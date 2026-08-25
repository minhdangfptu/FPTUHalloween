import {
  ArrowLeft,
  CheckCheck,
  Info,
  Send,
  Trash2,
  UsersRound,
} from "lucide-react";
import React from "react";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import ManageSidebar from "../../components/ManageSidebar";
import { ChatMessagesSkeleton } from "../../components/LoadingSkeletons";
import { staffChatAPI } from "../../apis/staffChatAPI";
import { baseUrl } from "../../config";
import defaultChatAvatar from "../../assets/avatar.jpg";
import ListChat from "./ListChat";
import "./ChatPage.scss";

const idOf = (value) => value?._id || value?.id || value;
const nameOf = (value, fallback = "Conversation") =>
  value?.name || value?.fullName || value?.userName || fallback;
const currentUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};
const CHAT_AUTH_RETRY_DELAY_MS = 300;

const renderMentionText = (content, members = []) => {
  const text = String(content || "");
  const memberNames = new Set(
    members
      .map((member) => member?.userName?.toLowerCase())
      .filter(Boolean),
  );
  const mentionPattern = /(^|\s)(@[a-zA-Z0-9._-]+)/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = mentionPattern.exec(text)) !== null) {
    parts.push(text.slice(lastIndex, match.index));
    parts.push(match[1]);
    const mention = match[2];
    parts.push(
      memberNames.has(mention.slice(1).toLowerCase()) ? (
        <span className="chat-mention" key={`${match.index}-${mention}`}>
          {mention}
        </span>
      ) : (
        mention
      ),
    );
    lastIndex = mentionPattern.lastIndex;
  }

  parts.push(text.slice(lastIndex));
  return parts;
};

