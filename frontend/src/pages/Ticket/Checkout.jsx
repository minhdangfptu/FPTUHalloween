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
import { PROMO_CODE, FUN_PROMO_CODE, getDiscountedPrice, isSupportedPromotion, isPromotionActive } from "../../utils/ticketPromotion";
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

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^0\d{9}$/;
const getEmailValidationMessage = (value) => {
  if (!value.trim()) return "Vui lòng nhập email.";
  if (!value.includes("@")) return "Email phải chứa ký tự @.";
  if (!value.includes(".")) return "Email phải có phần mở rộng như .com hoặc .vn.";
  return "Email phải có định dạng hợp lệ, ví dụ ten@domain.com.";
};
const getPhoneValidationMessage = (value) => {
  if (!value.trim()) return "Vui lòng nhập số điện thoại.";
  if (/\s/.test(value)) return "Số điện thoại không được chứa khoảng trắng.";
  if (/\D/.test(value)) return "Số điện thoại chỉ được chứa chữ số.";
  if (!value.startsWith("0")) return "Số điện thoại phải bắt đầu bằng số 0.";
  if (value.length < 10) return "Số điện thoại phải đủ 10 chữ số.";
  if (value.length > 10) return "Số điện thoại không được vượt quá 10 chữ số.";
  return "";
};

