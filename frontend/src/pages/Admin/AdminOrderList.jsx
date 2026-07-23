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

const STATUS_LABELS = {
  Pending: "Chờ thanh toán",
  Processing: "Đang xử lý",
  Paid: "Đã thanh toán",
  Cancelled: "Đã hủy",
};

const TICKET_STATUS_LABELS = {
  Pending: "Đang chờ sử dụng",
  Checked: "Đã sử dụng",
  Cancelled: "Đã hủy",
};

const PAYMENT_METHOD_LABELS = {
  PayOS: "Thanh toán trực tuyến",
};

const getOrderPayload = (response) =>
  response?.data?.data || response?.data || {};
const getCustomerName = (order) =>
  order?.userId?.fullName || order?.userId?.email || "Khách vãng lai";
const formatMoney = (amount) =>
  `${new Intl.NumberFormat("vi-VN").format(Number(amount) || 0)} đ`;
const formatDate = (value) =>
  value ? new Date(value).toLocaleString("vi-VN") : "—";
const getItemCount = (order) =>
  (order?.items || []).reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0,
  );

const AdminOrderList = () => {
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
      toast.loading("Đang tải danh sách đơn hàng...", { id: loadingId });
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
    [status],
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
    toast.loading("Đang tải chi tiết đơn hàng...", { id: loadingId });
    try {
      const response = await orderAPI.getAdminOrderById(order._id);
      const payload = getOrderPayload(response);
      payload.tickets = (payload.tickets || []).map((ticket) => {
        const ticketType = ticket.ticketTypeId || {};
        const date = ticketType.ticketTypeDate ?? ticket.ticketTypeDate;
        const time = ticketType.ticketTypeTime || ticket.ticketTypeTime;
        const suffix = [
          date != null ? `Ngày ${date}` : null,
          time ? `Giờ ${time}` : null,
        ]
          .filter(Boolean)
          .join(" · ");
        return {
          ...ticket,
          ticketTypeId: {
            ...ticketType,
            ticketTypeName: [
              ticketType.ticketTypeName || ticket.ticketTypeName || "Loại vé",
              suffix,
            ]
              .filter(Boolean)
              .join(" · "),
          },
        };
      });
      setSelectedOrder(payload);
      toast.success("Đã tải chi tiết đơn hàng.", { id: loadingId });
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
              <ShoppingBag size={16} /> Vận hành bán vé
            </p>
            <h1>Đơn hàng</h1>
            <p>
              Theo dõi thanh toán, người mua và trạng thái phát hành vé trong
              một luồng.
            </p>
          </div>
          <button
            className="admin-order-list__refresh"
            type="button"
            onClick={() => loadOrders(pagination.page)}
            disabled={isLoading}
          >
            <RefreshCw size={16} /> Làm mới
          </button>
        </header>

        <section className="admin-order-stats" aria-label="Tổng quan đơn hàng">
          <article>
            <FileText size={18} />
            <span>
              <small>Tổng đơn trên trang</small>
              <strong>{orders.length}</strong>
            </span>
          </article>
          <article>
            <CircleDollarSign size={18} />
            <span>
              <small>Giá trị trên trang</small>
              <strong>{formatMoney(totalValue)}</strong>
            </span>
          </article>
          <article>
            <PackageCheck size={18} />
            <span>
              <small>Đã thanh toán</small>
              <strong>{paidCount}</strong>
            </span>
          </article>
        </section>

        <section className="admin-order-card" aria-label="Danh sách đơn hàng">
          <div className="admin-order-card__toolbar">
            <div>
              <strong>{pagination.total}</strong>
              <span>đơn hàng</span>
            </div>
            <div className="admin-order-filters">
              <label className="admin-order-search">
                <Search size={15} />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Tìm mã đơn, người mua..."
                  aria-label="Tìm đơn hàng"
                />
              </label>
              <label className="admin-order-select">
                <span>Trạng thái</span>
                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                >
                  <option value="">Tất cả</option>
                  <option value="Pending">Chờ thanh toán</option>
                  <option value="Processing">Đang xử lý</option>
                  <option value="Paid">Đã thanh toán</option>
                  <option value="Cancelled">Đã hủy</option>
                </select>
              </label>
            </div>
          </div>

          {isLoading ? (
            <div className="admin-order-empty" aria-busy="true">
              Đang đồng bộ dữ liệu đơn hàng...
            </div>
          ) : visibleOrders.length === 0 ? (
            <div className="admin-order-empty">
              Không tìm thấy đơn hàng phù hợp.
            </div>
          ) : (
            <div className="admin-order-table-wrap">
              <table className="admin-order-table">
                <thead>
                  <tr>
                    <th>Mã đơn</th>
                    <th>Người mua</th>
                    <th>Ngày tạo</th>
                    <th>Số vé</th>
                    <th>Giá trị</th>
                    <th>Trạng thái</th>
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
                              {order.userId?.email || "Chưa có email"}
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
                          {STATUS_LABELS[order.orderStatus] ||
                            order.orderStatus ||
                            "Không rõ"}
                        </span>
                      </td>
                      <td>
                        <button
                          className="admin-order-view"
                          type="button"
                          onClick={() => openDetail(order)}
                        >
                          <Eye size={15} /> Chi tiết
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
                <ChevronLeft size={15} /> Trước
              </button>
              <span>
                Trang {pagination.page} / {pagination.totalPages}
              </span>
              <button
                type="button"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => loadOrders(pagination.page + 1)}
              >
                Sau <ChevronRight size={15} />
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
                <p>Chi tiết đơn hàng</p>
                <h2 style={{ color: "#ce0000" }} id="order-detail-title">
                  #
                  {String(
                    selectedOrder.payosOrderId || selectedOrder._id,
                  ).slice(-10)}
                </h2>
              </div>
              <button
                type="button"
                aria-label="Đóng chi tiết"
                onClick={() => setSelectedOrder(null)}
              >
                <X size={19} />
              </button>
            </header>
            {isDetailLoading ? (
              <div className="admin-order-dialog__loading">
                <Clock3 size={20} /> Đang tải...
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
                    {STATUS_LABELS[selectedOrder.orderStatus] ||
                      selectedOrder.orderStatus}
                  </span>
                </div>
                <div className="admin-order-dialog__summary">
                  <div>
                    <small>Tổng thanh toán</small>
                    <strong>{formatMoney(selectedOrder.totalAmount)}</strong>
                  </div>
                  <div>
                    <small>Phương thức</small>
                    <strong>
                      {PAYMENT_METHOD_LABELS[selectedOrder.paymentMethod] ||
                        selectedOrder.paymentMethod ||
                        PAYMENT_METHOD_LABELS.PayOS}
                    </strong>
                  </div>
                </div>
                <h3>Vé trong đơn</h3>
                <div className="admin-order-dialog__tickets">
                  {(selectedOrder.tickets || []).length ? (
                    selectedOrder.tickets.map((ticket) => (
                      <div key={ticket._id}>
                        <span>
                          {ticket.ticketTypeId?.ticketTypeName || "Loại vé"}
                        </span>
                        <small>
                          {ticket.qrCodeData ? (
                            <button type="button" className="admin-order-qr-button" onClick={() => setSelectedQrCode(ticket.qrCodeData)}>
                              Xem mã QR
                            </button>
                          ) : "Chưa phát hành mã QR"}
                        </small>
                        <b>
                          {TICKET_STATUS_LABELS[ticket.ticketStatus] ||
                            ticket.ticketStatus ||
                            TICKET_STATUS_LABELS.Pending}
                        </b>
                      </div>
                    ))
                  ) : (
                    <p>Chưa có vé được phát hành cho đơn này.</p>
                  )}
                </div>
              </>
            )}
          </section>
        </div>
      )}
      <QRModal isOpen={Boolean(selectedQrCode)} value={selectedQrCode} onClose={() => setSelectedQrCode(null)} />
    </div>
  );
};

export default AdminOrderList;
