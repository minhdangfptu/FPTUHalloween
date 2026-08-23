import { useCallback, useEffect, useState } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Clock3,
  Monitor,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import ManageSidebar from "../../components/ManageSidebar";
import LogoutModal from "../../components/LogoutModal";
import ddayVoteAPI from "../../apis/ddayVoteAPI";
import {
  translateError,
  translateSuccess,
} from "../../utils/translateResponse";
import "./DdayVoteAdminPage.scss";

const newOption = (index) => ({ optionId: `option-${index + 1}`, label: "" });
const newCategory = (index) => ({
  categoryId: `category-${index + 1}`,
  label: "",
  options: [newOption(0), newOption(1)],
});
const nextEntityIndex = (items, prefix, idField) => {
  let index = items.length;
  while (items.some((item) => item[idField] === `${prefix}-${index + 1}`)) {
    index += 1;
  }
  return index;
};
const emptyConfig = () => ({
  configKey: "dday",
  title: "",
  description: "",
  status: "draft",
  openAt: "",
  closeAt: "",
  totalVotes: 0,
  categories: [newCategory(0)],
});
const AUDIT_PAGE_SIZE = 10;
const emptyAuditPagination = {
  page: 1,
  pageSize: AUDIT_PAGE_SIZE,
  total: 0,
  totalPages: 0,
};
const DDAY_VOTE_URL = "https://fptuhalloween.io.vn/vote/dday";

const toLocalInput = (value) => {
  if (!value) return "";
  const date = new Date(value);
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 16);
};

