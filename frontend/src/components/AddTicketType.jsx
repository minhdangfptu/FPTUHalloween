import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import ticketTypeAPI from "../apis/ticketTypeAPI";
import { translateError, translateSuccess } from "../utils/translateResponse";
import "./AddTicketType.scss";

const EMPTY_FORM = {
  ticketTypeName: "",
  ticketTypePrice: "",
  availableQuantity: "",
  totalQuantity: "",
  ticketTypeDate: "",
  ticketTypeTime: "",
  ticketType3dModel: "ghost",
};

const getStoredRole = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    return String(user?.role?.roleName || user?.roleName || user?.role || user?.roleId?.roleName || "").toLowerCase();
  } catch {
    return "";
  }
};

const AddTicketType = ({ onCreated }) => {
  const { t } = useTranslation();
  const componentText = (key, options) => t(`components.${key}`, options);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (getStoredRole() !== "admin") return null;

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const loadingToast = toast.loading(componentText("creatingTicket"));
    setIsSubmitting(true);
    try {
      const result = await ticketTypeAPI.create({
        ...form,
        ticketTypePrice: Number(form.ticketTypePrice),
        totalQuantity: Number(form.totalQuantity),
        // Backend stores the event day as a number; the UI uses a date picker.
        ticketTypeDate: Number(form.ticketTypeDate.split("-")[2]),
        ticketEventDate: form.ticketTypeDate,
      });
      toast.success(translateSuccess(result.message || "Created successfully"), { id: loadingToast });
      setForm(EMPTY_FORM);
      setIsOpen(false);
      onCreated?.(result.ticketType);
    } catch (requestError) {
      toast.error(translateError(requestError), { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button className="add-ticket-type__trigger" type="button" onClick={() => setIsOpen(true)}>
        <Plus size={17} /> {componentText("addTicket")}
      </button>
      {isOpen && (
        <div className="add-ticket-type__overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setIsOpen(false)}>
          <form className="add-ticket-type__modal" onSubmit={handleSubmit}>
            <div className="add-ticket-type__heading">
              <div><span>{componentText("ticketType")}</span><h2>{componentText("addTicket")}</h2></div>
              <button type="button" aria-label={componentText("close")} onClick={() => setIsOpen(false)}><X size={20} /></button>
            </div>
            <div className="add-ticket-type__fields">
              <label>{componentText("ticketName")}<input name="ticketTypeName" value={form.ticketTypeName} onChange={updateField} required /></label>
              <label>{componentText("ticketPriceLabel")}<input name="ticketTypePrice" type="number" min="0" value={form.ticketTypePrice} onChange={updateField} required /></label>
              <label>{componentText("date")}<input name="ticketTypeDate" type="date" value={form.ticketTypeDate} onChange={updateField} required /></label>
              <label>{componentText("time")}<input name="ticketTypeTime" type="time" value={form.ticketTypeTime} onChange={updateField} required /></label>
              <label>{componentText("availableQuantity")}<input name="availableQuantity" type="number" min="0" value={form.availableQuantity} onChange={updateField} required /></label>
              <label>{componentText("totalQuantity")}<input name="totalQuantity" type="number" min="0" value={form.totalQuantity} onChange={updateField} required /></label>
              <label className="add-ticket-type__full">{componentText("model3d")}<input name="ticketType3dModel" value={form.ticketType3dModel} onChange={updateField} required /></label>
            </div>
            <div className="add-ticket-type__actions"><button type="button" onClick={() => setIsOpen(false)}>{componentText("cancel")}</button><button type="submit" disabled={isSubmitting}>{isSubmitting ? componentText("saving") : componentText("create")}</button></div>
          </form>
        </div>
      )}
    </>
  );
};

export default AddTicketType;
