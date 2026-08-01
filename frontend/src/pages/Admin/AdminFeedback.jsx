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
const formatDate = (value) =>
  value
    ? new Date(value).toLocaleString("vi-VN", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "—";

const getTargetLabel = (targetType) => targetType === "staff" ? "Đội ngũ vận hành" : "Người tham dự";
const getStatusLabel = (status) => ({ draft: "Bản nháp", published: "Đang mở", closed: "Đã đóng" })[status] || status;

const AdminFeedback = () => {
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
          <p>Đang nạp kho phản hồi…</p>
        </div>
      </main>
    );
  if (error)
    return (
      <main className="admin-feedback-page">
        <ManageSidebar role="admin" activeItem="feedback" />
        <div className="admin-feedback-content feedback-state feedback-state--error">
          <h2>Không mở được kho phản hồi</h2>
          <p>{error}</p>
          <button
            className="feedback-button feedback-button--dark"
            type="button"
            onClick={loadForms}
          >
            Thử lại
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
              <ClipboardPenLine size={14} /> Feedback desk
            </p>
            <h1>Kho tiếng nói của mùa lễ hội.</h1>
            <p>
              Soạn form riêng cho người tham dự và đội ngũ vận hành, rồi đọc tín
              hiệu sau mỗi lượt gửi.
            </p>
          </div>
          <div className="feedback-heading-actions">
            <button
              className="feedback-button feedback-button--quiet"
              type="button"
              onClick={toggleFeedbackNav}
              disabled={!attendeeForm || isTogglingFeedbackNav}
              title={!attendeeForm ? "Hãy tạo form dành cho người tham dự trước" : undefined}
            >
              {isFeedbackNavEnabled ? <EyeOff size={17} /> : <Eye size={17} />}
              {isFeedbackNavEnabled ? "Ẩn nút đánh giá" : "Hiện nút đánh giá"}
            </button>
            <button
              className="feedback-button feedback-button--accent"
              type="button"
              onClick={() => selectForm(null)}
            >
              <Plus size={17} /> Form mới
            </button>
          </div>
        </header>
        <div className="admin-feedback-layout">
          <aside className="feedback-form-index">
            <div className="feedback-form-index__heading">
              <span>Biểu mẫu</span>
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
                  <small className="feedback-form-index__status">{getStatusLabel(item.status)} · {item.responseCount || 0} phản hồi</small>
                  <small className="feedback-form-index__dates">Mở: {formatDate(item.openAt)}<br />Đóng: {formatDate(item.closeAt)}</small>
                  <small>
                    {item.targetType === "staff" ? "Staff" : "Attendee"} ·{" "}
                    {item.status}
                  </small>
                </span>
                <ChevronDown size={16} />
              </button>
            ))}
            {forms.length === 0 && (
              <p className="feedback-muted">
                Chưa có form nào. Bắt đầu bằng một form mới.
              </p>
            )}
          </aside>
          <section className="feedback-builder">
            <form onSubmit={handleSave}>
              <div className="feedback-builder__top">
                <div>
                  <span className="feedback-kicker">
                    {selectedId ? "ĐANG CHỈNH SỬA" : "BẢN NHÁP MỚI"}
                  </span>
                  <h2>
                    {selectedId
                      ? "Chỉnh lại Form phản hồi"
                      : "Mở một Form mới"}
                  </h2>
                </div>
                {selectedId && (
                  <button
                    className="feedback-icon-button feedback-icon-button--danger"
                    type="button"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    aria-label="Xóa form"
                  >
                    <Trash2 size={17} />
                  </button>
                )}
              </div>
              <div className="feedback-builder__grid">
                <label>
                  Tiêu đề
                  <input
                    value={form.title}
                    onChange={(event) =>
                      updateFormField("title", event.target.value)
                    }
                    required
                    placeholder="Ví dụ: Staff debrief sau sự kiện"
                  />
                </label>
                <label>
                  Đối tượng
                  <select
                    value={form.targetType}
                    onChange={(event) =>
                      updateFormField("targetType", event.target.value)
                    }
                  >
                    <option value="attendee">Người tham dự</option>
                    <option value="staff">BTC</option>
                  </select>
                </label>
                <label className="feedback-builder__wide">
                  Mô tả
                  <textarea
                    value={form.description}
                    onChange={(event) =>
                      updateFormField("description", event.target.value)
                    }
                    rows={2}
                    placeholder="Nói ngắn gọn vì sao phản hồi này quan trọng…"
                  />
                </label>
                <label>
                  Mở form
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
                  Đóng form
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
                  Trạng thái
                  <select
                    value={form.status}
                    onChange={(event) =>
                      updateFormField("status", event.target.value)
                    }
                  >
                    <option value="draft">Bản nháp</option>
                    <option value="published">Đang mở</option>
                    <option value="closed">Đã đóng</option>
                  </select>
                </label>
              </div>
              <div className="feedback-builder__questions">
                <div className="feedback-builder__section-head">
                  <div>
                    <span className="feedback-kicker">CẤU TRÚC</span>
                    <h3>Câu hỏi trong form</h3>
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
                          CCâu hỏi số {String(index + 1).padStart(2, "0")}
                        </span>
                        <button
                          className="feedback-icon-button"
                          type="button"
                          onClick={() => removeQuestion(index)}
                          aria-label="Xóa câu hỏi"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                      <label>
                        Câu hỏi
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
                          placeholder="Nhập câu hỏi…"
                        />
                      </label>
                      <div className="feedback-question-card__row">
                        <label>
                          Kiểu trả lời
                          <select
                            value={question.type}
                            onChange={(event) =>
                              updateQuestion(index, "type", event.target.value)
                            }
                          >
                            <option value="rating">Chấm điểm 1–5</option>
                            <option value="text">Đoạn văn</option>
                            <option value="single_choice">Một lựa chọn</option>
                            <option value="multiple_choice">
                              Nhiều lựa chọn
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
                          Bắt buộc trả lời
                        </label>
                      </div>
                      {["single_choice", "multiple_choice"].includes(
                        question.type,
                      ) && (
                        <label>
                          Các phương án trả lời{" "}
                          <span className="feedback-muted">
                            (mỗi phương án viết trên một dòng)
                          </span>
                          <textarea
                            value={(question.options || []).join("\n")}
                            onChange={(event) =>
                              updateOptions(index, event.target.value)
                            }
                            rows={3}
                            placeholder={
                              "Ví dụ:\nRất hài lòng\nBình thường\nCần cải thiện"
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
                      aria-label={`Thêm câu hỏi sau câu ${index + 1}`}
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
                    : "Chưa đặt thời gian mở form"}
                </span>
                <button
                  className="feedback-button feedback-button--accent"
                  type="submit"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <LoaderCircle className="feedback-spinner" size={17} />{" "}
                      Đang lưu…
                    </>
                  ) : (
                    <>
                      <Save size={17} /> Lưu form
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
                <p className="feedback-kicker">SAU KHI GỬI</p>
                <h2>Những gì đang được nói.</h2>
              </div>
              <div className="feedback-insight-total">
                <UsersRound size={18} />
                <strong>{responses?.pagination?.total || 0}</strong>
                <span>lượt phản hồi</span>
              </div>
            </header>
            <div className="feedback-stat-grid">
              {statistics?.statistics?.map((item) => (
                <article key={String(item.questionId)}>
                  <span className="feedback-stat-type">
                    {item.type === "rating"
                      ? "ĐIỂM TRUNG BÌNH"
                      : "PHÂN BỐ LỰA CHỌN"}
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
                    <strong>{response.userId?.fullName || "Ẩn danh"}</strong>
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
                  <p className="feedback-kicker">DANH SÁCH PHẢN HỒI</p>
                  <h2 id="feedback-response-modal-title">{form.title}</h2>
                  <span>{responses?.pagination?.total || 0} lượt gửi</span>
                </div>
                <button className="feedback-icon-button" type="button" onClick={() => setIsResponsesOpen(false)} aria-label="Đóng danh sách phản hồi"><X size={19} /></button>
              </header>
              <div className="feedback-response-modal__body">
                {!responses && <div className="feedback-state feedback-state--compact"><LoaderCircle className="feedback-spinner" size={24} /><p>Đang tải phản hồi…</p></div>}
                {responses?.responses?.length === 0 && <div className="feedback-state feedback-state--compact"><UsersRound size={25} /><p>Chưa có phản hồi nào cho form này.</p></div>}
                {responses?.responses?.map((response, responseIndex) => (
                  <article className="feedback-response-entry" key={response._id}>
                    <div className="feedback-response-entry__meta"><strong>{response.userId?.fullName || `Người gửi ${responseIndex + 1}`}</strong><span>{formatDate(response.createdAt)}</span></div>
                    <div className="feedback-response-entry__answers">
                      {response.answers?.map((answer) => {
                        const question = form.questions.find((item) => String(item._id) === String(answer.questionId));
                        return <div key={String(answer.questionId)}><small>{question?.question || "Câu hỏi"}</small><p>{Array.isArray(answer.value) ? answer.value.join(", ") : String(answer.value)}</p></div>;
                      })}
                    </div>
                  </article>
                ))}
              </div>
              <footer className="feedback-response-modal__footer"><button className="feedback-button feedback-button--quiet" type="button" onClick={() => setIsResponsesOpen(false)}>Đóng</button><button className="feedback-button feedback-button--accent" type="button" onClick={() => setIsResponsesOpen(false)}>Chỉnh sửa form</button></footer>
            </section>
          </div>
        )}
      </div>
    </main>
  );
};

export default AdminFeedback;
