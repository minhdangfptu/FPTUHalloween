/* Hallmark · pre-emit critique: P5 H5 E4 S5 R4 V4 */
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Check,
  Edit3,
  Info,
  Package,
  Save,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import authAPI from "../../apis/authAPI";
import axiosClient from "../../apis/axiosClient";
import UserListTicket from "../../components/UserListTicket";
import QRModal from "../../components/QRModal";
import {
  translateError,
  translateSuccess,
} from "../../utils/translateResponse";
import avatar from "../../assets/avatar.jpg";
import "./UserProfile.scss";

const EMPTY_PROFILE = {
  email: "",
  phone: "",
  fullName: "",
  department: "",
  department_position: "",
  authProvider: "local",
  roleId: "",
  isVerified: false,
  isDisabled: false,
  createdAt: "",
  updatedAt: "",
};
const getProfileData = (response) => {
  const data = response?.data || response?.user || response || EMPTY_PROFILE;
  const role = data.roleId ?? data.role_id ?? "";
  return {
    ...data,
    fullName: data.fullName ?? data.full_name ?? "",
    phone: data.phone ?? data.phone_number ?? "",
    roleId: typeof role === "object" ? (role.roleName ?? role._id ?? "") : role,
    createdAt: data.createdAt ?? data.created_at ?? "",
    updatedAt: data.updatedAt ?? data.update_at ?? "",
  };
};
const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium" }).format(
        new Date(value),
      )
    : "Chưa cập nhật";

