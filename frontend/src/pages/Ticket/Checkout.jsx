import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  Ticket,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { CartSkeleton } from "../../components/LoadingSkeletons";
import authAPI from "../../apis/authAPI";
import cartAPI from "../../apis/cartAPI";
import { translateError } from "../../utils/translateResponse";
import LogoutModal from "../../components/LogoutModal";
import "./Checkout.scss";

const CHECKOUT_KEY = "fptu-halloween-checkout";
const SELECTED_ITEMS_KEY = "fptu-halloween-selected-cart-items";
const getStoredCustomer = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    return {
      fullName: user?.fullName || user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    };
  } catch {
    return { fullName: "", email: "", phone: "" };
  }
};

const getCustomerFromResponse = (response) => {
  const user = response?.data || response?.user || response || {};
  return {
    fullName: user.fullName || user.full_name || user.name || "",
    email: user.email || "",
    phone: user.phone || user.phone_number || "",
  };
};

const formatPrice = (value) =>
  `${new Intl.NumberFormat("vi-VN").format(value || 0)} VND`;

const Checkout = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const ticket = (key, options) => t(`ticket.${key}`, options);
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [discountCode, setDiscountCode] = useState("");
  const [discountMessage, setDiscountMessage] = useState("");
  const [customer, setCustomer] = useState(getStoredCustomer);
  const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);

  const loadCart = useCallback(async () => {
    const loadingToast = toast.loading(ticket("loadingPayment"));
    setIsLoading(true);
    setError(null);
    try {
      setCart(await cartAPI.get());
    } catch (requestError) {
      setError(translateError(requestError));
      toast.error(translateError(requestError), { id: loadingToast });
    } finally {
      setIsLoading(false);
      toast.dismiss(loadingToast);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  useEffect(() => {
    const syncCustomer = () => setCustomer(getStoredCustomer());
    window.addEventListener("auth:login", syncCustomer);
    return () => window.removeEventListener("auth:login", syncCustomer);
  }, []);

  useEffect(() => {
    let isMounted = true;

    authAPI
      .getMe()
      .then((response) => {
        if (isMounted) setCustomer(getCustomerFromResponse(response));
      })
      .catch(() => {
        // Keep the values loaded from localStorage when profile loading fails.
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const selectedIds = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem(SELECTED_ITEMS_KEY) || "null");
    } catch {
      return null;
    }
  }, []);
  const cartItems = useMemo(() => {
    const items = cart.items || [];
    if (!Array.isArray(selectedIds)) return items;
    return items.filter((item) => selectedIds.includes(String(item.ticketTypeId)));
  }, [cart.items, selectedIds]);
  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + Number(item.subtotal || 0), 0),
    [cartItems],
  );
  const totalQuantity = useMemo(
    () => cartItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
    [cartItems],
  );
  const hasUnavailableItems = useMemo(
    () => cartItems.some((item) => item.ticketType?.ticketTypeStatus !== "active" || Number(item.ticketType?.availableQuantity) <= 0),
    [cartItems],
  );
  const discount =
    discountCode.trim().toUpperCase() === "HALLOWEEN"
      ? Math.round(subtotal * 0.1)
      : 0;
  const total = subtotal - discount;

  useEffect(() => {
    if (!isLoading && !error && !cartItems.length)
      navigate("/cart", { replace: true });
  }, [cartItems.length, error, isLoading, navigate]);

  const applyDiscount = () =>
    setDiscountMessage(
      discount
        ? ticket("couponApplied")
        : ticket("couponInvalid"),
    );
  const handleSubmit = (event) => {
    event.preventDefault();
    if (hasUnavailableItems) {
      toast.error(ticket("noOrders"));
      return;
    }
    setShowPaymentConfirmation(true);
  };

  const continueToPayment = () => {
    localStorage.setItem(
      CHECKOUT_KEY,
      JSON.stringify({ customer, items: cartItems, subtotal, discount, total }),
    );
    setShowPaymentConfirmation(false);
    navigate("/qr-payment");
  };

  if (isLoading)
    return (
      <main className="ticket-checkout-page">
        <CartSkeleton />
      </main>
    );
  if (error)
    return (
      <main className="ticket-checkout-page">
        <div className="ticket-checkout-state">
          <p>{error}</p>
          <button type="button" onClick={loadCart}>
            {ticket("retry")}
          </button>
        </div>
      </main>
    );
  if (!cartItems.length) return null;

  return (
    <main className="ticket-checkout-page">
      <div className="ticket-checkout-shell">
        <button
          className="checkout-back"
          type="button"
          onClick={() => navigate("/cart")}
        >
          <ArrowLeft size={17} /> {ticket("backCart")}
        </button>
        <header className="checkout-heading">
          <p>FPTU Halloween 2026</p>
          <h1>{ticket("checkoutTitle")}</h1>
          <span>{ticket("stepOne")}</span>
        </header>
        <div className="checkout-layout">
          <form className="checkout-form" onSubmit={handleSubmit}>
            <section>
              <div className="checkout-section-head">
                <div>
                  <h2>{ticket("buyerInfo")}</h2>
                  <p>{ticket("buyerHint")}</p>
                  <p style={{ color: "var(--red)" }}>
                    {ticket("emailNotice")}
                  </p>
                </div>
              </div>
              <div className="checkout-fields">
                <label>
                  {ticket("fullName")}
                  <input
                    required
                    value={customer.fullName}
                    onChange={(event) =>
                      setCustomer({ ...customer, fullName: event.target.value })
                    }
                  placeholder={ticket("fullNamePlaceholder")}
                  />
                </label>
                <label>
                  Email
                  <input
                    required
                    type="email"
                    value={customer.email}
                    onChange={(event) =>
                      setCustomer({ ...customer, email: event.target.value })
                    }
                    placeholder="you@example.com"
                  />
                </label>
                <label>
                  {ticket("phone")}
                  <input
                    required
                    type="tel"
                    value={customer.phone}
                    onChange={(event) =>
                      setCustomer({ ...customer, phone: event.target.value })
                    }
                  placeholder={ticket("phonePlaceholder")}
                  />
                </label>
              </div>
            </section>
            <section>
              <div className="checkout-section-head">
                <div>
                  <h2>{ticket("coupon")}</h2>
                  <p>{ticket("couponHint")}</p>
                </div>
              </div>
              <div className="checkout-discount">
                <input
                  value={discountCode}
                  onChange={(event) => {
                    setDiscountCode(event.target.value);
                    setDiscountMessage("");
                  }}
                placeholder={ticket("couponPlaceholder")}
                />
                <button type="button" onClick={applyDiscount}>
                {ticket("apply")}
                </button>
              </div>
              {discountMessage && (
                <p
                  className={
                    discount
                      ? "checkout-message is-success"
                      : "checkout-message is-error"
                  }
                >
                  {discountMessage}
                </p>
              )}
            </section>
            <button className="checkout-submit" type="submit" disabled={hasUnavailableItems}>
              {ticket("continue")} <ArrowRight size={18} />
            </button>
          </form>
          <aside className="checkout-summary">
            <p className="checkout-summary__label">
              {ticket("selectedTickets")} · {totalQuantity}
            </p>
            {cartItems.map((item) => {
              const ticketType = item.ticketType || {};
              return (
                <div className={`checkout-ticket${ticketType.ticketTypeStatus !== "active" ? " checkout-ticket--unavailable" : ""}`} key={item.ticketTypeId}>
                  <div className="checkout-ticket__mark">
                    <Ticket size={19} />
                    <strong>
                      {String(ticketType.ticketTypeDate || "01").padStart(
                        2,
                        "0",
                      )}
                    </strong>
                  </div>
                  <div>
                    <h3>{ticketType.ticketTypeName}</h3>
                    {ticketType.ticketTypeStatus !== "active" && <p className="checkout-ticket__unavailable">{ticket("unavailable")}</p>}
                    <p>
                      <CalendarDays size={14} /> {ticket("day")} {" "}
                      {ticketType.ticketTypeDate} {ticket("dateSuffix")}
                    </p>
                    <p>
                      <Clock3 size={14} /> {ticketType.ticketTypeTime}
                    </p>
                  </div>
                  <strong>{item.quantity} ×</strong>
                </div>
              );
            })}
            <div className="checkout-total">
              <div>
                <span>{ticket("subtotal")}</span>
                <strong>{formatPrice(subtotal)}</strong>
              </div>
              <div>
                <span>{ticket("discount")}</span>
                <strong>- {formatPrice(discount)}</strong>
              </div>
              <div className="checkout-total__final">
                <span>{ticket("total")}</span>
                <strong>{formatPrice(total)}</strong>
              </div>
            </div>
            <div className="checkout-safe">
              <Check size={16} /> {ticket("secure")}
            </div>
          </aside>
        </div>
      </div>
      <LogoutModal
        isOpen={showPaymentConfirmation}
        onClose={() => setShowPaymentConfirmation(false)}
        onConfirm={continueToPayment}
        title={ticket("confirmPayment")}
        description={ticket("confirmPaymentText")}
        cancelLabel={ticket("cancel")}
        confirmLabel={ticket("continue")}
      />
    </main>
  );
};

export default Checkout;
