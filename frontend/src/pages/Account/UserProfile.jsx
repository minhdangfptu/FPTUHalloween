/* Hallmark · pre-emit critique: P5 H5 E4 S5 R4 V4 */
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
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
const formatDate = (value, fallback = "Chưa cập nhật", locale = "vi-VN") =>
  value
    ? new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(
        new Date(value),
      )
    : fallback;

const OrderCountdown = ({ expiresAt, t }) => {
  const getRemaining = () => Math.max(0, Number(expiresAt || 0) - Math.floor(Date.now() / 1000));
  const [remaining, setRemaining] = useState(getRemaining);

  useEffect(() => {
    const update = () => setRemaining(getRemaining());
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [expiresAt]);

  if (!expiresAt || remaining <= 0) return <small className="profile-order-expiry profile-order-expiry--expired">{t("profilePage.expired")}</small>;
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  return <small className="profile-order-expiry">{t("profilePage.remaining", { time: `${minutes}:${String(seconds).padStart(2, "0")}` })}</small>;
};

export default function UserProfile() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const profileText = (key, options) => t(`profilePage.${key}`, options);
  const orderStatusLabels = {
    Pending: profileText("pending"),
    Processing: profileText("processing"),
    Paid: profileText("paid"),
    Cancelled: profileText("cancelled"),
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
      const loadingToast = toast.loading(profileText("loading"));
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
    const loadingToast = toast.loading(profileText("updateLoading"));
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
  const displayName = profile.fullName || profileText("user");
  const value = (field) => profile[field] || profileText("notUpdated");
  const visibleOrders = orderStatusFilter
    ? orders.filter((order) => order.orderStatus === orderStatusFilter)
    : orders;
  const authProviderLabel =
    profile.authProvider === "google"
      ? profileText("googleAccount")
      : profile.authProvider === "local"
        ? profileText("emailAccount")
        : profileText("notUpdated");
  const details = [
    ["fullName", "fullName"],
    ["email", "email"],
    ["phone", "phone"],
    ["createdAt", "joined"],
    ["department", "department"],
    ["department_position", "position"],
    ["authProvider", "authMethod"],
  ];

  return (
    <main className="user-profile-page">
      <div className="profile-toolbar">
        <div className="profile-tab">
          <UserRound size={18} /> {profileText("detailsTab")}
        </div>
        <div className="profile-toolbar-actions">
          <button
            type="button"
            className="profile-button profile-button--edit"
            onClick={() => setIsEditing((current) => !current)}
          >
            {isEditing ? <X size={17} /> : <Edit3 size={17} />}
            {isEditing ? profileText("cancelEdit") : profileText("edit")}
          </button>
          <button
            type="button"
            className="profile-button profile-button--delete"
            onClick={() => toast.error(profileText("deleteUnavailable"))}
          >
            <Trash2 size={17} /> {profileText("delete")}
          </button>
        </div>
      </div>
      {isLoading ? (
        <div className="profile-loading" aria-busy="true">
          <Skeleton circle width={92} height={92} />
          <Skeleton width={220} height={24} />
          <Skeleton width={280} />
          <Skeleton width="70%" height={120} />
        </div>
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
                  {profile.isDisabled ? profileText("disabled") : profileText("active")}
                </span>
                <span className="profile-badge profile-badge--role">
                  <Info size={15} /> {value("roleId")}
                </span>
              </div>
              <div className="profile-summary-meta">
                <div>
                  <span>{profileText("phone")}</span>
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
                <h2>{profileText("details")}</h2>
              </div>
              <form id="profile-form" onSubmit={handleSave}>
                <div className="details-grid">
                  {details.map(([field, labelKey]) => (
                    <div className="detail-item" key={field}>
                      <span>{profileText(labelKey)}</span>
                      {isEditing && ["fullName", "phone"].includes(field) ? (
                        <input
                          name={field}
                          value={draft[field] || ""}
                          onChange={handleChange}
                        />
                      ) : (
                        <strong>
                          {field === "createdAt"
                            ? formatDate(profile[field], profileText("notUpdated"), i18n.language.startsWith("en") ? "en-US" : "vi-VN")
                            : field === "authProvider"
                              ? authProviderLabel
                              : value(field)}
                        </strong>
                      )}
                    </div>
                  ))}
                  <div className="detail-item">
                    <span>{profileText("verificationStatus")}</span>
                    <strong className="verified">
                      {profile.isVerified ? (
                        <>
                          <Check size={16} /> {profileText("verified")}
                        </>
                      ) : (
                        profileText("unverified")
                      )}
                    </strong>
                  </div>
                </div>
                {isEditing && (
                  <button
                    className="profile-button profile-button--save"
                    type="submit"
                  >
                    <Save size={17} /> {profileText("save")}
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
                <h2>{profileText("orders")}</h2>
                <p>{profileText("ordersIntro")}</p>
              </div>
              <label className="orders-status-filter">
                <span>{profileText("filterStatus")}</span>
                <select value={orderStatusFilter} onChange={(event) => setOrderStatusFilter(event.target.value)} aria-label={profileText("filterOrderStatus")}>
                  <option value="">{profileText("all")}</option>
                  <option value="Pending">{profileText("pending")}</option>
                  <option value="Processing">{profileText("processing")}</option>
                  <option value="Paid">{profileText("paid")}</option>
                  <option value="Cancelled">{profileText("cancelled")}</option>
                </select>
              </label>
            </header>
            <div className="orders-table">
              <div className="orders-row orders-row--header">
                <span>{profileText("orderCode")}</span>
                <span>{profileText("orderDate")}</span>
                <span>{profileText("product")}</span>
                <span>{profileText("total")}</span>
                <span>{profileText("status")}</span>
                <span>{profileText("action")}</span>
              </div>
              {visibleOrders.length === 0 ? (
                <div className="orders-empty">{profileText("noOrders")}</div>
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
                        {formatDate(order.createdAt, profileText("notUpdated"), i18n.language.startsWith("en") ? "en-US" : "vi-VN")}
                      </span>
                      <span style={{ fontSize: "14px" }}>
                        {profileText("tickets", { count: order.itemCount || 0 })}
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
                          profileText("unknown")}
                        {order.orderStatus === "Pending" && <OrderCountdown expiresAt={order.paymentExpiresAt} t={t} />}
                      </span>
                      <span
                        className={`profile-order-view ${
                          order.orderStatus === "Cancelled"
                            ? "profile-order-view--disabled"
                            : ""
                        }`}
                      >
                        {order.orderStatus === "Pending"
                          ? profileText("continuePayment")
                          : profileText("viewTicket")}
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
              <h2>{profileText("digitalTickets")}</h2>
            </div>
            {tickets.length === 0 ? (
              <p className="profile-tickets-empty">
                {profileText("noTickets")}
              </p>
            ) : (
              <div className="profile-ticket-list">
                {tickets.map((ticket) => (
                  <article className="profile-ticket" key={ticket._id}>
                    <div>
                      <strong>
                        {ticket.ticketTypeId?.ticketTypeName ||
                          profileText("ticketFallback")}
                      </strong>
                      <span>{profileText("ticketStatus", { status: ticket.ticketStatus })}</span>
                    </div>
                    {ticket.qrCodeData ? (
                      <button type="button" className="profile-ticket-qr-button" onClick={() => setSelectedQrCode(ticket.qrCodeData)}>
                        {profileText("viewQr")}
                      </button>
                    ) : <span>{profileText("qrPending")}</span>}
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
