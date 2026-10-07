/* Hallmark · macrostructure: Operations Desk · tone: editorial administration · anchor hue: FPT red */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Eye,
  FileText,
  PackageCheck,
  RefreshCw,
  Search,
  ShoppingBag,
  UserRound,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { SkeletonRows } from "../../components/LoadingSkeletons";
import orderAPI from "../../apis/orderAPI";
import ManageSidebar from "../../components/ManageSidebar";
import QRModal from "../../components/QRModal";
import { translateError } from "../../utils/translateResponse";
import "./AdminOrderList.scss";

const PAGE_SIZE = 8;
const EMPTY_PAGINATION = {
  page: 1,
  pageSize: PAGE_SIZE,
  total: 0,
  totalPages: 1,
};

const getOrderPayload = (response) =>
  response?.data?.data || response?.data || {};
const getItemCount = (order) => {
  if (order?.itemCount != null) return Number(order.itemCount) || 0;
  return (order?.items || []).reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0,
  );
};

const AdminOrderList = () => {
  const { t, i18n } = useTranslation();
  const orderText = (key, options) => t(`management.orders.${key}`, options);
  const statusLabel = (status) => t(`management.orders.status${status || "Unknown"}`, { defaultValue: status || orderText("statusUnknown") });
  const ticketStatusLabel = (status) => t(`management.orders.ticketStatus${status || "Pending"}`, { defaultValue: status || orderText("ticketStatusPending") });
  const getCustomerName = (order) => order?.userId?.fullName || order?.userId?.email || orderText("guest");
  const formatMoney = (amount) => new Intl.NumberFormat(i18n.language === "en" ? "en-US" : "vi-VN", {
    style: "currency", currency: "VND",
  }).format(Number(amount) || 0);
  const formatDate = (value) => value ? new Date(value).toLocaleString(i18n.language === "en" ? "en-US" : "vi-VN") : "—";
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState(EMPTY_PAGINATION);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [selectedQrCode, setSelectedQrCode] = useState(null);

  const loadOrders = useCallback(
    async (page = 1) => {
      const loadingId = "admin-orders-loading";
      toast.loading(t("management.orders.loadingList"), { id: loadingId });
      setIsLoading(true);
      try {
        const response = await orderAPI.getAdminOrders({
          page,
          pageSize: PAGE_SIZE,
          status,
        });
        const payload = getOrderPayload(response);
        setOrders(payload.orders || []);
        setPagination(payload.pagination || { ...EMPTY_PAGINATION, page });
        toast.dismiss(loadingId);
      } catch (error) {
        toast.error(translateError(error), { id: loadingId });
      } finally {
        setIsLoading(false);
      }
    },
    [status, t],
  );

  useEffect(() => {
    loadOrders(1);
  }, [loadOrders]);

  const visibleOrders = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return orders;
    return orders.filter((order) => {
      const haystack = [
        order._id,
        order.payosOrderId,
        getCustomerName(order),
        order.userId?.phone,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [orders, search]);

  const openDetail = async (order) => {
    setSelectedOrder({ ...order, tickets: [] });
    setIsDetailLoading(true);
    const loadingId = "admin-order-detail-loading";
    toast.loading(orderText("loadingDetail"), { id: loadingId });
    try {
      const response = await orderAPI.getAdminOrderById(order._id);
      const payload = getOrderPayload(response);
      payload.tickets = (payload.tickets || []).map((ticket) => {
        const ticketType = ticket.ticketTypeId || {};
        const date = ticketType.ticketTypeDate ?? ticket.ticketTypeDate;
        const time = ticketType.ticketTypeTime || ticket.ticketTypeTime;
        const suffix = [
          date != null ? orderText("day", { day: date }) : null,
          time ? orderText("hour", { time }) : null,
        ]
          .filter(Boolean)
          .join(" · ");
        return {
          ...ticket,
          ticketTypeId: {
            ...ticketType,
            ticketTypeName: [
              ticketType.ticketTypeName || ticket.ticketTypeName || orderText("ticketType"),
              suffix,
            ]
              .filter(Boolean)
              .join(" · "),
          },
        };
      });
      setSelectedOrder(payload);
      toast.success(orderText("detailLoaded"), { id: loadingId });
    } catch (error) {
      toast.error(translateError(error), { id: loadingId });
    } finally {
      setIsDetailLoading(false);
    }
  };

  const totalValue = orders.reduce(
    (sum, order) => sum + Number(order.totalAmount || 0),
    0,
  );
  const paidCount = orders.filter(
    (order) => order.orderStatus === "Paid",
  ).length;

  return (
    <div className="staff-manage-layout admin-order-page">
      <ManageSidebar role="admin" activeItem="orders" />
      <main className="admin-order-list">
        <header className="admin-order-list__header">
          <div>
            <p className="admin-order-list__kicker">
              <ShoppingBag size={16} /> {orderText("kicker")}
            </p>
            <h1>{orderText("title")}</h1>
            <p>{orderText("intro")}</p>
          </div>
          <button
            className="admin-order-list__refresh"
            type="button"
            onClick={() => loadOrders(pagination.page)}
            disabled={isLoading}
          >
            <RefreshCw size={16} /> {t("management.common.refresh")}
          </button>
        </header>

        <section className="admin-order-stats" aria-label={orderText("overview")}>
          <article>
            <FileText size={18} />
            <span>
              <small>{orderText("pageOrders")}</small>
              <strong>{orders.length}</strong>
            </span>
          </article>
          <article>
            <CircleDollarSign size={18} />
            <span>
              <small>{orderText("pageValue")}</small>
              <strong>{formatMoney(totalValue)}</strong>
            </span>
          </article>
          <article>
            <PackageCheck size={18} />
            <span>
              <small>{orderText("paid")}</small>
              <strong>{paidCount}</strong>
            </span>
          </article>
        </section>

        <section className="admin-order-card" aria-label={orderText("list")}>
          <div className="admin-order-card__toolbar">
            <div>
              <strong>{pagination.total}</strong>
              <span>{orderText("orders")}</span>
            </div>
            <div className="admin-order-filters">
              <label className="admin-order-search">
                <Search size={15} />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={orderText("searchPlaceholder")}
                  aria-label={orderText("search")}
                />
              </label>
              <label className="admin-order-select">
                <span>{t("management.common.status")}</span>
                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                >
                  <option value="">{t("management.common.all")}</option>
                  <option value="Pending">{statusLabel("Pending")}</option>
                  <option value="Processing">{statusLabel("Processing")}</option>
                  <option value="Paid">{statusLabel("Paid")}</option>
                  <option value="Cancelled">{statusLabel("Cancelled")}</option>
                </select>
              </label>
            </div>
          </div>

          {isLoading ? (
            <SkeletonRows rows={7} columns={7} />
          ) : visibleOrders.length === 0 ? (
            <div className="admin-order-empty">
              {orderText("empty")}
            </div>
          ) : (
            <div className="admin-order-table-wrap">
              <table className="admin-order-table">
                <thead>
                  <tr>
                    <th>{orderText("orderCode")}</th>
                    <th>{orderText("buyer")}</th>
                    <th>{orderText("createdAt")}</th>
                    <th>{orderText("ticketQuantity")}</th>
                    <th>{orderText("value")}</th>
                    <th>{t("management.common.status")}</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {visibleOrders.map((order) => (
                    <tr key={order._id}>
                      <td>
                        <strong className="admin-order-code">
                          #{String(order.payosOrderId || order._id).slice(-10)}
                        </strong>
                        <small>{order._id}</small>
                      </td>
                      <td>
                        <div className="admin-order-person">
                          <UserRound size={17} />
                          <span>
                            <strong>{getCustomerName(order)}</strong>
                            <small>
                              {order.userId?.email || orderText("noEmail")}
                            </small>
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className="admin-order-date">
                          <CalendarDays size={14} />
                          {formatDate(order.createdAt)}
                        </span>
                      </td>
                      <td>{getItemCount(order)}</td>
                      <td>
                        <strong>{formatMoney(order.totalAmount)}</strong>
                      </td>
                      <td>
                        <span
                          className={`admin-order-status is-${String(order.orderStatus || "pending").toLowerCase()}`}
                        >
                          {statusLabel(order.orderStatus)}
                        </span>
                      </td>
                      <td>
                        <button
                          className="admin-order-view"
                          type="button"
                          onClick={() => openDetail(order)}
                        >
                          <Eye size={15} /> {t("management.common.details")}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {!isLoading && pagination.totalPages > 1 && (
            <div className="admin-order-pagination">
              <button
                type="button"
                disabled={pagination.page <= 1}
                onClick={() => loadOrders(pagination.page - 1)}
              >
                <ChevronLeft size={15} /> {t("management.common.previous")}
              </button>
              <span>
                {orderText("pageOf", { page: pagination.page, total: pagination.totalPages })}
              </span>
              <button
                type="button"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => loadOrders(pagination.page + 1)}
              >
                {t("management.common.next")} <ChevronRight size={15} />
              </button>
            </div>
          )}
        </section>
      </main>

      {selectedOrder && (
        <div
          className="admin-order-modal"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedOrder(null);
          }}
        >
          <section
            className="admin-order-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-detail-title"
          >
            <header>
              <div>
                <p>{orderText("detailTitle")}</p>
                <h2 style={{ color: "#ce0000" }} id="order-detail-title">
                  #
                  {String(
                    selectedOrder.payosOrderId || selectedOrder._id,
                  ).slice(-10)}
                </h2>
              </div>
              <button
                type="button"
                aria-label={orderText("closeDetail")}
                onClick={() => setSelectedOrder(null)}
              >
                <X size={19} />
              </button>
            </header>
            {isDetailLoading ? (
              <div className="admin-order-dialog__loading">
                <Clock3 size={20} /> {t("management.common.loading")}
              </div>
            ) : (
              <>
                <div className="admin-order-dialog__meta">
                  <span>
                    <UserRound size={15} /> {getCustomerName(selectedOrder)}
                  </span>
                  <span>
                    <CalendarDays size={15} />{" "}
                    {formatDate(selectedOrder.createdAt)}
                  </span>
                  <span
                    className={`admin-order-status is-${String(selectedOrder.orderStatus || "pending").toLowerCase()}`}
                  >
                    {statusLabel(selectedOrder.orderStatus)}
                  </span>
                </div>
                <section className="admin-order-dialog__recipient">
                  <h3>{orderText("recipientInfo")}</h3>
                  <div className="admin-order-dialog__recipient-grid">
                    <div>
                      <small>{orderText("recipientName")}</small>
                      <strong>{selectedOrder.buyerInfo?.fullName || orderText("notUpdated")}</strong>
                    </div>
                    <div>
                      <small>{orderText("recipientEmail")}</small>
                      <strong>{selectedOrder.buyerInfo?.email || orderText("notUpdated")}</strong>
                    </div>
                    <div>
                      <small>{orderText("recipientPhone")}</small>
                      <strong>{selectedOrder.buyerInfo?.phone || orderText("notUpdated")}</strong>
                    </div>
                  </div>
                </section>
                <div className="admin-order-dialog__summary">
                  <div>
                    <small>{orderText("paymentTotal")}</small>
                    <strong>{formatMoney(selectedOrder.totalAmount)}</strong>
                  </div>
                  <div>
                    <small>{orderText("method")}</small>
                    <strong>
                      {selectedOrder.paymentMethod === "PayOS" ? orderText("onlinePayment") : selectedOrder.paymentMethod || orderText("onlinePayment")}
                    </strong>
                  </div>
                </div>
                <h3>{orderText("orderTickets")}</h3>
                <div className="admin-order-dialog__tickets">
                  {(selectedOrder.tickets || []).length ? (
                    selectedOrder.tickets.map((ticket) => (
                      <div key={ticket._id}>
                        <span>
                          {ticket.ticketTypeId?.ticketTypeName || orderText("ticketType")}
                        </span>
                        <small>
                          {ticket.qrCodeData ? (
                            <button type="button" className="admin-order-qr-button" onClick={() => setSelectedQrCode(ticket.qrCodeData)}>
                              {orderText("viewQr")}
                            </button>
                          ) : orderText("qrPending")}
                        </small>
                        <b>
                          {ticketStatusLabel(ticket.ticketStatus)}
                        </b>
                      </div>
                    ))
                  ) : (
                    <p>{orderText("noIssuedTickets")}</p>
                  )}
                </div>
              </>
            )}
          </section>
        </div>
      )}
      <QRModal isOpen={Boolean(selectedQrCode)} value={selectedQrCode} onClose={() => setSelectedQrCode(null)} isManagement />
    </div>
  );
};

export default AdminOrderList;