const toIso = (value) => (value ? new Date(value).toISOString() : null);
const formatDuration = (milliseconds, text) => {
  if (milliseconds <= 0) return text("expired");
  const totalSeconds = Math.floor(milliseconds / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const parts = [];
  if (days > 0) parts.push(text("days", { count: days }));
  if (hours > 0) parts.push(text("hours", { count: String(hours).padStart(2, "0") }));
  if (minutes > 0) parts.push(text("minutes", { count: String(minutes).padStart(2, "0") }));
  if (seconds > 0 || parts.length === 0)
    parts.push(text("seconds", { count: String(seconds || 1).padStart(2, "0") }));
  return parts.join(" ");
};

const mapConfig = (value) =>
  value
    ? {
        ...value,
        openAt: toLocalInput(value.openAt),
        closeAt: toLocalInput(value.closeAt),
        categories: (value.categories || []).map((category) => ({
          ...category,
          options: (category.options || []).map((option) => ({ ...option })),
        })),
    }
    : emptyConfig();

const validateConfigForSave = (config, text) => {
  const hasCampaignInformation = [
    config.title,
    config.description,
    config.openAt,
    config.closeAt,
  ].every((value) => typeof value === "string" && value.trim());

  if (!hasCampaignInformation) {
    return text("validationInformation");
  }

  if (!Array.isArray(config.categories) || config.categories.length === 0) {
    return text("validationCategories");
  }

  const invalidCategoryIndex = config.categories.findIndex(
    (category) =>
      !category?.label?.trim() ||
      !Array.isArray(category.options) ||
      category.options.length < 2 ||
      category.options.some((option) => !option?.label?.trim()),
  );

  if (invalidCategoryIndex !== -1) {
    return text("validationCategory", { number: invalidCategoryIndex + 1 });
  }

  return "";
};

const DdayModal = ({
  title,
  onClose,
  children,
  closeDisabled = false,
  fullscreen = false,
}) => {
  const { t } = useTranslation();
  return (
  <div
    className={`dday-admin-modal-backdrop${fullscreen ? " dday-admin-modal-backdrop--fullscreen" : ""}`}
    role="presentation"
    onMouseDown={(event) => {
      if (event.target === event.currentTarget && !closeDisabled) onClose();
    }}
  >
    <div
      className={`dday-admin-modal${fullscreen ? " dday-admin-modal--fullscreen" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dday-admin-modal-title"
    >
      <div className="dday-admin-modal__heading">
        <h2 id="dday-admin-modal-title">{title}</h2>
        <button
          type="button"
          className="dday-icon-button"
          onClick={onClose}
          disabled={closeDisabled}
          aria-label={t("management.common.close")}
        >
          <X size={17} />
        </button>
      </div>
      {children}
    </div>
  </div>
  );
};

const DdayVoteAdminPage = () => {
  const { t, i18n } = useTranslation();
  const adminVoteText = (key, options) => t(`management.voteAdmin.${key}`, options);
  const formatDate = (value) => value
    ? new Date(value).toLocaleString(i18n.language === "en" ? "en-US" : "vi-VN", { dateStyle: "medium", timeStyle: "short" })
    : "—";
  const statusLabel = { draft: adminVoteText("statusDraft"), open: adminVoteText("statusOpen"), closed: adminVoteText("statusClosed") };
  const [config, setConfig] = useState(emptyConfig);
  const [campaignExists, setCampaignExists] = useState(false);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editSnapshot, setEditSnapshot] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [pendingAction, setPendingAction] = useState(null);
  const [closeAtDraft, setCloseAtDraft] = useState("");
  const [countdownOpen, setCountdownOpen] = useState(false);
  const [publishConfirmOpen, setPublishConfirmOpen] = useState(false);
  const [editConfirmOpen, setEditConfirmOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteFinalConfirmOpen, setDeleteFinalConfirmOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
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
      setCampaignExists(Boolean(configResponse));
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

  const updateConfig = (field, value) =>
    setConfig((current) => ({ ...current, [field]: value }));
  const updateCategory = (categoryIndex, field, value) =>
    setConfig((current) => ({
      ...current,
      categories: current.categories.map((category, index) =>
        index === categoryIndex ? { ...category, [field]: value } : category,
      ),
    }));
  const updateOption = (categoryIndex, optionIndex, value) =>
    setConfig((current) => ({
      ...current,
      categories: current.categories.map((category, index) =>
        index !== categoryIndex
          ? category
          : {
              ...category,
              options: category.options.map((option, optionPosition) =>
                optionPosition === optionIndex
                  ? { ...option, label: value }
                  : option,
              ),
            },
      ),
    }));
  const addCategory = () =>
    setConfig((current) => ({
      ...current,
      categories: [
        ...current.categories,
        newCategory(
          nextEntityIndex(current.categories, "category", "categoryId"),
        ),
      ],
    }));
  const removeCategory = (categoryIndex) =>
    setConfig((current) => ({
      ...current,
      categories: current.categories.filter(
        (_, index) => index !== categoryIndex,
      ),
    }));
  const addOption = (categoryIndex) =>
    setConfig((current) => ({
      ...current,
      categories: current.categories.map((category, index) =>
        index === categoryIndex
          ? {
              ...category,
              options: [
                ...category.options,
                newOption(
                  nextEntityIndex(category.options, "option", "optionId"),
                ),
              ],
            }
          : category,
      ),
    }));
  const removeOption = (categoryIndex, optionIndex) =>
    setConfig((current) => ({
      ...current,
      categories: current.categories.map((category, index) =>
        index === categoryIndex
          ? {
              ...category,
              options: category.options.filter(
                (_, position) => position !== optionIndex,
              ),
            }
          : category,
      ),
    }));

  const startEditing = () => {
    if (config.status !== "draft") return;
    setEditSnapshot(config);
    setEditing(true);
  };

  const cancelEditing = () => {
    if (editSnapshot) setConfig(editSnapshot);
    setEditSnapshot(null);
    setEditing(false);
  };

  const requestSave = (event) => {
    event.preventDefault();
    if (config.status !== "draft" || !canEdit || saving) return;

    const validationMessage = validateConfigForSave(config, adminVoteText);
    if (validationMessage) {
      toast.error(validationMessage);
      return;
    }

    setEditConfirmOpen(true);
  };

  const save = async () => {
    setEditConfirmOpen(false);
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
      setCampaignExists(true);
      setEditSnapshot(null);
      setEditing(false);
      toast.success(
        translateSuccess(
          campaignExists
            ? "Vote campaign updated successfully"
            : "Vote campaign created successfully",
        ),
      );
    } catch (requestError) {
      toast.error(translateError(requestError));
    } finally {
      setSaving(false);
    }
  };

  const deleteCampaign = async () => {
    setDeleteFinalConfirmOpen(false);
    setDeleteLoading(true);
    try {
      await ddayVoteAPI.deleteCampaign();
      setConfig(emptyConfig());
      setCampaignExists(false);
      setResults(null);
      setEditSnapshot(null);
      setEditing(false);
      toast.success(translateSuccess("Vote campaign deleted successfully"));
    } catch (requestError) {
      toast.error(translateError(requestError));
    } finally {
      setDeleteLoading(false);
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
    toast.error(
      adminVoteText("popupBlocked"),
    );
  };

  const loadAudit = useCallback(async (page = 1) => {
    setAuditLoading(true);
    setAuditError("");
    try {
      const response = await ddayVoteAPI.getAudit({
        page,
        pageSize: AUDIT_PAGE_SIZE,
      });
      setAuditEntries(response?.data || []);
      setAuditPagination(
        response?.pagination || { ...emptyAuditPagination, page },
      );
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
  const canEdit = isDraft && (!campaignExists || editing);
  const isOpen = config.status === "open";
  const remainingMilliseconds = config.closeAt
    ? new Date(config.closeAt).getTime() - now
    : 0;
  const pendingTitle =
    pendingAction?.type === "close"
      ? adminVoteText("confirmCloseTitle")
      : pendingAction?.type === "close-time"
        ? adminVoteText("confirmCloseTimeTitle")
        : pendingAction?.isReopen
          ? adminVoteText("confirmReopenTitle")
          : adminVoteText("confirmOpenTitle");

  return (
    <div className="dday-admin-shell">
      <ManageSidebar role="admin" activeItem="vote" />
      <main className="dday-admin-main">
        <header className="dday-admin-header">
          <div>
            <span className="dday-admin-kicker">{adminVoteText("kicker")}</span>
            <h1>{adminVoteText("title")}</h1>
            <p>{adminVoteText("intro")}</p>
          </div>
          <div className="dday-admin-header__actions">
            {campaignExists && !editing && (
              <button
                type="button"
                className="dday-admin-button dday-admin-button--danger"
                onClick={() => setDeleteConfirmOpen(true)}
                disabled={deleteLoading}
              >
                <Trash2 size={16} /> {adminVoteText(deleteLoading ? "deleting" : "deleteAll")}
              </button>
            )}
            {campaignExists && isDraft && !editing && (
              <button
                type="button"
                className="dday-admin-button dday-admin-button--secondary"
                onClick={startEditing}
              >
                <Pencil size={16} /> {adminVoteText("editCampaign")}
              </button>
            )}
            {editing && (
              <button
                type="button"
                className="dday-admin-button dday-admin-button--secondary"
                onClick={cancelEditing}
                disabled={saving}
              >
                {adminVoteText("cancelEditing")}
              </button>
            )}
            <button
              type="button"
              className="dday-admin-refresh"
              onClick={load}
              disabled={loading || canEdit || deleteLoading}
            >
              <RefreshCw size={16} /> {t("management.common.refresh")}
            </button>
          </div>
        </header>

        {error && (
          <div className="dday-admin-error" role="alert">
            <CircleAlert size={18} /> {error}
          </div>
        )}
        {loading ? (
          <div className="dday-admin-loading" aria-busy="true">
            {adminVoteText("loadingConfig")}
          </div>
        ) : (
          <>
            <section className="dday-admin-metrics">
              <div>
                <small>{t("management.common.status")}</small>
                <strong>{statusLabel[config.status] || config.status}</strong>
              </div>
              <div>
                <small>{adminVoteText("totalVotes")}</small>
                <strong>{config.totalVotes || 0}</strong>
              </div>
              <div>
                <small>{adminVoteText("closingTime")}</small>
                <strong>{formatDate(config.closeAt)}</strong>
              </div>
            </section>

            <form className="dday-admin-card" onSubmit={requestSave}>
              <div className="dday-admin-card__heading">
                <div>
                  <span className="dday-admin-kicker">
                    {adminVoteText("setupKicker")}
                  </span>
                  <h2>{adminVoteText("information")}</h2>
                </div>
                <span
                  className={`dday-admin-status dday-admin-status--${config.status}`}
                >
                  {statusLabel[config.status]}
                </span>
              </div>
              <div className="dday-admin-grid">
                <label>
                  <span>{adminVoteText("campaignTitle")}</span>
                  <input
                    value={config.title}
                    onChange={(event) =>
                      updateConfig("title", event.target.value)
                    }
                    disabled={!canEdit}
                    placeholder={adminVoteText("titlePlaceholder")}
                  />
                </label>
                <label>
                  <span>{adminVoteText("description")}</span>
                  <textarea
                    value={config.description}
                    onChange={(event) =>
                      updateConfig("description", event.target.value)
                    }
                    disabled={!canEdit}
                    rows={3}
                    placeholder={adminVoteText("descriptionPlaceholder")}
                  />
                </label>
                <label>
                  <span>{adminVoteText("plannedOpening")}</span>
                  <input
                    type="datetime-local"
                    value={config.openAt}
                    onChange={(event) =>
                      updateConfig("openAt", event.target.value)
                    }
                    disabled={!canEdit}
                  />
                </label>
                <label>
                  <span>{adminVoteText("automaticClosing")}</span>
                  <input
                    type="datetime-local"
                    value={config.closeAt}
                    onChange={(event) =>
                      updateConfig("closeAt", event.target.value)
                    }
                    disabled={!canEdit}
                  />
                </label>
              </div>
              <div className="dday-admin-section-heading">
                <div>
                  <h3>{adminVoteText("categories")}</h3>
                  <p>{adminVoteText("categoriesHelp")}</p>
                </div>
                {canEdit && (
                  <button
                    type="button"
                    className="dday-admin-link"
                    onClick={addCategory}
                  >
                    <Plus size={15} /> {adminVoteText("addCategory")}
                  </button>
                )}
              </div>
              <div className="dday-admin-categories">
                {config.categories.map((category, categoryIndex) => (
                  <div
                    className="dday-admin-category"
                    key={`${category.categoryId}-${categoryIndex}`}
                  >
                    <div className="dday-admin-category__heading">
                      <strong>{adminVoteText("categoryNumber", { number: categoryIndex + 1 })}</strong>
                      {canEdit && (
                        <button
                          type="button"
                          className="dday-icon-button"
                          onClick={() => removeCategory(categoryIndex)}
                          disabled={config.categories.length <= 1 || saving}
                          aria-label={adminVoteText("deleteCategory")}
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                    <div className="dday-admin-category__fields">
                      <label>
                        <span>{adminVoteText("categoryName")}</span>
                        <input
                          value={category.label}
                          onChange={(event) =>
                            updateCategory(
                              categoryIndex,
                              "label",
                              event.target.value,
                            )
                          }
                          disabled={!canEdit}
                          placeholder={adminVoteText("categoryPlaceholder")}
                        />
                      </label>
                    </div>
                    <div className="dday-admin-options">
                      {category.options.map((option, optionIndex) => (
                        <div
                          className="dday-admin-option"
                          key={`${option.optionId}-${optionIndex}`}
                        >
                          <label>
                            <span>{adminVoteText("optionNumber", { number: optionIndex + 1 })}</span>
                            <input
                              value={option.label}
                              onChange={(event) =>
                                updateOption(
                                  categoryIndex,
                                  optionIndex,
                                  event.target.value,
                                )
                              }
                              disabled={!canEdit}
                              placeholder={adminVoteText(optionIndex === 0 ? "optionCodePlaceholder" : "optionNamePlaceholder")}
                            />
                          </label>
                          {canEdit && (
                            <button
                              type="button"
                              className="dday-icon-button"
                              onClick={() =>
                                removeOption(categoryIndex, optionIndex)
                              }
                              disabled={category.options.length <= 2 || saving}
                              aria-label={adminVoteText("deleteOption")}
                            >
                              <X size={15} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    {canEdit && (
                      <button
                        type="button"
                        className="dday-admin-link"
                        onClick={() => addOption(categoryIndex)}
                      >
                        <Plus size={15} /> {adminVoteText("addOption")}
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {campaignExists && isDraft && !editing && (
                <div className="dday-admin-actions">
                  <button
                    type="button"
                    className="dday-admin-button dday-admin-button--dark"
                    onClick={requestOpen}
                    disabled={actionLoading}
                  >
                    <Check size={16} /> {adminVoteText("openVoting")}
                  </button>
                </div>
              )}
              {canEdit && (
                <div className="dday-admin-actions">
                  <button
                    type="submit"
                    className="dday-admin-button dday-admin-button--primary"
                    disabled={saving}
                  >
                    <Save size={16} />
                    {saving
                      ? adminVoteText("saving")
                      : campaignExists
                        ? adminVoteText("saveChanges")
                        : adminVoteText("saveCampaign")}
                  </button>
                  {campaignExists && (
                    <button
                      type="button"
                      className="dday-admin-button dday-admin-button--secondary"
                      onClick={cancelEditing}
                      disabled={saving}
                    >
                      {t("management.common.cancel")}
                    </button>
                  )}
                </div>
              )}
              {isOpen && (
                <div className="dday-admin-actions dday-admin-actions--management">
                  <button
                    type="button"
                    className="dday-admin-button dday-admin-button--secondary"
                    onClick={requestCloseTimeEdit}
                    disabled={actionLoading}
                  >
                    <Clock3 size={16} /> {adminVoteText("editCloseTime")}
                  </button>
                  <button
                    type="button"
                    className="dday-admin-button dday-admin-button--secondary"
                    onClick={() => setCountdownOpen(true)}
                    disabled={actionLoading}
                  >
                    <Clock3 size={16} /> {adminVoteText("viewCountdown")}
                  </button>
                  <button
                    type="button"
                    className="dday-admin-button dday-admin-button--danger"
                    onClick={requestClose}
                    disabled={actionLoading}
                  >
                    {adminVoteText("closeNow")}
                  </button>
                </div>
              )}
              {config.status === "closed" && (
                <div className="dday-admin-actions dday-admin-actions--management">
                  <p className="dday-admin-reopen-note">
                    {adminVoteText("reopenNote")}
                  </p>
                  <button
                    type="button"
                    className="dday-admin-button dday-admin-button--dark"
                    onClick={requestOpen}
                    disabled={actionLoading}
                  >
                    <Check size={16} /> {adminVoteText("reopenVoting")}
                  </button>
                  <button
                    type="button"
                    className="dday-admin-button dday-admin-button--secondary"
                    onClick={openAudit}
                    disabled={actionLoading}
                  >
                    <Users size={17} /> {adminVoteText("viewVoters")}
                  </button>
                  <button
                    type="button"
                    className="dday-admin-button dday-admin-button--primary"
                    onClick={() => setPublishConfirmOpen(true)}
                    disabled={actionLoading}
                  >
                    <Monitor size={17} /> {adminVoteText("publishResults")}
                  </button>
                </div>
              )}
            </form>

            {results && (
              <section className="dday-admin-card">
                <div className="dday-admin-card__heading">
                  <div>
                    <span className="dday-admin-kicker">{adminVoteText("summaryResults")}</span>
                    <h2>{adminVoteText("validVotes", { count: results.totalVotes })}</h2>
                  </div>
                  <span>{formatDate(results.closedAt)}</span>
                </div>
                {results.categories.map((category) => (
                  <div className="dday-admin-result" key={category.categoryId}>
                    <h3>{category.label}</h3>
                    {category.options.map((option) => (
                      <div key={option.optionId}>
                        <span>{option.label}</span>
                        <strong>{option.count}</strong>
                      </div>
                    ))}
                  </div>
                ))}
              </section>
            )}
          </>
        )}
      </main>

      {pendingAction && (
        <DdayModal
          title={pendingTitle}
          onClose={() => setPendingAction(null)}
          closeDisabled={actionLoading}
        >
          <div className="dday-admin-modal__body">
            {pendingAction.type === "close" && (
              <p>{adminVoteText("closeWarning")}</p>
            )}
            {pendingAction.type === "open" && (
              <p>
                {pendingAction.isReopen
                  ? adminVoteText("reopenWarning")
                  : adminVoteText("openWarning")}
              </p>
            )}
            {pendingAction.type === "close-time" && (
              <p>{adminVoteText("closeTimeWarning")}</p>
            )}
            {(pendingAction.type === "open" ||
              pendingAction.type === "close-time") && (
              <label className="dday-admin-modal-field">
                <span>{adminVoteText("automaticClosing")}</span>
                <input
                  type="datetime-local"
                  value={closeAtDraft}
                  onChange={(event) => setCloseAtDraft(event.target.value)}
                  min={toLocalInput(new Date())}
                  required
                />
              </label>
            )}
            <div className="dday-admin-modal__actions">
              <button
                type="button"
                className="dday-admin-button dday-admin-button--secondary"
                onClick={() => setPendingAction(null)}
                disabled={actionLoading}
              >
                {t("management.common.cancel")}
              </button>
              <button
                type="button"
                className="dday-admin-button dday-admin-button--dark"
                onClick={confirmPendingAction}
                disabled={actionLoading}
              >
                {actionLoading
                  ? adminVoteText("processing")
                  : pendingAction.type === "close"
                    ? adminVoteText("closeVoting")
                    : pendingAction.type === "close-time"
                      ? adminVoteText("saveNewTime")
                      : pendingAction.isReopen
                        ? adminVoteText("reopenAndExtend")
                        : adminVoteText("openVoting")}
              </button>
            </div>
          </div>
        </DdayModal>
      )}

      {countdownOpen && (
        <DdayModal onClose={() => setCountdownOpen(false)} fullscreen>
          <div className="dday-admin-countdown-layout">
            <section className="dday-admin-countdown-panel" aria-live="polite">
              <span className="dday-admin-kicker">
                {adminVoteText("remainingTime")}
              </span>
              <div className="dday-admin-countdown">
                <Clock3 size={38} />
                <strong>{formatDuration(remainingMilliseconds, adminVoteText)}</strong>
                <p>{adminVoteText("closesAt", { time: formatDate(config.closeAt) })}</p>
              </div>
              <div className="dday-admin-countdown-qr">
                <span>{adminVoteText("scanToVote")}</span>
                <QRCodeCanvas
                  value={DDAY_VOTE_URL}
                  size={220}
                  includeMargin
                  aria-label={adminVoteText("voteQrAria")}
                />
              </div>
            </section>
            <section
              className="dday-admin-contestant-panel"
              aria-label={adminVoteText("contestantImage")}
            >
              <div
                className="dday-admin-contestant-placeholder"
                role="img"
                aria-label={adminVoteText("contestantPlaceholderAria")}
              >
                <Users size={76} strokeWidth={1.3} />
                <strong>{adminVoteText("contestantImageLabel")}</strong>
                <span>{adminVoteText("contestantPlaceholder")}</span>
              </div>
            </section>
          </div>
          <div className="dday-admin-modal__actions">
            {/* <button
              type="button"
              className="dday-admin-button dday-admin-button--secondary"
              onClick={() => setCountdownOpen(false)}
            >
              Đóng
            </button> */}
          </div>
        </DdayModal>
      )}

      {auditOpen && (
        <DdayModal
          title={adminVoteText("voterList")}
          onClose={() => setAuditOpen(false)}
          closeDisabled={auditLoading}
        >
          <div className="dday-admin-audit">
            <p className="dday-admin-audit__summary">
              {adminVoteText("voterSummary", { count: auditPagination.total })}
            </p>
            {auditLoading && (
              <div className="dday-admin-audit__state" aria-live="polite">
                {adminVoteText("loadingVoters")}
              </div>
            )}
            {!auditLoading && auditError && (
              <div
                className="dday-admin-audit__state dday-admin-audit__state--error"
                role="alert"
              >
                <CircleAlert size={18} />
                <span>{auditError}</span>
                <button
                  type="button"
                  className="dday-admin-button dday-admin-button--secondary"
                  onClick={() => loadAudit(auditPagination.page)}
                >
                  {t("management.common.retry")}
                </button>
              </div>
            )}
            {!auditLoading && !auditError && auditEntries.length === 0 && (
              <div className="dday-admin-audit__state">
                {adminVoteText("emptyVoters")}
              </div>
            )}
            {!auditLoading && !auditError && auditEntries.length > 0 && (
              <div className="dday-admin-audit__list">
                {auditEntries.map((vote) => (
                  <article
                    className="dday-admin-audit__entry"
                    key={vote.submissionId || vote._id}
                  >
                    <div className="dday-admin-audit__identity">
                      <div>
                        <strong>{vote.googleName || adminVoteText("noName")}</strong>
                        <span>{vote.googleEmail || adminVoteText("noEmail")}</span>
                      </div>
                    </div>
                    <div className="dday-admin-audit__choices">
                      {(vote.choices || []).map((choice, choiceIndex) => {
                        const category = config.categories.find(
                          (item) => item.categoryId === choice.categoryId,
                        );
                        const option = category?.options?.find(
                          (item) => item.optionId === choice.optionId,
                        );
                        return (
                          <div
                            className="dday-admin-audit__choice"
                            key={`${choice.categoryId || choiceIndex}-${choice.optionId || choiceIndex}`}
                          >
                            <span>{category?.label || adminVoteText("category")}</span>
                            <strong>{option?.label || adminVoteText("option")}</strong>
                          </div>
                        );
                      })}
                    </div>
                  </article>
                ))}
              </div>
            )}
            {auditPagination.totalPages > 1 && (
              <div className="dday-admin-audit__pagination">
                <button
                  type="button"
                  className="dday-admin-button dday-admin-button--secondary"
                  onClick={() => loadAudit(auditPagination.page - 1)}
                  disabled={auditLoading || auditPagination.page <= 1}
                >
                  <ChevronLeft size={16} /> {t("management.common.previous")}
                </button>
                <span>
                  {adminVoteText("pageOf", { page: auditPagination.page, total: auditPagination.totalPages })}
                </span>
                <button
                  type="button"
                  className="dday-admin-button dday-admin-button--secondary"
                  onClick={() => loadAudit(auditPagination.page + 1)}
                  disabled={
                    auditLoading ||
                    auditPagination.page >= auditPagination.totalPages
                  }
                >
                  {t("management.common.next")} <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </DdayModal>
      )}

      <LogoutModal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={() => {
          setDeleteConfirmOpen(false);
          setDeleteFinalConfirmOpen(true);
        }}
        title={adminVoteText("deleteTitleOne")}
        description={adminVoteText("deleteDescriptionOne")}
        cancelLabel={t("management.common.cancel")}
        confirmLabel={adminVoteText("continue")}
        isManagement
      />

      <LogoutModal
        isOpen={deleteFinalConfirmOpen}
        onClose={() => setDeleteFinalConfirmOpen(false)}
        onConfirm={deleteCampaign}
        title={adminVoteText("deleteTitleTwo")}
        description={adminVoteText("deleteDescriptionTwo")}
        cancelLabel={t("management.common.cancel")}
        confirmLabel={adminVoteText("deleteConfirm")}
        isManagement
      />

      <LogoutModal
        isOpen={editConfirmOpen}
        onClose={() => setEditConfirmOpen(false)}
        onConfirm={save}
        title={
          campaignExists
            ? adminVoteText("saveChangesTitle")
            : adminVoteText("saveCampaignTitle")
        }
        description={
          campaignExists
            ? adminVoteText("saveChangesDescription")
            : adminVoteText("saveCampaignDescription")
        }
        cancelLabel={t("management.common.cancel")}
        confirmLabel={
          campaignExists ? adminVoteText("saveChanges") : adminVoteText("saveCampaign")
        }
        isManagement
      />

      <LogoutModal
        isOpen={publishConfirmOpen}
        onClose={() => setPublishConfirmOpen(false)}
        onConfirm={() => {
          setPublishConfirmOpen(false);
          openPublishScreen();
        }}
        title={adminVoteText("publishTitle")}
        description={adminVoteText("publishDescription")}
        cancelLabel={t("management.common.cancel")}
        confirmLabel={adminVoteText("openPublishScreen")}
        isManagement
      />
    </div>
  );
};

export default DdayVoteAdminPage;
