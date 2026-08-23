import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  ClipboardPenLine,
  LoaderCircle,
  Plus,
  Save,
  Trash2,
  X,
  UsersRound,
  Eye,
  EyeOff,
} from "lucide-react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import ManageSidebar from "../../components/ManageSidebar";
import feedbackAPI from "../../apis/feedbackAPI";
import {
  translateError,
  translateSuccess,
} from "../../utils/translateResponse";
import "../Feedback/Feedback.scss";

const NEW_QUESTION = () => ({
  question: "",
  type: "rating",
  options: [],
  required: false,
});
const EMPTY_FORM = {
  title: "",
  description: "",
  targetType: "attendee",
  openAt: "",
  closeAt: "",
  status: "draft",
  questions: [NEW_QUESTION()],
};

const toLocalInput = (value) =>
  value ? new Date(value).toISOString().slice(0, 16) : "";
const toIso = (value) => (value ? new Date(value).toISOString() : "");
const AdminFeedback = () => {
  const { t, i18n } = useTranslation();
  const feedbackText = (key, options) => t(`management.feedback.${key}`, options);
  const formatDate = (value) => value
    ? new Date(value).toLocaleString(i18n.language === "en" ? "en-US" : "vi-VN", { dateStyle: "medium", timeStyle: "short" })
    : "—";
  const getTargetLabel = (targetType) => feedbackText(targetType === "staff" ? "staffAudience" : "attendeeAudience");
  const getStatusLabel = (status) => t(`management.feedback.status${status}`, { defaultValue: status });
  const [forms, setForms] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [responses, setResponses] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTogglingFeedbackNav, setIsTogglingFeedbackNav] = useState(false);
  const [isResponsesOpen, setIsResponsesOpen] = useState(false);
  const [error, setError] = useState("");

  const loadForms = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await feedbackAPI.getForms();
      setForms(data);
      if (data[0]) {
        setSelectedId(data[0]._id);
        setForm({
          ...data[0],
          openAt: toLocalInput(data[0].openAt),
          closeAt: toLocalInput(data[0].closeAt),
          questions: data[0].questions.map((question) => ({
            ...question,
            options: question.options || [],
          })),
        });
      }
    } catch (requestError) {
      const message = translateError(requestError);
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadForms();
  }, [loadForms]);

  const loadInsights = useCallback(async (formId) => {
    if (!formId) {
      setResponses(null);
      setStatistics(null);
      return;
    }
    try {
      const [responseData, statisticData] = await Promise.all([
        feedbackAPI.getResponses(formId),
        feedbackAPI.getStatistics(formId),
      ]);
      setResponses(responseData);
      setStatistics(statisticData);
    } catch (requestError) {
      toast.error(translateError(requestError));
    }
  }, []);

  useEffect(() => {
    loadInsights(selectedId);
  }, [loadInsights, selectedId]);

  const selectForm = (nextForm) => {
    setIsResponsesOpen(Boolean(nextForm?._id));
    setSelectedId(nextForm?._id || null);
    setForm(
      nextForm
        ? {
            ...nextForm,
            openAt: toLocalInput(nextForm.openAt),
            closeAt: toLocalInput(nextForm.closeAt),
            questions: nextForm.questions.map((question) => ({
              ...question,
              options: question.options || [],
            })),
          }
        : { ...EMPTY_FORM, questions: [NEW_QUESTION()] },
    );
  };

  const updateFormField = (field, value) =>
    setForm((current) => ({ ...current, [field]: value }));
  const updateQuestion = (index, field, value) =>
    setForm((current) => ({
      ...current,
      questions: current.questions.map((question, questionIndex) =>
        questionIndex === index ? { ...question, [field]: value } : question,
      ),
    }));
  const addQuestion = () =>
    setForm((current) => ({
      ...current,
      questions: [...current.questions, NEW_QUESTION()],
    }));
  const removeQuestion = (index) =>
    setForm((current) => ({
      ...current,
      questions:
        current.questions.length === 1
          ? current.questions
          : current.questions.filter(
              (_, questionIndex) => questionIndex !== index,
            ),
    }));
  const updateOptions = (index, value) =>
    updateQuestion(
      index,
      "options",
      value.split("\n"),
    );

  const payload = useMemo(
    () => ({
      ...form,
      openAt: toIso(form.openAt),
      closeAt: toIso(form.closeAt),
      questions: form.questions.map(
        ({ question, type, options, required }) => ({
          question: question.trim(),
          type,
          options: options.map((option) => option.trim()).filter(Boolean),
          required,
        }),
      ),
    }),
    [form],
  );

  const handleSave = async (event) => {
    event.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
    try {
      const result = selectedId
        ? await feedbackAPI.update(selectedId, payload)
        : await feedbackAPI.create(payload);
      toast.success(translateSuccess(result.message));
      await loadForms();
      if (result.form?._id) setSelectedId(result.form._id);
    } catch (requestError) {
      toast.error(translateError(requestError));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedId || isDeleting) return;
    setIsDeleting(true);
    try {
      await feedbackAPI.delete(selectedId);
      toast.success(translateSuccess("Deleted successfully"));
      setSelectedId(null);
      setForm({ ...EMPTY_FORM, questions: [NEW_QUESTION()] });
      await loadForms();
    } catch (requestError) {
      toast.error(translateError(requestError));
    } finally {
      setIsDeleting(false);
    }
  };

  const attendeeForm = forms.find((item) => item.targetType === "attendee");
  const isFeedbackNavEnabled = attendeeForm?.status === "published";

  const toggleFeedbackNav = async () => {
    if (!attendeeForm || isTogglingFeedbackNav) return;
    setIsTogglingFeedbackNav(true);
    try {
      const nextStatus = isFeedbackNavEnabled ? "draft" : "published";
      const result = await feedbackAPI.update(attendeeForm._id, { status: nextStatus });
      toast.success(translateSuccess(result.message));
      window.dispatchEvent(new CustomEvent("feedback:visibility-changed"));
      await loadForms();
    } catch (requestError) {
      toast.error(translateError(requestError));
    } finally {
      setIsTogglingFeedbackNav(false);
    }
  };

  if (isLoading)
    return (
      <main className="admin-feedback-page">
        <ManageSidebar role="admin" activeItem="feedback" />
        <div className="admin-feedback-content feedback-state">
          <LoaderCircle className="feedback-spinner" size={28} />
          <p>{feedbackText("loading")}</p>
        </div>
      </main>
    );
  if (error)
    return (
      <main className="admin-feedback-page">
        <ManageSidebar role="admin" activeItem="feedback" />
        <div className="admin-feedback-content feedback-state feedback-state--error">
          <h2>{feedbackText("loadError")}</h2>
          <p>{error}</p>
          <button
            className="feedback-button feedback-button--dark"
            type="button"
            onClick={loadForms}
          >
            {t("management.common.retry")}
          </button>
        </div>
      </main>
    );

  return (
    <main className="admin-feedback-page">
      <ManageSidebar role="admin" activeItem="feedback" />
      <div className="admin-feedback-content">
        <header className="admin-feedback-heading">
          <div>
            <p className="feedback-eyebrow">
              <ClipboardPenLine size={14} /> {feedbackText("kicker")}
            </p>
            <h1>{feedbackText("title")}</h1>
            <p>{feedbackText("intro")}</p>
          </div>
          <div className="feedback-heading-actions">
            <button
              className="feedback-button feedback-button--quiet"
              type="button"
              onClick={toggleFeedbackNav}
              disabled={!attendeeForm || isTogglingFeedbackNav}
              title={!attendeeForm ? feedbackText("createAttendeeFirst") : undefined}
            >
              {isFeedbackNavEnabled ? <EyeOff size={17} /> : <Eye size={17} />}
              {feedbackText(isFeedbackNavEnabled ? "hideFeedback" : "showFeedback")}
            </button>
            <button
              className="feedback-button feedback-button--accent"
              type="button"
              onClick={() => selectForm(null)}
            >
              <Plus size={17} /> {feedbackText("newForm")}
            </button>
          </div>
        </header>
        <div className="admin-feedback-layout">
          <aside className="feedback-form-index">
            <div className="feedback-form-index__heading">
              <span>{feedbackText("forms")}</span>
              <b>{forms.length}</b>
            </div>
            {forms.map((item) => (
              <button
                className={item._id === selectedId ? "is-active" : ""}
                type="button"
                key={item._id}
                onClick={() => selectForm(item)}
              >
                <span>
                  <strong>{item.title}</strong>
                  <small className="feedback-form-index__audience">{getTargetLabel(item.targetType)}</small>
                  <small className="feedback-form-index__status">{getStatusLabel(item.status)} · {feedbackText("responseCount", { count: item.responseCount || 0 })}</small>
                  <small className="feedback-form-index__dates">{feedbackText("opens", { time: formatDate(item.openAt) })}<br />{feedbackText("closes", { time: formatDate(item.closeAt) })}</small>
                  <small>
                    {getTargetLabel(item.targetType)} ·{" "}
                    {item.status}
                  </small>
                </span>
                <ChevronDown size={16} />
              </button>
            ))}
            {forms.length === 0 && (
              <p className="feedback-muted">
                {feedbackText("emptyForms")}
              </p>
            )}
          </aside>
          <section className="feedback-builder">
            <form onSubmit={handleSave}>
              <div className="feedback-builder__top">
                <div>
                  <span className="feedback-kicker">
                    {feedbackText(selectedId ? "editingLabel" : "newDraftLabel")}
                  </span>
                  <h2>
                    {selectedId
                      ? feedbackText("editFormTitle")
                      : feedbackText("newFormTitle")}
                  </h2>
                </div>
                {selectedId && (
                  <button
                    className="feedback-icon-button feedback-icon-button--danger"
                    type="button"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    aria-label={feedbackText("deleteForm")}
                  >
                    <Trash2 size={17} />
                  </button>
                )}
              </div>
              <div className="feedback-builder__grid">
                <label>
                  {feedbackText("formTitle")}
                  <input
                    value={form.title}
                    onChange={(event) =>
                      updateFormField("title", event.target.value)
                    }
                    required
                    placeholder={feedbackText("titlePlaceholder")}
                  />
                </label>
                <label>
                  {feedbackText("audience")}
                  <select
                    value={form.targetType}
                    onChange={(event) =>
                      updateFormField("targetType", event.target.value)
                    }
                  >
                    <option value="attendee">{feedbackText("attendeeAudience")}</option>
                    <option value="staff">{feedbackText("staffShort")}</option>
                  </select>
                </label>
                <label className="feedback-builder__wide">
                  {feedbackText("description")}
                  <textarea
                    value={form.description}
                    onChange={(event) =>
                      updateFormField("description", event.target.value)
                    }
                    rows={2}
                    placeholder={feedbackText("descriptionPlaceholder")}
                  />
                </label>
                <label>
                  {feedbackText("openForm")}
                  <input
                    type="datetime-local"
                    value={form.openAt}
                    onChange={(event) =>
                      updateFormField("openAt", event.target.value)
                    }
                    required
                  />
                </label>
                <label>
                  {feedbackText("closeForm")}
                  <input
                    type="datetime-local"
                    value={form.closeAt}
                    onChange={(event) =>
                      updateFormField("closeAt", event.target.value)
                    }
                    required
                  />
                </label>
                <label>
                  {t("management.common.status")}
                  <select
                    value={form.status}
                    onChange={(event) =>
                      updateFormField("status", event.target.value)
                    }
                  >
                    <option value="draft">{feedbackText("statusdraft")}</option>
                    <option value="published">{feedbackText("statuspublished")}</option>
                    <option value="closed">{feedbackText("statusclosed")}</option>
                  </select>
                </label>
              </div>
              <div className="feedback-builder__questions">
                <div className="feedback-builder__section-head">
                  <div>
                    <span className="feedback-kicker">{feedbackText("structure")}</span>
                    <h3>{feedbackText("formQuestions")}</h3>
                  </div>
                </div>
                {form.questions.map((question, index) => (
                  <div
                    className="feedback-question-stack"
                    key={`${index}-${question._id || "new"}`}
                  >
                    <article className="feedback-question-card">
                      <div className="feedback-question-card__bar">
                        <span>
                          {feedbackText("questionNumber", { number: String(index + 1).padStart(2, "0") })}
                        </span>
                        <button
                          className="feedback-icon-button"
                          type="button"
                          onClick={() => removeQuestion(index)}
                          aria-label={feedbackText("deleteQuestion")}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                      <label>
                        {feedbackText("question")}
                        <input
                          value={question.question}
                          onChange={(event) =>
                            updateQuestion(
                              index,
                              "question",
                              event.target.value,
                            )
                          }
                          required
                          placeholder={feedbackText("questionPlaceholder")}
                        />
                      </label>
                      <div className="feedback-question-card__row">
                        <label>
                          {feedbackText("answerType")}
                          <select
                            value={question.type}
                            onChange={(event) =>
                              updateQuestion(index, "type", event.target.value)
                            }
                          >
                            <option value="rating">{feedbackText("ratingType")}</option>
                            <option value="text">{feedbackText("textType")}</option>
                            <option value="single_choice">{feedbackText("singleType")}</option>
                            <option value="multiple_choice">
                              {feedbackText("multipleType")}
                            </option>
                          </select>
                        </label>
                        <label className="feedback-check">
                          <input
                            type="checkbox"
                            checked={question.required}
                            onChange={(event) =>
                              updateQuestion(
                                index,
                                "required",
                                event.target.checked,
                              )
                            }
                          />{" "}
                          {feedbackText("required")}
                        </label>
                      </div>
                      {["single_choice", "multiple_choice"].includes(
                        question.type,
                      ) && (
                        <label>
                          {feedbackText("answerOptions")}{" "}
                          <span className="feedback-muted">
                            {feedbackText("onePerLine")}
                          </span>
                          <textarea
                            value={(question.options || []).join("\n")}
                            onChange={(event) =>
                              updateOptions(index, event.target.value)
                            }
                            rows={3}
                            placeholder={
                              feedbackText("optionsPlaceholder")
                            }
                            required
                          />
                        </label>
                      )}
                    </article>
                    <button
                      className="feedback-add-question"
                      type="button"
                      onClick={addQuestion}
                      aria-label={feedbackText("addAfterQuestion", { number: index + 1 })}
                    >
                      <Plus size={17} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="feedback-builder__actions">
                <span>
                  {form.openAt && form.closeAt
                    ? `${formatDate(form.openAt)} → ${formatDate(form.closeAt)}`
                    : feedbackText("timeNotSet")}
                </span>
                <button
                  className="feedback-button feedback-button--accent"
                  type="submit"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <LoaderCircle className="feedback-spinner" size={17} />{" "}
                      {feedbackText("saving")}
                    </>
                  ) : (
                    <>
                      <Save size={17} /> {feedbackText("saveForm")}
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>
        </div>
        {selectedId && (
          <section className="feedback-insights">
            <header>
              <div>
                <p className="feedback-kicker">{feedbackText("afterSubmit")}</p>
                <h2>{feedbackText("insightsTitle")}</h2>
              </div>
              <div className="feedback-insight-total">
                <UsersRound size={18} />
                <strong>{responses?.pagination?.total || 0}</strong>
                <span>{feedbackText("responses")}</span>
              </div>
            </header>
            <div className="feedback-stat-grid">
              {statistics?.statistics?.map((item) => (
                <article key={String(item.questionId)}>
                  <span className="feedback-stat-type">
                    {item.type === "rating"
                      ? feedbackText("averageScore")
                      : feedbackText("choiceDistribution")}
                  </span>
                  <h3>{item.question}</h3>
                  {item.type === "rating" ? (
                    <strong className="feedback-stat-number">
                      {item.average || 0}
                      <small>/5</small>
                    </strong>
                  ) : (
                    <div className="feedback-bars">
                      {item.options?.map((option) => (
                        <div key={option.option}>
                          <span>{option.option}</span>
                          <b
                            style={{
                              "--bar-size": `${responses?.pagination?.total ? (option.count / responses.pagination.total) * 100 : 0}%`,
                            }}
                          >
                            {option.count}
                          </b>
                        </div>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
            <div className="feedback-response-list">
              {responses?.responses?.slice(0, 5).map((response) => (
                <article key={response._id}>
                  <div>
                    <strong>{response.userId?.fullName || feedbackText("anonymous")}</strong>
                    <span>{formatDate(response.createdAt)}</span>
                  </div>
                  <p>
                    {response.answers
                      ?.map((answer) =>
                        Array.isArray(answer.value)
                          ? answer.value.join(", ")
                          : answer.value,
                      )
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </article>
              ))}
            </div>
          </section>
        )}
        {isResponsesOpen && selectedId && (
          <div className="feedback-response-modal" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setIsResponsesOpen(false); }}>
            <section className="feedback-response-modal__panel" role="dialog" aria-modal="true" aria-labelledby="feedback-response-modal-title">
              <header className="feedback-response-modal__header">
                <div>
                  <p className="feedback-kicker">{feedbackText("responseList")}</p>
                  <h2 id="feedback-response-modal-title">{form.title}</h2>
                  <span>{feedbackText("submissions", { count: responses?.pagination?.total || 0 })}</span>
                </div>
                <button className="feedback-icon-button" type="button" onClick={() => setIsResponsesOpen(false)} aria-label={feedbackText("closeResponses")}><X size={19} /></button>
              </header>
              <div className="feedback-response-modal__body">
                {!responses && <div className="feedback-state feedback-state--compact"><LoaderCircle className="feedback-spinner" size={24} /><p>{feedbackText("loadingResponses")}</p></div>}
                {responses?.responses?.length === 0 && <div className="feedback-state feedback-state--compact"><UsersRound size={25} /><p>{feedbackText("emptyResponses")}</p></div>}
                {responses?.responses?.map((response, responseIndex) => (
                  <article className="feedback-response-entry" key={response._id}>
                    <div className="feedback-response-entry__meta"><strong>{response.userId?.fullName || feedbackText("sender", { number: responseIndex + 1 })}</strong><span>{formatDate(response.createdAt)}</span></div>
                    <div className="feedback-response-entry__answers">
                      {response.answers?.map((answer) => {
                        const question = form.questions.find((item) => String(item._id) === String(answer.questionId));
                        return <div key={String(answer.questionId)}><small>{question?.question || feedbackText("question")}</small><p>{Array.isArray(answer.value) ? answer.value.join(", ") : String(answer.value)}</p></div>;
                      })}
                    </div>
                  </article>
                ))}
              </div>
              <footer className="feedback-response-modal__footer"><button className="feedback-button feedback-button--quiet" type="button" onClick={() => setIsResponsesOpen(false)}>{t("management.common.close")}</button><button className="feedback-button feedback-button--accent" type="button" onClick={() => setIsResponsesOpen(false)}>{feedbackText("editForm")}</button></footer>
            </section>
          </div>
        )}
      </div>
    </main>
  );
};

export default AdminFeedback;
