import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { authAPI } from "../../apis/authAPI";
import { translateError, translateSuccess } from "../../utils/translateResponse";
import wtmLogo from "../../assets/wtm.png";
import "./ForgotPassword.scss";

const rules = [{ id: "length", label: "Ít nhất 8 ký tự", test: (value) => value.length >= 8 }];

export default function ForgotPassword() {
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const passed = rules.every((rule) => rule.test(newPassword));
  const matched = newPassword.length > 0 && newPassword === confirmPassword;

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading(step === 0 ? "Đang gửi mã xác thực..." : step === 1 ? "Đang xác thực OTP..." : "Đang đặt lại mật khẩu...");
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
          toast.error("Mật khẩu mới chưa hợp lệ hoặc xác nhận chưa khớp.", { id: loadingToast });
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
          <h1 className="cp-card__title">{step === 0 ? "Quên mật khẩu" : step === 1 ? "Xác thực OTP" : "Đặt lại mật khẩu"}</h1>
          <p className="cp-card__subtitle">{step === 0 ? "Nhập email để nhận mã xác thực" : step === 1 ? "Nhập mã OTP đã được gửi đến email của bạn" : "Tạo mật khẩu mới cho tài khoản của bạn"}</p>
        </div>

        <form className="cp-form" onSubmit={submit} noValidate>
          {step === 0 && <div className="cp-field"><label className="cp-field__label" htmlFor="forgot-email">Email</label><div className="cp-input-shell"><input id="forgot-email" type="email" placeholder="Nhập email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div></div>}
          {step === 1 && <div className="cp-field"><label className="cp-field__label" htmlFor="forgot-otp">Mã OTP</label><div className="cp-input-shell"><input id="forgot-otp" inputMode="numeric" maxLength={6} placeholder="Nhập mã OTP" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} required /></div></div>}
          {step === 2 && <>
            <div className="cp-field"><label className="cp-field__label" htmlFor="forgot-password">Mật khẩu mới</label><div className="cp-input-shell"><input id="forgot-password" type="password" placeholder="Nhập mật khẩu mới" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} minLength={8} required /></div></div>
            {newPassword.length > 0 && <div className="cp-strength"><div className="cp-strength__bars">{[1, 2, 3, 4].map((n) => <span key={n} className="cp-strength__bar" style={{ background: n <= (passed ? 4 : 1) ? (passed ? "#16a34a" : "#ef4444") : "#e5e7eb" }} />)}</div><p className="cp-strength__label" style={{ color: passed ? "#16a34a" : "#ef4444" }}>{passed ? "Mạnh" : "Yếu"}</p></div>}
            <ul className="cp-rules">{rules.map((rule) => <li key={rule.id} className={`cp-rules__item${rule.test(newPassword) ? " is-ok" : ""}`}><span className="cp-rules__dot" /><span>{rule.label}</span></li>)}</ul>
            <div className="cp-field"><label className="cp-field__label" htmlFor="forgot-confirm">Nhập lại mật khẩu mới</label><div className="cp-input-shell"><input id="forgot-confirm" type="password" placeholder="Nhập lại mật khẩu mới" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required /></div>{confirmPassword && !matched && <p className="cp-field__error">Mật khẩu xác nhận không khớp</p>}</div>
          </>}
          <button className="cp-submit" type="submit" disabled={loading}>{loading ? "Đang xử lý..." : step === 0 ? "Gửi mã xác thực" : step === 1 ? "Xác thực OTP" : "Đặt lại mật khẩu"}</button>
          <p className="cp-back-link"><a href="/login">Quay lại đăng nhập</a></p>
        </form>
      </div>
    </main>
  );
}
