import { useCallback, useEffect, useState } from "react";
import { Check, ChevronLeft, ChevronRight, CircleAlert, Clock3, Monitor, Plus, RefreshCw, Save, Trash2, Users, X } from "lucide-react";
import toast from "react-hot-toast";
import ManageSidebar from "../../components/ManageSidebar";
import LogoutModal from "../../components/LogoutModal";
import ddayVoteAPI from "../../apis/ddayVoteAPI";
import { translateError, translateSuccess } from "../../utils/translateResponse";
import "./DdayVoteAdminPage.scss";

const newOption = (index) => ({ optionId: `option-${index + 1}`, label: "" });
const newCategory = (index) => ({ categoryId: `category-${index + 1}`, label: "", options: [newOption(0), newOption(1)] });
const emptyConfig = () => ({ configKey: "dday", title: "", description: "", status: "draft", openAt: "", closeAt: "", totalVotes: 0, categories: [newCategory(0)] });
const AUDIT_PAGE_SIZE = 10;
const emptyAuditPagination = { page: 1, pageSize: AUDIT_PAGE_SIZE, total: 0, totalPages: 0 };

const toLocalInput = (value) => {
  if (!value) return "";
  const date = new Date(value);
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 16);
};

const toIso = (value) => (value ? new Date(value).toISOString() : null);
const formatDate = (value) => value ? new Date(value).toLocaleString("vi-VN", { dateStyle: "medium", timeStyle: "short" }) : "—";
const statusLabel = { draft: "Bản nháp", open: "Đang mở", closed: "Đã đóng" };

