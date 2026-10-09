/* Hallmark · macrostructure: Operations Desk · tone: editorial administration · anchor hue: FPT red */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Eye,
  QrCode,
  Search,
  Ticket,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { SkeletonRows } from "../../components/LoadingSkeletons";
import ticketAPI from "../../apis/ticketAPI";
import ticketTypeAPI from "../../apis/ticketTypeAPI";
import ManageSidebar from "../../components/ManageSidebar";
import QRModal from "../../components/QRModal";
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
const payloadOf = (response) => response?.data?.data || {};
const StatusBadge = ({ status }) => {
  const { t } = useTranslation();
  return <span
    className={`user-ticket-status user-ticket-status--${String(status || "pending").toLowerCase()}`}
  >
    <i /> {t(`management.userTickets.status${status || "Unknown"}`, { defaultValue: status || t("management.common.unknown") })}
  </span>
};

const StaffUserTicket = () => {
  const { t, i18n } = useTranslation();
  const userTicketText = (key, options) => t(`management.userTickets.${key}`, options);
  const formatDate = (value) => value ? new Date(value).toLocaleString(i18n.language === "en" ? "en-US" : "vi-VN") : "—";
  const getName = (ticket) => ticket?.buyerName || ticket?.orderId?.buyerInfo?.fullName || ticket?.userId?.fullName || ticket?.userId?.email || t("management.common.notUpdated");
  const [tickets, setTickets] = useState([]);
  const [pagination, setPagination] = useState(EMPTY_PAGINATION);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");
  const [summary, setSummary] = useState(EMPTY_SUMMARY);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [selectedQrCode, setSelectedQrCode] = useState(null);
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [manualForm, setManualForm] = useState({ buyerName: "", buyerEmail: "", buyerPhone: "", ticketTypeId: "" });
  const [manualLoading, setManualLoading] = useState(false);
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
  }, [tickets, search, t]);

  const openDetail = async (ticket) => {
    setSelectedTicket(ticket);
    try {
      const response = await ticketAPI.getUserTicketById(ticket._id);
      setSelectedTicket(payloadOf(response));
    } catch (error) {
      toast.error(translateError(error));
    }
  };

  const openManualForm = async () => {
    try {
      const data = await ticketTypeAPI.getList({ pageSize: 100 });
      const availableTypes = (data.ticketTypes || []).filter((type) => type.ticketTypeStatus === "active" && Number(type.availableQuantity) > 0);
      setTicketTypes(availableTypes);
      setManualForm((current) => ({ ...current, ticketTypeId: current.ticketTypeId || availableTypes[0]?._id || "" }));
      setIsManualOpen(true);
    } catch (error) {
      toast.error(translateError(error));
    }
  };

  const submitManualTicket = async (event) => {
    event.preventDefault();
    setManualLoading(true);
    try {
      const response = await ticketAPI.createManual(manualForm);
      const createdTicket = payloadOf(response);
      setIsManualOpen(false);
      setManualForm({ buyerName: "", buyerEmail: "", buyerPhone: "", ticketTypeId: "" });
      setSelectedQrCode(createdTicket.qrCodeData);
      await loadTickets();
      toast.success(userTicketText("manualSuccess"));
    } catch (error) {
      toast.error(translateError(error));
    } finally {
      setManualLoading(false);
    }
  };

  return (
    <div className="staff-manage-layout staff-user-ticket-page">
      <ManageSidebar role={role} activeItem="purchased-tickets" />
      <main className="user-ticket-main">
        <header className="user-ticket-header">
          <div>
            <p className="user-ticket-eyebrow">
              <Ticket size={16} /> {userTicketText("kicker")}
            </p>
            <h1>{userTicketText("title")}</h1>
            <p>{userTicketText("intro")}</p>
          </div>
          <div className="user-ticket-header-actions">
            <label className="user-ticket-date-filter">
              <CalendarDays size={17} />
              <span>{userTicketText("ticketDate")}</span>
              <select
                value={date}
                onChange={(event) => {
                  setDate(event.target.value);
                  setPage(1);
                }}
                aria-label={userTicketText("filterDate")}
              >
                <option value="">{userTicketText("allDates")}</option>
                {[27, 28, 29].map((day) => <option value={day} key={day}>{userTicketText("dayInOctober", { day })}</option>)}
              </select>
            </label>
            <label className="user-ticket-search">
              <Search size={17} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={userTicketText("searchPlaceholder")}
              />
            </label>
            <div className="user-ticket-action-buttons">
              <button
                className="user-ticket-checkin-button"
                type="button"
                onClick={() =>
                  navigate(
                    role === "admin" ? "/admin/check-in" : "/staff/check-in",
                  )
                }
              >
                <Ticket size={16} /> {userTicketText("checkIn") } <ArrowRight size={16} />
              </button>
              {role === "admin" && (
                <button className="user-ticket-manual-button" type="button" onClick={openManualForm}>
                  <Ticket size={16} /> {userTicketText("manualCreate")}
                </button>
              )}
            </div>
          </div>
        </header>

        <section className="user-ticket-summary">
          <div>
            <span>{userTicketText("soldTotal")}</span>
            <strong>{summary.sold}</strong>
          </div>
          <div>
            <span>{userTicketText("checkedTotal")}</span>
            <strong>{summary.checkedIn}</strong>
          </div>
          <div>
            <span>{userTicketText("remainingTotal")}</span>
            <strong>{summary.remaining}</strong>
          </div>
        </section>

        <section className="staff-user-ticket-card">
          <div className="user-ticket-toolbar">
            <div>
              <h2>{userTicketText("userTickets")}</h2>
              <span>{userTicketText("recorded", { count: pagination.total })}</span>
            </div>
            <select
              value={status}
              onChange={(event) => {
                setStatus(event.target.value);
                setPage(1);
              }}
              aria-label={userTicketText("filterStatus")}
            >
              <option value="">{userTicketText("allStatuses")}</option>
              <option value="Pending">{userTicketText("statusPending")}</option>
              <option value="Checked">{userTicketText("statusChecked")}</option>
              <option value="Cancelled">{userTicketText("statusCancelled")}</option>
            </select>
          </div>
          <div className="user-ticket-table-wrap">
            <table className="user-ticket-table">
              <thead>
                <tr>
                  <th>{userTicketText("owner")}</th>
                  <th>{userTicketText("ticketType")}</th>
                  <th>{t("management.common.status")}</th>
                  <th>{userTicketText("issuedDate")}</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5"><SkeletonRows rows={5} columns={5} /></td></tr>
                ) : visibleTickets.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="user-ticket-empty">
                      {userTicketText("empty")}
                    </td>
                  </tr>
                ) : (
                  visibleTickets.map((ticket) => (
                    <tr key={ticket._id}>
                      <td>
                        <strong>{getName(ticket)}</strong>
                        <small>{ticket.orderId?.buyerInfo ? (ticket.orderId.buyerInfo.email || userTicketText("manualBuyer")) : (ticket.userId?.email || userTicketText("noEmail"))}</small>
                      </td>
                      <td>
                        {ticket.ticketTypeId?.ticketTypeName ||
                          userTicketText("unknownType")}
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
                          <Eye size={16} /> {t("management.common.view")}
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
              {userTicketText("pageOf", { page: pagination.page || page, total: Math.max(1, pagination.totalPages || 1) })}
            </span>
            <div>
              <button
                type="button"
                disabled={loading || page <= 1}
                onClick={() => setPage((value) => value - 1)}
                aria-label={userTicketText("previousPage")}
              >
                <ChevronLeft size={17} />
              </button>
              <button
                type="button"
                disabled={loading || page >= (pagination.totalPages || 1)}
                onClick={() => setPage((value) => value + 1)}
                aria-label={userTicketText("nextPage")}
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
              aria-label={userTicketText("closeDetail")}
            >
              <X size={20} />
            </button>
            <p className="user-ticket-eyebrow">
              <Ticket size={16} /> {userTicketText("detailTitle")}
            </p>
            <h2>
              {selectedTicket.ticketTypeId?.ticketTypeName || userTicketText("eventTicket")}
            </h2>
            <StatusBadge status={selectedTicket.ticketStatus} />
            <dl>
              <dt>{userTicketText("ticketCode")}</dt>
                <dd>
                {selectedTicket.qrCodeData || selectedTicket._id}
                {selectedTicket.qrCodeData && (
                  <button
                    type="button"
                    className="user-ticket-qr-button"
                    onClick={() => setSelectedQrCode(selectedTicket.qrCodeData)}
                  >
                    <QrCode size={16} /> {userTicketText("viewQr")}
                  </button>
                )}
              </dd>
              <dt>{userTicketText("owner")}</dt>
              <dd>
                {getName(selectedTicket)}
                <small>{selectedTicket.orderId?.buyerInfo ? (selectedTicket.orderId.buyerInfo.email || userTicketText("manualBuyer")) : selectedTicket.userId?.email}</small>
              </dd>
              <dt>{userTicketText("order")}</dt>
              <dd>
                {selectedTicket.orderId?._id || selectedTicket.orderId || "—"}
              </dd>
              <dt>{userTicketText("issuedAt")}</dt>
              <dd>{formatDate(selectedTicket.createdAt)}</dd>
              <dt>{userTicketText("checkedAt")}</dt>
              <dd>{formatDate(selectedTicket.checkedInAt)}</dd>
            </dl>
          </aside>
        </div>
      )}
      <QRModal
        isOpen={Boolean(selectedQrCode)}
        value={selectedQrCode}
        onClose={() => setSelectedQrCode(null)}
        isManagement
      />
      {isManualOpen && (
        <div className="user-ticket-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setIsManualOpen(false)}>
          <aside className="user-ticket-drawer user-ticket-manual-drawer">
            <button className="user-ticket-drawer__close" type="button" onClick={() => setIsManualOpen(false)} aria-label={userTicketText("closeDetail")}><X size={20} /></button>
            <p className="user-ticket-eyebrow"><Ticket size={16} /> {userTicketText("manualCreate")}</p>
            <h2>{userTicketText("manualTitle")}</h2>
            <form onSubmit={submitManualTicket} className="user-ticket-manual-form">
              <label>{userTicketText("buyerName")}
                <input required value={manualForm.buyerName} onChange={(event) => setManualForm({ ...manualForm, buyerName: event.target.value })} placeholder={userTicketText("buyerNamePlaceholder")} />
              </label>
              <label>{userTicketText("buyerEmail")}
                <input required type="email" value={manualForm.buyerEmail} onChange={(event) => setManualForm({ ...manualForm, buyerEmail: event.target.value })} placeholder={userTicketText("buyerEmailPlaceholder")} />
              </label>
              <label>{userTicketText("buyerPhone")}
                <input required type="tel" value={manualForm.buyerPhone} onChange={(event) => setManualForm({ ...manualForm, buyerPhone: event.target.value })} placeholder={userTicketText("buyerPhonePlaceholder")} />
              </label>
              <label>{userTicketText("ticketType")}
                <select required value={manualForm.ticketTypeId} onChange={(event) => setManualForm({ ...manualForm, ticketTypeId: event.target.value })}>
                  <option value="">{userTicketText("selectTicketType")}</option>
                  {ticketTypes.map((type) => <option key={type._id} value={type._id}>{type.ticketTypeName} · {type.availableQuantity} {userTicketText("availableRemaining")}</option>)}
                </select>
              </label>
              <button type="submit" disabled={manualLoading || !manualForm.ticketTypeId}>{manualLoading ? userTicketText("creating") : userTicketText("createAndQr")}</button>
            </form>
          </aside>
        </div>
      )}
    </div>
  );
};

export default StaffUserTicket;
