import React, { useEffect, useState } from "react";
import "./Header.css";
import { Circle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import hotNewsAPI from "../apis/hotNewsAPI";
import { ScrollBasedVelocity } from "./ui/scroll-based-velocity";
import useTheme from "../hooks/use-theme";
import { useTranslation } from "react-i18next";

const renderTickerContent = (items) => (
  items.map((item, index) => (
    <React.Fragment key={item._id || index}>
      <span className="fpt-header__ticker-item">
        {item.link ? (
          <a href={item.link} target="_blank" rel="noreferrer">
            {item.content}
          </a>
        ) : (
          item.content
        )}
      </span>
      <span className="fpt-header__ticker-separator" aria-hidden="true">
        <Circle size={7} strokeWidth={0} fill="currentColor" />
      </span>
    </React.Fragment>
  ))
);

function Header() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { i18n, t } = useTranslation();
  const [activeHotNews, setActiveHotNews] = useState([]);
  const [hotNewsState, setHotNewsState] = useState("loading");
  const language = i18n.language === "en" ? "en" : "vi";

  useEffect(() => {
    let isMounted = true;

    hotNewsAPI
      .getActiveList()
      .then((items) => {
        if (!isMounted) return;
        setActiveHotNews(items);
        setHotNewsState("ready");
      })
      .catch(() => {
        if (!isMounted) return;
        setHotNewsState("error");
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const tickerItems = hotNewsState === "error"
    ? [{ _id: "error", content: t("header.tickerFallback") }]
    : hotNewsState === "ready"
      ? activeHotNews
      : [];

  return (
    <header className="fpt-header">
      <div className="fpt-header__container">
        <div className="fpt-header__content">
          <div
            className="fpt-header__ticker"
            aria-label={t("header.newsLabel")}
            aria-live="polite"
          >
            {tickerItems.length > 0 && (
              <ScrollBasedVelocity
                text={renderTickerContent(tickerItems)}
                default_velocity={60}
                className="fpt-header__ticker-track"
                startFromRight
              />
            )}
          </div>

          <div className="fpt-header__actions">
            <div className="fpt-header__social">
              <button
                type="button"
                onClick={() => i18n.changeLanguage(language === "vi" ? "en" : "vi")}
                className="fpt-header__social-btn fpt-header__social-btn--language"
                aria-label={language === "vi" ? t("header.switchToEnglish") : t("header.switchToVietnamese")}
                title={language === "vi" ? t("header.switchToEnglish") : t("header.switchToVietnamese")}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M3 12h18" />
                  <path d="M12 3c2.5 2.5 3.8 5.5 3.8 9S14.5 18.5 12 21c-2.5-2.5-3.8-5.5-3.8-9S9.5 5.5 12 3Z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={toggleTheme}
                className="fpt-header__social-btn fpt-header__social-btn--theme"
                aria-label={theme === "light" ? t("header.darkMode") : t("header.lightMode")}
                title={theme === "light" ? t("header.darkMode") : t("header.lightMode")}
              >
                {theme === "light" ? (
                  <svg
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3 6.7 6.7 0 0 0 21 12.8Z" />
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                  </svg>
                )}
              </button>
            </div>
            <button
              onClick={() => navigate("/tickets")}
              className="fpt-header__cta-btn"
            >
              {t("header.buyTicket")}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
