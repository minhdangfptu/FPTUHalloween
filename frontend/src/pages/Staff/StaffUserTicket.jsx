/* Hallmark · macrostructure: Operations Desk · tone: editorial administration · anchor hue: FPT red */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Eye,
  Search,
  Ticket,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import ticketAPI from "../../apis/ticketAPI";
import ManageSidebar from "../../components/ManageSidebar";
import { translateError } from "../../utils/translateResponse";
import { useLocation, useNavigate } from "react-router-dom";
import "./StaffUserTicket.scss";

const PAGE_SIZE = 8;
const EMPTY_PAGINATION = {
  page: 1,
  pageSize: PAGE_SIZE,
  total: 0,
  totalPages: 1,
};
const EMPTY_SUMMARY = { sold: 0, checkedIn: 0, remaining: 0 };
const STATUS_LABELS = {
  Pending: "Chờ sử dụng",
  Checked: "Đã sử dụng",
  Cancelled: "Đã hủy",
};

const payloadOf = (response) => response?.data?.data || {};
const formatDate = (value) =>
  value ? new Date(value).toLocaleString("vi-VN") : "—";
const getName = (ticket) =>
  ticket?.userId?.fullName || ticket?.userId?.email || "Chưa cập nhật";

const StatusBadge = ({ status }) => (
  <span
    className={`user-ticket-status user-ticket-status--${String(status || "pending").toLowerCase()}`}
  >
    <i /> {STATUS_LABELS[status] || status || "Không rõ"}
  </span>
);

