import React, { useCallback, useEffect, useState } from "react";
import { ArrowLeft, CalendarDays, Check, Clock3, Edit3, ShieldCheck, Ticket, Users } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { DetailSkeleton } from "../../components/LoadingSkeletons";
import ManageSidebar from "../../components/ManageSidebar";
import ticketTypeAPI from "../../apis/ticketTypeAPI";
import { translateError, translateSuccess } from "../../utils/translateResponse";
import "./StaffTicketTypeDetail.scss";

const getStoredRole = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    return String(user?.role?.roleName || user?.roleName || user?.role || user?.roleId?.roleName || "").toLowerCase();
  } catch {
    return "";
  }
};

const toForm = (ticket) => ({
  ticketTypeName: ticket.ticketTypeName || "",
  ticketTypePrice: ticket.ticketTypePrice ?? "",
  availableQuantity: ticket.availableQuantity ?? "",
  totalQuantity: ticket.totalQuantity ?? "",
  ticketTypeDate: ticket.ticketEventDate
    ? new Date(ticket.ticketEventDate).toISOString().slice(0, 10)
    : ticket.ticketTypeDate ? `2026-10-${String(ticket.ticketTypeDate).padStart(2, "0")}` : "",
  ticketTypeTime: ticket.ticketTypeTime || "",
  ticketType3dModel: ticket.ticketType3dModel || "ghost",
});

