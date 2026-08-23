import {
  ChevronDown,
  MessageCircle,
  MoreHorizontal,
  Plus,
  Search,
  SearchX,
  UsersRound,
  X,
} from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { ChatListSkeleton } from "../../components/LoadingSkeletons";
import "./ListChat.scss";

const getId = (item) => item?._id || item?.id;
const getName = (item, fallback = "Unnamed") =>
  item?.name || item?.fullName || item?.userName || fallback;
const getLastSenderName = (conversation, fallback) => {
  const sender = conversation?.lastMessageSender || conversation?.lastSender;
  return sender ? getName(sender, fallback) : "";
};
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
  isSearching = false,
  isLoading = false,
  onSelectConversation,
  onSelectUser,
  activeId,
  presence = {},
  currentUserId,
  isAdmin = false,
  onCreateGroup,
  onEditGroup,
}) => {
  const { t, i18n } = useTranslation();
  const chatText = (key, options) => t(`chat.${key}`, options);
  const displayName = (item) => getName(item, chatText("unnamed"));
  const showResults = searchQuery.trim().length > 0;
  return (
    <section className="chat-list" aria-label={chatText("conversationList")}>
      <div className="chat-list__heading">
        <div>
          <span className="chat-list__eyebrow">{chatText("brand")}</span>
          <h1>{chatText("messages")}</h1>
        </div>
        <div className="chat-list__actions">
          <span className="chat-list__count">{conversations.length}</span>
          {isAdmin && (
            <button
              className="chat-list__create"
              type="button"
              onClick={onCreateGroup}
            >
              <Plus size={15} />
              <span>{chatText("createGroupAction")}</span>
              <ChevronDown size={14} />
            </button>
          )}
        </div>
      </div>
      <label className="chat-list__search">
        <Search size={18} />
        <input
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={chatText("searchPlaceholder")}
          aria-label={chatText("searchPlaceholder")}
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            aria-label={chatText("clearSearch")}
          >
            <X size={16} />
          </button>
        )}
      </label>
      {showResults ? (
        <div className="chat-list__results">
          <span className="chat-list__section-label">{chatText("searchResults")}</span>
          {isSearching && (
            <div className="chat-list__search-loading" role="status">
              <span className="chat-list__spinner" aria-hidden="true" />
              <span>{chatText("searching")}</span>
            </div>
          )}
          {!isSearching && searchResults.map((user) => (
            <button
              className="chat-person"
              key={getId(user)}
              type="button"
              onClick={() => onSelectUser(user)}
            >
              <span className="chat-avatar">{initials(displayName(user))}</span>
              <span>
                <strong>{displayName(user)}</strong>
                <small>@{user.userName || chatText("staffUsername")}</small>
              </span>
            </button>
          ))}
          {!isSearching && groups
            .filter((group) =>
              displayName(group).toLowerCase().includes(searchQuery.toLowerCase()),
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
                  <strong>{displayName(group)}</strong>
                  <small>{chatText("eventGroup")}</small>
                </span>
              </button>
            ))}
          {!isSearching && !searchResults.length &&
            !groups.some((group) =>
              displayName(group).toLowerCase().includes(searchQuery.toLowerCase()),
            ) && (
              <div className="chat-list__no-results" role="status">
                <span className="chat-list__no-results-icon">
                  <SearchX size={20} />
                </span>
                <strong>{chatText("noResults")}</strong>
                <small>{chatText("noResultsText")}</small>
              </div>
            )}
        </div>
      ) : (
        <div className="chat-list__items">
          {isLoading ? <ChatListSkeleton /> : conversations.map((conversation) => {
            const itemId = getId(conversation);
            const participant = conversation.members?.find(
              (item) => getId(item) !== String(currentUserId),
            );
            const name =
              conversation.type === "group"
                ? conversation.name
                : displayName(participant);
            const lastSenderName = getLastSenderName(conversation, chatText("unnamed"));
            const online = participant
              ? Boolean(presence[getId(participant)])
              : false;
            const memberState = conversation.memberStates?.find(
              (state) => String(state.userId) === String(currentUserId),
            );
            const isUnread = Boolean(
              conversation.lastMessageAt &&
              (!memberState?.lastReadAt ||
                new Date(conversation.lastMessageAt) >
                  new Date(memberState.lastReadAt)) &&
              activeId !== itemId,
            );
            return (
              <div
                className={`chat-conversation-wrap ${conversation.type === "group" && isAdmin ? "chat-conversation-wrap--admin" : ""}`}
                key={itemId}
              >
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
                      {conversation.lastMessagePreview
                        ? conversation.type === "group" && lastSenderName
                          ? `${lastSenderName}: ${conversation.lastMessagePreview}`
                          : conversation.lastMessagePreview
                        : chatText("startConversation")}
                    </small>
                  </span>
                  <time>
                    {conversation.lastMessageAt
                      ? new Date(conversation.lastMessageAt).toLocaleTimeString(
                          i18n.language === "en" ? "en-US" : "vi-VN",
                          { hour: "2-digit", minute: "2-digit" },
                        )
                      : ""}
                  </time>
                  {isUnread && (
                    <span
                      className="chat-conversation__unread-dot"
                      aria-label={chatText("unread")}
                    />
                  )}
                </button>
                {conversation.type === "group" && isAdmin && (
                  <button
                    className="chat-conversation__more"
                    type="button"
                    onClick={() => onEditGroup(conversation)}
                    aria-label={chatText("editAria", { name })}
                  >
                    <MoreHorizontal size={18} />
                  </button>
                )}
              </div>
            );
          })}
          {!conversations.length && (
            <div className="chat-list__blank">
              <MessageCircle size={26} />
              <p>{chatText("emptyConversations")}</p>
              <small>{chatText("emptyConversationsText")}</small>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
export default ListChat;
