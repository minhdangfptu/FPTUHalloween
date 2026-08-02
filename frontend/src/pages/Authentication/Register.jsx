import React, { useEffect, useState } from "react";
import "./Register.css";
import "./Login.css";
import loginImg from "../../assets/login.png";
import coverImg from "../../assets/cover-01.png";
import fbgc from "../../assets/fbgc.png";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../../apis/authAPI";
import toast from "react-hot-toast";
import {
  translateError,
  translateSuccess,
} from "../../utils/translateResponse";
import { Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function Register() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    full_name: "",
    phone_number: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverMessage, setServerMessage] = useState("");
  const [googleClient, setGoogleClient] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const auth = (key, options) => t(`auth.register.${key}`, options);

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
      const loadingToast = toast.loading(auth("googleLoading"));
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = auth("required", { field: "Email" });
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = auth("invalid", { field: "Email" });
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = auth("required", { field: auth("passwordPlaceholder") });
    } else if (formData.password.length < 6) {
      newErrors.password = auth("minPassword");
    }

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = auth("required", { field: auth("confirmPassword") });
    } else if (formData.password !== confirmPassword) {
      newErrors.confirmPassword = auth("passwordMismatch");
    }

    // Full name validation
    if (!formData.full_name) {
      newErrors.full_name = auth("required", { field: auth("fullName") });
    } else if (formData.full_name.length < 2) {
      newErrors.full_name = auth("minName");
    }

    // Phone number validation
    if (!formData.phone_number) {
      newErrors.phone_number = auth("required", { field: auth("phone") });
    } else if (!/^[0-9+\-\s()]+$/.test(formData.phone_number)) {
      newErrors.phone_number = auth("invalid", { field: auth("phone") });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setServerMessage("");
    const loadingToast = toast.loading(auth("registering"));

    try {
      await authAPI.register({
        email: formData.email,
        password: formData.password,
        fullName: formData.full_name,
        phone: formData.phone_number,
      });
      localStorage.setItem("registerEmail", formData.email);
      toast.success(
        translateSuccess("Register successfully. Please confirm OTP."),
        { id: loadingToast },
      );
      setServerMessage(auth("success"));
      setTimeout(() => navigate("/login"), 1200);
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        auth("error");
      setServerMessage(message);
      toast.error(message, { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fptu-halloween-register-page">
      {/* Cột trái: form */}
      <div className="fptu-halloween-register-left-pane">
        <div className="fptu-halloween-register-top">
          <div className="fptu-halloween-register-box">
            {/* <img className="fptu-halloween-register-logo" src={loginImg} alt="FPTU Halloween" /> */}
            <h1 className="auth-title">{auth("title")}</h1>
            <p className="auth-subtitle">
              {auth("subtitle")}
            </p>
            <div className="fptu-halloween-register-panel">
              <form onSubmit={onSubmit}>
                <label
                  className="fptu-halloween-register-form-label"
                  htmlFor="full_name"
                >
                  {auth("fullName")}
                </label>
                <input
                  id="full_name"
                  name="full_name"
                  className="fptu-halloween-register-form-input"
                  type="text"
                  placeholder={auth("fullNamePlaceholder")}
                  value={formData.full_name}
                  onChange={handleInputChange}
                  required
                />
                {errors.full_name && (
                  <div className="fptu-halloween-register-error-message">
                    {errors.full_name}
                  </div>
                )}
                <div style={{ height: 12 }} />

                <label
                  className="fptu-halloween-register-form-label"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  className="fptu-halloween-register-form-input"
                  type="email"
                  placeholder={auth("emailPlaceholder")}
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                {errors.email && (
                  <div className="fptu-halloween-register-error-message">
                    {errors.email}
                  </div>
                )}
                <div style={{ height: 12 }} />

                <label
                  className="fptu-halloween-register-form-label"
                  htmlFor="phone_number"
                >
                  {auth("phone")}
                </label>
                <input
                  id="phone_number"
                  name="phone_number"
                  className="fptu-halloween-register-form-input"
                  type="tel"
                  placeholder={auth("phonePlaceholder")}
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  required
                />
                {errors.phone_number && (
                  <div className="fptu-halloween-register-error-message">
                    {errors.phone_number}
                  </div>
                )}
                <div style={{ height: 12 }} />

                <label
                  className="fptu-halloween-register-form-label"
                  htmlFor="password"
                >
                  {auth("passwordPlaceholder")}
                </label>
                <div className="password-field">
                  <input
                    id="password"
                    name="password"
                    className="fptu-halloween-register-form-input"
                    type={showPassword ? "text" : "password"}
                    placeholder={auth("passwordPlaceholder")}
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? auth("hide") : auth("show")}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <div className="fptu-halloween-register-error-message">
                    {errors.password}
                  </div>
                )}
                <div style={{ height: 12 }} />

                <label
                  className="fptu-halloween-register-form-label"
                  htmlFor="confirmPassword"
                >
                  {auth("confirmPassword")}
                </label>
                <div className="password-field">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    className="fptu-halloween-register-form-input"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder={auth("confirmPlaceholder")}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword) {
                        setErrors((prev) => ({
                          ...prev,
                          confirmPassword: "",
                        }));
                      }
                    }}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowConfirmPassword((visible) => !visible)
                    }
                    aria-label={
                      showConfirmPassword ? auth("hide") : auth("show")
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <div className="fptu-halloween-register-error-message">
                    {errors.confirmPassword}
                  </div>
                )}
                <div style={{ height: 14 }} />

                {serverMessage && (
                  <div
                    style={{
                      color: serverMessage.includes("thành công")
                        ? "#2e7d32"
                        : "#d32f2f",
                      marginBottom: 10,
                      fontSize: 14,
                    }}
                  >
                    {serverMessage}
                  </div>
                )}
                <button
                  className="fptu-halloween-register-btn-primary"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? auth("loading") : auth("submit")}
                </button>
              </form>
            </div>

            <div
              style={{ marginTop: 12 }}
              className="fptu-halloween-register-text-muted"
            >
              {auth("or")}
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
                <span style={{ color: "black" }}>{auth("google")}</span>
              </button>
            </div>

            <div
              style={{ marginTop: 16 }}
              className="fptu-halloween-register-text-muted"
            >
              {auth("hasAccount")} {" "}
              <a
                href="/login"
                style={{
                  color: "red",
                  textDecoration: "underline",
                  fontWeight: 600,
                }}
              >
                {auth("login")}
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

export default Register;