const ChatPage = ({ role = "staff" }) => {
  const { t, i18n } = useTranslation();
  const chatText = (key, options) => t(`chat.${key}`, options);
  const getName = (value) => nameOf(value, chatText("conversation"));
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
  const [isLoadingMessages, setIsLoadingMessages] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [showGroupModal, setShowGroupModal] = React.useState(false);
  const [editingGroup, setEditingGroup] = React.useState(null);
  const [showConversationInfo, setShowConversationInfo] = React.useState(false);
  const [confirmLeaveGroup, setConfirmLeaveGroup] = React.useState(false);
  const [memberToRemove, setMemberToRemove] = React.useState(null);
  const [isRemovingMember, setIsRemovingMember] = React.useState(false);
  const [groupName, setGroupName] = React.useState("");
  const [groupDescription, setGroupDescription] = React.useState("");
  const [selectedMembers, setSelectedMembers] = React.useState([]);
  const [memberQuery, setMemberQuery] = React.useState("");
  const [isCreatingGroup, setIsCreatingGroup] = React.useState(false);
  const socketRef = React.useRef(null);
  const activeRef = React.useRef(null);
  const conversationsRef = React.useRef([]);
  const messagesContainerRef = React.useRef(null);
  const composerRef = React.useRef(null);
  const typingTimer = React.useRef(null);
  const [mentionQuery, setMentionQuery] = React.useState(null);
  const [mentionStart, setMentionStart] = React.useState(-1);
  const me = React.useMemo(currentUser, []);
  const meId = idOf(me);
  React.useEffect(() => {
    activeRef.current = active;
  }, [active]);
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
      const loading = toast.loading(t("chat.loadingConversations"));
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
        toast.success(t("chat.conversationsLoaded"), { id: loading });
      } catch (error) {
        toast.error(
          error?.response?.data?.message || t("chat.loadMessagesError"),
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
  }, [t]);
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
        toast.error(chatText("searchStaffError"));
      } finally {
        setIsSearching(false);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [query, t]);
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
      toast.error(t("chat.realtimeError")),
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
  }, [addMessage, meId, t]);
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
    setDraft("");
    setMentionQuery(null);
    setMentionStart(-1);
    const conversationId = idOf(conversation);
    const loading = toast.loading(chatText("loadingMessages"));
    setIsLoadingMessages(true);
    try {
      const data = await staffChatAPI.getMessages(conversationId);
      setMessages(Array.isArray(data) ? data : data?.messages || []);
      toast.success(chatText("conversationOpened"), { id: loading });
      socketRef.current?.emit(
        "conversation:join",
        { conversationId },
        (ack) => {
          if (!ack?.ok)
            toast.error(ack?.message || chatText("joinError"));
        },
      );
      socketRef.current?.emit("conversation:read", { conversationId });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || chatText("openError"),
        { id: loading },
      );
    } finally {
      setIsLoadingMessages(false);
    }
  };
  const selectUser = async (user) => {
    const loading = toast.loading(chatText("creatingConversation"));
    try {
      const conversation = await staffChatAPI.createDirectConversation(
        idOf(user),
      );
      toast.success(chatText("readyToMessage"), { id: loading });
      await selectConversation(conversation);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || chatText("createConversationError"),
        { id: loading },
      );
    }
  };
  const createGroup = async (event) => {
    event.preventDefault();
    if (editingGroup) return updateExistingGroup(event);
    if (!groupName.trim() || selectedMembers.length === 0)
      return toast.error(chatText("groupValidation"));
    setIsCreatingGroup(true);
    const loading = toast.loading(chatText("creatingGroup"));
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
      setMemberQuery("");
      toast.success(chatText("groupCreated"), { id: loading });
    } catch (error) {
      toast.error(error?.response?.data?.message || chatText("createGroupError"), {
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
      toast.error(chatText("searchMembersError"));
    }
  };
  const openCreateGroup = () => {
    setEditingGroup(null);
    setGroupName("");
    setGroupDescription("");
    setSelectedMembers([]);
    setMemberQuery("");
    setResults([]);
    setShowGroupModal(true);
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
    if (!groupName.trim()) return toast.error(chatText("groupNameRequired"));
    const currentMemberIds = (editingGroup.members || []).map(idOf);
    const selectedMemberIds = selectedMembers.map(idOf);
    const memberIdsToAdd = selectedMemberIds.filter(
      (memberId) =>
        !currentMemberIds.some(
          (id) => String(id) === String(memberId),
        ),
    );
    const memberIdsToRemove = currentMemberIds.filter(
      (memberId) =>
        !selectedMemberIds.some(
          (id) => String(id) === String(memberId),
        ),
    );
    const creatorId = idOf(editingGroup.createdBy);

    if (
      memberIdsToRemove.some(
        (memberId) => String(memberId) === String(creatorId),
      )
    ) {
      return toast.error(chatText("cannotRemoveCreator"));
    }

    setIsCreatingGroup(true);
    const loading = toast.loading(chatText("updatingGroup"));
    try {
      let group = await staffChatAPI.updateGroup(idOf(editingGroup), {
        name: groupName.trim(),
        description: groupDescription.trim(),
      });
      if (memberIdsToAdd.length) {
        group = await staffChatAPI.addGroupMembers(
          idOf(editingGroup),
          memberIdsToAdd,
        );
      }
      for (const memberId of memberIdsToRemove) {
        group = await staffChatAPI.removeGroupMember(
          idOf(editingGroup),
          memberId,
        );
      }
      setGroups((items) =>
        items.map((item) => (idOf(item) === idOf(group) ? group : item)),
      );
      setConversations((items) =>
        items.map((item) => (idOf(item) === idOf(group) ? group : item)),
      );
      setActive((current) =>
        current && idOf(current) === idOf(group) ? group : current,
      );
      setEditingGroup(null);
      setShowGroupModal(false);
      setGroupName("");
      setGroupDescription("");
      setSelectedMembers([]);
      setMemberQuery("");
      toast.success(chatText("groupUpdated"), { id: loading });
    } catch (error) {
      toast.error(error?.response?.data?.message || chatText("updateGroupError"), {
        id: loading,
      });
    } finally {
      setIsCreatingGroup(false);
    }
  };
  const leaveGroup = async () => {
    if (!active) return;
    const loading = toast.loading(chatText("leavingGroup"));
    try {
      await staffChatAPI.removeGroupMember(idOf(active), meId);
      setConversations((items) =>
        items.filter((item) => idOf(item) !== idOf(active)),
      );
      setGroups((items) => items.filter((item) => idOf(item) !== idOf(active)));
      setActive(null);
      setShowConversationInfo(false);
      setConfirmLeaveGroup(false);
      toast.success(chatText("groupLeft"), { id: loading });
    } catch (error) {
      toast.error(error?.response?.data?.message || chatText("leaveGroupError"), {
        id: loading,
      });
    }
  };
  const removeMember = async () => {
    if (!active || !memberToRemove || isRemovingMember) return;
    const loading = toast.loading(chatText("removingMember"));
    setIsRemovingMember(true);
    try {
      const group = await staffChatAPI.removeGroupMember(
        idOf(active),
        idOf(memberToRemove),
      );
      setConversations((items) =>
        items.map((item) => (idOf(item) === idOf(group) ? group : item)),
      );
      setGroups((items) =>
        items.map((item) => (idOf(item) === idOf(group) ? group : item)),
      );
      setActive(group);
      activeRef.current = group;
      setMemberToRemove(null);
      toast.success(chatText("memberRemoved"), { id: loading });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || chatText("removeMemberError"),
        { id: loading },
      );
    } finally {
      setIsRemovingMember(false);
    }
  };
  const sendMessage = (event) => {
    event.preventDefault();
    const content = draft.trim();
    if (!content || !active) return;
    if (!socketRef.current?.connected)
      return toast.error(chatText("realtimeNotReady"));
    socketRef.current.emit(
      "message:send",
      { conversationId: idOf(active), content },
      (response) => {
        if (response?.ok === false || response?.error) {
          toast.error(response.message || response.error);
        } else {
          const sentMessage = response?.message || response?.data || response;
          if (!sentMessage?.content || !idOf(sentMessage)) {
            toast.error(chatText("serverMessageError"));
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
          setMentionQuery(null);
          setMentionStart(-1);
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
    const { value, selectionStart } = event.target;
    const cursorPosition = selectionStart ?? value.length;
    setDraft(value);

    const beforeCursor = value.slice(0, cursorPosition);
    const mentionMatch = beforeCursor.match(/(?:^|\s)@([a-zA-Z0-9._-]*)$/);
    if (active?.type !== "group" || !mentionMatch) {
      setMentionQuery(null);
      setMentionStart(-1);
    } else {
      setMentionQuery(mentionMatch[1].toLowerCase());
      setMentionStart(cursorPosition - mentionMatch[1].length - 1);
    }

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
  const mentionSuggestions =
    mentionQuery === null || active?.type !== "group"
      ? []
      : (active.members || [])
          .filter(
            (member) =>
              String(idOf(member)) !== String(meId) &&
              member.userName?.toLowerCase().includes(mentionQuery),
          )
          .slice(0, 6);
  const insertMention = (member) => {
    const username = member.userName;
    if (!username || mentionStart < 0) return;
    const input = composerRef.current;
    const cursorPosition = input?.selectionStart ?? draft.length;
    const nextDraft = `${draft.slice(0, mentionStart)}@${username} ${draft.slice(cursorPosition)}`;
    const nextCursor = mentionStart + username.length + 2;
    setDraft(nextDraft);
    setMentionQuery(null);
    setMentionStart(-1);
    window.requestAnimationFrame(() => {
      input?.focus();
      input?.setSelectionRange(nextCursor, nextCursor);
    });
  };
  const activeMember = active?.members?.find((member) => idOf(member) !== meId);
  const activeName = active
    ? active.type === "group"
      ? active.name || "Nhóm staff"
      : getName(activeMember)
    : "Chọn một cuộc trò chuyện";
  const activeOnline = activeMember
    ? Boolean(presence[idOf(activeMember)])
    : false;
  return (
    <>
      <ManageSidebar role={role} activeItem="chat" />
      <main
        className={`chat-page ${mobileOpen ? "chat-page--conversation-open" : ""}`}
      >
        <ListChat
          conversations={conversations}
          groups={groups}
          currentUserId={meId}
          isAdmin={role === "admin"}
          onCreateGroup={openCreateGroup}
          onEditGroup={openEditGroup}
          presence={presence}
          searchQuery={query}
          onSearchChange={setQuery}
          searchResults={results}
          isSearching={isSearching}
          onSelectConversation={selectConversation}
          onSelectUser={selectUser}
          activeId={idOf(active)}
          isLoading={isLoading}
        />
        <section className="chat-thread">
          <header className="chat-thread__header">
            <button
              className="chat-thread__back"
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label={chatText("backToList")}
            >
              <ArrowLeft size={18} />
            </button>
            <div
              className={`chat-avatar ${active?.type === "group" ? "chat-avatar--group" : ""} ${activeOnline ? "chat-avatar--online" : ""}`}
            >
              {active?.type === "group" ? (
                <UsersRound size={18} />
              ) : (
                <img
                  className="chat-avatar__image"
                  src={defaultChatAvatar}
                  alt=""
                  aria-hidden="true"
                />
              )}
            </div>
            <div>
              <h2>{activeName}</h2>
              <p>
                {active
                  ? typing
                    ? chatText("typing")
                    : active.type === "group"
                      ? chatText("eventGroup")
                      : activeOnline
                        ? chatText("online")
                        : chatText("offline")
                  : chatText("internalChannel")}
              </p>
            </div>
            <button
              className="chat-thread__info"
              type="button"
              disabled={!active}
              onClick={() => setShowConversationInfo(true)}
              aria-label={chatText("conversationInfo")}
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
                {isLoadingMessages ? <ChatMessagesSkeleton /> : messages.map((message) => {
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
                          <img
                            className="chat-avatar__image"
                            src={defaultChatAvatar}
                            alt=""
                            aria-hidden="true"
                          />
                        </span>
                      )}
                      <div className="chat-bubble">
                        <span className="chat-bubble__content">
                          {renderMentionText(message.content, active.members)}
                        </span>
                        <small>
                          {message.createdAt
                            ? new Date(message.createdAt).toLocaleTimeString(
                                i18n.language === "en" ? "en-US" : "vi-VN",
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
                    <strong>{chatText("emptyMessages")}</strong>
                    <span>{chatText("startChatWith", { name: activeName })}</span>
                  </div>
                )}
              </div>
              <form className="chat-composer" onSubmit={sendMessage}>
                {mentionSuggestions.length > 0 && (
                  <div className="chat-mention-menu" role="listbox">
                    {mentionSuggestions.map((member) => (
                      <button
                        type="button"
                        className="chat-mention-option"
                        key={idOf(member)}
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => insertMention(member)}
                      >
                        <span className="chat-avatar">
                          <img
                            className="chat-avatar__image"
                            src={defaultChatAvatar}
                            alt=""
                            aria-hidden="true"
                          />
                        </span>
                        <span>
                          <strong>{getName(member)}</strong>
                          <small>@{member.userName}</small>
                        </span>
                      </button>
                    ))}
                  </div>
                )}
                <input
                  ref={composerRef}
                  value={draft}
                  onChange={handleDraft}
                  placeholder={chatText("messagePlaceholder")}
                  aria-label={chatText("messageContent")}
                />
                <button type="submit" aria-label={chatText("sendMessage")}>
                  <Send size={18} />
                </button>
              </form>
            </>
          ) : (
            <div className="chat-thread__empty chat-thread__empty--welcome">
              <MessageIcon />
              <strong>{chatText("welcome")}</strong>
              <span>{chatText("welcomeText")}</span>
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
                <span className="chat-list__eyebrow">{chatText("chatInfo")}</span>
                <h2>{active.type === "group" ? active.name : activeName}</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowConversationInfo(false)}
                aria-label={t("management.common.close")}
              >
                ×
              </button>
            </div>
            {active.type === "group" ? (
              <>
                <p className="chat-info-modal__description">
                  {active.description || chatText("internalGroup")}
                </p>
                <strong>{chatText("members", { count: active.members?.length || 0 })}</strong>
                <div className="chat-info-modal__member-list">
                  {active.members?.map((member) => (
                    <div className="chat-info-modal__member" key={idOf(member)}>
                      <span className="chat-avatar">
                        <img
                          className="chat-avatar__image"
                          src={defaultChatAvatar}
                          alt=""
                          aria-hidden="true"
                        />
                      </span>
                      <span className="chat-info-modal__member-copy">
                        <strong>{getName(member)}</strong>
                        <small>@{member.userName || chatText("staffUsername")}</small>
                        <small className="chat-info-modal__member-meta">
                          {[member.department, member.department_position]
                            .filter(Boolean)
                            .join(" · ") || chatText("departmentMissing")}
                        </small>
                      </span>
                      {role === "admin" &&
                        String(idOf(member)) !== String(meId) &&
                        String(idOf(member)) !== String(active.createdBy) && (
                          <button
                            className="chat-info-modal__remove"
                            type="button"
                            onClick={() => setMemberToRemove(member)}
                            aria-label={chatText("removeMemberAria", { name: getName(member) })}
                            title={chatText("removeFromGroup")}
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                    </div>
                  ))}
                </div>
                <button
                  className="chat-info-modal__leave"
                  type="button"
                  onClick={() => setConfirmLeaveGroup(true)}
                >
                  {chatText("leaveGroup")}
                </button>
              </>
            ) : (
              <div className="chat-info-modal__profile">
                <div className="chat-avatar">
                  <img
                    className="chat-avatar__image"
                    src={defaultChatAvatar}
                    alt=""
                    aria-hidden="true"
                  />
                </div>
                <strong>{activeName}</strong>
                <span>@{activeMember?.userName || chatText("staffUsername")}</span>
                <small>{activeMember?.role || t("components.staff")}</small>
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
            <h2>{chatText("leaveConfirmTitle")}</h2>
            <p>{chatText("leaveConfirmText")}</p>
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
                {t("management.common.cancel")}
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
                {chatText("leaveGroup")}
              </button>
            </div>
          </div>
        </div>
      )}
      {memberToRemove && (
        <div
          className="chat-modal-backdrop"
          role="presentation"
          onMouseDown={(event) =>
            event.target === event.currentTarget &&
            !isRemovingMember &&
            setMemberToRemove(null)
          }
        >
          <div
            className="chat-modal chat-confirm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="remove-member-title"
          >
            <h2 id="remove-member-title">{chatText("removeConfirmTitle")}</h2>
            <p>{chatText("removeConfirmText", { name: getName(memberToRemove) })}</p>
            <div>
              <button
                type="button"
                disabled={isRemovingMember}
                onClick={() => setMemberToRemove(null)}
              >
                {t("management.common.cancel")}
              </button>
              <button
                type="button"
                disabled={isRemovingMember}
                onClick={removeMember}
              >
                {chatText(isRemovingMember ? "removing" : "removeMember")}
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
                <span className="chat-list__eyebrow">{chatText("adminTool")}</span>
                <h2>{chatText(editingGroup ? "editGroup" : "createGroup")}</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowGroupModal(false)}
                aria-label={t("management.common.close")}
              >
                ×
              </button>
            </div>
            <label>
              {chatText("groupName")}
              <input
                value={groupName}
                onChange={(event) => setGroupName(event.target.value)}
                placeholder={chatText("groupNamePlaceholder")}
              />
            </label>
            <label>
              {chatText("description")}
              <textarea
                value={groupDescription}
                onChange={(event) => setGroupDescription(event.target.value)}
                placeholder={chatText("descriptionPlaceholder")}
                rows="3"
              />
            </label>
            <label>
              {chatText("addMembers")}
              <input
                value={memberQuery}
                onChange={(event) => searchMembers(event.target.value)}
                placeholder={chatText("searchUsername")}
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
                    {getName(user)} <small>@{user.userName}</small>
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
                  ✓ {getName(user)}
                </button>
              ))}
            </div>
            <div className="chat-modal__footer">
              <span>{chatText("selectedMembers", { count: selectedMembers.length })}</span>
              <button type="submit" disabled={isCreatingGroup}>
                {isCreatingGroup
                  ? editingGroup
                    ? chatText("updating")
                    : chatText("creating")
                  : editingGroup
                    ? chatText("saveChanges")
                    : chatText("createGroupAction")}
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
