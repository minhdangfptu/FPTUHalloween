import { useCallback, useEffect, useRef, useState } from "react";
import {
  CircleAlert,
  Clock3,
  Link2,
  Megaphone,
  Pencil,
  Plus,
  Power,
  RefreshCw,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import ManageSidebar from "../../components/ManageSidebar";
import hotNewsAPI from "../../apis/hotNewsAPI";
import {
  translateError,
  translateSuccess,
} from "../../utils/translateResponse";
import "./HotNews.scss";

const EMPTY_FORM = { content: "", link: "" };

const getRoleName = (user) =>
  user?.role?.roleName ||
  user?.roleName ||
  user?.role ||
  user?.roleId?.roleName ||
  user?.roleId;

const readIsAdmin = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    return String(getRoleName(user) || "").toLowerCase() === "admin";
  } catch {
    return false;
  }
};

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleString("vi-VN", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "Chưa cập nhật";

const HotNews = () => {
  const [hotNews, setHotNews] = useState([]);
  const [isAdmin] = useState(readIsAdmin);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [changingId, setChangingId] = useState(null);
  const dialogRef = useRef(null);

  const loadHotNews = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");

    try {
      const data = await hotNewsAPI.getList();
      setHotNews(data);
    } catch (error) {
      const message = translateError(error);
      setLoadError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) loadHotNews();
    else setIsLoading(false);
  }, [isAdmin, loadHotNews]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isDialogOpen && !dialog.open) dialog.showModal();
    if (!isDialogOpen && dialog.open) dialog.close();
  }, [isDialogOpen]);

  const openCreateDialog = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setIsDialogOpen(true);
  };

  const openEditDialog = (item) => {
    setEditingId(item._id);
    setForm({ content: item.content || "", link: item.link || "" });
    setFormError("");
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    if (isSubmitting) return;
    setIsDialogOpen(false);
  };

  const handleDialogCancel = (event) => {
    event.preventDefault();
    closeDialog();
  };

  const handleDialogBackdrop = (event) => {
    if (event.target === event.currentTarget) closeDialog();
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    if (formError) setFormError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      content: form.content.trim(),
      link: form.link.trim(),
    };

    if (!payload.content) {
      setFormError("Nội dung thông báo không được để trống.");
      return;
    }

    setIsSubmitting(true);
    setFormError("");

    try {
      const result = editingId
        ? await hotNewsAPI.update(editingId, payload)
        : await hotNewsAPI.create(payload);
      const savedHotNews = result.hotNews;

      setHotNews((current) => {
        if (!editingId) return [savedHotNews, ...current];
        return current.map((item) =>
          item._id === editingId ? savedHotNews : item,
        );
      });
      setIsDialogOpen(false);
      toast.success(translateSuccess(result.message));
    } catch (error) {
      setFormError(translateError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (item) => {
    if (changingId) return;

    const previousItems = hotNews;
    const nextIsActive = !item.isActive;
    setChangingId(item._id);
    setHotNews((current) =>
      current.map((currentItem) =>
        currentItem._id === item._id
          ? { ...currentItem, isActive: nextIsActive }
          : currentItem,
      ),
    );

    try {
      const result = await hotNewsAPI.changeStatus(item._id, nextIsActive);
      setHotNews((current) =>
        current.map((currentItem) =>
          currentItem._id === item._id ? result.hotNews : currentItem,
        ),
      );
      toast.success(translateSuccess(result.message));
    } catch (error) {
      setHotNews(previousItems);
      toast.error(translateError(error));
    } finally {
      setChangingId(null);
    }
  };

  if (!isAdmin) {
    return (
      <main className="hot-news-access">
        <CircleAlert size={22} />
        <h1>Không có quyền truy cập</h1>
        <p>Chỉ quản trị viên mới có thể quản lý thông báo.</p>
      </main>
    );
  }

  return (
    <div className="staff-manage-layout hot-news-page">
      <ManageSidebar role="admin" activeItem="hot-news" />
      <main className="hot-news-main">
        <header className="hot-news-header">
          <div className="hot-news-header__copy">
            <p className="hot-news-kicker">
              <Megaphone size={16} /> Bảng tin sự kiện
            </p>
            <h1>Thông báo, đúng lúc.</h1>
            <p>
              Soạn nội dung ngắn để đưa thông tin quan trọng lên đầu hành trình
              của người tham dự.
            </p>
          </div>
          <div className="hot-news-header__actions">
            <button
              className="hot-news-button hot-news-button--quiet"
              type="button"
              onClick={loadHotNews}
              disabled={isLoading}
            >
              <RefreshCw size={16} /> Làm mới
            </button>
            <button
              className="hot-news-button hot-news-button--primary"
              type="button"
              onClick={openCreateDialog}
            >
              <Plus size={17} /> Thêm thông báo
            </button>
          </div>
        </header>

        <section
          className="hot-news-workbench"
          aria-labelledby="hot-news-list-title"
        >
          <div className="hot-news-workbench__head">
            <div>
              <p className="hot-news-workbench__label">Danh sách hiện tại</p>
              <h2 id="hot-news-list-title">HotNews</h2>
            </div>
            <span className="hot-news-count" aria-live="polite">
              {hotNews.length} thông báo
            </span>
          </div>

          {isLoading ? (
            <div className="hot-news-skeleton" aria-busy="true">
              {[0, 1, 2].map((item) => (
                <div className="hot-news-skeleton__row" key={item} />
              ))}
            </div>
          ) : loadError ? (
            <div className="hot-news-empty hot-news-empty--error" role="alert">
              <CircleAlert size={20} />
              <p>{loadError}</p>
              <button type="button" onClick={loadHotNews}>
                Thử lại
              </button>
            </div>
          ) : hotNews.length === 0 ? (
            <div className="hot-news-empty">
              <Megaphone size={24} />
              <h3>Chưa có thông báo nào.</h3>
              <p>
                Thêm thông báo đầu tiên để cập nhật nhanh cho người tham dự.
              </p>
              <button
                className="hot-news-button hot-news-button--primary"
                type="button"
                onClick={openCreateDialog}
              >
                <Plus size={17} /> Thêm thông báo
              </button>
            </div>
          ) : (
            <div className="hot-news-list">
              {hotNews.map((item, index) => (
                <article className="hot-news-row" key={item._id}>
                  <div className="hot-news-row__index" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="hot-news-row__body">
                    <div className="hot-news-row__meta">
                      <span
                        className={`hot-news-status ${item.isActive ? "is-active" : "is-inactive"}`}
                      >
                        <Power size={13} />{" "}
                        {item.isActive ? "Đang hiển thị" : "Đang tắt"}
                      </span>
                      <span>
                        <Clock3 size={13} />{" "}
                        {formatDate(item.updatedAt || item.createdAt)}
                      </span>
                    </div>
                    <p className="hot-news-row__content">{item.content}</p>
                    {item.link ? (
                      <a
                        className="hot-news-row__link"
                        href={item.link}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Link2 size={14} /> Mở liên kết
                      </a>
                    ) : null}
                  </div>
                  <div className="hot-news-row__actions">
                    <button
                      className="hot-news-action"
                      type="button"
                      onClick={() => openEditDialog(item)}
                    >
                      <Pencil size={15} /> Sửa
                    </button>
                    <button
                      className={`hot-news-action ${item.isActive ? "is-active" : ""}`}
                      type="button"
                      aria-pressed={item.isActive}
                      disabled={changingId === item._id}
                      onClick={() => handleStatusChange(item)}
                    >
                      <Power size={15} /> {item.isActive ? "Tắt" : "Bật"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <dialog
        className="hot-news-dialog"
        ref={dialogRef}
        onCancel={handleDialogCancel}
        onMouseDown={handleDialogBackdrop}
        aria-labelledby="hot-news-dialog-title"
      >
        <form className="hot-news-form" onSubmit={handleSubmit}>
          <div className="hot-news-dialog__head">
            <div>
              <p className="hot-news-workbench__label">Biên tập</p>
              <h2 id="hot-news-dialog-title">
                {editingId ? "Sửa thông báo" : "Thêm thông báo"}
              </h2>
            </div>
            <button
              className="hot-news-dialog__close"
              type="button"
              onClick={closeDialog}
              aria-label="Đóng cửa sổ"
            >
              <X size={18} />
            </button>
          </div>
          <label className="hot-news-field">
            <span>
              Nội dung thông báo (Hạn chế dùng icon và hạn chế viết hoa)
            </span>
            <textarea
              name="content"
              value={form.content}
              onChange={handleFormChange}
              placeholder="Ví dụ: Cổng check-in mở lúc 18:00 tại sảnh chính."
              rows={5}
              maxLength={500}
              required
              aria-describedby="hot-news-content-help"
            />
            <small id="hot-news-content-help">Tối đa 500 ký tự.</small>
          </label>
          <label className="hot-news-field">
            <span>
              Liên kết <em>(không bắt buộc)</em>
            </span>
            <input
              name="link"
              type="url"
              value={form.link}
              onChange={handleFormChange}
              placeholder="https://..."
            />
          </label>
          {formError ? (
            <p className="hot-news-form__error" role="alert">
              <CircleAlert size={15} /> {formError}
            </p>
          ) : null}
          <div className="hot-news-form__actions">
            <button
              className="hot-news-button hot-news-button--quiet"
              type="button"
              onClick={closeDialog}
              disabled={isSubmitting}
            >
              Hủy
            </button>
            <button
              className="hot-news-button hot-news-button--primary"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Đang lưu…"
                : editingId
                  ? "Lưu thay đổi"
                  : "Thêm thông báo"}
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
};

export default HotNews;
