import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Copy, QrCode, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import paymentAPI from "../../apis/paymentAPI";
import { translateError } from "../../utils/translateResponse";
import { notifyCartUpdated } from "../../utils/flyingToCart";
import LogoutModal from "../../components/LogoutModal";
import "./QRPayment.scss";

const PAYMENT_KEY = "fptu-halloween-payos-payment";

const QRPayment = () => {
  const navigate = useNavigate();
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
    const loadingToast = toast.loading("Đang tạo mã QR thanh toán...");

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
        toast.success("Tạo mã QR thanh toán thành công", { id: loadingToast });
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
    toast.error("Mã QR đã hết hạn. Vui lòng tạo thanh toán lại.");
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
      toast.success("Đã huỷ đơn hàng.");
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
          toast.success("Thanh toán thành công. Vé đã được phát hành.");
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
          <h1>Chưa có đơn thanh toán</h1>
          <button type="button" onClick={() => navigate("/cart")}>
            Quay lại giỏ vé
          </button>
        </section>
      </main>
    );
  if (isLoading)
    return <main className="qr-payment-page"><div className="qr-payment-shell qr-payment-loading" aria-busy="true" aria-live="polite"><div className="qr-payment-loading__back" /><header className="qr-payment-heading"><p><QrCode size={16} /> Bước 2 / 2</p><h1>Đang tạo mã thanh toán...</h1><span>Vui lòng chờ trong giây lát.</span></header><section className="qr-payment-card qr-payment-loading__card"><div className="qr-payment-loading__qr" /><div className="qr-payment-loading__details"><div className="qr-payment-loading__line qr-payment-loading__line--wide" /><div className="qr-payment-loading__line" /><div className="qr-payment-loading__line" /><div className="qr-payment-loading__line qr-payment-loading__line--short" /></div></section></div></main>;

  if (!payment)
    return <main className="qr-payment-page"><div className="qr-payment-empty"><QrCode size={34} /><h1>Không thể tạo thanh toán</h1><button type="button" onClick={() => navigate("/checkout")}>Thử lại</button></div></main>;

  return (
    <main className="qr-payment-page">
      <div className="qr-payment-shell">
        <button
          className="qr-payment-back"
          type="button"
          onClick={() => navigate("/checkout")}
        >
          <ArrowLeft size={17} /> Quay lại xác nhận đơn
        </button>
        <header className="qr-payment-heading">
          <p>
            <QrCode size={16} /> Bước 2 / 2
          </p>
          <h1>Quét mã để thanh toán</h1>
          <span>Hoàn tất thanh toán để nhận vé điện tử.</span>
        </header>
        <section className={`qr-payment-card${isExpired ? " qr-payment-card--expired" : ""}`}>
          <div className="qr-payment-left">
            <div className="qr-payment-code" aria-label="Mã QR thanh toán">
              <img
                src={`https://img.vietqr.io/image/${payment.bin}-${payment.accountNumber}-compact2.png?amount=${payment.amount}&addInfo=${encodeURIComponent(payment.description)}&accountName=${encodeURIComponent(payment.accountName)}`}
                alt="Mã QR VietQR thanh toán PayOS"
              />
            </div>
          </div>
          <div className="qr-payment-details">
            <div className="qr-payment-amount">
              <span>Số tiền cần thanh toán</span>
              <strong>{new Intl.NumberFormat("vi-VN").format(total)} VND</strong>
            </div>
            <div className="qr-payment-countdown">
              Thời gian thanh toán còn lại: <strong>{String(Math.floor(remainingSeconds / 60)).padStart(2, "0")}:{String(remainingSeconds % 60).padStart(2, "0")}</strong>
            </div>
            <div className="qr-payment-instructions">
              <h2>Thông tin chuyển khoản</h2>
              <div>
                <span>Ngân hàng</span>
                <strong>MB - Ngân hàng TMCP Quân Đội</strong>
              </div>
              <div>
                <span>Số tài khoản</span>
                <strong>{payment.accountNumber}</strong>
              </div>
              <div>
                <span>Tên tài khoản</span>
                <strong>{payment.accountName}</strong>
              </div>
              <div>
                <span>Nội dung chuyển khoản</span>
                <button type="button" onClick={copyCode}>
                  {payment.description} <Copy size={15} />
                </button>
              </div>
            </div>
            <div className="qr-payment-note">
              <ShieldCheck size={17} /> Sau khi chuyển khoản, hệ thống sẽ xác nhận
              và phát hành vé điện tử.
            </div>
            {/* Nút "Tôi đã thanh toán" tạm ẩn; trạng thái được đồng bộ tự động từ PayOS. */}
            {/* <button
              className="qr-payment-complete"
              type="button"
              onClick={() => window.open(payment.checkoutUrl, "_blank", "noopener,noreferrer")}
            >
              <Check size={18} /> Tôi đã thanh toán
            </button> */}
            <button className="qr-payment-cancel" type="button" onClick={() => setShowCancelModal(true)} disabled={isCancelling || isExpired}>
              {isCancelling ? "Đang huỷ đơn..." : "Huỷ đơn hàng"}
            </button>
          </div>
          {isExpired && (
            <div className="qr-payment-expired-overlay" role="alert">
              <QrCode size={34} />
              <strong>Mã QR đã hết hạn</strong>
              <span>Vui lòng thanh toán lại.</span>
              <button type="button" onClick={() => navigate("/cart", { replace: true })}>
                Quay lại giỏ hàng
              </button>
            </div>
          )}
        </section>
      </div>
      <LogoutModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelPayment}
        title="Huỷ đơn hàng"
        description="Bạn muốn huỷ đơn hàng này?<br />Bạn có chắc chắn không?"
        cancelLabel="Không, giữ lại đơn"
        confirmLabel="Đúng, huỷ đơn hàng"
      />
    </main>
  );
};

export default QRPayment;
