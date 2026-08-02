import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Copy, QrCode, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import paymentAPI from "../../apis/paymentAPI";
import { translateError } from "../../utils/translateResponse";
import { notifyCartUpdated } from "../../utils/flyingToCart";
import LogoutModal from "../../components/LogoutModal";
import "./QRPayment.scss";

const PAYMENT_KEY = "fptu-halloween-payos-payment";

const QRPayment = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const ticket = (key, options) => t(`ticket.${key}`, options);
  const checkout = useMemo(
    () => JSON.parse(localStorage.getItem("fptu-halloween-checkout") || "null"),
    [],
  );
  const paymentCode = `HLW${Date.now().toString().slice(-8)}`;
  const [payment, setPayment] = useState(null);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [isExpired, setIsExpired] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isLoading, setIsLoading] = useState(Boolean(checkout));
  const total = payment?.amount || checkout?.total || 0;

  useEffect(() => {
    if (!checkout) return undefined;
    let isMounted = true;
    const loadingToast = toast.loading(ticket("qrCreate"));

    const savedPayment = JSON.parse(localStorage.getItem(PAYMENT_KEY) || "null");
    paymentAPI.createPayOSPayment({
      discount: checkout.discount || 0,
      selectedTicketTypeIds: (checkout.items || []).map((item) => String(item.ticketTypeId)),
      selectedItems: (checkout.items || []).map((item) => ({
        ticketTypeId: String(item.ticketTypeId),
        quantity: Number(item.quantity),
      })),
      existingOrderCode: savedPayment?.orderCode,
    })
      .then((result) => {
        if (!isMounted) return;
        setPayment(result);
        localStorage.setItem(PAYMENT_KEY, JSON.stringify(result));
        toast.success(ticket("qrCreated"), { id: loadingToast });
      })
      .catch((error) => {
        if (isMounted) toast.error(translateError(error), { id: loadingToast });
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
      toast.dismiss(loadingToast);
    };
  }, [checkout]);

  useEffect(() => {
    if (!payment?.expiredAt) return undefined;
    const updateCountdown = () => {
      const seconds = Math.max(0, Number(payment.expiredAt) - Math.floor(Date.now() / 1000));
      setRemainingSeconds(seconds);
      setIsExpired(seconds === 0);
    };
    updateCountdown();
    const intervalId = window.setInterval(updateCountdown, 1000);
    return () => window.clearInterval(intervalId);
  }, [payment]);

  useEffect(() => {
    if (!isExpired) return undefined;
    toast.error(ticket("qrExpired"));
    const cancelExpiredPayment = async () => {
      if (payment?.orderCode) {
        try { await paymentAPI.cancelPayOSPayment(payment.orderCode); } catch { /* Already expired is safe. */ }
      }
      localStorage.removeItem(PAYMENT_KEY);
    };
    cancelExpiredPayment();
    const redirectTimeout = window.setTimeout(() => navigate("/cart", { replace: true }), 3000);
    return () => window.clearTimeout(redirectTimeout);
  }, [isExpired, navigate, payment]);

  const handleCancelPayment = async () => {
    if (!payment?.orderCode || isCancelling) return;
    setIsCancelling(true);
    setShowCancelModal(false);
    try {
      await paymentAPI.cancelPayOSPayment(payment.orderCode);
      localStorage.removeItem(PAYMENT_KEY);
      notifyCartUpdated({ items: [], totalAmount: 0 });
          toast.success(ticket("cancelled"));
      navigate("/cart", { replace: true });
    } catch (error) {
      toast.error(translateError(error));
    } finally {
      setIsCancelling(false);
    }
  };

  useEffect(() => {
    if (!payment?.orderCode || isExpired) return undefined;
    const intervalId = window.setInterval(async () => {
      try {
        const result = await paymentAPI.getPayOSStatus(payment.orderCode);
        if (result.status === "PAID") {
          window.clearInterval(intervalId);
          localStorage.removeItem(PAYMENT_KEY);
          notifyCartUpdated({ items: [], totalAmount: 0 });
          toast.success(ticket("paymentSuccess"));
          navigate(`/complete-payment?orderCode=${payment.orderCode}`);
        }
      } catch {
        // The user can continue waiting or open the payment link manually.
      }
    }, 5000);
    return () => window.clearInterval(intervalId);
  }, [isExpired, navigate, payment]);
  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(payment?.description || paymentCode);
    } catch {
      /* clipboard unavailable */
    }
  };

  if (!checkout)
    return (
      <main className="qr-payment-page">
        <section className="qr-payment-empty">
          <QrCode size={34} />
          <h1>{ticket("noPayment")}</h1>
          <button type="button" onClick={() => navigate("/cart")}>
            {ticket("backCart")}
          </button>
        </section>
      </main>
    );
  if (isLoading)
    return <main className="qr-payment-page"><div className="qr-payment-shell" aria-busy="true" aria-live="polite"><Skeleton width={140} height={18} /><Skeleton width="48%" height={42} /><Skeleton width="68%" /><section className="qr-payment-card qr-payment-loading__card"><Skeleton height={300} width="min(400px, 70vw)" /><div className="qr-payment-loading__details"><Skeleton height={48} /><Skeleton height={48} /><Skeleton height={48} /><Skeleton height={48} /></div></section></div></main>;

  if (!payment)
    return <main className="qr-payment-page"><div className="qr-payment-empty"><QrCode size={34} /><h1>{ticket("cannotPayment")}</h1><button type="button" onClick={() => navigate("/checkout")}>{ticket("retry")}</button></div></main>;

  return (
    <main className="qr-payment-page">
      <div className="qr-payment-shell">
        <button
          className="qr-payment-back"
          type="button"
          onClick={() => navigate("/checkout")}
        >
          <ArrowLeft size={17} /> {ticket("backCheckout")}
        </button>
        <header className="qr-payment-heading">
          <p>
            <QrCode size={16} /> {ticket("stepTwo")}
          </p>
          <h1>{ticket("scanQr")}</h1>
          <span>{ticket("scanQrText")}</span>
        </header>
        <section className={`qr-payment-card${isExpired ? " qr-payment-card--expired" : ""}`}>
          <div className="qr-payment-left">
            <div className="qr-payment-code" aria-label={ticket("qrLabel")}>
              <img
                src={`https://img.vietqr.io/image/${payment.bin}-${payment.accountNumber}-compact2.png?amount=${payment.amount}&addInfo=${encodeURIComponent(payment.description)}&accountName=${encodeURIComponent(payment.accountName)}`}
                alt={ticket("qrAlt")}
              />
            </div>
          </div>
          <div className="qr-payment-details">
            <div className="qr-payment-amount">
              <span>{ticket("paymentAmount")}</span>
              <strong>{new Intl.NumberFormat("vi-VN").format(total)} VND</strong>
            </div>
            <div className="qr-payment-countdown">
              {ticket("paymentTime")}: <strong>{String(Math.floor(remainingSeconds / 60)).padStart(2, "0")}:{String(remainingSeconds % 60).padStart(2, "0")}</strong>
            </div>
            <div className="qr-payment-instructions">
              <h2>{ticket("bankInfo")}</h2>
              <div>
                <span>{ticket("bank")}</span>
                <strong>{ticket("bankName")}</strong>
              </div>
              <div>
                <span>{ticket("accountNumber")}</span>
                <strong>{payment.accountNumber}</strong>
              </div>
              <div>
                <span>{ticket("accountName")}</span>
                <strong>{payment.accountName}</strong>
              </div>
              <div>
                <span>{ticket("transferContent")}</span>
                <button type="button" onClick={copyCode}>
                  {payment.description} <Copy size={15} />
                </button>
              </div>
            </div>
            <div className="qr-payment-note">
              <ShieldCheck size={17} /> {ticket("paymentNotice")}
            </div>
            {/* Nút "Tôi đã thanh toán" tạm ẩn; trạng thái được đồng bộ tự động từ PayOS. */}
            {/* <button
              className="qr-payment-complete"
              type="button"
              onClick={() => window.open(payment.checkoutUrl, "_blank", "noopener,noreferrer")}
            >
              <Check size={18} /> {ticket("paidButton")}
            </button> */}
            <button className="qr-payment-cancel" type="button" onClick={() => setShowCancelModal(true)} disabled={isCancelling || isExpired}>
              {isCancelling ? ticket("canceling") : ticket("cancelOrder")}
            </button>
          </div>
          {isExpired && (
            <div className="qr-payment-expired-overlay" role="alert">
              <QrCode size={34} />
              <strong>{ticket("payExpired")}</strong>
              <span>{ticket("payAgain")}</span>
              <button type="button" onClick={() => navigate("/cart", { replace: true })}>
                {ticket("backCart")}
              </button>
            </div>
          )}
        </section>
      </div>
      <LogoutModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelPayment}
        title={ticket("cancelOrder")}
        description={ticket("cancelOrderText")}
        cancelLabel={ticket("keepOrder")}
        confirmLabel={ticket("confirmCancel")}
      />
    </main>
  );
};

export default QRPayment;
