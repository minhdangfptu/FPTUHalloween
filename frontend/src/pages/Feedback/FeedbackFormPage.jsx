import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, Clock3, HeartHandshake, LoaderCircle, Send, Sparkles, Star } from "lucide-react";
import toast from "react-hot-toast";
import ManageSidebar from "../../components/ManageSidebar";
import feedbackAPI from "../../apis/feedbackAPI";
import { translateError, translateSuccess } from "../../utils/translateResponse";
import "./Feedback.scss";

const formatDate = (value) => value
  ? new Date(value).toLocaleString("vi-VN", { dateStyle: "medium", timeStyle: "short" })
  : "Chưa cập nhật";

const getQuestionValue = (answers, questionId) => answers.find((answer) => answer.questionId === questionId)?.value;

const FeedbackPageFrame = ({ targetType, children }) => targetType === "staff"
  ? <div className="feedback-management-layout"><ManageSidebar role="staff" activeItem="feedback" />{children}</div>
  : children;

const FeedbackFormPage = ({ targetType }) => {
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

  useEffect(() => { loadForms(); }, [loadForms]);

  useEffect(() => {
    setAnswers([]);
    setSubmitted(false);
  }, [selectedForm?._id]);

  const answerCount = useMemo(
    () => answers.filter((answer) => answer.value !== "" && answer.value !== undefined && answer.value !== null).length,
    [answers],
  );

  const setAnswer = (questionId, value) => {
    setAnswers((current) => {
      const existing = current.find((answer) => answer.questionId === questionId);
      if (!existing) return [...current, { questionId, value }];
      return current.map((answer) => answer.questionId === questionId ? { ...answer, value } : answer);
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
      return question.required && (value === undefined || value === "" || (Array.isArray(value) && value.length === 0));
    });
    if (missingRequired) {
      toast.error(`Vui lòng trả lời câu hỏi ${missingRequired.order}.`);
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
    return <FeedbackPageFrame targetType={targetType}><main className="feedback-page"><div className="feedback-shell feedback-state"><LoaderCircle className="feedback-spinner" size={28} /><p>Đang mở sổ phản hồi…</p></div></main></FeedbackPageFrame>;
  }

  if (error) {
    return <FeedbackPageFrame targetType={targetType}><main className="feedback-page"><div className="feedback-shell feedback-state feedback-state--error"><Sparkles size={28} /><h2>Cuốn sổ đang khép lại</h2><p>{error}</p><button className="feedback-button feedback-button--dark" type="button" onClick={loadForms}>Thử lại</button></div></main></FeedbackPageFrame>;
  }

  if (!selectedForm) {
    return <FeedbackPageFrame targetType={targetType}><main className="feedback-page"><div className="feedback-shell feedback-state"><Clock3 size={28} /><h2>Chưa có biểu mẫu đang mở</h2><p>Ban tổ chức sẽ mở sổ phản hồi trong khung thời gian phù hợp.</p></div></main></FeedbackPageFrame>;
  }

  if (submitted) {
    return <FeedbackPageFrame targetType={targetType}><main className="feedback-page"><div className="feedback-shell feedback-state feedback-state--success"><span className="feedback-success-mark"><Check size={30} /></span><p className="feedback-eyebrow">ĐÃ GHI NHẬN</p><h1>Cảm ơn bạn đã để lại dấu vết.</h1><p>Phản hồi của bạn đã được gửi vào kho lưu trữ của mùa sự kiện.</p><button className="feedback-button feedback-button--dark" type="button" onClick={() => setSubmitted(false)}>Xem lại phản hồi</button></div></main></FeedbackPageFrame>;
  }

  const audienceLabel = targetType === "staff" ? "nội bộ vận hành" : "người tham dự";
  return (
    <FeedbackPageFrame targetType={targetType}><main className="feedback-page">
      <div className="feedback-shell">
        <header className="feedback-hero">
          <div className="feedback-hero__copy">
            <p className="feedback-eyebrow"><Sparkles size={14} /> Phản hồi, đánh giá sự kiện · {audienceLabel}</p>
            <h1>{selectedForm.title}</h1>
            <p>{selectedForm.description || "Một vài dòng thật lòng để mùa Halloween sau được tổ chức tốt hơn."}</p>
          </div>
          <div className="feedback-hero__stamp"><HeartHandshake size={22} /><span>Đang mở</span><small>đến {formatDate(selectedForm.closeAt)}</small></div>
        </header>

        {forms.length > 1 && <div className="feedback-form-tabs" role="tablist" aria-label="Chọn biểu mẫu"><span>Biểu mẫu đang mở</span>{forms.map((form) => <button key={form._id} type="button" className={form._id === selectedForm._id ? "is-active" : ""} onClick={() => setSelectedForm(form)}>{form.title}</button>)}</div>}

        <form className="feedback-response-sheet" onSubmit={handleSubmit}>
          <div className="feedback-sheet-meta"><span>{selectedForm.questions.length} câu hỏi</span><span>{answerCount} đã trả lời</span></div>
          {selectedForm.questions.map((question, index) => {
            const questionId = String(question._id);
            const value = getQuestionValue(answers, questionId);
            return <fieldset className="feedback-question" key={questionId}><legend><span className="feedback-question__number">{String(index + 1).padStart(2, "0")}</span><span>{question.question}{question.required && <b aria-label="Bắt buộc">*</b>}</span></legend>{question.type === "rating" && <div className="feedback-rating" role="radiogroup" aria-label={question.question}>{[1, 2, 3, 4, 5].map((rating) => <button key={rating} className={rating <= (value || 0) ? "is-selected" : ""} type="button" onClick={() => setAnswer(questionId, rating)} aria-label={`${rating} sao`} aria-pressed={value === rating}><Star size={26} fill="currentColor" strokeWidth={1.5} /></button>)}</div>}{question.type === "text" && <textarea value={value || ""} onChange={(event) => setAnswer(questionId, event.target.value)} rows={4} placeholder="Viết điều bạn thật sự nghĩ…" />}{question.type === "single_choice" && <div className="feedback-options">{question.options.map((option) => <label key={option} className={value === option ? "is-selected" : ""}><input type="radio" name={questionId} checked={value === option} onChange={() => setAnswer(questionId, option)} />{option}</label>)}</div>}{question.type === "multiple_choice" && <div className="feedback-options">{question.options.map((option) => <label key={option} className={value?.includes(option) ? "is-selected" : ""}><input type="checkbox" checked={value?.includes(option) || false} onChange={() => toggleMultipleChoice(questionId, option)} />{option}</label>)}</div>}</fieldset>;
          })}
          <footer className="feedback-submit-row"><p>Phản hồi sẽ được lưu cùng vai trò {targetType === "staff" ? "Staff" : "người tham dự"} của bạn.</p><button className="feedback-button feedback-button--accent" type="submit" disabled={isSubmitting}>{isSubmitting ? <><LoaderCircle className="feedback-spinner" size={17} /> Đang gửi…</> : <><Send size={17} /> Gửi phản hồi</>}</button></footer>
        </form>
      </div>
    </main></FeedbackPageFrame>
  );
};

export default FeedbackFormPage;
