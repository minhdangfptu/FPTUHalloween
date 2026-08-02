import React, { useEffect, useState } from "react";
import { CheckCircle2, Ticket } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import paymentAPI from "../../apis/paymentAPI";
import "./CompletePayment.scss";

const CompletePayment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderCode = searchParams.get("orderCode");
  const [isChecking, setIsChecking] = useState(true);
  const [status, setStatus] = useState("checking");
  const { t } = useTranslation();
  const page = (key) => t(`pages.payment.${key}`);

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
        if (nextStatus !== "paid") toast.error(page("notConfirmed"));
      })
      .catch(() => { setStatus("failed"); toast.error(page("statusError")); })
      .finally(() => setIsChecking(false));
    return undefined;
  }, [orderCode]);

  return (
    <main className="complete-payment-page">
      <section className="complete-payment-card">
        <div className="complete-payment-icon"><CheckCircle2 size={36} /></div>
        <p className="complete-payment-kicker"><Ticket size={15} /> FPTU Halloween</p>
        <h1>{isChecking ? page("checking") : status === "paid" ? page("success") : page("waiting")}</h1>
        <p className="complete-payment-lede">
          {isChecking ? page("checkingText") : status === "paid" ? page("successText") : page("waitingText")}
        </p>
        <div className="complete-payment-actions">
          <button type="button" onClick={() => navigate("/user-profile")}>{page("myTickets")}</button>
          <button type="button" className="is-secondary" onClick={() => navigate("/")}>{page("home")}</button>
        </div>
      </section>
    </main>
  );
};

export default CompletePayment;
