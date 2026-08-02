/* Hallmark · page: ticket wallet · audience: signed-in users · tone: clear event desk */
import React, { useEffect, useMemo, useState } from "react";
import { CalendarDays, CircleAlert, Clock3, QrCode, Ticket, UserRound } from "lucide-react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { SkeletonCards } from "../../components/LoadingSkeletons";
import axiosClient from "../../apis/axiosClient";
import QRModal from "../../components/QRModal";
import "./MyTicket.scss";

const MyTicket = () => {
  const { t, i18n } = useTranslation();
  const ticketText = (key, options) => t(`ticket.${key}`, options);
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
      .catch(() => toast.error(ticketText("loadError")))
      .finally(() => mounted && setIsLoading(false));
    return () => { mounted = false; };
  }, []);

  const filteredTickets = useMemo(() => filter === "all"
    ? tickets
    : tickets.filter((ticket) => String(ticket.ticketStatus || "").toLowerCase() === filter), [tickets, filter]);

  const status = {
    Pending: [ticketText("pending"), "pending"],
    Processing: [ticketText("processing"), "processing"],
    Checked: [ticketText("checked"), "checked"],
    Cancelled: [ticketText("cancelledStatus"), "cancelled"],
  };
  const formatDate = (value) => value ? new Date(value).toLocaleDateString(i18n.language.startsWith("en") ? "en-US" : "vi-VN") : t("components.notUpdated");

  return (
    <main className="my-ticket-page">
      <section className="my-ticket-hero">
        <div>
          <p className="my-ticket-kicker"><Ticket size={17} /> {t("nav.yourTickets")}</p>
          <h1>{ticketText("wallet")}</h1>
          <p>{ticketText("qrInstruction")}</p>
        </div>
        <div className="my-ticket-count"><strong>{tickets.length}</strong><span>{ticketText("issued")}</span></div>
      </section>
      <section className="my-ticket-toolbar" aria-label={ticketText("filter")}>
        <div><strong>{ticketText("ticketList")}</strong><span>{filteredTickets.length} {ticketText("displayed")}</span></div>
        <select value={filter} onChange={(event) => setFilter(event.target.value)} aria-label={ticketText("filterStatus")}>
          <option value="all">{ticketText("allStatuses")}</option>
          <option value="pending">{ticketText("pending")}</option>
          <option value="checked">{ticketText("checked")}</option>
          <option value="cancelled">{ticketText("cancelledStatus")}</option>
        </select>
      </section>
      {isLoading ? <SkeletonCards count={3} /> : filteredTickets.length === 0 ? (
        <div className="my-ticket-state"><CircleAlert size={25} /><strong>{ticketText("noMatching")}</strong><span>{ticketText("purchasedHere")}</span></div>
      ) : (
        <section className="my-ticket-list">
          {filteredTickets.map((ticket) => {
            const ticketType = ticket.ticketTypeId || {};
            const [label, tone] = status[ticket.ticketStatus] || [t("profilePage.unknown"), "pending"];
            return <article className="my-ticket-card" key={ticket._id || ticket.qrCodeData}>
              <div className="my-ticket-card__mark"><Ticket size={22} /></div>
              <div className="my-ticket-card__body">
                <div className="my-ticket-card__top"><h2>{ticketType.ticketTypeName || ticket.ticketName || t("components.ticketFallback")}</h2><span className={`my-ticket-status my-ticket-status--${tone}`}>{label}</span></div>
                <div className="my-ticket-meta"><span><CalendarDays size={15} /> {ticketType.ticketTypeDate || formatDate(ticket.eventDate)}</span><span><Clock3 size={15} /> {ticketType.ticketTypeTime || t("components.notUpdated")}</span><span><UserRound size={15} /> {ticket.ownerName || t("nav.yourTickets")}</span></div>
              </div>
              {ticket.qrCodeData ? <button type="button" className="my-ticket-qr" onClick={() => setSelectedQr(ticket.qrCodeData)}><QrCode size={17} /> {ticketText("viewQr")}</button> : <span className="my-ticket-no-qr">{ticketText("qrNotIssued")}</span>}
            </article>;
          })}
        </section>
      )}
      <QRModal isOpen={Boolean(selectedQr)} value={selectedQr} onClose={() => setSelectedQr(null)} />
    </main>
  );
};

export default MyTicket;
