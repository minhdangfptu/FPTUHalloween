import React, { useEffect, useState } from "react";
import { CheckCircle2, Ticket } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import paymentAPI from "../../apis/paymentAPI";
import "./CompletePayment.scss";

const CompletePayment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderCode = searchParams.get("orderCode");
  const [isChecking, setIsChecking] = useState(true);
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    if (!orderCode) {
      setIsChecking(false);
      setStatus("failed");
      return undefined;
    }
    paymentAPI.getPayOSStatus(orderCode)
      .then((result) => {
        const nextStatus = result.status === "PAID" ? "paid" : result.status === "PROCESSING" ? "processing" : "pending";
        setStatus(nextStatus);
        if (nextStatus !== "paid") toast.error("Thanh toán chưa được xác nhận hoàn tất.");
      })
      .catch(() => { setStatus("failed"); toast.error("Không thể kiểm tra trạng thái đơn hàng."); })
      .finally(() => setIsChecking(false));
    return undefined;
  }, [orderCode]);

  return (
    <main className="complete-payment-page">
      <section className="complete-payment-card">
        <div className="complete-payment-icon"><CheckCircle2 size={36} /></div>
        <p className="complete-payment-kicker"><Ticket size={15} /> FPTU Halloween</p>
        <h1>{isChecking ? "Đang xác nhận thanh toán" : status === "paid" ? "Thanh toán thành công" : "Đang chờ xác nhận"}</h1>
        <p className="complete-payment-lede">
          {isChecking ? "Hệ thống đang kiểm tra giao dịch và phát hành vé điện tử." : status === "paid" ? "Vé điện tử của bạn đã được phát hành thành công." : "Giao dịch chưa hoàn tất. Vui lòng chờ webhook hoặc thử lại sau."}
        </p>
        <div className="complete-payment-actions">
          <button type="button" onClick={() => navigate("/user-profile")}>Xem vé của tôi</button>
          <button type="button" className="is-secondary" onClick={() => navigate("/")}>Về trang chủ</button>
        </div>
      </section>
    </main>
  );
};

export default CompletePayment;
