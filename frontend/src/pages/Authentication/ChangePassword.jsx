import { useState } from "react";
import toast from "react-hot-toast";
import wtmLogo from "../../assets/wtm.png";
import { authAPI } from "../../apis/authAPI";
import { translateError, translateSuccess } from "../../utils/translateResponse";
import { useTranslation } from "react-i18next";
import "./ChangePassword.scss";

function PasswordToggleIcon({ isVisible }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M2.5 12s3.3-5 9.5-5 9.5 5 9.5 5-3.3 5-9.5 5-9.5-5-9.5-5Z" />
      <circle cx="12" cy="12" r="2.5" />
      {!isVisible && <path d="m4 4 16 16" />}
    </svg>
  );
}

const STRENGTH_RULES = [
  { id: "length", test: (v) => v.length >= 8 },
];

function getStrength(pw) {
  const passed = STRENGTH_RULES.filter((r) => r.test(pw)).length;
  if (passed === 0) return { level: 1, color: "#ef4444" };
  return { level: 4, color: "#22c55e" };
}

export default function ChangePasswordPage() {
  const { t } = useTranslation();
  const auth = (key) => t(`auth.changePassword.${key}`);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [touched, setTouched] = useState({ new: false, confirm: false });

  const strength = getStrength(newPassword);
  const matched = confirmPassword.length > 0 && newPassword === confirmPassword;
  const allPassed = STRENGTH_RULES.every((r) => r.test(newPassword));

  const hasError = (field) => {
    if (!touched[field]) return false;
    if (field === "new") return !allPassed && newPassword.length > 0;
    if (field === "confirm") return !matched && confirmPassword.length > 0;
    return false;
  };

  async function handleVerifyOld(e) {
    e.preventDefault();
    if (!oldPassword.trim()) return;

    setVerifying(true);
    setIsSubmitting(true);
    const loadingToast = toast.loading(auth("checking"));
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      if (!user?.email) throw new Error(auth("accountMissing"));
      const response = await authAPI.login({ identifier: user.email, password: oldPassword });
      setIsVerified(true);
      toast.success(translateSuccess(response.message || "Operation successful"), { id: loadingToast });
    } catch (err) {
      toast.error(translateError(err), { id: loadingToast });
    } finally {
      setVerifying(false);
      setIsSubmitting(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setTouched({ new: true, confirm: true });
    if (!allPassed || !matched) return;

    setIsSubmitting(true);
    const loadingToast = toast.loading(auth("processing"));

    try {
      const response = await authAPI.changePassword({
        currentPassword: oldPassword,
        newPassword,
      });
      toast.success(translateSuccess(response.message || "Password changed successfully"), {
        id: loadingToast,
      });
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
    } catch (err) {
      toast.error(translateError(err), {
        id: loadingToast,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="cp-page">
      <div className="cp-card">
        {/* Header */}
        <div className="cp-card__header">
          <img className="cp-brand-logo" src={wtmLogo} alt="FPTU Halloween" />
          <h1 className="cp-card__title">
            {isVerified ? auth("enterNew") : auth("verifyOld")}
          </h1>
          <p className="cp-card__subtitle">
            {isVerified
              ? auth("newDescription")
              : auth("verifyDescription")}
          </p>
        </div>

        {/* Step 1: Verify old password */}
        {!isVerified && (
          <form className="cp-form" onSubmit={handleVerifyOld} noValidate>
            <div className="cp-field">
              <label className="cp-field__label">{auth("old")}</label>
              <div className="cp-input-shell">
                <span className="cp-input-shell__icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  type={showOld ? "text" : "password"}
                  name="oldPassword"
                  autoComplete="current-password"
                  placeholder={auth("oldPlaceholder")}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
                <button
                  className="cp-input-shell__toggle"
                  type="button"
                  aria-label={showOld ? auth("hidden") : auth("visible")}
                  onClick={() => setShowOld((v) => !v)}
                >
                  <PasswordToggleIcon isVisible={showOld} />
                </button>
              </div>
            </div>

            <p className="cp-change-forgot-hint">
              <a href="/forgot-password">{auth("forgot")}</a>
            </p>

            <button
              className="cp-submit"
              type="submit"
              disabled={verifying || !oldPassword.trim()}
            >
              {verifying ? auth("verifying") : auth("continue")}
            </button>

            <p className="cp-back-link">
              <a href="/login">{auth("backLogin")}</a>
            </p>
          </form>
        )}

        {/* Step 2: Set new password */}
        {isVerified && (
          <form className="cp-form" onSubmit={handleSubmit} noValidate>
            {/* New Password */}
            <div className={`cp-field${hasError("new") ? " is-error" : ""}`}>
              <label className="cp-field__label">{auth("new")}</label>
              <div className="cp-input-shell">
                <span className="cp-input-shell__icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  type={showNew ? "text" : "password"}
                  name="newPassword"
                  autoComplete="new-password"
                  placeholder={auth("newPlaceholder")}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  onBlur={() => setTouched((p) => ({ ...p, new: true }))}
                />
                <button
                  className="cp-input-shell__toggle"
                  type="button"
                  aria-label={showNew ? auth("hidden") : auth("visible")}
                  onClick={() => setShowNew((v) => !v)}
                >
                  <PasswordToggleIcon isVisible={showNew} />
                </button>
              </div>
              {hasError("new") && (
                <p className="cp-field__error">
                  {auth("minLength")}
                </p>
              )}
            </div>

            {/* Strength Meter */}
            {newPassword.length > 0 && (
              <>
                <div className="cp-strength">
                  <div className="cp-strength__bars">
                    {[1, 2, 3, 4].map((n) => (
                      <span
                        key={n}
                        className="cp-strength__bar"
                        style={{
                          background:
                            n <= strength.level ? strength.color : "#e5e7eb",
                          transition: "background 300ms ease",
                        }}
                      />
                    ))}
                  </div>
                  <p
                    className="cp-strength__label"
                    style={{ color: strength.color }}
                  >
                    {strength.level === 4 ? auth("strong") : auth("weak")}
                  </p>
                </div>

                <ul className="cp-rules">
                  {STRENGTH_RULES.map((rule) => {
                    const ok = rule.test(newPassword);
                    return (
                      <li
                        key={rule.id}
                        className={`cp-rules__item${ok ? " is-ok" : ""}`}
                      >
                        <span className="cp-rules__dot" />
                    <span>{auth("ruleLength")}</span>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}

            {/* Confirm Password */}
            <div
              className={`cp-field${hasError("confirm") ? " is-error" : ""}`}
            >
              <label className="cp-field__label">{auth("confirm")}</label>
              <div className="cp-input-shell">
                <span className="cp-input-shell__icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  autoComplete="new-password"
                  placeholder={auth("confirmPlaceholder")}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={() => setTouched((p) => ({ ...p, confirm: true }))}
                />
                <button
                  className="cp-input-shell__toggle"
                  type="button"
                  aria-label={showConfirm ? auth("hidden") : auth("visible")}
                  onClick={() => setShowConfirm((v) => !v)}
                >
                  <PasswordToggleIcon isVisible={showConfirm} />
                </button>
              </div>
              {hasError("confirm") && (
                <p className="cp-field__error">{auth("mismatch")}</p>
              )}
            </div>

            <button
              className="cp-submit"
              type="submit"
              disabled={isSubmitting || !allPassed || !matched}
            >
              {isSubmitting ? auth("processing") : auth("confirmAction")}
            </button>

            <p className="cp-back-link">
              <button
                type="button"
                className="cp-back-btn"
                onClick={() => {
                  setIsVerified(false);
                  setOldPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                  setTouched({ new: false, confirm: false });
                }}
              >
                {auth("back")}
              </button>
            </p>
          </form>
        )}
      </div>
    </main>
  );
}
