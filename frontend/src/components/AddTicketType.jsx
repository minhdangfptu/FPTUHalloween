import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import toast from "react-hot-toast";
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
    const loadingToast = toast.loading("Đang tạo loại vé...");
    setIsSubmitting(true);
    try {
      const result = await ticketTypeAPI.create({
        ...form,
        ticketTypePrice: Number(form.ticketTypePrice),
        totalQuantity: Number(form.totalQuantity),
        ticketTypeDate: Number(form.ticketTypeDate),
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
        <Plus size={17} /> Thêm loại vé
      </button>
      {isOpen && (
        <div className="add-ticket-type__overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setIsOpen(false)}>
          <form className="add-ticket-type__modal" onSubmit={handleSubmit}>
            <div className="add-ticket-type__heading">
              <div><span>Ticket type</span><h2>Thêm loại vé</h2></div>
              <button type="button" aria-label="Đóng" onClick={() => setIsOpen(false)}><X size={20} /></button>
            </div>
            <div className="add-ticket-type__fields">
              <label>Tên loại vé<input name="ticketTypeName" value={form.ticketTypeName} onChange={updateField} required /></label>
              <label>Giá vé<input name="ticketTypePrice" type="number" min="0" value={form.ticketTypePrice} onChange={updateField} required /></label>
              <label>Ngày<input name="ticketTypeDate" type="number" min="1" max="31" value={form.ticketTypeDate} onChange={updateField} required /></label>
              <label>Giờ<input name="ticketTypeTime" type="time" value={form.ticketTypeTime} onChange={updateField} required /></label>
              <label>Số vé còn lại<input name="availableQuantity" type="number" min="0" value={form.availableQuantity} onChange={updateField} required /></label>
              <label>Tổng số vé<input name="totalQuantity" type="number" min="0" value={form.totalQuantity} onChange={updateField} required /></label>
              <label className="add-ticket-type__full">Mô hình 3D<input name="ticketType3dModel" value={form.ticketType3dModel} onChange={updateField} required /></label>
            </div>
            <div className="add-ticket-type__actions"><button type="button" onClick={() => setIsOpen(false)}>Hủy</button><button type="submit" disabled={isSubmitting}>{isSubmitting ? "Đang lưu..." : "Tạo loại vé"}</button></div>
          </form>
        </div>
      )}
    </>
  );
};

export default AddTicketType;
