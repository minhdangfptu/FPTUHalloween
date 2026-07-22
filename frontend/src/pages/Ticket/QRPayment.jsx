import React, { useMemo } from "react";
import { ArrowLeft, Check, Copy, QrCode, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./QRPayment.scss";

const QRPayment = () => {
  const navigate = useNavigate();
  const checkout = useMemo(
    () => JSON.parse(localStorage.getItem("fptu-halloween-checkout") || "null"),
    [],
  );
  const paymentCode = `HLW${Date.now().toString().slice(-8)}`;
  const total = checkout?.total || 0;
  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(paymentCode);
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
        <section className="qr-payment-card">
          <div className="qr-payment-left">
            <div className="qr-payment-code" aria-label="Mã QR thanh toán">
              <div className="qr-payment-pattern">
                {Array.from({ length: 49 }, (_, index) => (
                  <i
                    className={
                      (index * 7 + (index % 3)) % 5 < 2 ? "is-filled" : ""
                    }
                    key={index}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="qr-payment-details">
            <div className="qr-payment-amount">
              <span>Số tiền cần thanh toán</span>
              <strong>{new Intl.NumberFormat("vi-VN").format(total)} VND</strong>
            </div>
            <div className="qr-payment-instructions">
              <h2>Thông tin chuyển khoản</h2>
              <div>
                <span>Ngân hàng</span>
                <strong>Thông tin sẽ được cập nhật</strong>
              </div>
              <div>
                <span>Nội dung chuyển khoản</span>
                <button type="button" onClick={copyCode}>
                  {paymentCode} <Copy size={15} />
                </button>
              </div>
            </div>
            <div className="qr-payment-note">
              <ShieldCheck size={17} /> Sau khi chuyển khoản, hệ thống sẽ xác nhận
              và phát hành vé điện tử.
            </div>
            <button
              className="qr-payment-complete"
              type="button"
              onClick={() => navigate("/complete-payment")}
            >
              <Check size={18} /> Tôi đã thanh toán
            </button>
          </div>
        </section>
      </div>
    </main>
  );
};

export default QRPayment;