const OrderCountdown = ({ expiresAt }) => {
  const getRemaining = () => Math.max(0, Number(expiresAt || 0) - Math.floor(Date.now() / 1000));
  const [remaining, setRemaining] = useState(getRemaining);

  useEffect(() => {
    const update = () => setRemaining(getRemaining());
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [expiresAt]);

  if (!expiresAt || remaining <= 0) return <small className="profile-order-expiry profile-order-expiry--expired">Đã hết thời gian</small>;
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  return <small className="profile-order-expiry">Còn lại {minutes}:{String(seconds).padStart(2, "0")}</small>;
};

export default function UserProfile() {
  const navigate = useNavigate();
  const orderStatusLabels = {
    Pending: "Chờ thanh toán",
    Processing: "Đang xử lý",
    Paid: "Đã thanh toán",
    Cancelled: "Đã huỷ",
  };
  const handleOrderAction = (order) => {
    if (order.orderStatus === "Cancelled") return;
    if (order.orderStatus === "Pending") {
      localStorage.setItem("fptu-halloween-checkout", JSON.stringify({ customer: { fullName: profile.fullName, email: profile.email, phone: profile.phone }, items: order.items || [], subtotal: order.totalAmount, discount: 0, total: order.totalAmount }));
      localStorage.setItem("fptu-halloween-payos-payment", JSON.stringify({ orderCode: Number(order.payosOrderId) }));
      navigate("/qr-payment");
      return;
    }
    setSelectedOrder(order);
  };
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [draft, setDraft] = useState(EMPTY_PROFILE);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [tickets, setTickets] = useState([]);
  const [selectedQrCode, setSelectedQrCode] = useState(null);
  const [orders, setOrders] = useState([]);
  const [orderStatusFilter, setOrderStatusFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const hasLoadedProfile = useRef(false);

  useEffect(() => {
    // React StrictMode chạy effect hai lần trong development.
    if (hasLoadedProfile.current) return;
    hasLoadedProfile.current = true;

    const loadProfile = async () => {
      const loadingToast = toast.loading("Đang tải dữ liệu...");
      try {
        const [profileResponse, ticketResponse, orderResponse] =
          await Promise.all([
            authAPI.getMe(),
            axiosClient.get("/tickets/me"),
            axiosClient.get("/orders/me"),
          ]);
        const data = getProfileData(profileResponse);
        setTickets(ticketResponse.data?.data || []);
        setOrders(orderResponse.data?.data || []);
        setProfile({ ...EMPTY_PROFILE, ...data });
        setDraft({ ...EMPTY_PROFILE, ...data });
      } catch (error) {
        toast.error(translateError(error));
      } finally {
        setIsLoading(false);
        toast.dismiss(loadingToast);
      }
    };
    loadProfile();
  }, []);

  const handleChange = ({ target }) =>
    setDraft((current) => ({ ...current, [target.name]: target.value }));
  const handleSave = async (event) => {
    event.preventDefault();
    const loadingToast = toast.loading("Đang cập nhật thông tin...");
    try {
      const data = getProfileData(
        await authAPI.updateMe({
          full_name: draft.fullName,
          phone_number: draft.phone,
        }),
      );
      const updated = { ...profile, ...draft, ...data };
      setProfile(updated);
      setDraft(updated);
      setIsEditing(false);
      localStorage.setItem("user", JSON.stringify(updated));
      toast.success(translateSuccess("Updated successfully"), {
        id: loadingToast,
      });
    } catch (error) {
      toast.error(translateError(error), { id: loadingToast });
    }
  };
  const cancelEdit = () => {
    setDraft(profile);
    setIsEditing(false);
  };
  const displayName = profile.fullName || "Người dùng FPTU";
  const value = (field) => profile[field] || "Chưa cập nhật";
  const visibleOrders = orderStatusFilter
    ? orders.filter((order) => order.orderStatus === orderStatusFilter)
    : orders;
  const authProviderLabel =
    profile.authProvider === "google"
      ? "Tài khoản Google"
      : profile.authProvider === "local"
        ? "Tài khoản Email"
        : "Chưa cập nhật";
  const details = [
    ["fullName", "Họ và tên"],
    ["email", "Email"],
    ["phone", "Số điện thoại"],
    ["createdAt", "Ngày tham gia"],
    ["department", "Ban Sự kiện"],
    ["department_position", "Chức vụ"],
    ["authProvider", "Phương thức đăng nhập"],
  ];

  return (
    <main className="user-profile-page">
      <div className="profile-toolbar">
        <div className="profile-tab">
          <UserRound size={18} /> Chi tiết Người dùng
        </div>
        <div className="profile-toolbar-actions">
          <button
            type="button"
            className="profile-button profile-button--edit"
            onClick={() => setIsEditing((current) => !current)}
          >
            {isEditing ? <X size={17} /> : <Edit3 size={17} />}
            {isEditing ? "Hủy chỉnh sửa" : "Chỉnh sửa"}
          </button>
          <button
            type="button"
            className="profile-button profile-button--delete"
            onClick={() => toast.error("Xóa tài khoản chưa được hỗ trợ.")}
          >
            <Trash2 size={17} /> Xóa tài khoản
          </button>
        </div>
      </div>
      {isLoading ? (
        <div className="profile-loading" aria-busy="true" />
      ) : (
        <>
          <section className="profile-overview">
            <aside className="profile-card profile-summary">
              <div className="profile-avatar">
                <img src={avatar} alt={displayName} />
              </div>
              <h1>{displayName}</h1>
              <p className="profile-email">{value("email")}</p>
              <div className="profile-badges">
                <span className="profile-badge profile-badge--active">
                  <i />{" "}
                  {profile.isDisabled ? "Đã vô hiệu hóa" : "Đang hoạt động"}
                </span>
                <span className="profile-badge profile-badge--role">
                  <Info size={15} /> {value("roleId")}
                </span>
              </div>
              <div className="profile-summary-meta">
                <div>
                  <span>Số điện thoại</span>
                  <strong>{value("phone")}</strong>
                </div>
                <div>
                  <span>Email</span>
                  <strong className="muted">{value("email")}</strong>
                </div>
              </div>
            </aside>
            <section className="profile-card profile-details">
              <div className="section-title">
                <Info size={23} />
                <h2>Thông tin chi tiết</h2>
              </div>
              <form id="profile-form" onSubmit={handleSave}>
                <div className="details-grid">
                  {details.map(([field, label]) => (
                    <div className="detail-item" key={field}>
                      <span>{label}</span>
                      {isEditing && ["fullName", "phone"].includes(field) ? (
                        <input
                          name={field}
                          value={draft[field] || ""}
                          onChange={handleChange}
                        />
                      ) : (
                        <strong>
                          {field === "createdAt"
                            ? formatDate(profile[field])
                            : field === "authProvider"
                              ? authProviderLabel
                              : value(field)}
                        </strong>
                      )}
                    </div>
                  ))}
                  <div className="detail-item">
                    <span>Trạng thái xác minh</span>
                    <strong className="verified">
                      {profile.isVerified ? (
                        <>
                          <Check size={16} /> Đã xác minh
                        </>
                      ) : (
                        "Chưa xác minh"
                      )}
                    </strong>
                  </div>
                </div>
                {isEditing && (
                  <button
                    className="profile-button profile-button--save"
                    type="submit"
                  >
                    <Save size={17} /> Lưu thay đổi
                  </button>
                )}
              </form>
            </section>
          </section>
          <section className="profile-card orders-card">
            <header className="orders-heading">
              <div className="orders-icon">
                <Package size={22} />
              </div>
              <div>
                <h2>Đơn hàng của bạn</h2>
                <p>Theo dõi và xem lại các đơn hàng đã đặt.</p>
              </div>
              <label className="orders-status-filter">
                <span>Lọc trạng thái</span>
                <select value={orderStatusFilter} onChange={(event) => setOrderStatusFilter(event.target.value)} aria-label="Lọc trạng thái đơn hàng">
                  <option value="">Tất cả</option>
                  <option value="Pending">Chờ thanh toán</option>
                  <option value="Processing">Đang xử lý</option>
                  <option value="Paid">Đã thanh toán</option>
                  <option value="Cancelled">Đã hủy</option>
                </select>
              </label>
            </header>
            <div className="orders-table">
              <div className="orders-row orders-row--header">
                <span>Mã đơn</span>
                <span>Ngày đặt</span>
                <span>Sản phẩm</span>
                <span>Tổng tiền</span>
                <span>Trạng thái</span>
                <span>Thao tác</span>
              </div>
              {visibleOrders.length === 0 ? (
                <div className="orders-empty">Bạn chưa có đơn hàng nào.</div>
              ) : (
                <div className="profile-order-list">
                  {visibleOrders.map((order) => (
                    <button
                      className="profile-order-row"
                      type="button"
                      key={order._id}
                      onClick={() => handleOrderAction(order)}
                      disabled={order.orderStatus === "Cancelled"}
                    >
                      <span style={{ fontSize: "14px" }}>
                        #{String(order.payosOrderId || order._id).slice(-8)}
                      </span>
                      <span style={{ fontSize: "14px" }}>
                        {formatDate(order.createdAt)}
                      </span>
                      <span style={{ fontSize: "14px" }}>
                        {order.itemCount || 0} vé
                      </span>
                      <strong
                        className={
                          order.orderStatus === "Cancelled"
                            ? "profile-order-total profile-order-total--cancelled"
                            : "profile-order-total"
                        }
                        style={{ fontSize: "14px" }}
                      >
                        {new Intl.NumberFormat("vi-VN").format(
                          order.totalAmount || 0,
                        )}{" "}
                        VND
                      </strong>
                      <span
                        className={`profile-order-status profile-order-status--${String(order.orderStatus).toLowerCase()}`}
                      >
                        {orderStatusLabels[order.orderStatus] ||
                          "Chưa xác định"}
                        {order.orderStatus === "Pending" && <OrderCountdown expiresAt={order.paymentExpiresAt} />}
                      </span>
                      <span
                        className={`profile-order-view ${
                          order.orderStatus === "Cancelled"
                            ? "profile-order-view--disabled"
                            : ""
                        }`}
                      >
                        {order.orderStatus === "Pending"
                          ? "Tiếp tục thanh toán"
                          : "Xem vé"}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>
          <section className="profile-card profile-tickets-card">
            <div className="section-title">
              <Package size={23} />
              <h2>Vé điện tử của bạn</h2>
            </div>
            {tickets.length === 0 ? (
              <p className="profile-tickets-empty">
                Bạn chưa có vé điện tử nào.
              </p>
            ) : (
              <div className="profile-ticket-list">
                {tickets.map((ticket) => (
                  <article className="profile-ticket" key={ticket._id}>
                    <div>
                      <strong>
                        {ticket.ticketTypeId?.ticketTypeName ||
                          "Vé FPTU Halloween"}
                      </strong>
                      <span>Trạng thái: {ticket.ticketStatus}</span>
                    </div>
                    {ticket.qrCodeData ? (
                      <button type="button" className="profile-ticket-qr-button" onClick={() => setSelectedQrCode(ticket.qrCodeData)}>
                        Xem mã QR
                      </button>
                    ) : <span>Chưa phát hành mã QR</span>}
                  </article>
                ))}
              </div>
            )}
          </section>
          {selectedOrder && (
            <UserListTicket
              order={selectedOrder}
              tickets={tickets.filter(
                (ticket) =>
                  String(ticket.orderId) === String(selectedOrder._id),
              )}
              onClose={() => setSelectedOrder(null)}
            />
          )}
          <QRModal isOpen={Boolean(selectedQrCode)} value={selectedQrCode} onClose={() => setSelectedQrCode(null)} />
        </>
      )}
    </main>
  );
}
