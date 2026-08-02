import { ArrowLeft, House, LockKeyhole } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./ErrorPages.scss";

const ErrorPageView = ({
  code,
  eyebrow,
  title,
  description,
  statusLabel,
  illustration,
  illustrationAlt,
  variant,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <main className={`error-page error-page--${variant}`}>
      <div className="error-page__rail" aria-hidden="true">
        <span>FPTU / HALLOWEEN</span>
        <strong>{code}</strong>
      </div>

      <section className="error-page__content" aria-labelledby={`error-title-${code}`}>
        <div className="error-page__signal" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <p className="error-page__eyebrow">{eyebrow}</p>
        <h1 id={`error-title-${code}`}>{title}</h1>
        <p className="error-page__description">{description}</p>

        <div className="error-page__actions">
          <Link className="error-page__action error-page__action--primary" to="/">
            <House size={17} strokeWidth={2.2} />
            {t("pages.errors.backHome")}
          </Link>
          <button
            className="error-page__action error-page__action--secondary"
            type="button"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={17} strokeWidth={2.2} />
            {t("pages.errors.back")}
          </button>
        </div>

        <p className="error-page__status" aria-live="polite">
          <span>STATUS</span>
          <strong>{statusLabel}</strong>
        </p>
      </section>

      <aside className="error-page__visual" aria-label={`${code} illustration`}>
        {illustration ? (
          <img
            src={illustration}
            alt={illustrationAlt}
            width="912"
            height="676"
          />
        ) : (
          <div className="error-page__lock-mark" aria-hidden="true">
            <LockKeyhole size={72} strokeWidth={1.25} />
            <span>ACCESS CHECK</span>
          </div>
        )}
        <span className="error-page__visual-code" aria-hidden="true">
          {code}
        </span>
      </aside>
    </main>
  );
};

export default ErrorPageView;