const Checkout = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const ticket = (key, options) => t(`ticket.${key}`, options);
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [discountCode, setDiscountCode] = useState("");
  const [appliedCode, setAppliedCode] = useState("");
  const [discountMessageKey, setDiscountMessageKey] = useState("");
  const [now, setNow] = useState(Date.now());
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
      if (!requestError?.isLogoutRelated && !window.__fptuLogoutInProgress) {
        toast.error(translateError(requestError), { id: loadingToast });
      }
    } finally {
      setIsLoading(false);
      toast.dismiss(loadingToast);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

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
  const promotionActive = appliedCode && isPromotionActive(now, appliedCode);
  const promotionApplied = Boolean(promotionActive);
  const discountDetails = cartItems.map((item) => {
    const originalPrice = Number(item.ticketType?.ticketTypePrice || 0);
    const discountedPrice = getDiscountedPrice(originalPrice, appliedCode || PROMO_CODE);
    return { item, originalPrice, discountedPrice, perTicket: originalPrice - discountedPrice };
  });
  const availableDiscount = discountDetails.reduce(
    (sum, { item, perTicket }) => sum + perTicket * Number(item.quantity || 0),
    0,
  );
  const discount = promotionApplied ? availableDiscount : 0;
  const total = subtotal - discount;

  useEffect(() => {
    if (!isLoading && !error && !cartItems.length)
      navigate("/cart", { replace: true });
  }, [cartItems.length, error, isLoading, navigate]);

  const applyDiscount = () => {
    const code = discountCode.trim().toUpperCase();
    if (!isSupportedPromotion(code)) {
      setAppliedCode("");
      setDiscountMessageKey("couponInvalid");
      toast.error(ticket("couponInvalid"), { id: "checkout-promo" });
      return;
    }
    const activeNow = isPromotionActive(Date.now(), code);
    setAppliedCode(activeNow ? code : "");
    setDiscountMessageKey(activeNow ? "couponApplied" : "promoUnavailable");
    if (activeNow) {
      const savings = cartItems.reduce((sum, item) => {
        const price = Number(item.ticketType?.ticketTypePrice || 0);
        return sum + (price - getDiscountedPrice(price, code)) * Number(item.quantity || 0);
      }, 0);
      toast.success(code === FUN_PROMO_CODE ? ticket("couponApplied") : ticket("promoAppliedToast", { amount: formatPrice(savings) }), { id: "checkout-promo" });
    } else {
      toast.error(ticket("promoUnavailable"), { id: "checkout-promo" });
    }
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const email = customer.email.trim();
    const phone = customer.phone.trim();

    if (!EMAIL_PATTERN.test(email)) {
      toast.error(getEmailValidationMessage(customer.email));
      return;
    }
    if (!PHONE_PATTERN.test(phone)) {
      toast.error(getPhoneValidationMessage(customer.phone));
      return;
    }
    if (hasUnavailableItems) {
      toast.error(ticket("noOrders"));
      return;
    }
    setShowPaymentConfirmation(true);
  };

  const continueToPayment = () => {
    const activeCode = appliedCode && isPromotionActive(Date.now(), appliedCode) ? appliedCode : null;
    if (appliedCode && !activeCode) {
      setShowPaymentConfirmation(false);
      setDiscountMessageKey("promoUnavailable");
      toast.error(ticket("promoUnavailable"));
      return;
    }
    const confirmedDiscount = activeCode ? cartItems.reduce((sum, item) => {
      const price = Number(item.ticketType?.ticketTypePrice || 0);
      return sum + (price - getDiscountedPrice(price, activeCode)) * Number(item.quantity || 0);
    }, 0) : 0;
    localStorage.setItem(
      CHECKOUT_KEY,
      JSON.stringify({ customer, items: cartItems, subtotal, discount: confirmedDiscount, total: subtotal - confirmedDiscount, promoCode: activeCode }),
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
          <p>{ticket("eventBrand2026")}</p>
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
                  {ticket("email")}
                  <input
                    required
                    type="email"
                    pattern={EMAIL_PATTERN.source}
                    value={customer.email}
                    onInvalid={(event) => {
                      event.currentTarget.setCustomValidity(
                        getEmailValidationMessage(event.currentTarget.value),
                      );
                    }}
                    onInput={(event) => event.currentTarget.setCustomValidity("")}
                    onChange={(event) =>
                      setCustomer({ ...customer, email: event.target.value })
                    }
                    placeholder={ticket("emailPlaceholder")}
                  />
                </label>
                <label>
                  {ticket("phone")}
                  <input
                    required
                    type="tel"
                    inputMode="numeric"
                    pattern={PHONE_PATTERN.source}
                    value={customer.phone}
                    onInvalid={(event) => {
                      event.currentTarget.setCustomValidity(
                        getPhoneValidationMessage(event.currentTarget.value),
                      );
                    }}
                    onInput={(event) => event.currentTarget.setCustomValidity("")}
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
                  aria-label={ticket("coupon")}
                  value={discountCode}
                  onChange={(event) => {
                    setDiscountCode(event.target.value);
                    setAppliedCode("");
                    setDiscountMessageKey("");
                  }}
                  placeholder={ticket("couponPlaceholder")}
                />
                <button type="button" onClick={applyDiscount}>
                  {ticket("apply")}
                </button>
              </div>
              {(discountMessageKey || (appliedCode && !promotionActive)) && (
                <p
                  role="status"
                  className={
                    promotionApplied
                      ? "checkout-message is-success"
                      : "checkout-message is-error"
                  }
                >
                  {ticket(appliedCode && !promotionActive ? "promoUnavailable" : discountMessageKey)}
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
              <div className={promotionApplied ? "checkout-total__discount is-applied" : "checkout-total__discount"}>
                {promotionApplied ? (
                  <>
                    <div className="checkout-total__discount-heading">
                      <span>{ticket("discount")} · {appliedCode}{appliedCode === FUN_PROMO_CODE ? ` · ${new Intl.NumberFormat(i18n.language, { style: "percent", minimumFractionDigits: 4, maximumFractionDigits: 4 }).format(0.000001)}` : ""}</span>
                      <Check size={17} aria-hidden="true" />
                    </div>
                    <div className="checkout-total__discount-breakdown">
                      {discount > 0 && discountDetails.map(({ item, originalPrice, discountedPrice, perTicket }) => (
                        <div className="checkout-total__discount-item" key={item.ticketTypeId}>
                          <div className="checkout-total__discount-line">
                            <span>{ticket("promoPerTicket")}{discountDetails.length > 1 ? ` · ${item.ticketType?.ticketTypeName || ""}` : ""}</span>
                            <strong>− {formatPrice(perTicket)}</strong>
                          </div>
                          <p className="checkout-total__price-change">
                            <span>{ticket("promoTicketPriceLabel")}:</span>
                            <del>{formatPrice(originalPrice)}</del>
                            <span aria-hidden="true">→</span>
                            <strong>{formatPrice(discountedPrice)}</strong>
                          </p>
                        </div>
                      ))}
                      <div className="checkout-total__discount-sum">
                        <span>{ticket("promoTotalSavings", { count: totalQuantity })}</span>
                        <strong>− {formatPrice(discount)}</strong>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <span>{ticket("discount")}</span>
                    <strong>- {formatPrice(discount)}</strong>
                  </>
                )}
              </div>
              <div className={`checkout-total__final${promotionApplied ? " is-discounted" : ""}`}>
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
