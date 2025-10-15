import React, { useState, useEffect } from "react";
import "./ConfirmEmail.css";
import loginImg from "../../assets/login.png";
import coverImg from "../../assets/cover-01.png";

function ConfirmEmail() {
  const [verificationCode, setVerificationCode] = useState("");
  const [errors, setErrors] = useState({});
  const [isResending, setIsResending] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [email, setEmail] = useState(""); // Email từ URL params hoặc localStorage

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
      newErrors.verificationCode = "Mã xác thực là bắt buộc";
    } else if (verificationCode.length !== 6) {
      newErrors.verificationCode = "Mã xác thực phải có đúng 6 số";
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
      // TODO: Gọi API xác thực mã
      console.log("Verification code:", verificationCode);
      console.log("Email:", email);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert("Xác thực thành công! Bạn có thể đăng nhập.");
      // Redirect to login or complete registration
      window.location.href = '/login';
    } catch (error) {
      console.error("Verification error:", error);
      setErrors({ verificationCode: "Mã xác thực không đúng" });
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
      
      alert("Mã xác thực mới đã được gửi đến email của bạn!");
      
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
      alert("Có lỗi xảy ra khi gửi lại mã. Vui lòng thử lại.");
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
                <h2>Xác thực Email</h2>
                <p className="fptu-halloween-confirm-email-description">
                  Chúng tôi đã gửi mã xác thực đến email <strong>{email}</strong>
                </p>
                <p className="fptu-halloween-confirm-email-instruction">
                  Vui lòng nhập mã 6 số dưới đây để hoàn tất đăng ký
                </p>
              </div>

              <form onSubmit={onSubmit}>
                <label className="fptu-halloween-confirm-email-form-label" htmlFor="verificationCode">
                  Mã xác thực
                </label>
                <input
                  id="verificationCode"
                  name="verificationCode"
                  className="fptu-halloween-confirm-email-form-input fptu-halloween-confirm-email-verification-code-input"
                  type="text"
                  placeholder="Nhập mã 6 số"
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
                  Xác thực
                </button>
              </form>

              <div className="fptu-halloween-confirm-email-resend-section">
                <p className="fptu-halloween-confirm-email-resend-text">
                  Chưa nhận được mã?
                </p>
                <button 
                  type="button" 
                  className="fptu-halloween-confirm-email-resend-btn"
                  onClick={handleResendCode}
                  disabled={isResending || resendCountdown > 0}
                >
                  {isResending ? 'Đang gửi...' : 
                   resendCountdown > 0 ? `Gửi lại (${resendCountdown}s)` : 
                   'Gửi lại mã'}
                </button>
              </div>
            </div>

            <div style={{ marginTop: 16 }} className="fptu-halloween-confirm-email-text-muted">
              Quay lại{" "}
              <a
                href="/register"
                style={{
                  color: "red",
                  textDecoration: "underline",
                  fontWeight: 600,
                }}
              >
                Đăng ký
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
