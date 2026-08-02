import React, { useState, useEffect } from "react";
import "./ConfirmEmail.css";
import loginImg from "../../assets/login.png";
import coverImg from "../../assets/cover-01.png";
import { authAPI } from "../../apis/authAPI";
import toast from "react-hot-toast";
import { translateError, translateSuccess } from "../../utils/translateResponse";
import { useTranslation } from "react-i18next";

function ConfirmEmail() {
  const [verificationCode, setVerificationCode] = useState("");
  const [errors, setErrors] = useState({});
  const [isResending, setIsResending] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [email, setEmail] = useState(""); // Email từ URL params hoặc localStorage
  const { t } = useTranslation();
  const auth = (key, options) => t(`auth.confirm.${key}`, options);

  useEffect(() => {
    // Lấy email từ URL params hoặc localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const emailFromParams = urlParams.get('email');
    const emailFromStorage = localStorage.getItem('registerEmail');
    setEmail(emailFromParams || emailFromStorage || 'your-email@example.com');
  }, []);

  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Chỉ cho phép số
    if (value.length <= 6) {
      setVerificationCode(value);
      // Clear error when user starts typing
      if (errors.verificationCode) {
        setErrors(prev => ({
          ...prev,
          verificationCode: ""
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!verificationCode) {
      newErrors.verificationCode = auth("required");
    } else if (verificationCode.length !== 6) {
      newErrors.verificationCode = auth("length");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const loadingToast = toast.loading(auth("submit"));
      await authAPI.confirmOtp({ identifier: email, otp: verificationCode, purpose: "register" });
      toast.success(translateSuccess("Registration successful"), { id: loadingToast });
      localStorage.removeItem("registerEmail");
      window.location.href = "/";
      return;
    } catch (error) {
      console.error("Verification error:", error);
      toast.error(translateError(error));
      setErrors({ verificationCode: auth("invalid") });
    }
  };

  const handleResendCode = async () => {
    if (resendCountdown > 0) return;

    try {
      setIsResending(true);
      
      // TODO: Gọi API gửi lại mã
      console.log("Resending verification code to:", email);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert(auth("sent", { email }));
      
      // Start countdown
      setResendCountdown(60);
      const countdownInterval = setInterval(() => {
        setResendCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
    } catch (error) {
      console.error("Resend error:", error);
      alert(auth("invalid"));
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="fptu-halloween-confirm-email-page">
      {/* Cột trái: form */}
      <div className="fptu-halloween-confirm-email-left-pane">
        <div className="fptu-halloween-confirm-email-top">
          <div className="fptu-halloween-confirm-email-box">
            <img className="fptu-halloween-confirm-email-logo" src={loginImg} alt="FPTU Halloween" />
            <div className="fptu-halloween-confirm-email-panel">
              <div className="fptu-halloween-confirm-email-header">
                <h2>{auth("title")}</h2>
                <p className="fptu-halloween-confirm-email-description">
                  {auth("sent", { email })}
                </p>
                <p className="fptu-halloween-confirm-email-instruction">
                  {auth("instruction")}
                </p>
              </div>

              <form onSubmit={onSubmit}>
                <label className="fptu-halloween-confirm-email-form-label" htmlFor="verificationCode">
                  {auth("code")}
                </label>
                <input
                  id="verificationCode"
                  name="verificationCode"
                  className="fptu-halloween-confirm-email-form-input fptu-halloween-confirm-email-verification-code-input"
                  type="text"
                  placeholder={auth("placeholder")}
                  value={verificationCode}
                  onChange={handleCodeChange}
                  maxLength={6}
                  required
                />
                {errors.verificationCode && (
                  <div className="fptu-halloween-confirm-email-error-message">{errors.verificationCode}</div>
                )}
                <div style={{ height: 14 }} />

                <button className="fptu-halloween-confirm-email-btn-primary" type="submit">
                  {auth("submit")}
                </button>
              </form>

              <div className="fptu-halloween-confirm-email-resend-section">
                <p className="fptu-halloween-confirm-email-resend-text">
                  {auth("notReceived")}
                </p>
                <button 
                  type="button" 
                  className="fptu-halloween-confirm-email-resend-btn"
                  onClick={handleResendCode}
                  disabled={isResending || resendCountdown > 0}
                >
                  {isResending ? auth("sending") : resendCountdown > 0 ? `${auth("resend")} (${resendCountdown}s)` : auth("resend")}
                </button>
              </div>
            </div>

            <div style={{ marginTop: 16 }} className="fptu-halloween-confirm-email-text-muted">
              {auth("back")} {" "}
              <a
                href="/register"
                style={{
                  color: "red",
                  textDecoration: "underline",
                  fontWeight: 600,
                }}
              >
                {auth("register")}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Cột phải: ảnh cover */}
      <div
        className="fptu-halloween-confirm-email-right-cover"
        aria-hidden
        style={{ backgroundImage: `url(${coverImg})` }}
      />
    </div>
  );
}

export default ConfirmEmail;