const StaffTicketTypeDetail = () => {
  const { t, i18n } = useTranslation();
  const ticketTypeText = (key, options) => t(`management.ticketTypes.${key}`, options);
  const componentText = (key) => t(`components.${key}`);
  const formatPrice = (price) => new Intl.NumberFormat(i18n.language === "en" ? "en-US" : "vi-VN", {
    style: "currency", currency: "VND",
  }).format(price || 0);
  const navigate = useNavigate();
  const { ticketTypeId } = useParams();
  const [ticketType, setTicketType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isAdmin = getStoredRole() === "admin";

  const loadTicketType = useCallback(async () => {
    const loadingToast = toast.loading(ticketTypeText("loadingDetail"));
    setIsLoading(true);
    setError(null);
    try {
      const result = await ticketTypeAPI.getById(ticketTypeId);
      setTicketType(result);
      setForm(result ? toForm(result) : null);
    } catch (requestError) {
      setError(translateError(requestError));
      toast.error(translateError(requestError));
    } finally {
      setIsLoading(false);
      toast.dismiss(loadingToast);
    }
  }, [ticketTypeId]);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    const loadingToast = toast.loading(ticketTypeText("updating"));
    setIsSubmitting(true);
    try {
      const result = await ticketTypeAPI.update(ticketTypeId, {
        ...form,
        ticketTypePrice: Number(form.ticketTypePrice),
        totalQuantity: Number(form.totalQuantity),
        ticketTypeDate: Number(form.ticketTypeDate.split("-")[2]),
        ticketEventDate: form.ticketTypeDate,
      });
      setTicketType(result.ticketType);
      setForm(toForm(result.ticketType));
      setIsEditing(false);
      toast.success(translateSuccess(result.message || "Updated successfully"), { id: loadingToast });
    } catch (requestError) {
      toast.error(translateError(requestError), { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async () => {
    const nextStatus = ticketType.ticketTypeStatus === "active" ? "inactive" : "active";
    const loadingToast = toast.loading(ticketTypeText("updatingStatus"));
    setIsSubmitting(true);
    try {
      const result = await ticketTypeAPI.changeStatus(ticketTypeId, nextStatus);
      setTicketType(result.ticketType);
      toast.success(translateSuccess(result.message || "Updated successfully"), { id: loadingToast });
    } catch (requestError) {
      toast.error(translateError(requestError), { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    loadTicketType();
  }, [loadTicketType]);

  return (
    <div className="staff-manage-layout">
      <ManageSidebar role={isAdmin ? "admin" : "staff"} activeItem="ticket-types" />
      <main className="staff-ticket-detail">
        <button className="staff-ticket-detail__back" type="button" onClick={() => navigate(-1)}>
          <ArrowLeft size={17} /> {ticketTypeText("back")}
        </button>

        {isLoading ? (
          <DetailSkeleton />
        ) : error || !ticketType ? (
          <div className="staff-ticket-detail__state">
            <p>{error || ticketTypeText("notFound")}</p>
            <button type="button" onClick={loadTicketType}>{t("management.common.retry")}</button>
          </div>
        ) : (
          <>
            <header>
              <p className="staff-ticket-detail__kicker"><Ticket size={16} /> {ticketTypeText("detailTitle")}</p>
              <h1>{ticketType.ticketTypeName}</h1>
              <div className="staff-ticket-detail__header-actions">
                {!isAdmin ? <span className="staff-ticket-detail__readonly">{ticketTypeText("readOnly")}</span> : (
                  <>
                    <button type="button" className="staff-ticket-detail__action staff-ticket-detail__action--secondary" onClick={() => setIsEditing((current) => !current)}><Edit3 size={16} /> {ticketTypeText(isEditing ? "cancelEdit" : "edit")}</button>
                    <button type="button" className="staff-ticket-detail__action" onClick={handleStatusChange} disabled={isSubmitting}>{ticketTypeText(ticketType.ticketTypeStatus === "active" ? "disable" : "enableSale")}</button>
                  </>
                )}
              </div>
            </header>
            {isEditing && (
              <form className="staff-ticket-detail__edit-form" onSubmit={handleUpdate}>
                <label>{componentText("ticketName")}<input name="ticketTypeName" value={form.ticketTypeName} onChange={updateField} required /></label>
                <label>{componentText("ticketPriceLabel")}<input name="ticketTypePrice" type="number" min="0" value={form.ticketTypePrice} onChange={updateField} required /></label>
                <label>{componentText("date")}<input name="ticketTypeDate" type="date" value={form.ticketTypeDate} onChange={updateField} required /></label>
                <label>{componentText("time")}<input name="ticketTypeTime" type="time" value={form.ticketTypeTime} onChange={updateField} required /></label>
                <label>{componentText("availableQuantity")}<input name="availableQuantity" type="number" min="0" value={form.availableQuantity} onChange={updateField} required /></label>
                <label>{componentText("totalQuantity")}<input name="totalQuantity" type="number" min="0" value={form.totalQuantity} onChange={updateField} required /></label>
                <label className="staff-ticket-detail__edit-form-full">{componentText("model3d")}<input name="ticketType3dModel" value={form.ticketType3dModel} onChange={updateField} required /></label>
                <button type="submit" disabled={isSubmitting}>{ticketTypeText(isSubmitting ? "saving" : "saveChanges")}</button>
              </form>
            )}
            <div className="staff-ticket-detail__layout">
              <section className="staff-ticket-detail__main">
                <div className="staff-ticket-detail__visual">
                  <div className="staff-ticket-detail__visual-orbit" />
                  <div className="staff-ticket-detail__visual-ticket">
                    <span>{String(ticketType.ticketTypeDate).padStart(2, "0")}</span>
                    <small>{ticketTypeText("entryPass")}</small>
                  </div>
                  <em>{ticketType.ticketType3dModel || ticketTypeText("modelFallback")}</em>
                </div>
                <div className="staff-ticket-detail__info">
                    <div><CalendarDays size={19} /><span><small>{ticketTypeText("participationDate")}</small><strong>{ticketTypeText("eventDateLong", { day: ticketType.ticketTypeDate })}</strong></span></div>
                  <div><Clock3 size={19} /><span><small>{t("management.common.time")}</small><strong>{ticketType.ticketTypeTime || t("management.common.notUpdated")}</strong></span></div>
                  <div><Users size={19} /><span><small>{ticketTypeText("totalQuantity")}</small><strong>{ticketTypeText("ticketCount", { count: ticketType.totalQuantity || t("management.common.notUpdated") })}</strong></span></div>
                  <div><ShieldCheck size={19} /><span><small>{t("management.common.status")}</small><strong>{ticketTypeText(ticketType.ticketTypeStatus === "active" ? "onSale" : "paused")}</strong></span></div>
                </div>
                <div className="staff-ticket-detail__includes">
                  <h2>{ticketTypeText("benefits")}</h2>
                  <ul>
                    <li><Check size={17} /> {ticketTypeText("benefitExperience")}</li>
                    <li><Check size={17} /> {ticketTypeText("benefitPersonal")}</li>
                    <li><Check size={17} /> {ticketTypeText("benefitDate")}</li>
                  </ul>
                </div>
              </section>
              <aside className="staff-ticket-detail__summary">
                <span>{componentText("ticketPriceLabel")}</span>
                <strong>{formatPrice(ticketType.ticketTypePrice)}</strong>
                <hr />
                <span>{ticketTypeText("remaining")}</span>
                <b>{ticketType.availableQuantity}</b>
                <small>{ticketTypeText("typeCode", { code: ticketType._id })}</small>
              </aside>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default StaffTicketTypeDetail;
