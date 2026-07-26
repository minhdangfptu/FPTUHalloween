import { ArrowLeft, CheckCheck, Info, Send, UsersRound } from "lucide-react";
import React from "react";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import ManageSidebar from "../../components/ManageSidebar";
import { staffChatAPI } from "../../apis/staffChatAPI";
import { baseUrl } from "../../config";
import ListChat from "./ListChat";
import "./ChatPage.scss";

const idOf = (value) => value?._id || value?.id || value;
const nameOf = (value) =>
  value?.name || value?.fullName || value?.userName || "Cuộc trò chuyện";
const initialsOf = (name) =>
  String(name || "?")
    .split(" ")
    .slice(-2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
const currentUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};
const CHAT_AUTH_RETRY_DELAY_MS = 300;

const ChatPage = ({ role = "staff" }) => {
  const [conversations, setConversations] = React.useState([]);
  const [groups, setGroups] = React.useState([]);
  const [presence, setPresence] = React.useState({});
  const [active, setActive] = React.useState(null);
  const [messages, setMessages] = React.useState([]);
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [draft, setDraft] = React.useState("");
  const [typing, setTyping] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  const [showGroupModal, setShowGroupModal] = React.useState(false);
  const [editingGroup, setEditingGroup] = React.useState(null);
  const [showConversationInfo, setShowConversationInfo] = React.useState(false);
  const [confirmLeaveGroup, setConfirmLeaveGroup] = React.useState(false);
  const [groupName, setGroupName] = React.useState("");
  const [groupDescription, setGroupDescription] = React.useState("");
  const [selectedMembers, setSelectedMembers] = React.useState([]);
  const [memberQuery, setMemberQuery] = React.useState("");
  const [isCreatingGroup, setIsCreatingGroup] = React.useState(false);
  const socketRef = React.useRef(null);
  const activeRef = React.useRef(null);
  const conversationsRef = React.useRef([]);
  const messagesContainerRef = React.useRef(null);
  const typingTimer = React.useRef(null);
  const me = React.useMemo(currentUser, []);
  const meId = idOf(me);
  React.useEffect(() => {
    activeRef.current = active;
  }, [active]);
  React.useEffect(() => {
    const handleSidebarToggle = (event) =>
      setIsSidebarCollapsed(Boolean(event.detail));
    window.addEventListener("manage-sidebar-toggle", handleSidebarToggle);
    return () =>
      window.removeEventListener("manage-sidebar-toggle", handleSidebarToggle);
  }, []);
  React.useEffect(() => {
    conversationsRef.current = conversations;
  }, [conversations]);
  React.useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return undefined;
    const frameId = window.requestAnimationFrame(() => {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    });
    return () => window.cancelAnimationFrame(frameId);
  }, [messages, active]);
  React.useEffect(() => {
    const unreadCount = conversations.filter((conversation) => {
      const memberState = conversation.memberStates?.find(
        (state) => String(state.userId) === String(meId),
      );
      return (
        conversation.lastMessageAt &&
        (!memberState?.lastReadAt ||
          new Date(conversation.lastMessageAt) >
            new Date(memberState.lastReadAt)) &&
        idOf(active) !== idOf(conversation)
      );
    }).length;
    localStorage.setItem("staffChatUnreadCount", String(unreadCount));
    window.dispatchEvent(new CustomEvent("staff-chat:unread"));
  }, [conversations, active, meId]);
  const addMessage = React.useCallback(
    (message) => {
      if (!message?.content || !idOf(message)) return;
      setMessages((items) =>
        items.some((item) => idOf(item) === idOf(message))
          ? items
          : [...items, message],
      );
    },
    [],
  );
  const markConversationReadLocally = (conversationId) => {
    const readAt = new Date().toISOString();
    setConversations((items) =>
      items.map((item) =>
        idOf(item) === String(conversationId)
          ? {
              ...item,
              memberStates: [
                ...(item.memberStates || []).filter(
                  (state) => String(state.userId) !== String(meId),
                ),
                { userId: meId, lastReadAt: readAt },
              ],
            }
          : item,
      ),
    );
  };

  React.useEffect(() => {
    let mounted = true;
    const load = async () => {
      const loading = toast.loading("Đang tải cuộc trò chuyện...");
      setIsLoading(true);
      try {
        let chatData;
        try {
          chatData = await Promise.all([
            staffChatAPI.getConversations(),
            staffChatAPI.getGroups(),
          ]);
        } catch (error) {
          if (error?.response?.status !== 401) throw error;
          await new Promise((resolve) =>
            setTimeout(resolve, CHAT_AUTH_RETRY_DELAY_MS),
          );
          chatData = await Promise.all([
            staffChatAPI.getConversations(),
            staffChatAPI.getGroups(),
          ]);
        }
        const [conversationData, groupData] = chatData;
        if (mounted) {
          setConversations(
            Array.isArray(conversationData)
              ? conversationData
              : conversationData?.conversations || [],
          );
          setGroups(
            Array.isArray(groupData) ? groupData : groupData?.groups || [],
          );
        }
        toast.success("Đã tải danh sách tin nhắn", { id: loading });
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Không thể tải tin nhắn",
          { id: loading },
        );
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);
  React.useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length < 2) {
        setResults([]);
        setIsSearching(false);
        return;
      }
      setIsSearching(true);
      try {
        const data = await staffChatAPI.searchUsers(query.trim());
        setResults(Array.isArray(data) ? data : data?.users || []);
      } catch {
        toast.error("Không thể tìm kiếm staff");
      } finally {
        setIsSearching(false);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [query]);
  React.useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return undefined;
    const socket = io(baseUrl || window.location.origin, {
      auth: { token },
      transports: ["websocket", "polling"],
    });
    socketRef.current = socket;
    socket.on("connect", () => {
      const joinedIds = new Set(
        conversationsRef.current.map((conversation) =>
          String(idOf(conversation)),
        ),
      );
      const activeId = idOf(activeRef.current);
      if (activeId) joinedIds.add(String(activeId));
      joinedIds.forEach((conversationId) =>
        socket.emit("conversation:join", { conversationId }),
      );
    });
    socket.on("connect_error", () =>
      toast.error("Không thể kết nối realtime chat"),
    );
    socket.on("message:new", (message) => {
      if (idOf(message.conversationId) === idOf(activeRef.current))
        addMessage(message);
      setConversations((items) =>
        items.map((item) =>
          idOf(item) === idOf(message.conversationId)
            ? {
                ...item,
                lastMessagePreview: message.content,
                lastMessageAt: message.createdAt,
                lastMessageSender: message.sender,
              }
            : item,
        ),
      );
    });
    socket.on("presence:list", (items = []) =>
      setPresence(
        Object.fromEntries(
          items.map((item) => [String(item.userId), item.status === "online"]),
        ),
      ),
    );
    socket.on("presence:update", ({ userId, status }) =>
      setPresence((items) => ({
        ...items,
        [String(userId)]: status === "online",
      })),
    );
    socket.on("typing:update", ({ userId, isTyping }) => {
      if (userId !== meId) setTyping(isTyping);
    });
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [addMessage, meId]);
  React.useEffect(() => {
    const socket = socketRef.current;
    if (!socket?.connected || !conversations.length) return;
    conversations.forEach((conversation) =>
      socket.emit("conversation:join", { conversationId: idOf(conversation) }),
    );
  }, [conversations]);
  const selectConversation = async (conversation) => {
    setActive(conversation);
    activeRef.current = conversation;
    markConversationReadLocally(idOf(conversation));
    setMobileOpen(true);
    setQuery("");
    const conversationId = idOf(conversation);
    const loading = toast.loading("Đang tải tin nhắn...");
    try {
      const data = await staffChatAPI.getMessages(conversationId);
      setMessages(Array.isArray(data) ? data : data?.messages || []);
      toast.success("Đã mở cuộc trò chuyện", { id: loading });
      socketRef.current?.emit(
        "conversation:join",
        { conversationId },
        (ack) => {
          if (!ack?.ok)
            toast.error(ack?.message || "Không thể tham gia đoạn chat");
        },
      );
      socketRef.current?.emit("conversation:read", { conversationId });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Không thể mở cuộc trò chuyện",
        { id: loading },
      );
    }
  };
  const selectUser = async (user) => {
    const loading = toast.loading("Đang tạo cuộc trò chuyện...");
    try {
      const conversation = await staffChatAPI.createDirectConversation(
        idOf(user),
      );
      toast.success("Đã sẵn sàng nhắn tin", { id: loading });
      await selectConversation(conversation);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Không thể tạo cuộc trò chuyện",
        { id: loading },
      );
    }
  };
  const createGroup = async (event) => {
    event.preventDefault();
    if (editingGroup) return updateExistingGroup(event);
    if (!groupName.trim() || selectedMembers.length === 0)
      return toast.error("Vui lòng nhập tên và chọn thành viên");
    setIsCreatingGroup(true);
    const loading = toast.loading("Đang tạo nhóm...");
    try {
      const group = await staffChatAPI.createGroup({
        name: groupName.trim(),
        description: groupDescription.trim(),
        memberIds: selectedMembers.map(idOf),
      });
      setGroups((items) => [...items, group]);
      setConversations((items) => [...items, group]);
      setShowGroupModal(false);
      setGroupName("");
      setGroupDescription("");
      setSelectedMembers([]);
      setMemberQuery([]);
      toast.success("Đã tạo nhóm", { id: loading });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Không thể tạo nhóm", {
        id: loading,
      });
    } finally {
      setIsCreatingGroup(false);
    }
  };
  const searchMembers = async (value) => {
    setMemberQuery(value);
    if (value.trim().length < 2) return setResults([]);
    try {
      const data = await staffChatAPI.searchUsers(value.trim());
      setResults(Array.isArray(data) ? data : data?.users || []);
    } catch {
      toast.error("Không thể tìm thành viên");
    }
  };
  const openEditGroup = (group) => {
    setEditingGroup(group);
    setGroupName(group.name || "");
    setGroupDescription(group.description || "");
    setSelectedMembers(group.members || []);
    setShowGroupModal(true);
  };
  const updateExistingGroup = async (event) => {
    event.preventDefault();
    if (!groupName.trim()) return toast.error("Vui lòng nhập tên nhóm");
    const loading = toast.loading("Đang cập nhật nhóm...");
    try {
      const group = await staffChatAPI.updateGroup(idOf(editingGroup), {
        name: groupName.trim(),
        description: groupDescription.trim(),
      });
      setGroups((items) =>
        items.map((item) => (idOf(item) === idOf(group) ? group : item)),
      );
      setConversations((items) =>
        items.map((item) => (idOf(item) === idOf(group) ? group : item)),
      );
      setEditingGroup(null);
      setShowGroupModal(false);
      toast.success("Đã cập nhật nhóm", { id: loading });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Không thể cập nhật nhóm", {
        id: loading,
      });
    }
  };
  const leaveGroup = async () => {
    if (!active) return;
    const loading = toast.loading("Đang rời nhóm...");
    try {
      await staffChatAPI.removeGroupMember(idOf(active), meId);
      setConversations((items) =>
        items.filter((item) => idOf(item) !== idOf(active)),
      );
      setGroups((items) => items.filter((item) => idOf(item) !== idOf(active)));
      setActive(null);
      setShowConversationInfo(false);
      setConfirmLeaveGroup(false);
      toast.success("Đã rời nhóm", { id: loading });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Không thể rời nhóm", {
        id: loading,
      });
    }
  };
  const sendMessage = (event) => {
    event.preventDefault();
    const content = draft.trim();
    if (!content || !active) return;
    if (!socketRef.current?.connected)
      return toast.error("Kết nối realtime chưa sẵn sàng");
    socketRef.current.emit(
      "message:send",
      { conversationId: idOf(active), content },
      (response) => {
        if (response?.ok === false || response?.error) {
          toast.error(response.message || response.error);
        } else {
          const sentMessage = response?.message || response?.data || response;
          if (!sentMessage?.content || !idOf(sentMessage)) {
            toast.error("Không nhận được tin nhắn từ máy chủ");
            return;
          }
          addMessage(sentMessage);
          setConversations((items) =>
            items.map((item) =>
              idOf(item) === idOf(active)
                ? {
                    ...item,
                    lastMessagePreview: sentMessage.content,
                    lastMessageAt: sentMessage.createdAt,
                    lastMessageSender: sentMessage.sender,
                  }
                : item,
            ),
          );
          setDraft("");
        }
      },
    );
    socketRef.current.emit("typing:stop", { conversationId: idOf(active) });
    socketRef.current.emit("conversation:read", {
      conversationId: idOf(active),
    });
    markConversationReadLocally(idOf(active));
  };
  const handleDraft = (event) => {
    setDraft(event.target.value);
    if (!active || !socketRef.current) return;
    socketRef.current.emit("typing:start", { conversationId: idOf(active) });
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(
      () =>
        socketRef.current?.emit("typing:stop", {
          conversationId: idOf(active),
        }),
      900,
    );
  };
  const activeMember = active?.members?.find((member) => idOf(member) !== meId);
  const activeName = active
    ? active.type === "group"
      ? active.name || "Nhóm staff"
      : nameOf(activeMember)
    : "Chọn một cuộc trò chuyện";
  const activeOnline = activeMember
    ? Boolean(presence[idOf(activeMember)])
    : false;
  return (
    <>
      <ManageSidebar role={role} activeItem="chat" />
      <main
        className={`chat-page ${mobileOpen ? "chat-page--conversation-open" : ""} ${isSidebarCollapsed ? "chat-page--sidebar-collapsed" : ""}`}
      >
        <ListChat
          conversations={conversations}
          groups={groups}
          currentUserId={meId}
          isAdmin={role === "admin"}
          onCreateGroup={() => setShowGroupModal(true)}
          onEditGroup={openEditGroup}
          presence={presence}
          searchQuery={query}
          onSearchChange={setQuery}
          searchResults={results}
          isSearching={isSearching}
          onSelectConversation={selectConversation}
          onSelectUser={selectUser}
          activeId={idOf(active)}
        />
        <section className="chat-thread">
          <header className="chat-thread__header">
            <button
              className="chat-thread__back"
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Quay lại danh sách"
            >
              <ArrowLeft size={18} />
            </button>
            <div
              className={`chat-avatar ${active?.type === "group" ? "chat-avatar--group" : ""} ${activeOnline ? "chat-avatar--online" : ""}`}
            >
              {active?.type === "group" ? (
                <UsersRound size={18} />
              ) : (
                initialsOf(activeName)
              )}
            </div>
            <div>
              <h2>{activeName}</h2>
              <p>
                {active
                  ? typing
                    ? "Đang nhập..."
                    : active.type === "group"
                      ? "Nhóm tin nhắn sự kiện"
                      : activeOnline
                        ? "Đang hoạt động"
                        : "Ngoại tuyến"
                  : "Kênh trao đổi nội bộ"}
              </p>
            </div>
            <button
              className="chat-thread__info"
              type="button"
              disabled={!active}
              onClick={() => setShowConversationInfo(true)}
              aria-label="Thông tin cuộc trò chuyện"
            >
              <Info size={19} />
            </button>
          </header>
          {active ? (
            <>
              <div
                className="chat-thread__messages"
                ref={messagesContainerRef}
              >
                {messages.map((message) => {
                  const mine =
                    idOf(message.sender) === meId ||
                    idOf(message.senderId) === meId;
                  return (
                    <div
                      className={`chat-bubble-row ${mine ? "chat-bubble-row--mine" : ""}`}
                      key={idOf(message)}
                    >
                      {!mine && (
                        <span className="chat-bubble__avatar" aria-hidden="true">
                          {initialsOf(nameOf(message.sender))}
                        </span>
                      )}
                      <div className="chat-bubble">
                        <span>{message.content}</span>
                        <small>
                          {message.createdAt
                            ? new Date(message.createdAt).toLocaleTimeString(
                                "vi-VN",
                                { hour: "2-digit", minute: "2-digit" },
                              )
                            : ""}
                          {mine && <CheckCheck size={13} />}
                        </small>
                      </div>
                    </div>
                  );
                })}
                {!messages.length && (
                  <div className="chat-thread__empty">
                    <MessageIcon />
                    <strong>Chưa có tin nhắn</strong>
                    <span>Hãy bắt đầu trao đổi với {activeName}.</span>
                  </div>
                )}
              </div>
              <form className="chat-composer" onSubmit={sendMessage}>
                <input
                  value={draft}
                  onChange={handleDraft}
                  placeholder="Viết tin nhắn..."
                  aria-label="Nội dung tin nhắn"
                />
                <button type="submit" aria-label="Gửi tin nhắn">
                  <Send size={18} />
                </button>
              </form>
            </>
          ) : (
            <div className="chat-thread__empty chat-thread__empty--welcome">
              <MessageIcon />
              <strong>Chào mừng đến HolaWeen Chat</strong>
              <span>Chọn thành viên hoặc nhóm ở bên trái để bắt đầu.</span>
            </div>
          )}
        </section>
      </main>
      {showConversationInfo && active && (
        <div
          className="chat-modal-backdrop"
          role="presentation"
          onMouseDown={(event) =>
            event.target === event.currentTarget &&
            setShowConversationInfo(false)
          }
        >
          <div className="chat-modal chat-info-modal">
            <div className="chat-modal__heading">
              <div>
                <span className="chat-list__eyebrow">Thông tin đoạn chat</span>
                <h2>{active.type === "group" ? active.name : activeName}</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowConversationInfo(false)}
                aria-label="Đóng"
              >
                ×
              </button>
            </div>
            {active.type === "group" ? (
              <>
                <p className="chat-info-modal__description">
                  {active.description || "Nhóm trao đổi nội bộ"}
                </p>
                <strong>Thành viên ({active.members?.length || 0})</strong>
                <div className="chat-info-modal__member-list">
                  {active.members?.map((member) => (
                    <div className="chat-info-modal__member" key={idOf(member)}>
                      <span className="chat-avatar">
                        {initialsOf(nameOf(member))}
                      </span>
                      <span>
                        <strong>{nameOf(member)}</strong>
                        <small>@{member.userName || "staff"}</small>
                      </span>
                    </div>
                  ))}
                </div>
                <button
                  className="chat-info-modal__leave"
                  type="button"
                  onClick={() => setConfirmLeaveGroup(true)}
                >
                  Rời nhóm
                </button>
              </>
            ) : (
              <div className="chat-info-modal__profile">
                <div className="chat-avatar">{initialsOf(activeName)}</div>
                <strong>{activeName}</strong>
                <span>@{activeMember?.userName || "staff"}</span>
                <small>{activeMember?.role || "Staff"}</small>
              </div>
            )}
          </div>
        </div>
      )}
      {confirmLeaveGroup && (
        <div className="chat-modal-backdrop" role="presentation">
          <div
            className="chat-modal chat-confirm-modal"
            style={{
              boxSizing: "border-box",
              width: "min(390px, calc(100vw - 32px))",
            }}
          >
            <h2>Rời nhóm?</h2>
            <p>Bạn sẽ không còn nhận được tin nhắn trong nhóm này.</p>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: "8px",
                width: "100%",
              }}
            >
              <button type="button" onClick={() => setConfirmLeaveGroup(false)}>
                Huỷ
              </button>
              <button
                type="button"
                onClick={leaveGroup}
                style={{
                  display: "inline-flex",
                  visibility: "visible",
                  opacity: 1,
                  color: "#fff",
                  background: "#ff4747",
                }}
              >
                Rời nhóm
              </button>
            </div>
          </div>
        </div>
      )}
      {showGroupModal && (
        <div
          className="chat-modal-backdrop"
          role="presentation"
          onMouseDown={(event) =>
            event.target === event.currentTarget && setShowGroupModal(false)
          }
        >
          <form className="chat-modal" onSubmit={createGroup}>
            <div className="chat-modal__heading">
              <div>
                <span className="chat-list__eyebrow">ADMIN TOOL</span>
                <h2>Tạo nhóm chat</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowGroupModal(false)}
                aria-label="Đóng"
              >
                ×
              </button>
            </div>
            <label>
              Tên nhóm
              <input
                value={groupName}
                onChange={(event) => setGroupName(event.target.value)}
                placeholder="Ví dụ: Core Truyền thông"
              />
            </label>
            <label>
              Mô tả
              <textarea
                value={groupDescription}
                onChange={(event) => setGroupDescription(event.target.value)}
                placeholder="Mục đích của nhóm (không bắt buộc)"
                rows="3"
              />
            </label>
            <label>
              Thêm thành viên
              <input
                value={memberQuery}
                onChange={(event) => searchMembers(event.target.value)}
                placeholder="Tìm theo username"
              />
            </label>
            <div className="chat-modal__members">
              {results
                .filter(
                  (user) =>
                    !selectedMembers.some((id) => idOf(id) === idOf(user)),
                )
                .map((user) => (
                  <button
                    type="button"
                    key={idOf(user)}
                    onClick={() =>
                      setSelectedMembers((items) => [...items, user])
                    }
                  >
                    {nameOf(user)} <small>@{user.userName}</small>
                  </button>
                ))}
              {selectedMembers.map((user) => (
                <button
                  className="chat-modal__member--selected"
                  type="button"
                  key={idOf(user)}
                  onClick={() =>
                    setSelectedMembers((items) =>
                      items.filter((item) => idOf(item) !== idOf(user)),
                    )
                  }
                >
                  ✓ {nameOf(user)}
                </button>
              ))}
            </div>
            <div className="chat-modal__footer">
              <span>{selectedMembers.length} thành viên được chọn</span>
              <button type="submit" disabled={isCreatingGroup}>
                {isCreatingGroup ? "Đang tạo..." : "Tạo nhóm"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};
const MessageIcon = () => (
  <div className="chat-thread__empty-icon">
    <Send size={20} />
  </div>
);
export default ChatPage;
