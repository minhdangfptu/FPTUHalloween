import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { authAPI } from "../../apis/authAPI";
import { translateError, translateSuccess } from "../../utils/translateResponse";
import wtmLogo from "../../assets/wtm.png";
import "./ForgotPassword.scss";
import { useTranslation } from "react-i18next";

const rules = [{ id: "length", test: (value) => value.length >= 8 }];

export default function ForgotPassword() {
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const auth = (key) => t(`auth.forgot.${key}`);
  const passed = rules.every((rule) => rule.test(newPassword));
  const matched = newPassword.length > 0 && newPassword === confirmPassword;

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading(step === 0 ? auth("sendOtp") : step === 1 ? auth("verifyOtp") : auth("reset"));
    try {
      if (step === 0) {
        const response = await authAPI.forgotPassword(email);
        setStep(1);
        toast.success(translateSuccess(response.message || "Reset password OTP sent successfully"), { id: loadingToast });
      } else if (step === 1) {
        const response = await authAPI.confirmOtp({ identifier: email, otp, purpose: "reset-password" });
        setResetToken(response.resetToken);
        setStep(2);
        toast.success(translateSuccess(response.message || "Operation successful"), { id: loadingToast });
      } else {
        if (!passed || !matched) {
          toast.error(auth("mismatch"), { id: loadingToast });
          return;
        }
        const response = await authAPI.resetPassword({ email, resetToken, newPassword });
        toast.success(translateSuccess(response.message || "Password reset successfully"), { id: loadingToast });
        navigate("/login");
      }
    } catch (error) {
      toast.error(translateError(error), { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="cp-page fp-page">
      <div className="cp-card">
        <div className="cp-card__header">
          <img className="cp-brand-logo" src={wtmLogo} alt="FPTU Halloween" />
          <h1 className="cp-card__title">{step === 0 ? auth("titleEmail") : step === 1 ? auth("titleOtp") : auth("titleReset")}</h1>
          <p className="cp-card__subtitle">{step === 0 ? auth("subtitleEmail") : step === 1 ? auth("subtitleOtp") : auth("subtitleReset")}</p>
        </div>

        <form className="cp-form" onSubmit={submit} noValidate>
          {step === 0 && <div className="cp-field"><label className="cp-field__label" htmlFor="forgot-email">Email</label><div className="cp-input-shell"><input id="forgot-email" type="email" placeholder={auth("emailPlaceholder")} value={email} onChange={(e) => setEmail(e.target.value)} required /></div></div>}
          {step === 1 && <div className="cp-field"><label className="cp-field__label" htmlFor="forgot-otp">OTP</label><div className="cp-input-shell"><input id="forgot-otp" inputMode="numeric" maxLength={6} placeholder={auth("otpPlaceholder")} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} required /></div></div>}
          {step === 2 && <>
            <div className="cp-field"><label className="cp-field__label" htmlFor="forgot-password">{auth("password")}</label><div className="cp-input-shell"><input id="forgot-password" type="password" placeholder={auth("passwordPlaceholder")} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} minLength={8} required /></div></div>
            {newPassword.length > 0 && <div className="cp-strength"><div className="cp-strength__bars">{[1, 2, 3, 4].map((n) => <span key={n} className="cp-strength__bar" style={{ background: n <= (passed ? 4 : 1) ? (passed ? "#16a34a" : "#ef4444") : "#e5e7eb" }} />)}</div><p className="cp-strength__label" style={{ color: passed ? "#16a34a" : "#ef4444" }}>{passed ? auth("strong") : auth("weak")}</p></div>}
            <ul className="cp-rules">{rules.map((rule) => <li key={rule.id} className={`cp-rules__item${rule.test(newPassword) ? " is-ok" : ""}`}><span className="cp-rules__dot" /><span>{auth("length")}</span></li>)}</ul>
            <div className="cp-field"><label className="cp-field__label" htmlFor="forgot-confirm">{auth("confirm")}</label><div className="cp-input-shell"><input id="forgot-confirm" type="password" placeholder={auth("confirm")} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required /></div>{confirmPassword && !matched && <p className="cp-field__error">{auth("mismatch")}</p>}</div>
          </>}
          <button className="cp-submit" type="submit" disabled={loading}>{loading ? auth("processing") : step === 0 ? auth("send") : step === 1 ? auth("verify") : auth("submit")}</button>
          <p className="cp-back-link"><a href="/login">{auth("back")}</a></p>
        </form>
      </div>
    </main>
  );
}
