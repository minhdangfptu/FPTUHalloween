import React, { useState } from "react";
import "./Register.css";
import loginImg from "../../assets/login.png";
import coverImg from "../../assets/cover-01.png";
import fbgc from "../../assets/fbgc.png";

function Register() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    full_name: "",
    phone_number: ""
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Mật khẩu là bắt buộc";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = "Xác nhận mật khẩu là bắt buộc";
    } else if (formData.password !== confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu không khớp";
    }

    // Full name validation
    if (!formData.full_name) {
      newErrors.full_name = "Họ tên là bắt buộc";
    } else if (formData.full_name.length < 2) {
      newErrors.full_name = "Họ tên phải có ít nhất 2 ký tự";
    }

    // Phone number validation
    if (!formData.phone_number) {
      newErrors.phone_number = "Số điện thoại là bắt buộc";
    } else if (!/^[0-9+\-\s()]+$/.test(formData.phone_number)) {
      newErrors.phone_number = "Số điện thoại không hợp lệ";
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
      // TODO: Gọi API register
      console.log("Register data:", formData);
      alert("Đăng ký thành công!");
    } catch (error) {
      console.error("Register error:", error);
      alert("Có lỗi xảy ra khi đăng ký");
    }
  };

  return (
    <div className="fptu-halloween-register-page">
      {/* Cột trái: form */}
      <div className="fptu-halloween-register-left-pane">
        <div className="fptu-halloween-register-top">
          <div className="fptu-halloween-register-box">
            <img className="fptu-halloween-register-logo" src={loginImg} alt="FPTU Halloween" />
            <div className="fptu-halloween-register-panel">
              <form onSubmit={onSubmit}>
                <label className="fptu-halloween-register-form-label" htmlFor="full_name">
                  Họ và tên
                </label>
                <input
                  id="full_name"
                  name="full_name"
                  className="fptu-halloween-register-form-input"
                  type="text"
                  placeholder="Nhập họ và tên"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  required
                />
                {errors.full_name && (
                  <div className="fptu-halloween-register-error-message">{errors.full_name}</div>
                )}
                <div style={{ height: 12 }} />

                <label className="fptu-halloween-register-form-label" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  className="fptu-halloween-register-form-input"
                  type="email"
                  placeholder="Nhập email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                {errors.email && (
                  <div className="fptu-halloween-register-error-message">{errors.email}</div>
                )}
                <div style={{ height: 12 }} />

                <label className="fptu-halloween-register-form-label" htmlFor="phone_number">
                  Số điện thoại
                </label>
                <input
                  id="phone_number"
                  name="phone_number"
                  className="fptu-halloween-register-form-input"
                  type="tel"
                  placeholder="Nhập số điện thoại"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  required
                />
                {errors.phone_number && (
                  <div className="fptu-halloween-register-error-message">{errors.phone_number}</div>
                )}
                <div style={{ height: 12 }} />

                <label className="fptu-halloween-register-form-label" htmlFor="password">
                  Mật khẩu
                </label>
                <input
                  id="password"
                  name="password"
                  className="fptu-halloween-register-form-input"
                  type="password"
                  placeholder="Nhập mật khẩu"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                {errors.password && (
                  <div className="fptu-halloween-register-error-message">{errors.password}</div>
                )}
                <div style={{ height: 12 }} />

                <label className="fptu-halloween-register-form-label" htmlFor="confirmPassword">
                  Xác nhận mật khẩu
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  className="fptu-halloween-register-form-input"
                  type="password"
                  placeholder="Nhập lại mật khẩu"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) {
                      setErrors(prev => ({
                        ...prev,
                        confirmPassword: ""
                      }));
                    }
                  }}
                  required
                />
                {errors.confirmPassword && (
                  <div className="fptu-halloween-register-error-message">{errors.confirmPassword}</div>
                )}
                <div style={{ height: 14 }} />

                <button className="fptu-halloween-register-btn-primary" type="submit">
                  Đăng ký
                </button>
              </form>
            </div>


            <div style={{ marginTop: 16 }} className="fptu-halloween-register-text-muted">
              Đã có tài khoản?{" "}
              <a
                href="/login"
                style={{
                  color: "red",
                  textDecoration: "underline",
                  fontWeight: 600,
                }}
              >
                Đăng nhập
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Cột phải: ảnh cover */}
      <div
        className="fptu-halloween-register-right-cover"
        aria-hidden
        style={{ backgroundImage: `url(${coverImg})` }}
      />
    </div>
  );
}

export default Register;