const formatDuration = (milliseconds) => {
  if (milliseconds <= 0) return "Đã hết thời gian";
  const totalSeconds = Math.floor(milliseconds / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${days} ngày ${String(hours).padStart(2, "0")} giờ ${String(minutes).padStart(2, "0")} phút ${String(seconds).padStart(2, "0")} giây`;
};

const mapConfig = (value) => value ? {
  ...value,
  openAt: toLocalInput(value.openAt),
  closeAt: toLocalInput(value.closeAt),
  categories: (value.categories || []).map((category) => ({
    ...category,
    options: (category.options || []).map((option) => ({ ...option })),
  })),
} : emptyConfig();

const DdayModal = ({ title, onClose, children, closeDisabled = false }) => (
  <div
    className="dday-admin-modal-backdrop"
    role="presentation"
    onMouseDown={(event) => {
      if (event.target === event.currentTarget && !closeDisabled) onClose();
    }}
  >
    <div className="dday-admin-modal" role="dialog" aria-modal="true" aria-labelledby="dday-admin-modal-title">
      <div className="dday-admin-modal__heading">
        <h2 id="dday-admin-modal-title">{title}</h2>
        <button type="button" className="dday-icon-button" onClick={onClose} disabled={closeDisabled} aria-label="Đóng cửa sổ">
          <X size={17} />
        </button>
      </div>
      {children}
    </div>
  </div>
);

const DdayVoteAdminPage = () => {
  const [config, setConfig] = useState(emptyConfig);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [pendingAction, setPendingAction] = useState(null);
  const [closeAtDraft, setCloseAtDraft] = useState("");
  const [countdownOpen, setCountdownOpen] = useState(false);
  const [publishConfirmOpen, setPublishConfirmOpen] = useState(false);
  const [auditOpen, setAuditOpen] = useState(false);
  const [auditEntries, setAuditEntries] = useState([]);
  const [auditPagination, setAuditPagination] = useState(emptyAuditPagination);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditError, setAuditError] = useState("");
  const [now, setNow] = useState(Date.now());

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const configResponse = await ddayVoteAPI.getAdminConfig();
      setConfig(mapConfig(configResponse));
      if (configResponse?.status === "closed") {
        try {
          setResults(await ddayVoteAPI.getResults());
        } catch {
          setResults(null);
        }
      } else {
        setResults(null);
      }
    } catch (requestError) {
      setError(translateError(requestError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!countdownOpen) return undefined;
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [countdownOpen, config.closeAt]);

  useEffect(() => {
    if (!pendingAction && !countdownOpen) return undefined;
    const closeWithEscape = (event) => {
      if (event.key === "Escape" && !actionLoading) {
        setPendingAction(null);
        setCountdownOpen(false);
      }
    };
    document.addEventListener("keydown", closeWithEscape);
    return () => document.removeEventListener("keydown", closeWithEscape);
  }, [actionLoading, countdownOpen, pendingAction]);

  const updateConfig = (field, value) => setConfig((current) => ({ ...current, [field]: value }));
  const updateCategory = (categoryIndex, field, value) => setConfig((current) => ({
    ...current,
    categories: current.categories.map((category, index) => index === categoryIndex ? { ...category, [field]: value } : category),
  }));
  const updateOption = (categoryIndex, optionIndex, value) => setConfig((current) => ({
    ...current,
    categories: current.categories.map((category, index) => index !== categoryIndex ? category : {
      ...category,
      options: category.options.map((option, optionPosition) => optionPosition === optionIndex ? { ...option, label: value } : option),
    }),
  }));
  const addCategory = () => setConfig((current) => ({ ...current, categories: [...current.categories, newCategory(current.categories.length)] }));
  const removeCategory = (categoryIndex) => setConfig((current) => ({ ...current, categories: current.categories.filter((_, index) => index !== categoryIndex) }));
  const addOption = (categoryIndex) => setConfig((current) => ({
    ...current,
    categories: current.categories.map((category, index) => index === categoryIndex ? { ...category, options: [...category.options, newOption(category.options.length)] } : category),
  }));
  const removeOption = (categoryIndex, optionIndex) => setConfig((current) => ({
    ...current,
    categories: current.categories.map((category, index) => index === categoryIndex ? { ...category, options: category.options.filter((_, position) => position !== optionIndex) } : category),
  }));

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const saved = await ddayVoteAPI.updateAdminConfig({
        title: config.title,
        description: config.description,
        openAt: toIso(config.openAt),
        closeAt: toIso(config.closeAt),
        categories: config.categories,
      });
      setConfig(mapConfig({ ...saved, totalVotes: config.totalVotes }));
      toast.success(translateSuccess("Vote campaign updated successfully"));
    } catch (requestError) {
      toast.error(translateError(requestError));
    } finally {
      setSaving(false);
    }
  };

  const requestOpen = () => {
    setCloseAtDraft(config.status === "closed" ? "" : config.closeAt);
    setPendingAction({ type: "open", isReopen: config.status === "closed" });
  };

  const requestClose = () => setPendingAction({ type: "close" });

  const requestCloseTimeEdit = () => {
    setCloseAtDraft(config.closeAt);
    setPendingAction({ type: "close-time" });
  };

  const openPublishScreen = () => {
    const publishUrl = `${window.location.origin}/admin/votes/publish-code`;
    const publishWindow = window.open(publishUrl, "_blank");
    if (publishWindow) {
      publishWindow.opener = null;
      return;
    }
    toast.error("Trình duyệt đã chặn tab mới. Vui lòng cho phép popup để mở màn hình công bố.");
  };

  const loadAudit = useCallback(async (page = 1) => {
    setAuditLoading(true);
    setAuditError("");
    try {
      const response = await ddayVoteAPI.getAudit({ page, pageSize: AUDIT_PAGE_SIZE });
      setAuditEntries(response?.data || []);
      setAuditPagination(response?.pagination || { ...emptyAuditPagination, page });
    } catch (requestError) {
      setAuditError(translateError(requestError));
    } finally {
      setAuditLoading(false);
    }
  }, []);

  const openAudit = () => {
    setAuditOpen(true);
    loadAudit(1);
  };

  const confirmPendingAction = async () => {
    if (!pendingAction) return;
    setActionLoading(true);
    try {
      if (pendingAction.type === "open") {
        await ddayVoteAPI.open({ closeAt: toIso(closeAtDraft) });
        toast.success(translateSuccess("Vote campaign opened successfully"));
      } else if (pendingAction.type === "close") {
        await ddayVoteAPI.close();
        toast.success(translateSuccess("Vote campaign closed successfully"));
      } else {
        await ddayVoteAPI.updateCloseTime(toIso(closeAtDraft));
        toast.success(translateSuccess("Vote close time updated successfully"));
      }
      setPendingAction(null);
      await load();
    } catch (requestError) {
      toast.error(translateError(requestError));
    } finally {
      setActionLoading(false);
    }
  };

  const isDraft = config.status === "draft";
  const isOpen = config.status === "open";
  const remainingMilliseconds = config.closeAt ? new Date(config.closeAt).getTime() - now : 0;
  const pendingTitle = pendingAction?.type === "close"
    ? "Xác nhận đóng bình chọn"
    : pendingAction?.type === "close-time"
      ? "Xác nhận đổi thời điểm đóng"
      : pendingAction?.isReopen
        ? "Xác nhận mở lại bình chọn"
        : "Xác nhận mở bình chọn";

  return (
    <div className="dday-admin-shell">
      <ManageSidebar role="admin" activeItem="vote" />
      <main className="dday-admin-main">
        <header className="dday-admin-header">
          <div><span className="dday-admin-kicker">Điều hành bình chọn D-Day</span><h1>Quản lý bình chọn</h1><p>Một chương trình bình chọn duy nhất cho ngày sự kiện.</p></div>
          <button type="button" className="dday-admin-refresh" onClick={load} disabled={loading}><RefreshCw size={16} /> Làm mới</button>
        </header>

        {error && <div className="dday-admin-error" role="alert"><CircleAlert size={18} /> {error}</div>}
        {loading ? <div className="dday-admin-loading" aria-busy="true">Đang tải cấu hình…</div> : <>
          <section className="dday-admin-metrics"><div><small>Trạng thái</small><strong>{statusLabel[config.status] || config.status}</strong></div><div><small>Tổng lượt bình chọn</small><strong>{config.totalVotes || 0}</strong></div><div><small>Thời điểm đóng</small><strong>{formatDate(config.closeAt)}</strong></div></section>

          <form className="dday-admin-card" onSubmit={save}>
            <div className="dday-admin-card__heading"><div><span className="dday-admin-kicker">Thiết lập chương trình · D-Day</span><h2>Thông tin bình chọn</h2></div><span className={`dday-admin-status dday-admin-status--${config.status}`}>{statusLabel[config.status]}</span></div>
            <div className="dday-admin-grid"><label><span>Tiêu đề</span><input value={config.title} onChange={(event) => updateConfig("title", event.target.value)} disabled={!isDraft} placeholder="Bình chọn D-Day" /></label><label><span>Mô tả hướng dẫn người tham gia</span><textarea value={config.description} onChange={(event) => updateConfig("description", event.target.value)} disabled={!isDraft} rows={3} placeholder="Ví dụ: Hãy chọn một tiết mục bạn yêu thích ở mỗi hạng mục." /></label><label><span>Thời điểm bắt đầu dự kiến</span><input type="datetime-local" value={config.openAt} onChange={(event) => updateConfig("openAt", event.target.value)} disabled={!isDraft} /></label><label><span>Thời điểm tự động đóng</span><input type="datetime-local" value={config.closeAt} onChange={(event) => updateConfig("closeAt", event.target.value)} disabled={!isDraft} /></label></div>
            <div className="dday-admin-section-heading"><div><h3>Các hạng mục bình chọn</h3><p>Mỗi hạng mục cần ít nhất hai lựa chọn. Mã nội bộ có thể giữ nguyên nếu không cần thay đổi.</p></div>{isDraft && <button type="button" className="dday-admin-link" onClick={addCategory}><Plus size={15} /> Thêm hạng mục</button>}</div>
            <div className="dday-admin-categories">
              {config.categories.map((category, categoryIndex) => (
                <div className="dday-admin-category" key={`${category.categoryId}-${categoryIndex}`}>
                  <div className="dday-admin-category__heading">
                    <strong>Hạng mục {categoryIndex + 1}</strong>
                    {isDraft && <button type="button" className="dday-icon-button" onClick={() => removeCategory(categoryIndex)} aria-label="Xóa hạng mục"><Trash2 size={15} /></button>}
                  </div>
                  <div className="dday-admin-category__fields">
                    <label><span>Tên hạng mục</span><input value={category.label} onChange={(event) => updateCategory(categoryIndex, "label", event.target.value)} disabled={!isDraft} placeholder="Ví dụ: Tiết mục yêu thích" /></label>
                  </div>
                  <div className="dday-admin-options">
                    {category.options.map((option, optionIndex) => (
                      <div className="dday-admin-option" key={`${option.optionId}-${optionIndex}`}>
                        <label><span>Lựa chọn {optionIndex + 1}</span><input value={option.label} onChange={(event) => updateOption(categoryIndex, optionIndex, event.target.value)} disabled={!isDraft} placeholder={`Ví dụ: ${optionIndex === 0 ? "MĐ" : "Tên lựa chọn"}`} /></label>
                        {isDraft && <button type="button" className="dday-icon-button" onClick={() => removeOption(categoryIndex, optionIndex)} aria-label="Xóa lựa chọn"><X size={15} /></button>}
                      </div>
                    ))}
                  </div>
                  {isDraft && <button type="button" className="dday-admin-link" onClick={() => addOption(categoryIndex)}><Plus size={15} /> Thêm lựa chọn</button>}
                </div>
              ))}
            </div>

            {isDraft && <div className="dday-admin-actions"><button type="submit" className="dday-admin-button dday-admin-button--primary" disabled={saving}><Save size={16} /> {saving ? "Đang lưu…" : "Lưu bản nháp"}</button><button type="button" className="dday-admin-button dday-admin-button--dark" onClick={requestOpen} disabled={actionLoading}><Check size={16} /> Mở bình chọn</button></div>}
            {isOpen && <div className="dday-admin-actions dday-admin-actions--management"><button type="button" className="dday-admin-button dday-admin-button--secondary" onClick={requestCloseTimeEdit} disabled={actionLoading}><Clock3 size={16} /> Chỉnh thời điểm đóng</button><button type="button" className="dday-admin-button dday-admin-button--secondary" onClick={() => setCountdownOpen(true)} disabled={actionLoading}><Clock3 size={16} /> Xem đồng hồ đếm ngược</button><button type="button" className="dday-admin-button dday-admin-button--danger" onClick={requestClose} disabled={actionLoading}>Đóng bình chọn ngay</button></div>}
            {config.status === "closed" && <div className="dday-admin-actions dday-admin-actions--management"><p className="dday-admin-reopen-note">Bình chọn đã đóng. Bạn có thể mở lại và chọn thời điểm đóng mới để mở thêm thời gian.</p><button type="button" className="dday-admin-button dday-admin-button--dark" onClick={requestOpen} disabled={actionLoading}><Check size={16} /> Mở lại bình chọn</button><button type="button" className="dday-admin-button dday-admin-button--secondary" onClick={openAudit} disabled={actionLoading}><Users size={17} /> Xem danh sách người vote</button><button type="button" className="dday-admin-button dday-admin-button--primary" onClick={() => setPublishConfirmOpen(true)} disabled={actionLoading}><Monitor size={17} /> Công bố kết quả</button></div>}
          </form>

          {results && <section className="dday-admin-card"><div className="dday-admin-card__heading"><div><span className="dday-admin-kicker">Kết quả tổng hợp</span><h2>{results.totalVotes} lượt bình chọn hợp lệ</h2></div><span>{formatDate(results.closedAt)}</span></div>{results.categories.map((category) => <div className="dday-admin-result" key={category.categoryId}><h3>{category.label}</h3>{category.options.map((option) => <div key={option.optionId}><span>{option.label}</span><strong>{option.count}</strong></div>)}</div>)}</section>}
        </>}
      </main>

      {pendingAction && <DdayModal title={pendingTitle} onClose={() => setPendingAction(null)} closeDisabled={actionLoading}>
        <div className="dday-admin-modal__body">
          {pendingAction.type === "close" && <p>Bạn có chắc muốn đóng bình chọn ngay không? Người tham gia sẽ không thể gửi lượt bình chọn mới sau thao tác này.</p>}
          {pendingAction.type === "open" && <p>{pendingAction.isReopen ? "Bình chọn sẽ được mở lại để có thêm thời gian. Hãy chọn thời điểm đóng mới." : "Bình chọn sẽ bắt đầu nhận lượt bình chọn ngay sau khi xác nhận."}</p>}
          {pendingAction.type === "close-time" && <p>Thời điểm đóng hiện tại sẽ được thay bằng thời điểm mới. Người tham gia vẫn có thể bình chọn trong thời gian bình chọn đang mở.</p>}
          {(pendingAction.type === "open" || pendingAction.type === "close-time") && <label className="dday-admin-modal-field"><span>Thời điểm tự động đóng</span><input type="datetime-local" value={closeAtDraft} onChange={(event) => setCloseAtDraft(event.target.value)} min={toLocalInput(new Date())} required /></label>}
          <div className="dday-admin-modal__actions"><button type="button" className="dday-admin-button dday-admin-button--secondary" onClick={() => setPendingAction(null)} disabled={actionLoading}>Hủy</button><button type="button" className="dday-admin-button dday-admin-button--dark" onClick={confirmPendingAction} disabled={actionLoading}>{actionLoading ? "Đang xử lý…" : pendingAction.type === "close" ? "Đóng bình chọn" : pendingAction.type === "close-time" ? "Lưu thời điểm mới" : pendingAction.isReopen ? "Mở lại và thêm thời gian" : "Mở bình chọn"}</button></div>
        </div>
      </DdayModal>}

      {countdownOpen && <DdayModal title="Thời gian bình chọn còn lại" onClose={() => setCountdownOpen(false)}><div className="dday-admin-countdown"><Clock3 size={30} /><strong>{formatDuration(remainingMilliseconds)}</strong><p>Thời điểm đóng: {formatDate(config.closeAt)}</p></div><div className="dday-admin-modal__actions"><button type="button" className="dday-admin-button dday-admin-button--secondary" onClick={() => setCountdownOpen(false)}>Đóng</button></div></DdayModal>}

      {auditOpen && <DdayModal title="Danh sách người đã bình chọn" onClose={() => setAuditOpen(false)} closeDisabled={auditLoading}>
        <div className="dday-admin-audit">
          <p className="dday-admin-audit__summary">Hiển thị {auditPagination.total} tài khoản đã gửi bình chọn.</p>
          {auditLoading && <div className="dday-admin-audit__state" aria-live="polite">Đang tải danh sách người vote…</div>}
          {!auditLoading && auditError && <div className="dday-admin-audit__state dday-admin-audit__state--error" role="alert"><CircleAlert size={18} /><span>{auditError}</span><button type="button" className="dday-admin-button dday-admin-button--secondary" onClick={() => loadAudit(auditPagination.page)}>Thử lại</button></div>}
          {!auditLoading && !auditError && auditEntries.length === 0 && <div className="dday-admin-audit__state">Chưa có tài khoản nào gửi bình chọn.</div>}
          {!auditLoading && !auditError && auditEntries.length > 0 && <div className="dday-admin-audit__list">
            {auditEntries.map((vote) => <article className="dday-admin-audit__entry" key={vote.submissionId || vote._id}>
              <div className="dday-admin-audit__identity"><div><strong>{vote.googleName || "Không có tên"}</strong><span>{vote.googleEmail || "Không có email"}</span></div></div>
              <div className="dday-admin-audit__choices">
                {(vote.choices || []).map((choice, choiceIndex) => {
                  const category = config.categories.find((item) => item.categoryId === choice.categoryId);
                  const option = category?.options?.find((item) => item.optionId === choice.optionId);
                  return <div className="dday-admin-audit__choice" key={`${choice.categoryId || choiceIndex}-${choice.optionId || choiceIndex}`}><span>{category?.label || "Hạng mục"}</span><strong>{option?.label || "Lựa chọn"}</strong></div>;
                })}
              </div>
            </article>)}
          </div>}
          {auditPagination.totalPages > 1 && <div className="dday-admin-audit__pagination"><button type="button" className="dday-admin-button dday-admin-button--secondary" onClick={() => loadAudit(auditPagination.page - 1)} disabled={auditLoading || auditPagination.page <= 1}><ChevronLeft size={16} /> Trước</button><span>Trang {auditPagination.page} / {auditPagination.totalPages}</span><button type="button" className="dday-admin-button dday-admin-button--secondary" onClick={() => loadAudit(auditPagination.page + 1)} disabled={auditLoading || auditPagination.page >= auditPagination.totalPages}>Sau <ChevronRight size={16} /></button></div>}
        </div>
      </DdayModal>}

      <LogoutModal
        isOpen={publishConfirmOpen}
        onClose={() => setPublishConfirmOpen(false)}
        onConfirm={() => { setPublishConfirmOpen(false); openPublishScreen(); }}
        title="Xác nhận công bố kết quả"
        description="Màn hình công bố sẽ mở ở tab mới để bạn đưa lên màn LED.<br />Bạn có chắc muốn tiếp tục?"
        cancelLabel="Hủy"
        confirmLabel="Mở màn hình công bố"
        isManagement
      />
    </div>
  );
};

export default DdayVoteAdminPage;