const StaffUserTicket = () => {
  const [tickets, setTickets] = useState([]);
  const [pagination, setPagination] = useState(EMPTY_PAGINATION);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");
  const [summary, setSummary] = useState(EMPTY_SUMMARY);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const role = location.pathname.startsWith("/admin/") ? "admin" : "staff";

  const loadTickets = useCallback(async () => {
    setLoading(true);
    try {
      const response = await ticketAPI.getUserTickets({
        page,
        pageSize: PAGE_SIZE,
        status,
        date,
      });
      const data = payloadOf(response);
      setTickets(data.tickets || []);
      setPagination(data.pagination || { ...EMPTY_PAGINATION, page });
      setSummary(data.summary || EMPTY_SUMMARY);
    } catch (error) {
      toast.error(translateError(error));
    } finally {
      setLoading(false);
    }
  }, [date, page, status]);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const visibleTickets = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return tickets;
    return tickets.filter((ticket) =>
      [
        ticket._id,
        ticket.qrCodeData,
        getName(ticket),
        ticket.userId?.email,
        ticket.ticketTypeId?.ticketTypeName,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [tickets, search]);

  const openDetail = async (ticket) => {
    setSelectedTicket(ticket);
    try {
      const response = await ticketAPI.getUserTicketById(ticket._id);
      setSelectedTicket(payloadOf(response));
    } catch (error) {
      toast.error(translateError(error));
    }
  };

  return (
    <div className="staff-manage-layout staff-user-ticket-page">
      <ManageSidebar role={role} activeItem="purchased-tickets" />
      <main className="user-ticket-main">
        <header className="user-ticket-header">
          <div>
            <p className="user-ticket-eyebrow">
              <Ticket size={16} /> Phát hành & kiểm soát
            </p>
            <h1>Danh sách vé đã mua</h1>
            <p>
              Tra cứu người sở hữu, loại vé và trạng thái sử dụng trong một bảng
              điều hành.
            </p>
          </div>
          <div className="user-ticket-header-actions">
            <label className="user-ticket-date-filter">
              <CalendarDays size={17} />
              <span>Ngày vé</span>
              <select
                value={date}
                onChange={(event) => {
                  setDate(event.target.value);
                  setPage(1);
                }}
                aria-label="Lọc theo ngày vé"
              >
                <option value="">Tất cả ngày</option>
                <option value="27">Ngày 27/10</option>
                <option value="28">Ngày 28/10</option>
                <option value="29">Ngày 29/10</option>
              </select>
            </label>
            <label className="user-ticket-search">
              <Search size={17} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Tìm mã vé, người mua..."
              />
            </label>
            <button
              className="user-ticket-checkin-button"
              type="button"
              onClick={() =>
                navigate(
                  role === "admin" ? "/admin/check-in" : "/staff/check-in",
                )
              }
            >
              <Ticket size={16} /> Check-in vé <ArrowRight size={16} />
            </button>
          </div>
        </header>

        <section className="user-ticket-summary">
          <div>
            <span>Tổng số vé đã bán</span>
            <strong>{summary.sold}</strong>
          </div>
          <div>
            <span>Tổng số vé đã check-in</span>
            <strong>{summary.checkedIn}</strong>
          </div>
          <div>
            <span>Số vé còn lại</span>
            <strong>{summary.remaining}</strong>
          </div>
        </section>

        <section className="staff-user-ticket-card">
          <div className="user-ticket-toolbar">
            <div>
              <h2>Vé người dùng</h2>
              <span>{pagination.total} vé được ghi nhận</span>
            </div>
            <select
              value={status}
              onChange={(event) => {
                setStatus(event.target.value);
                setPage(1);
              }}
              aria-label="Lọc trạng thái vé"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="Pending">Chờ sử dụng</option>
              <option value="Checked">Đã sử dụng</option>
              <option value="Cancelled">Đã hủy</option>
            </select>
          </div>
          <div className="user-ticket-table-wrap">
            <table className="user-ticket-table">
              <thead>
                <tr>
                  <th>Người sở hữu</th>
                  <th>Loại vé</th>
                  <th>Trạng thái</th>
                  <th>Ngày phát hành</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="user-ticket-empty">
                      Đang tải danh sách vé...
                    </td>
                  </tr>
                ) : visibleTickets.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="user-ticket-empty">
                      Không tìm thấy vé phù hợp.
                    </td>
                  </tr>
                ) : (
                  visibleTickets.map((ticket) => (
                    <tr key={ticket._id}>
                      <td>
                        <strong>{getName(ticket)}</strong>
                        <small>{ticket.userId?.email || "Chưa có email"}</small>
                      </td>
                      <td>
                        {ticket.ticketTypeId?.ticketTypeName ||
                          "Loại vé không xác định"}
                      </td>
                      <td>
                        <StatusBadge status={ticket.ticketStatus} />
                      </td>
                      <td>
                        <span className="user-ticket-date">
                          <CalendarDays size={15} />
                          {formatDate(ticket.createdAt)}
                        </span>
                      </td>
                      <td className="user-ticket-action">
                        <button
                          type="button"
                          onClick={() => openDetail(ticket)}
                        >
                          <Eye size={16} /> Xem
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <footer className="user-ticket-pagination">
            <span>
              Trang {pagination.page || page} /{" "}
              {Math.max(1, pagination.totalPages || 1)}
            </span>
            <div>
              <button
                type="button"
                disabled={loading || page <= 1}
                onClick={() => setPage((value) => value - 1)}
                aria-label="Trang trước"
              >
                <ChevronLeft size={17} />
              </button>
              <button
                type="button"
                disabled={loading || page >= (pagination.totalPages || 1)}
                onClick={() => setPage((value) => value + 1)}
                aria-label="Trang sau"
              >
                <ChevronRight size={17} />
              </button>
            </div>
          </footer>
        </section>
      </main>

      {selectedTicket && (
        <div
          className="user-ticket-overlay"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedTicket(null);
          }}
        >
          <aside className="user-ticket-drawer">
            <button
              className="user-ticket-drawer__close"
              type="button"
              onClick={() => setSelectedTicket(null)}
              aria-label="Đóng chi tiết"
            >
              <X size={20} />
            </button>
            <p className="user-ticket-eyebrow">
              <Ticket size={16} /> Chi tiết vé
            </p>
            <h2>
              {selectedTicket.ticketTypeId?.ticketTypeName || "Vé sự kiện"}
            </h2>
            <StatusBadge status={selectedTicket.ticketStatus} />
            <dl>
              <dt>Mã vé</dt>
              <dd>{selectedTicket.qrCodeData || selectedTicket._id}</dd>
              <dt>Người sở hữu</dt>
              <dd>
                {getName(selectedTicket)}
                <small>{selectedTicket.userId?.email}</small>
              </dd>
              <dt>Đơn hàng</dt>
              <dd>
                {selectedTicket.orderId?._id || selectedTicket.orderId || "—"}
              </dd>
              <dt>Phát hành lúc</dt>
              <dd>{formatDate(selectedTicket.createdAt)}</dd>
              <dt>Check-in lúc</dt>
              <dd>{formatDate(selectedTicket.checkedInAt)}</dd>
            </dl>
          </aside>
        </div>
      )}
    </div>
  );
};

export default StaffUserTicket;
