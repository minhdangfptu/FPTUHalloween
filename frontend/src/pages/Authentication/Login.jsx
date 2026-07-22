import React, { useEffect, useState } from "react";
import "./Login.css";
import loginImg from "../../assets/login.png";
import coverImg from "../../assets/cover-01.png";
import fbgc from "../../assets/fbgc.png";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../../apis/authAPI";
import toast, { Toaster } from "react-hot-toast";
import {
  translateError,
  translateSuccess,
} from "../../utils/translateResponse";
import { Eye, EyeOff } from "lucide-react";

const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  "791057270396-1ei5hb7f9nmme6vq19vsao9qab8mgi45.apps.googleusercontent.com";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleClient, setGoogleClient] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeGoogle = () => {
      if (!window.google?.accounts?.oauth2) return;
      setGoogleClient(
        window.google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: "openid email profile",
          callback: () => {},
        }),
      );
    };
    if (window.google?.accounts?.oauth2) initializeGoogle();
    else {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogle;
      document.head.appendChild(script);
      return () => script.remove();
    }
    return undefined;
  }, []);

  const handleGoogleLogin = () => {
    if (!googleClient) {
      toast.error(
        translateError(
          new Error(
            "Google Login is not ready. Please try again in a few seconds.",
          ),
        ),
      );
      return;
    }
    googleClient.callback = async ({ access_token: accessToken, error }) => {
      if (error || !accessToken) {
        toast.error(translateError(new Error("Unable to login with Google.")));
        return;
      }
      const loadingToast = toast.loading("Đang đăng nhập với Google...");
      try {
        await authAPI.googleLogin({ accessToken });
        window.dispatchEvent(new CustomEvent("auth:login"));
        toast.success(translateSuccess("Login successful"), {
          id: loadingToast,
        });
        navigate("/");
      } catch (requestError) {
        toast.error(translateError(requestError), { id: loadingToast });
      }
    };
    googleClient.requestAccessToken();
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading("Đang đăng nhập...");
    try {
      await authAPI.login({ identifier: email, password });
      window.dispatchEvent(new CustomEvent("auth:login"));
      sessionStorage.setItem("showLoginWelcome", "1");
      toast.success(translateSuccess("Login successful"), { id: loadingToast });
      navigate("/");
    } catch (error) {
      toast.error(translateError(error), { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Toaster position="top-center" />
      <div className="left-pane">
        <div className="login-top">
          <div className="login-box">
            {/* <img className="login-logo" src={loginImg} alt="FPTU Halloween" /> */}
            <h1 className="auth-title">Đăng nhập</h1>
            <p className="auth-subtitle">
              Chào mừng bạn trở lại với FPTU Halloween
            </p>
            <div className="login-panel">
              <form onSubmit={onSubmit}>
                <label className="form-label" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  className="form-input"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
                <div style={{ height: 12 }} />
                <label className="form-label" htmlFor="password">
                  Mật khẩu
                </label>
                <div className="password-field">
                  <input
                    id="password"
                    className="form-input"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div style={{ height: 14 }} />
                <button
                  className="btn-primary"
                  type="submit"
                  disabled={loading}
                >
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
            <div style={{ marginTop: 12 }}>
              <button
                type="button"
                className="oauth-btn"
                onClick={handleGoogleLogin}
              >
                <span aria-hidden className="google-swatch">
                  <GoogleIcon />
                </span>
                <span style={{ color: "black" }}>Đăng nhập với Google</span>
              </button>
            </div>
            <div style={{ marginTop: 12 }} className="text-muted">
              Bạn là thành viên FPTU Board Game Club?
            </div>
            <div style={{ marginTop: 12 }}>
              <button
                type="button"
                className="oauth-btn"
                onClick={() => navigate("/fbgc-login")}
              >
                <span aria-hidden className="google-swatch">
                  <img
                    style={{ width: 20, height: 20 }}
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
      <div
        className="right-cover"
        aria-hidden
        style={{ backgroundImage: `url(${coverImg})` }}
      />
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M21.35 12.23c0-.72-.06-1.42-.18-2.09H12v3.96h5.24a4.48 4.48 0 0 1-1.94 2.94v2.44h3.14c1.84-1.69 2.91-4.18 2.91-7.25Z"
      />
      <path
        fill="#34A853"
        d="M12 21.5c2.63 0 4.84-.87 6.45-2.36l-3.14-2.44c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.52A9.74 9.74 0 0 0 12 21.5Z"
      />
      <path
        fill="#FBBC05"
        d="M6.54 13.59A5.85 5.85 0 0 1 6.23 12c0-.55.11-1.09.31-1.59V7.89H3.3A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.05 1.05 4.11l3.24-2.52Z"
      />
      <path
        fill="#EA4335"
        d="M12 6.38c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.46 14.63 2.5 12 2.5a9.74 9.74 0 0 0-8.7 5.39l3.24 2.52c.77-2.31 2.92-4.03 5.46-4.03Z"
      />
    </svg>
  );
}

export default Login;
