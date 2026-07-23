import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import axiosClient from "../apis/axiosClient";
import QRModal from "./QRModal";
import "./UserListTicket.scss";

const ticketStatusLabels = { Pending: "Chờ sử dụng", Processing: "Đang xử lý", Checked: "Đã sử dụng", Cancelled: "Đã huỷ" };
const formatPrice = (value) => `${new Intl.NumberFormat("vi-VN").format(Number(value || 0))} VND`;

const UserListTicket = ({ order, onClose }) => {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedQrCode, setSelectedQrCode] = useState(null);

  useEffect(() => {
    let isMounted = true;
    axiosClient.get(`/orders/me/${order._id}`)
      .then((response) => {
        if (isMounted) setTickets(response.data?.data?.tickets || []);
      })
      .catch(() => toast.error("Không thể tải danh sách vé của đơn hàng."))
      .finally(() => { if (isMounted) setIsLoading(false); });
    return () => { isMounted = false; };
  }, [order._id]);

  return (
    <div className="user-ticket-modal" role="presentation" onMouseDown={onClose}>
      <section className="user-ticket-dialog" role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}>
        <header className="user-ticket-dialog__header">
          <div><p>Đơn hàng #{String(order.payosOrderId || order._id).slice(-8)}</p><h2>Vé điện tử của bạn</h2></div>
          <button type="button" aria-label="Đóng" onClick={onClose}><X size={20} /></button>
        </header>
        <div className="user-ticket-dialog__body">
          {isLoading ? <p className="user-ticket-dialog__empty">Đang tải danh sách vé...</p> : tickets.length === 0 ? <p className="user-ticket-dialog__empty">Chưa có vé được phát hành cho đơn hàng này.</p> : tickets.map((ticket) => (
            <article className="user-ticket-card" key={ticket._id}>
              <div>
                <strong>{ticket.ticketTypeId?.ticketTypeName || "Vé FPTU Halloween"}</strong>
                <span>Ngày: {ticket.ticketTypeId?.ticketTypeDate ? `${ticket.ticketTypeId.ticketTypeDate} tháng 10, 2025` : "Chưa cập nhật"}</span>
                <span>Giờ: {ticket.ticketTypeId?.ticketTypeTime || "Chưa cập nhật"}</span>
                <span>Giá vé: {formatPrice(ticket.ticketTypeId?.ticketTypePrice)}</span>
                <span>Trạng thái: {ticketStatusLabels[ticket.ticketStatus] || "Chưa xác định"}</span>
              </div>
              {ticket.qrCodeData ? (
                <button type="button" className="user-ticket-qr-button" onClick={() => setSelectedQrCode(ticket.qrCodeData)}>
                  Xem mã QR
                </button>
              ) : <span>Chưa phát hành mã QR</span>}
            </article>
          ))}
        </div>
      </section>
      <QRModal isOpen={Boolean(selectedQrCode)} value={selectedQrCode} onClose={() => setSelectedQrCode(null)} />
    </div>
  );
};

export default UserListTicket;
