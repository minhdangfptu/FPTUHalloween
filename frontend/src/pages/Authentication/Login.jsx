import React, { useState } from "react";
import "./Login.css";
import loginImg from "../../assets/login.png";
import coverImg from "../../assets/cover-01.png";
import fbgc from "../../assets/fbgc.png";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../../apis/authAPI";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      await authAPI.login({ identifier: email, password });
      navigate("/");
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || "Đăng nhập thất bại";
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Cột trái: form */}
      <div className="left-pane">
        <div className="login-top">
          <div className="login-box">
            <img className="login-logo" src={loginImg} alt="FPTU Halloween" />
            <div className="login-panel">
              <form onSubmit={onSubmit}>
                <label className="form-label" htmlFor="email">
                  Email
                </label>
                <input
                  backgroundColor="white"
                  style={{ backgroundColor: "white" }}
                  id="email"
                  className="form-input"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <div style={{ height: 12 }} />
                <label className="form-label" htmlFor="password">
                  Mật khẩu
                </label>
                <input
                  placeholder="Mật khẩu"
                  id="password"
                  className="form-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div style={{ height: 14 }} />
                {errorMessage && (
                  <div style={{ color: "#d32f2f", marginBottom: 8, fontSize: 14 }}>{errorMessage}</div>
                )}
                <button className="btn-primary" type="submit" disabled={loading}>
                  {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                </button>
                <div style={{ marginTop: 8, textAlign: "center" }}>
                  <a className="link-muted" href="/forgot-password">
                    Quên mật khẩu?
                  </a>
                </div>
              </form>
            </div>

            <div style={{ marginTop: 12 }} className="text-muted">
              Hoặc
            </div>
            <div style={{ marginTop: 12 , cursor: "pointer"}} >
              <button type="button" className="oauth-btn" onClick={() => navigate("/login/fbgc")}>
                <span aria-hidden className="google-swatch">
                  <img
                    style={{ width: "20px", height: "20px" }}
                    src={fbgc}
                    alt="FBGC"
                  />
                </span>
                <span style={{ color: "black" }}>
                  Đăng nhập với tài khoản FBGC
                </span>
              </button>
            </div>

            <div style={{ marginTop: 16 }} className="text-muted">
              Bạn chưa có tài khoản?{" "}
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
        className="right-cover"
        aria-hidden
        style={{ backgroundImage: `url(${coverImg})` }}
      />
    </div>
  );
}

export default Login;
