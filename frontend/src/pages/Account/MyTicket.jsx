/* Hallmark · page: ticket wallet · audience: signed-in users · tone: clear event desk */
import React, { useEffect, useMemo, useState } from "react";
import { CalendarDays, CircleAlert, Clock3, QrCode, Ticket, UserRound } from "lucide-react";
import toast from "react-hot-toast";
import axiosClient from "../../apis/axiosClient";
import QRModal from "../../components/QRModal";
import "./MyTicket.scss";

const MyTicket = () => {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedQr, setSelectedQr] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    let mounted = true;
    axiosClient.get("/tickets/me")
      .then(({ data }) => {
        if (mounted) setTickets(data?.data || []);
      })
      .catch(() => toast.error("Không thể tải danh sách vé của bạn."))
      .finally(() => mounted && setIsLoading(false));
    return () => { mounted = false; };
  }, []);

  const filteredTickets = useMemo(() => filter === "all"
    ? tickets
    : tickets.filter((ticket) => String(ticket.ticketStatus || "").toLowerCase() === filter), [tickets, filter]);

  const status = {
    Pending: ["Chờ sử dụng", "pending"],
    Processing: ["Đang xử lý", "processing"],
    Checked: ["Đã check-in", "checked"],
    Cancelled: ["Đã huỷ", "cancelled"],
  };
  const formatDate = (value) => value ? new Date(value).toLocaleDateString("vi-VN") : "Chưa cập nhật";

  return (
    <main className="my-ticket-page">
      <section className="my-ticket-hero">
        <div>
          <p className="my-ticket-kicker"><Ticket size={17} /> Vé của bạn</p>
          <h1>Ví vé điện tử</h1>
          <p>Giữ mã QR bên bạn để xuất trình khi đến sự kiện.</p>
        </div>
        <div className="my-ticket-count"><strong>{tickets.length}</strong><span>vé đã phát hành</span></div>
      </section>
      <section className="my-ticket-toolbar" aria-label="Bộ lọc vé">
        <div><strong>Danh sách vé</strong><span>{filteredTickets.length} vé đang hiển thị</span></div>
        <select value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="Lọc trạng thái vé">
          <option value="all">Tất cả trạng thái</option>
          <option value="pending">Chờ sử dụng</option>
          <option value="checked">Đã check-in</option>
          <option value="cancelled">Đã huỷ</option>
        </select>
      </section>
      {isLoading ? <div className="my-ticket-state">Đang tải vé của bạn...</div> : filteredTickets.length === 0 ? (
        <div className="my-ticket-state"><CircleAlert size={25} /><strong>Chưa có vé phù hợp</strong><span>Vé đã mua sẽ xuất hiện tại đây.</span></div>
      ) : (
        <section className="my-ticket-list">
          {filteredTickets.map((ticket) => {
            const ticketType = ticket.ticketTypeId || {};
            const [label, tone] = status[ticket.ticketStatus] || ["Chưa xác định", "pending"];
            return <article className="my-ticket-card" key={ticket._id || ticket.qrCodeData}>
              <div className="my-ticket-card__mark"><Ticket size={22} /></div>
              <div className="my-ticket-card__body">
                <div className="my-ticket-card__top"><h2>{ticketType.ticketTypeName || ticket.ticketName || "Vé FPTU Halloween"}</h2><span className={`my-ticket-status my-ticket-status--${tone}`}>{label}</span></div>
                <div className="my-ticket-meta"><span><CalendarDays size={15} /> {ticketType.ticketTypeDate || formatDate(ticket.eventDate)}</span><span><Clock3 size={15} /> {ticketType.ticketTypeTime || "Chưa cập nhật"}</span><span><UserRound size={15} /> {ticket.ownerName || "Vé của bạn"}</span></div>
              </div>
              {ticket.qrCodeData ? <button type="button" className="my-ticket-qr" onClick={() => setSelectedQr(ticket.qrCodeData)}><QrCode size={17} /> Xem mã QR</button> : <span className="my-ticket-no-qr">Mã QR chưa phát hành</span>}
            </article>;
          })}
        </section>
      )}
      <QRModal isOpen={Boolean(selectedQr)} value={selectedQr} onClose={() => setSelectedQr(null)} />
    </main>
  );
};

export default MyTicket;
