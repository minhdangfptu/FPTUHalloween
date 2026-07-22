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
import toast from "react-hot-toast";
import authAPI from "../../apis/authAPI";
import cartAPI from "../../apis/cartAPI";
import { translateError } from "../../utils/translateResponse";
import "./Checkout.scss";

const CHECKOUT_KEY = "fptu-halloween-checkout";
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
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [discountCode, setDiscountCode] = useState("");
  const [discountMessage, setDiscountMessage] = useState("");
  const [customer, setCustomer] = useState(getStoredCustomer);

  const loadCart = useCallback(async () => {
    const loadingToast = toast.loading("Đang tải thông tin thanh toán...");
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

  const cartItems = cart.items || [];
  const subtotal = useMemo(
    () => Number(cart.totalAmount || 0),
    [cart.totalAmount],
  );
  const totalQuantity = useMemo(
    () => cartItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
    [cartItems],
  );
  const hasUnavailableItems = useMemo(
    () => cartItems.some((item) => item.ticketType?.ticketTypeStatus !== "active"),
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
        ? "Mã giảm giá đã được áp dụng."
        : "Mã giảm giá không hợp lệ hoặc đã hết hạn.",
    );
  const handleSubmit = (event) => {
    event.preventDefault();
    if (hasUnavailableItems) {
      toast.error("Vé không còn được bán. Vui lòng quay lại giỏ hàng.");
      return;
    }
    localStorage.setItem(
      CHECKOUT_KEY,
      JSON.stringify({ customer, items: cartItems, subtotal, discount, total }),
    );
    navigate("/qr-payment");
  };

  if (isLoading)
    return (
      <main className="ticket-checkout-page">
        <div className="ticket-checkout-state" aria-busy="true" />
      </main>
    );
  if (error)
    return (
      <main className="ticket-checkout-page">
        <div className="ticket-checkout-state">
          <p>{error}</p>
          <button type="button" onClick={loadCart}>
            Thử lại
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
          <ArrowLeft size={17} /> Quay lại giỏ vé
        </button>
        <header className="checkout-heading">
          <p>FPTU Halloween 2025</p>
          <h1>Xác nhận đơn hàng</h1>
          <span>Bước 1 / 2</span>
        </header>
        <div className="checkout-layout">
          <form className="checkout-form" onSubmit={handleSubmit}>
            <section>
              <div className="checkout-section-head">
                <div>
                  <h2>Thông tin người mua</h2>
                  <p>Nhập thông tin để nhận vé điện tử.</p>
                  <p style={{ color: "var(--red)" }}>
                    Lưu ý: Hãy kiểm tra địa chỉ Email thật kĩ vì chúng tôi sẽ
                    gửi vé điện tử về địa chỉ này.
                  </p>
                </div>
              </div>
              <div className="checkout-fields">
                <label>
                  Họ và tên
                  <input
                    required
                    value={customer.fullName}
                    onChange={(event) =>
                      setCustomer({ ...customer, fullName: event.target.value })
                    }
                    placeholder="Nhập họ và tên"
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
                  Số điện thoại
                  <input
                    required
                    type="tel"
                    value={customer.phone}
                    onChange={(event) =>
                      setCustomer({ ...customer, phone: event.target.value })
                    }
                    placeholder="Nhập số điện thoại"
                  />
                </label>
              </div>
            </section>
            <section>
              <div className="checkout-section-head">
                <div>
                  <h2>Mã giảm giá</h2>
                  <p>Nếu có, nhập mã ưu đãi của bạn.</p>
                </div>
              </div>
              <div className="checkout-discount">
                <input
                  value={discountCode}
                  onChange={(event) => {
                    setDiscountCode(event.target.value);
                    setDiscountMessage("");
                  }}
                  placeholder="Nhập mã giảm giá"
                />
                <button type="button" onClick={applyDiscount}>
                  Áp dụng
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
              Tiếp tục thanh toán <ArrowRight size={18} />
            </button>
          </form>
          <aside className="checkout-summary">
            <p className="checkout-summary__label">
              Vé đã chọn · {totalQuantity}
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
                    {ticketType.ticketTypeStatus !== "active" && <p className="checkout-ticket__unavailable">Vé không còn được bán</p>}
                    <p>
                      <CalendarDays size={14} /> Ngày{" "}
                      {ticketType.ticketTypeDate} tháng 10, 2025
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
                <span>Tạm tính</span>
                <strong>{formatPrice(subtotal)}</strong>
              </div>
              <div>
                <span>Giảm giá</span>
                <strong>- {formatPrice(discount)}</strong>
              </div>
              <div className="checkout-total__final">
                <span>Tổng thanh toán</span>
                <strong>{formatPrice(total)}</strong>
              </div>
            </div>
            <div className="checkout-safe">
              <Check size={16} /> Thông tin của bạn được lưu an toàn trong phiên
              thanh toán này.
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default Checkout;
