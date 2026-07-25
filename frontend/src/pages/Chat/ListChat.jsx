import { ChevronDown, MessageCircle, MoreHorizontal, Plus, Search, UsersRound, X } from "lucide-react";
import React from "react";
import "./ListChat.scss";

const getId = (item) => item?._id || item?.id;
const getName = (item) =>
  item?.name || item?.fullName || item?.userName || "Không tên";
const initials = (name) =>
  getName({ name })
    .split(" ")
    .slice(-2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const ListChat = ({
  conversations = [],
  groups = [],
  searchQuery,
  onSearchChange,
  searchResults = [],
  onSelectConversation,
  onSelectUser,
  activeId,
  presence = {},
  currentUserId,
  isAdmin = false,
  onCreateGroup,
  onEditGroup,
}) => {
  const showResults = searchQuery.trim().length > 0;
  return (
    <section className="chat-list" aria-label="Danh sách cuộc trò chuyện">
      <div className="chat-list__heading">
        <div>
          <span className="chat-list__eyebrow">HolaWeen Chat</span>
          <h1>Tin nhắn</h1>
        </div>
        <div className="chat-list__actions"><span className="chat-list__count">{conversations.length}</span>{isAdmin && <button className="chat-list__create" type="button" onClick={onCreateGroup}><Plus size={15} /><span>Tạo nhóm</span><ChevronDown size={14} /></button>}</div>
      </div>
      <label className="chat-list__search">
        <Search size={18} />
        <input
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Tìm staff hoặc nhóm"
          aria-label="Tìm staff hoặc nhóm"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            aria-label="Xoá tìm kiếm"
          >
            <X size={16} />
          </button>
        )}
      </label>
      {showResults ? (
        <div className="chat-list__results">
          <span className="chat-list__section-label">KẾT QUẢ TÌM KIẾM</span>
          {searchResults.map((user) => (
            <button
              className="chat-person"
              key={getId(user)}
              type="button"
              onClick={() => onSelectUser(user)}
            >
              <span className="chat-avatar">{initials(getName(user))}</span>
              <span>
                <strong>{getName(user)}</strong>
                <small>@{user.userName || "staff"}</small>
              </span>
            </button>
          ))}
          {groups
            .filter((group) =>
              getName(group).toLowerCase().includes(searchQuery.toLowerCase()),
            )
            .map((group) => (
              <button
                className="chat-person"
                key={getId(group)}
                type="button"
                onClick={() => onSelectConversation(group)}
              >
                <span className="chat-avatar chat-avatar--group">
                  <UsersRound size={18} />
                </span>
                <span>
                  <strong>{getName(group)}</strong>
                  <small>Nhóm staff</small>
                </span>
              </button>
            ))}
          {!searchResults.length &&
            !groups.some((group) =>
              getName(group).toLowerCase().includes(searchQuery.toLowerCase()),
            ) && <p className="chat-list__empty">Không tìm thấy kết quả.</p>}
        </div>
      ) : (
        <div className="chat-list__items">
          {conversations.map((conversation) => {
            const itemId = getId(conversation);
            const participant = conversation.members?.find(
              (item) => getId(item) !== String(currentUserId),
            );
            const name =
              conversation.type === "group"
                ? conversation.name
                : getName(participant);
            const online = participant
              ? Boolean(presence[getId(participant)])
              : false;
            const memberState = conversation.memberStates?.find((state) => String(state.userId) === String(currentUserId));
            const isUnread = Boolean(conversation.lastMessageAt && (!memberState?.lastReadAt || new Date(conversation.lastMessageAt) > new Date(memberState.lastReadAt)) && activeId !== itemId);
            return (
              <div className={`chat-conversation-wrap ${conversation.type === "group" && isAdmin ? "chat-conversation-wrap--admin" : ""}`} key={itemId}>
              <button
                className={`chat-conversation ${activeId === itemId ? "chat-conversation--active" : ""} ${isUnread ? "chat-conversation--unread" : ""}`}
                type="button"
                onClick={() => onSelectConversation(conversation)}
              >
                <span
                  className={`chat-avatar ${online ? "chat-avatar--online" : ""}`}
                >
                  {conversation.type === "group" ? (
                    <UsersRound size={18} />
                  ) : (
                    initials(name)
                  )}
                </span>
                <span className="chat-conversation__copy">
                  <strong>{name}</strong>
                  <small>
                    {conversation.lastMessagePreview ||
                      "Bắt đầu cuộc trò chuyện"}
                  </small>
                </span>
                <time>
                  {conversation.lastMessageAt
                    ? new Date(conversation.lastMessageAt).toLocaleTimeString(
                        "vi-VN",
                        { hour: "2-digit", minute: "2-digit" },
                      )
                    : ""}
                </time>
                {isUnread && <span className="chat-conversation__unread-dot" aria-label="Chưa đọc" />}
              </button>{conversation.type === "group" && isAdmin && <button className="chat-conversation__more" type="button" onClick={() => onEditGroup(conversation)} aria-label={`Chỉnh sửa ${name}`}><MoreHorizontal size={18} /></button>}
              </div>
            );
          })}
          {!conversations.length && (
            <div className="chat-list__blank">
              <MessageCircle size={26} />
              <p>Chưa có cuộc trò chuyện</p>
              <small>Tìm một staff để bắt đầu.</small>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
export default ListChat;
