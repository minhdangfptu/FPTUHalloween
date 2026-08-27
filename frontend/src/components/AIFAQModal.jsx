import React from "react";
import {
  Check,
  Clock3,
  LoaderCircle,
  Menu,
  MessageSquareText,
  Newspaper,
  Plus,
  Send,
  Sparkles,
  TicketCheck,
  TriangleAlert,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import "./AIFAQModal.scss";

const MAX_MESSAGE_LENGTH = 2000;
const RESPONSE_DELAY_MS = 700;
const SUCCESS_STATE_DURATION_MS = 1200;
const CLOSE_ANIMATION_DURATION_MS = 300;

const AIFAQModal = () => {
  const { t } = useTranslation();
  const componentText = (key, defaultValue, options = {}) =>
    t(`components.${key}`, { defaultValue, ...options });
  const createWelcomeMessage = () => ({
    id: "welcome",
    role: "assistant",
    content: componentText(
      "aiFaqGreeting",
      "Chào bạn, mình là trợ lý FPTU Halloween. Bạn có thể hỏi về lịch sự kiện, vé, thanh toán hoặc check-in.",
    ),
    sources: [],
  });

  const dialogRef = React.useRef(null);
  const composerRef = React.useRef(null);
  const messagesRef = React.useRef(null);
  const responseTimerRef = React.useRef(null);
  const successTimerRef = React.useRef(null);
  const closeTimerRef = React.useRef(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = React.useState(false);
  const [activeConversationId, setActiveConversationId] = React.useState("new");
  const [message, setMessage] = React.useState("");
  const [messages, setMessages] = React.useState(() => [createWelcomeMessage()]);
  const [isResponding, setIsResponding] = React.useState(false);
  const [sendState, setSendState] = React.useState("default");
  const [validationError, setValidationError] = React.useState("");

  const historyItems = [
    {
      id: "ticket-availability",
      title: componentText("aiFaqHistoryTicket", "Vé ngày 30/10 còn không?"),
      time: componentText("aiFaqHistoryToday", "Hôm nay"),
    },
    {
      id: "event-schedule",
      title: componentText("aiFaqHistorySchedule", "Lịch trình Halloween 2026"),
      time: componentText("aiFaqHistoryYesterday", "Hôm qua"),
    },
    {
      id: "payment-guide",
      title: componentText("aiFaqHistoryPayment", "Hướng dẫn thanh toán vé"),
      time: componentText("aiFaqHistoryEarlier", "Trước đó"),
    },
  ];

  const suggestions = [
    {
      id: "ticket",
      icon: TicketCheck,
      label: componentText("aiFaqSuggestionTicket", "Kiểm tra thông tin vé"),
    },
    {
      id: "schedule",
      icon: Clock3,
      label: componentText("aiFaqSuggestionSchedule", "Xem lịch sự kiện"),
    },
    {
      id: "news",
      icon: Newspaper,
      label: componentText("aiFaqSuggestionNews", "Tin mới từ Fanpage"),
    },
  ];

  React.useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
      window.requestAnimationFrame(() => composerRef.current?.focus());
      return;
    }

    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  React.useEffect(() => {
    if (!isOpen || !messagesRef.current) return;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    messagesRef.current.scrollTo({
      top: messagesRef.current.scrollHeight,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }, [isOpen, isResponding, messages]);

  React.useEffect(
    () => () => {
      window.clearTimeout(responseTimerRef.current);
      window.clearTimeout(successTimerRef.current);
      window.clearTimeout(closeTimerRef.current);
    },
    [],
  );

  const completeClose = () => {
    window.clearTimeout(closeTimerRef.current);
    if (dialogRef.current?.open) dialogRef.current.close();
    setIsClosing(false);
    setIsOpen(false);
  };

  const handleClose = () => {
    if (!isOpen || isClosing) return;
    setIsHistoryOpen(false);
    setIsClosing(true);
    closeTimerRef.current = window.setTimeout(
      completeClose,
      CLOSE_ANIMATION_DURATION_MS + 50,
    );
  };

  const handleDialogAnimationEnd = (event) => {
    if (isClosing && event.target === dialogRef.current) completeClose();
  };

  const handleCancel = (event) => {
    event.preventDefault();
    if (isHistoryOpen) {
      setIsHistoryOpen(false);
      return;
    }
    handleClose();
  };

  const handleBackdropClick = (event) => {
    if (event.target === dialogRef.current) handleClose();
  };

  const handleNewConversation = () => {
    window.clearTimeout(responseTimerRef.current);
    window.clearTimeout(successTimerRef.current);
    setActiveConversationId("new");
    setMessages([createWelcomeMessage()]);
    setMessage("");
    setIsResponding(false);
    setSendState("default");
    setValidationError("");
    setIsHistoryOpen(false);
    window.requestAnimationFrame(() => composerRef.current?.focus());
  };

  const handleSelectConversation = (conversation) => {
    window.clearTimeout(responseTimerRef.current);
    window.clearTimeout(successTimerRef.current);
    setActiveConversationId(conversation.id);
    setMessages([
      {
        id: `${conversation.id}-user`,
        role: "user",
        content: conversation.title,
        sources: [],
      },
      {
        id: `${conversation.id}-assistant`,
        role: "assistant",
        content: componentText(
          "aiFaqHistoryPreview",
          "Đây là nội dung lịch sử mẫu. Khi kết nối API, câu trả lời và nguồn tham khảo của cuộc trò chuyện sẽ hiển thị tại đây.",
        ),
        sources: [componentText("aiFaqSourceEvent", "Thông tin sự kiện")],
      },
    ]);
    setIsResponding(false);
    setValidationError("");
    setSendState("default");
    setIsHistoryOpen(false);
    window.requestAnimationFrame(() => composerRef.current?.focus());
  };

  const handleSuggestion = (suggestion) => {
    setMessage(suggestion.label);
    setValidationError("");
    setSendState("default");
    composerRef.current?.focus();
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
    if (validationError) setValidationError("");
    if (sendState === "error" || sendState === "success") {
      setSendState("default");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedMessage = message.trim();
    if (!trimmedMessage || isResponding) return;

    if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
      setValidationError(
        componentText(
          "aiFaqMessageTooLong",
          "Câu hỏi vượt quá {{count}} ký tự. Hãy rút gọn nội dung rồi gửi lại.",
          { count: MAX_MESSAGE_LENGTH },
        ),
      );
      setSendState("error");
      return;
    }

    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmedMessage,
      sources: [],
    };
    setMessages((currentMessages) => [...currentMessages, userMessage]);
    setMessage("");
    setIsResponding(true);
    setSendState("loading");
    setValidationError("");

    responseTimerRef.current = window.setTimeout(() => {
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: componentText(
            "aiFaqPlaceholderReply",
            "Đây là phản hồi mô phỏng của trợ lý AI. Dữ liệu thật sẽ được trả về sau khi frontend kết nối API Gemini và nguồn kiến thức của sự kiện.",
          ),
          sources: [
            componentText("aiFaqSourceNews", "News chính thức"),
            componentText("aiFaqSourceTicket", "Thông tin vé"),
          ],
        },
      ]);
      setIsResponding(false);
      setSendState("success");
      successTimerRef.current = window.setTimeout(
        () => setSendState("default"),
        SUCCESS_STATE_DURATION_MS,
      );
    }, RESPONSE_DELAY_MS);
  };

  const sendIcon = {
    loading: <LoaderCircle aria-hidden="true" />,
    error: <TriangleAlert aria-hidden="true" />,
    success: <Check aria-hidden="true" />,
  }[sendState] || <Send aria-hidden="true" />;

  return (
    <div className="ai-faq-root">
      <button
        className="ai-faq-launcher"
        type="button"
        onClick={() => {
          window.clearTimeout(closeTimerRef.current);
          setIsClosing(false);
          setIsOpen(true);
        }}
        aria-label={componentText("openAiFaq", "Mở trợ lý hỏi đáp AI")}
        aria-haspopup="dialog"
        aria-expanded={isOpen && !isClosing}
        title={componentText("aiFaq", "Hỏi AI")}
      >
        <Sparkles aria-hidden="true" />
        <span>{componentText("aiFaqShort", "AI")}</span>
      </button>

      <dialog
        className="ai-faq-dialog"
        ref={dialogRef}
        onCancel={handleCancel}
        onClick={handleBackdropClick}
        onAnimationEnd={handleDialogAnimationEnd}
        onClose={() => {
          window.clearTimeout(closeTimerRef.current);
          setIsClosing(false);
          setIsOpen(false);
        }}
        data-closing={isClosing ? "true" : undefined}
        aria-labelledby="ai-faq-title"
      >
        <div className="ai-faq__shell">
          {isHistoryOpen && (
            <button
              className="ai-faq__history-scrim"
              type="button"
              onClick={() => setIsHistoryOpen(false)}
              aria-label={componentText("closeAiFaqHistory", "Đóng lịch sử chat")}
            />
          )}

          <aside
            className={`ai-faq__history ${isHistoryOpen ? "ai-faq__history--open" : ""}`}
            aria-label={componentText("aiFaqHistory", "Lịch sử chat")}
            aria-hidden={!isHistoryOpen}
            inert={!isHistoryOpen}
          >
            <div className="ai-faq__history-header">
              <div>
                <Sparkles aria-hidden="true" />
                <strong>FPTU AI</strong>
              </div>
              <button
                className="ai-faq__icon-button"
                type="button"
                onClick={() => setIsHistoryOpen(false)}
                aria-label={componentText("closeAiFaqHistory", "Đóng lịch sử chat")}
              >
                <X aria-hidden="true" />
              </button>
            </div>

            <button
              className="ai-faq__new-chat"
              type="button"
              onClick={handleNewConversation}
            >
              <Plus aria-hidden="true" />
              {componentText("aiFaqNewChat", "Đoạn chat mới")}
            </button>

            <div className="ai-faq__history-list">
              <p>{componentText("aiFaqRecent", "Gần đây")}</p>
              {historyItems.map((conversation) => (
                <button
                  className={
                    activeConversationId === conversation.id
                      ? "ai-faq__history-item ai-faq__history-item--active"
                      : "ai-faq__history-item"
                  }
                  type="button"
                  key={conversation.id}
                  onClick={() => handleSelectConversation(conversation)}
                >
                  <MessageSquareText aria-hidden="true" />
                  <span>
                    <strong>{conversation.title}</strong>
                    <small>{conversation.time}</small>
                  </span>
                </button>
              ))}
            </div>

            <p className="ai-faq__history-note">
              {componentText(
                "aiFaqHistoryNote",
                "Lịch sử hiện là dữ liệu mẫu và chưa được lưu vào tài khoản.",
              )}
            </p>
          </aside>

          <section className="ai-faq__chat">
            <header className="ai-faq__header">
              <button
                className="ai-faq__icon-button"
                type="button"
                onClick={() => setIsHistoryOpen(true)}
                aria-label={componentText("openAiFaqHistory", "Mở lịch sử chat")}
                aria-expanded={isHistoryOpen}
              >
                <Menu aria-hidden="true" />
              </button>
              <div className="ai-faq__heading">
                <div>
                  <h2 id="ai-faq-title">
                    {componentText("aiFaqTitle", "Trợ lý sự kiện")}
                  </h2>
                  <p>
                    <span className="ai-faq__status-dot" aria-hidden="true" />
                    <span className="ai-faq__status-label">
                      {componentText("aiFaqPreviewStatus", "Giao diện thử nghiệm")}
                    </span>
                  </p>
                </div>
              </div>
              <button
                className="ai-faq__icon-button"
                type="button"
                onClick={handleClose}
                aria-label={componentText("closeAiFaq", "Đóng trợ lý AI")}
              >
                <X aria-hidden="true" />
              </button>
            </header>

            <div className="ai-faq__messages" ref={messagesRef} aria-live="polite">
              <div className="ai-faq__conversation">
                {messages.map((chatMessage) => (
                  <article
                    className={`ai-faq__message ai-faq__message--${chatMessage.role}`}
                    key={chatMessage.id}
                  >
                    {chatMessage.role === "assistant" && (
                      <span className="ai-faq__message-avatar" aria-hidden="true">
                        <Sparkles />
                      </span>
                    )}
                    <div>
                      <p>{chatMessage.content}</p>
                      {chatMessage.sources.length > 0 && (
                        <div className="ai-faq__sources" aria-label={componentText("aiFaqSources", "Nguồn tham khảo")}>
                          {chatMessage.sources.map((source) => (
                            <span key={source}><Newspaper aria-hidden="true" /> {source}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </article>
                ))}

                {messages.length === 1 && (
                  <div className="ai-faq__suggestions">
                    {suggestions.map(({ id, icon: Icon, label }) => (
                      <button type="button" key={id} onClick={() => handleSuggestion({ label })}>
                        <Icon aria-hidden="true" />
                        <span>{label}</span>
                      </button>
                    ))}
                  </div>
                )}

                {isResponding && (
                  <div className="ai-faq__thinking" role="status">
                    <span className="ai-faq__message-avatar" aria-hidden="true"><Sparkles /></span>
                    <div>
                      <LoaderCircle aria-hidden="true" />
                      {componentText("aiFaqThinking", "Đang tìm thông tin phù hợp…")}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <footer className="ai-faq__composer-area">
              <form className="ai-faq__composer" onSubmit={handleSubmit} data-state={validationError ? "error" : "default"}>
                <label className="ai-faq__sr-only" htmlFor="ai-faq-message">
                  {componentText("aiFaqMessageLabel", "Câu hỏi dành cho trợ lý AI")}
                </label>
                <textarea
                  id="ai-faq-message"
                  ref={composerRef}
                  rows="1"
                  value={message}
                  onChange={handleMessageChange}
                  maxLength={MAX_MESSAGE_LENGTH + 1}
                  placeholder={componentText("aiFaqPlaceholder", "Hỏi về sự kiện FPTU Halloween…")}
                  aria-invalid={Boolean(validationError)}
                  aria-describedby="ai-faq-helper"
                />
                <button
                  className="ai-faq__send"
                  type="submit"
                  data-state={sendState}
                  disabled={!message.trim() || isResponding}
                  aria-disabled={!message.trim() || isResponding}
                  aria-label={componentText("sendAiFaqMessage", "Gửi câu hỏi")}
                >
                  {sendIcon}
                </button>
              </form>
              <div className="ai-faq__helper" id="ai-faq-helper">
                {validationError ? (
                  <span className="ai-faq__helper-error"><TriangleAlert aria-hidden="true" /> {validationError}</span>
                ) : (
                  <span>{componentText("aiFaqDisclaimer", "AI có thể trả lời chưa chính xác. Hãy kiểm tra nguồn chính thức.")}</span>
                )}
                <small>{message.length}/{MAX_MESSAGE_LENGTH}</small>
              </div>
            </footer>
          </section>
        </div>
      </dialog>
    </div>
  );
};

export default AIFAQModal;
