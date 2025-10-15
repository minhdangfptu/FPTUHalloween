import React, { useState, useEffect } from "react";
import "./CompleteRegister.css";
import loginImg from "../../assets/login.png";
import coverImg from "../../assets/cover-01.png";

function CompleteRegister() {
  const [email, setEmail] = useState("");
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    // Lấy email từ URL params hoặc localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const emailFromParams = urlParams.get('email');
    const emailFromStorage = localStorage.getItem('registerEmail');
    setEmail(emailFromParams || emailFromStorage || 'your-email@example.com');
    
    // Trigger success animation
    setShowAnimation(true);
  }, []);

  const handleGoToLogin = () => {
    // Clear registration data from localStorage
    localStorage.removeItem('registerEmail');
    // Redirect to login
    window.location.href = '/login';
  };

  return (
    <div className="fptu-halloween-complete-register-page">
      {/* Cột trái: form */}
      <div className="fptu-halloween-complete-register-left-pane">
        <div className="fptu-halloween-complete-register-top">
          <div className="fptu-halloween-complete-register-box">
            <img className="fptu-halloween-complete-register-logo" src={loginImg} alt="FPTU Halloween" />
            <div className="fptu-halloween-complete-register-panel">
              <div className="fptu-halloween-complete-register-header">
                {/* Success Icon */}
                <div className={`fptu-halloween-complete-register-success-icon ${showAnimation ? 'fptu-halloween-complete-register-animate' : ''}`}>
                  <svg 
                    width="80" 
                    height="80" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className="fptu-halloween-complete-register-success-checkmark"
                  >
                    <circle 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="#E63946" 
                      strokeWidth="2"
                      fill="none"
                      className="fptu-halloween-complete-register-success-circle"
                    />
                    <path 
                      d="M8 12l2 2 4-4" 
                      stroke="#E63946" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      className="fptu-halloween-complete-register-success-check"
                    />
                  </svg>
                </div>

                <h2>Đăng ký thành công!</h2>
                <p className="fptu-halloween-complete-register-description">
                  Chúc mừng! Tài khoản của bạn đã được tạo thành công.
                </p>
                <p className="fptu-halloween-complete-register-email">
                  Email: <strong>{email}</strong>
                </p>
                <p className="fptu-halloween-complete-register-instruction">
                  Bạn có thể đăng nhập ngay bây giờ để bắt đầu trải nghiệm FPTU Halloween 2025!
                </p>
              </div>

              <div className="fptu-halloween-complete-register-actions">
                <button 
                  className="fptu-halloween-complete-register-btn-primary" 
                  onClick={handleGoToLogin}
                >
                  Đăng nhập ngay
                </button>
                
              </div>
            </div>

            <div style={{ marginTop: 16 }} className="fptu-halloween-complete-register-text-muted">
              Cần hỗ trợ?{" "}
              <a
                href="/contact"
                style={{
                  color: "red",
                  textDecoration: "underline",
                  fontWeight: 600,
                }}
              >
                Liên hệ chúng tôi
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Cột phải: ảnh cover */}
      <div
        className="fptu-halloween-complete-register-right-cover"
        aria-hidden
        style={{ backgroundImage: `url(${coverImg})` }}
      />
    </div>
  );
}

export default CompleteRegister;
