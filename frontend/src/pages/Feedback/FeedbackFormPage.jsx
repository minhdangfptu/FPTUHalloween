import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Check,
  Clock3,
  HeartHandshake,
  LoaderCircle,
  Send,
  Sparkles,
  Star,
} from "lucide-react";
import toast from "react-hot-toast";
import ManageSidebar from "../../components/ManageSidebar";
import feedbackAPI from "../../apis/feedbackAPI";
import {
  translateError,
  translateSuccess,
} from "../../utils/translateResponse";
import "./Feedback.scss";

const formatDate = (value, locale = "vi-VN") =>
  value
    ? new Date(value).toLocaleString(locale, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "-";

const getQuestionValue = (answers, questionId) =>
  answers.find((answer) => answer.questionId === questionId)?.value;

const FeedbackPageFrame = ({ targetType, children }) =>
  targetType === "staff" ? (
    <div className="feedback-management-layout">
      <ManageSidebar role="staff" activeItem="feedback" />
      {children}
    </div>
  ) : (
    children
  );

const FeedbackFormPage = ({ targetType }) => {
  const { t, i18n } = useTranslation();
  const feedbackText = (key, options) => t(`feedbackPage.${key}`, options);
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const loadForms = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await feedbackAPI.getForms({ targetType });
      setForms(data);
      setSelectedForm(data[0] || null);
    } catch (requestError) {
      const message = translateError(requestError);
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [targetType]);

  useEffect(() => {
    loadForms();
  }, [loadForms]);

  useEffect(() => {
    setAnswers([]);
    setSubmitted(false);
  }, [selectedForm?._id]);

  const answerCount = useMemo(
    () =>
      answers.filter(
        (answer) =>
          answer.value !== "" &&
          answer.value !== undefined &&
          answer.value !== null,
      ).length,
    [answers],
  );

  const setAnswer = (questionId, value) => {
    setAnswers((current) => {
      const existing = current.find(
        (answer) => answer.questionId === questionId,
      );
      if (!existing) return [...current, { questionId, value }];
      return current.map((answer) =>
        answer.questionId === questionId ? { ...answer, value } : answer,
      );
    });
  };

  const toggleMultipleChoice = (questionId, option) => {
    const currentValue = getQuestionValue(answers, questionId) || [];
    const nextValue = currentValue.includes(option)
      ? currentValue.filter((item) => item !== option)
      : [...currentValue, option];
    setAnswer(questionId, nextValue);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedForm || isSubmitting) return;
    const missingRequired = selectedForm.questions.find((question) => {
      const value = getQuestionValue(answers, String(question._id));
      return (
        question.required &&
        (value === undefined ||
          value === "" ||
          (Array.isArray(value) && value.length === 0))
      );
    });
    if (missingRequired) {
      toast.error(feedbackText("requiredQuestion", { order: missingRequired.order }));
      return;
    }

    setIsSubmitting(true);
    try {
      await feedbackAPI.submit(selectedForm._id, answers);
      setSubmitted(true);
      toast.success(translateSuccess("Feedback submitted successfully"));
    } catch (requestError) {
      toast.error(translateError(requestError));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <FeedbackPageFrame targetType={targetType}>
        <main className="feedback-page">
          <div className="feedback-shell feedback-state">
            <LoaderCircle className="feedback-spinner" size={28} />
            <p>{feedbackText("loading")}</p>
          </div>
        </main>
      </FeedbackPageFrame>
    );
  }

  if (error) {
    return (
      <FeedbackPageFrame targetType={targetType}>
        <main className="feedback-page">
          <div className="feedback-shell feedback-state feedback-state--error">
            <Sparkles size={28} />
            <h2>{feedbackText("errorTitle")}</h2>
            <p>{error}</p>
            <button
              className="feedback-button feedback-button--dark"
              type="button"
              onClick={loadForms}
            >
              {feedbackText("retry")}
            </button>
          </div>
        </main>
      </FeedbackPageFrame>
    );
  }

  if (!selectedForm) {
    return (
      <FeedbackPageFrame targetType={targetType}>
        <main className="feedback-page">
          <div className="feedback-shell feedback-state">
            <Clock3 size={28} />
            <h2>{feedbackText("emptyTitle")}</h2>
            <p>{feedbackText("emptyText")}</p>
          </div>
        </main>
      </FeedbackPageFrame>
    );
  }

  if (submitted) {
    return (
      <FeedbackPageFrame targetType={targetType}>
        <main className="feedback-page">
          <div className="feedback-shell feedback-state feedback-state--success">
            <span className="feedback-success-mark">
              <Check size={30} />
            </span>
            <p className="feedback-eyebrow">{feedbackText("submittedLabel")}</p>
            <h1>{feedbackText("submittedTitle")}</h1>
            <p>{feedbackText("submittedText")}</p>
            <button
              className="feedback-button feedback-button--dark"
              type="button"
              onClick={() => setSubmitted(false)}
            >
              {feedbackText("review")}
            </button>
          </div>
        </main>
      </FeedbackPageFrame>
    );
  }

  const audienceLabel = targetType === "staff" ? feedbackText("staffAudience") : feedbackText("attendeeAudience");
  return (
    <FeedbackPageFrame targetType={targetType}>
      <main className="feedback-page">
        <div className="feedback-shell">
          <header className="feedback-hero">
            <div className="feedback-hero__copy">
              <p className="feedback-eyebrow">
                <Sparkles size={14} /> {feedbackText("eyebrow")} ·{" "}
                {audienceLabel}
              </p>
              <h1>{selectedForm.title}</h1>
              <p>
                {selectedForm.description ||
                  feedbackText("descriptionFallback")}
              </p>
            </div>
            <div className="feedback-hero__stamp">
              <HeartHandshake size={22} />
              <span>{feedbackText("open")}</span>
              <small>{feedbackText("until")} {formatDate(selectedForm.closeAt, i18n.language.startsWith("en") ? "en-US" : "vi-VN")}</small>
            </div>
          </header>

          {forms.length > 1 && (
            <div
              className="feedback-form-tabs"
              role="tablist"
              aria-label={feedbackText("chooseForm")}
            >
              <span>{feedbackText("openForm")}</span>
              {forms.map((form) => (
                <button
                  key={form._id}
                  type="button"
                  className={form._id === selectedForm._id ? "is-active" : ""}
                  onClick={() => setSelectedForm(form)}
                >
                  {form.title}
                </button>
              ))}
            </div>
          )}

          <form className="feedback-response-sheet" onSubmit={handleSubmit}>
            <div className="feedback-sheet-meta">
              <span>{feedbackText("questions", { count: selectedForm.questions.length })}</span>
              <span>{feedbackText("answered", { count: answerCount })}</span>
            </div>
            {selectedForm.questions.map((question, index) => {
              const questionId = String(question._id);
              const value = getQuestionValue(answers, questionId);
              return (
                <fieldset className="feedback-question" key={questionId}>
                  <legend>
                    <span className="feedback-question__number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>
                      {question.question}
                      {question.required && <b aria-label={feedbackText("required")}>*</b>}
                    </span>
                  </legend>
                  {question.type === "rating" && (
                    <div
                      className="feedback-rating"
                      role="radiogroup"
                      aria-label={question.question}
                    >
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          className={
                            rating <= (value || 0) ? "is-selected" : ""
                          }
                          type="button"
                          onClick={() => setAnswer(questionId, rating)}
                          aria-label={feedbackText("rating", { count: rating })}
                          aria-pressed={value === rating}
                        >
                          <Star
                            size={26}
                            fill="currentColor"
                            strokeWidth={1.5}
                          />
                        </button>
                      ))}
                    </div>
                  )}
                  {question.type === "text" && (
                    <textarea
                      value={value || ""}
                      onChange={(event) =>
                        setAnswer(questionId, event.target.value)
                      }
                      rows={4}
                      placeholder={feedbackText("placeholder")}
                    />
                  )}
                  {question.type === "single_choice" && (
                    <div className="feedback-options">
                      {question.options.map((option) => (
                        <label
                          key={option}
                          className={value === option ? "is-selected" : ""}
                        >
                          <input
                            type="radio"
                            name={questionId}
                            checked={value === option}
                            onChange={() => setAnswer(questionId, option)}
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  )}
                  {question.type === "multiple_choice" && (
                    <div className="feedback-options">
                      {question.options.map((option) => (
                        <label
                          key={option}
                          className={
                            value?.includes(option) ? "is-selected" : ""
                          }
                        >
                          <input
                            type="checkbox"
                            checked={value?.includes(option) || false}
                            onChange={() =>
                              toggleMultipleChoice(questionId, option)
                            }
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  )}
                </fieldset>
              );
            })}
            <footer className="feedback-submit-row">
              <p>
                {feedbackText("savedWithRole", { role: targetType === "staff" ? "Staff" : feedbackText("attendeeAudience") })}
              </p>
              <button
                className="feedback-button feedback-button--accent"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <LoaderCircle className="feedback-spinner" size={17} /> {feedbackText("sending")}
                  </>
                ) : (
                  <>
                    <Send size={17} /> {feedbackText("submit")}
                  </>
                )}
              </button>
            </footer>
          </form>
        </div>
      </main>
    </FeedbackPageFrame>
  );
};

export default FeedbackFormPage;
