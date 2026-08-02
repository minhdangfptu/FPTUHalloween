import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { SkeletonRows } from "./LoadingSkeletons";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import axiosClient from "../apis/axiosClient";
import QRModal from "./QRModal";
import "./UserListTicket.scss";

const formatPrice = (value) => `${new Intl.NumberFormat("vi-VN").format(Number(value || 0))} VND`;

const UserListTicket = ({ order, onClose }) => {
  const { t } = useTranslation();
  const componentText = (key, options) => t(`components.${key}`, options);
  const ticketStatusLabels = { Pending: t("ticket.pending"), Processing: t("ticket.processing"), Checked: t("ticket.checked"), Cancelled: t("ticket.cancelledStatus") };
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedQrCode, setSelectedQrCode] = useState(null);

  useEffect(() => {
    let isMounted = true;
    axiosClient.get(`/orders/me/${order._id}`)
      .then((response) => {
        if (isMounted) setTickets(response.data?.data?.tickets || []);
      })
      .catch(() => toast.error(componentText("loadTicketsError")))
      .finally(() => { if (isMounted) setIsLoading(false); });
    return () => { isMounted = false; };
  }, [order._id]);

  return (
    <div className="user-ticket-modal" role="presentation" onMouseDown={onClose}>
      <section className="user-ticket-dialog" role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}>
        <header className="user-ticket-dialog__header">
          <div><p>{componentText("ticketOrder", { code: String(order.payosOrderId || order._id).slice(-8) })}</p><h2>{componentText("eTickets")}</h2></div>
          <button type="button" aria-label={componentText("close")} onClick={onClose}><X size={20} /></button>
        </header>
        <div className="user-ticket-dialog__body">
          {isLoading ? <SkeletonRows rows={3} columns={2} /> : tickets.length === 0 ? <p className="user-ticket-dialog__empty">{componentText("noIssuedTickets")}</p> : tickets.map((ticket) => (
            <article className="user-ticket-card" key={ticket._id}>
              <div>
                <strong>{ticket.ticketTypeId?.ticketTypeName || componentText("ticketFallback")}</strong>
                <span>{t("ticket.day")}: {ticket.ticketTypeId?.ticketTypeDate ? t("ticket.dateTime", { date: ticket.ticketTypeId.ticketTypeDate }) : componentText("notUpdated")}</span>
                <span>{t("ticket.time")}: {ticket.ticketTypeId?.ticketTypeTime || componentText("notUpdated")}</span>
                <span>{componentText("ticketPrice", { price: formatPrice(ticket.ticketTypeId?.ticketTypePrice) })}</span>
                <span>{componentText("ticketStatus", { status: ticketStatusLabels[ticket.ticketStatus] || componentText("unknown") })}</span>
              </div>
              {ticket.qrCodeData ? (
                <button type="button" className="user-ticket-qr-button" onClick={() => setSelectedQrCode(ticket.qrCodeData)}>
                  {componentText("viewQr")}
                </button>
              ) : <span>{componentText("qrPending")}</span>}
            </article>
          ))}
        </div>
      </section>
      <QRModal isOpen={Boolean(selectedQrCode)} value={selectedQrCode} onClose={() => setSelectedQrCode(null)} />
    </div>
  );
};

export default UserListTicket;
