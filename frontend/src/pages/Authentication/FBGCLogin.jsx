import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { authAPI } from "../../apis/authAPI";
import {
  translateError,
  translateSuccess,
} from "../../utils/translateResponse";
import coverImg from "../../assets/cover.jpg";
import fbgcLogo from "../../assets/fbgc.png";
import "./FBGCLogin.scss";

const FBGCLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const loadingToast = toast.loading("Đang đăng nhập...");

    try {
      await authAPI.login({ identifier: username, password });
      window.dispatchEvent(new CustomEvent("auth:login"));
      toast.success(translateSuccess("Login successful"), { id: loadingToast });
      navigate("/");
    } catch (error) {
      toast.error(translateError(error), { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="fbgc-login-page">
      <Toaster position="top-center" />
      <section className="fbgc-login-form-pane">
        <div className="fbgc-login-box">
          <img
            className="fbgc-login-logo"
            src={fbgcLogo}
            alt="FPTU Board Game Club"
          />
          <h1>Đăng nhập</h1>
          <p className="fbgc-login-subtitle">
            Chào mừng bạn trở lại với FPTU Board Game Club
          </p>

          <form onSubmit={handleSubmit} className="fbgc-login-form">
            <label htmlFor="fbgc-username">Tên đăng nhập</label>
            <input
              id="fbgc-username"
              type="text"
              placeholder="Nhập tên đăng nhập"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              required
            />

            <label htmlFor="fbgc-password">Mật khẩu</label>
            <div className="fbgc-password-field"><input
              id="fbgc-password"
              type={showPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            /><button type="button" className="fbgc-password-toggle" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>

            <button type="submit" disabled={isLoading}>
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>

          <button
            type="button"
            className="fbgc-back-link"
            onClick={() => navigate("/login")}
          >
            Quay lại trang đăng nhập FPTU Halloween
          </button>
        </div>
      </section>
      <div
        className="fbgc-login-cover"
        style={{ backgroundImage: `url(${coverImg})` }}
        aria-hidden="true"
      />
    </main>
  );
};

export default FBGCLogin;
