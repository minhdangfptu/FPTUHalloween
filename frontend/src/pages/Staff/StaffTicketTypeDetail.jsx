import React, { useCallback, useEffect, useState } from "react";
import { ArrowLeft, CalendarDays, Check, Clock3, Edit3, ShieldCheck, Ticket, Users } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import ManageSidebar from "../../components/ManageSidebar";
import ticketTypeAPI from "../../apis/ticketTypeAPI";
import { translateError, translateSuccess } from "../../utils/translateResponse";
import "./StaffTicketTypeDetail.scss";

const formatPrice = (price) =>
  `${new Intl.NumberFormat("vi-VN").format(price || 0)} VND`;

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
  ticketTypeDate: ticket.ticketTypeDate ? `2026-10-${String(ticket.ticketTypeDate).padStart(2, "0")}` : "",
  ticketTypeTime: ticket.ticketTypeTime || "",
  ticketType3dModel: ticket.ticketType3dModel || "ghost",
});

const StaffTicketTypeDetail = () => {
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
    const loadingToast = toast.loading("Đang tải chi tiết loại vé...");
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
    const loadingToast = toast.loading("Đang cập nhật loại vé...");
    setIsSubmitting(true);
    try {
      const result = await ticketTypeAPI.update(ticketTypeId, {
        ...form,
        ticketTypePrice: Number(form.ticketTypePrice),
        totalQuantity: Number(form.totalQuantity),
        ticketTypeDate: Number(form.ticketTypeDate.split("-")[2]),
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
    const loadingToast = toast.loading("Đang cập nhật trạng thái...");
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
          <ArrowLeft size={17} /> Quay lại danh sách vé
        </button>

        {isLoading ? (
          <div className="staff-ticket-detail__state" aria-busy="true" />
        ) : error || !ticketType ? (
          <div className="staff-ticket-detail__state">
            <p>{error || "Không tìm thấy loại vé."}</p>
            <button type="button" onClick={loadTicketType}>Thử lại</button>
          </div>
        ) : (
          <>
            <header>
              <p className="staff-ticket-detail__kicker"><Ticket size={16} /> Chi tiết loại vé</p>
              <h1>{ticketType.ticketTypeName}</h1>
              <div className="staff-ticket-detail__header-actions">
                {!isAdmin ? <span className="staff-ticket-detail__readonly">Chế độ chỉ xem</span> : (
                  <>
                    <button type="button" className="staff-ticket-detail__action staff-ticket-detail__action--secondary" onClick={() => setIsEditing((current) => !current)}><Edit3 size={16} /> {isEditing ? "Hủy sửa" : "Chỉnh sửa"}</button>
                    <button type="button" className="staff-ticket-detail__action" onClick={handleStatusChange} disabled={isSubmitting}>{ticketType.ticketTypeStatus === "active" ? "Vô hiệu hóa" : "Mở bán"}</button>
                  </>
                )}
              </div>
            </header>
            {isEditing && (
              <form className="staff-ticket-detail__edit-form" onSubmit={handleUpdate}>
                <label>Tên loại vé<input name="ticketTypeName" value={form.ticketTypeName} onChange={updateField} required /></label>
                <label>Giá vé<input name="ticketTypePrice" type="number" min="0" value={form.ticketTypePrice} onChange={updateField} required /></label>
                <label>Ngày<input name="ticketTypeDate" type="date" value={form.ticketTypeDate} onChange={updateField} required /></label>
                <label>Giờ<input name="ticketTypeTime" type="time" value={form.ticketTypeTime} onChange={updateField} required /></label>
                <label>Vé còn lại<input name="availableQuantity" type="number" min="0" value={form.availableQuantity} onChange={updateField} required /></label>
                <label>Tổng số vé<input name="totalQuantity" type="number" min="0" value={form.totalQuantity} onChange={updateField} required /></label>
                <label className="staff-ticket-detail__edit-form-full">Mô hình 3D<input name="ticketType3dModel" value={form.ticketType3dModel} onChange={updateField} required /></label>
                <button type="submit" disabled={isSubmitting}>{isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}</button>
              </form>
            )}
            <div className="staff-ticket-detail__layout">
              <section className="staff-ticket-detail__main">
                <div className="staff-ticket-detail__visual">
                  <div className="staff-ticket-detail__visual-orbit" />
                  <div className="staff-ticket-detail__visual-ticket">
                    <span>{String(ticketType.ticketTypeDate).padStart(2, "0")}</span>
                    <small>ENTRY PASS</small>
                  </div>
                  <em>{ticketType.ticketType3dModel || "Mô hình 3D vé Nhà Ma"}</em>
                </div>
                <div className="staff-ticket-detail__info">
                    <div><CalendarDays size={19} /><span><small>Ngày tham gia</small><strong>Ngày {ticketType.ticketTypeDate} tháng 10, 2026</strong></span></div>
                  <div><Clock3 size={19} /><span><small>Thời gian</small><strong>{ticketType.ticketTypeTime || "Đang cập nhật"}</strong></span></div>
                  <div><Users size={19} /><span><small>Tổng số lượng</small><strong>{ticketType.totalQuantity || "Đang cập nhật"} vé</strong></span></div>
                  <div><ShieldCheck size={19} /><span><small>Trạng thái</small><strong>{ticketType.ticketTypeStatus === "active" ? "Đang mở bán" : "Tạm ngưng"}</strong></span></div>
                </div>
                <div className="staff-ticket-detail__includes">
                  <h2>Quyền lợi vé</h2>
                  <ul>
                    <li><Check size={17} /> Quyền tham gia trải nghiệm Nhà Ma</li>
                    <li><Check size={17} /> Vé điện tử cá nhân</li>
                    <li><Check size={17} /> Sử dụng trong đúng ngày đã chọn</li>
                  </ul>
                </div>
              </section>
              <aside className="staff-ticket-detail__summary">
                <span>Giá vé</span>
                <strong>{formatPrice(ticketType.ticketTypePrice)}</strong>
                <hr />
                <span>Vé còn lại</span>
                <b>{ticketType.availableQuantity}</b>
                <small>Mã loại vé: {ticketType._id}</small>
              </aside>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default StaffTicketTypeDetail;
