import React, { useEffect, useRef, useState } from "react";
import "./Header.css";
import { Circle, Info, Ticket, X } from "lucide-react";
import hotNewsAPI from "../apis/hotNewsAPI";
import { ScrollBasedVelocity } from "./ui/scroll-based-velocity";
import useTheme from "../hooks/use-theme";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import ThemeAsset from "./ThemeAsset";
import wtmDark from "../assets/wtm.png";
import wtmLight from "../assets/wtm_lightmode.png";

const renderTickerContent = (items) =>
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
  ));

function Header() {
  const { theme, toggleTheme } = useTheme();
  const { i18n, t } = useTranslation();
  const [activeHotNews, setActiveHotNews] = useState([]);
  const [hotNewsState, setHotNewsState] = useState("loading");
  const [isLanguageChanging, setIsLanguageChanging] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isThemeChanging, setIsThemeChanging] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const languageMenuRef = useRef(null);
  const language = ["vi", "en", "ja"].includes(i18n.resolvedLanguage)
    ? i18n.resolvedLanguage
    : "vi";
  const aboutCopy = {
    vi: {
      app: "Thông tin ứng dụng",
      close: "Đóng",
      logo: "Logo FPTU Halloween",
      title: "Thông tin ứng dụng",
      description:
        "Nền tảng chính thức cung cấp thông tin sự kiện, lịch trình, trải nghiệm Nhà Ma và hỗ trợ mua vé điện tử FPTU Halloween 2026.",
      terms: "Điều khoản sử dụng",
      contact: "Liên hệ",
      version: "Ver. - Build:",
      developed: "Phát triển bởi Minh Đặng VNR",
    },
    en: {
      app: "About this app",
      close: "Close",
      logo: "FPTU Halloween logo",
      title: "About this application",
      description:
        "The official platform for FPTU Halloween 2026 event information, schedules, Haunted House experiences, e-tickets and attendee support.",
      terms: "Terms & Conditions",
      contact: "Contact Us",
      version: "Ver. - Build:",
      developed: "Developed by Minh Đặng VNR",
    },
    ja: {
      app: "アプリ情報",
      close: "閉じる",
      logo: "FPTU Halloween ロゴ",
      title: "アプリ情報",
      description:
        "FPTU Halloween 2026 のイベント情報、スケジュール、お化け屋敷体験、電子チケットと参加者サポートを提供する公式プラットフォームです。",
      terms: "利用規約",
      contact: "お問い合わせ",
      version: "バージョン：",
      developed: "Minh Đặng VNR 開発",
    },
  }[language];
  const languageOptions = [
    { code: "vi", label: "Tiếng Việt" },
    { code: "en", label: "English" },
    { code: "ja", label: "日本語" },
  ];

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!languageMenuRef.current?.contains(event.target))
        setIsLanguageMenuOpen(false);
    };
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsLanguageMenuOpen(false);
        setIsAboutOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

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

  const tickerItems =
    hotNewsState === "error"
      ? [{ _id: "error", content: t("header.tickerFallback") }]
      : hotNewsState === "ready"
        ? activeHotNews
        : [];

  const handleLanguageChange = async (nextLanguage) => {
    if (isLanguageChanging || nextLanguage === language) {
      setIsLanguageMenuOpen(false);
      return;
    }

    setIsLanguageMenuOpen(false);
    setIsLanguageChanging(true);
    const loadingToast = toast.loading(t("components.changingLanguage"));

    await new Promise((resolve) => window.setTimeout(resolve, 2000));

    try {
      await i18n.changeLanguage(nextLanguage);
      toast.success(i18n.t("components.languageChanged"), { id: loadingToast });
    } catch {
      toast.error(i18n.t("components.languageChangeError"), {
        id: loadingToast,
      });
    } finally {
      setIsLanguageChanging(false);
    }
  };

  const handleThemeChange = async () => {
    if (isThemeChanging) return;

    setIsThemeChanging(true);
    const mode =
      theme === "light"
        ? t("components.themeDark")
        : t("components.themeLight");
    const loadingToast = toast.loading(t("components.changingTheme", { mode }));

    await new Promise((resolve) => window.setTimeout(resolve, 2000));

    try {
      toggleTheme();
      toast.success(t("components.themeChanged", { mode }), {
        id: loadingToast,
      });
    } catch {
      toast.error(t("components.themeChangeError"), { id: loadingToast });
    } finally {
      setIsThemeChanging(false);
    }
  };

  const handleTicketClick = () => {
    toast(t("header.ticketComingSoon"), {
      icon: <Ticket size={20} aria-hidden="true" />,
    });
  };

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
              <div className="fpt-header__language" ref={languageMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsLanguageMenuOpen((isOpen) => !isOpen)}
                  disabled={isLanguageChanging}
                  aria-busy={isLanguageChanging}
                  aria-expanded={isLanguageMenuOpen}
                  aria-haspopup="listbox"
                  className="fpt-header__social-btn fpt-header__social-btn--language"
                  aria-label={t("header.selectLanguage", {
                    defaultValue: "Select language",
                  })}
                  title={t("header.selectLanguage", {
                    defaultValue: "Select language",
                  })}
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
                {isLanguageMenuOpen && (
                  <div
                    className="fpt-header__language-menu"
                    role="listbox"
                    aria-label={t("header.selectLanguage", {
                      defaultValue: "Select language",
                    })}
                  >
                    {languageOptions.map((option) => (
                      <button
                        key={option.code}
                        type="button"
                        role="option"
                        aria-selected={language === option.code}
                        className={`fpt-header__language-option${language === option.code ? " fpt-header__language-option--active" : ""}`}
                        onClick={() => handleLanguageChange(option.code)}
                        disabled={isLanguageChanging}
                      >
                        <span>{option.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={handleThemeChange}
                disabled={isThemeChanging}
                aria-busy={isThemeChanging}
                className="fpt-header__social-btn fpt-header__social-btn--theme"
                aria-label={
                  theme === "light"
                    ? t("header.darkMode")
                    : t("header.lightMode")
                }
                title={
                  theme === "light"
                    ? t("header.darkMode")
                    : t("header.lightMode")
                }
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
              <button
                type="button"
                className="fpt-header__social-btn fpt-header__social-btn--info"
                onClick={() => setIsAboutOpen(true)}
                aria-label={aboutCopy.app}
                title={aboutCopy.app}
              >
                <Info size={24} strokeWidth={1.7} aria-hidden="true" />
              </button>
            </div>
            <button
              type="button"
              onClick={handleTicketClick}
              className="fpt-header__cta-btn"
            >
              {t("header.buyTicket")}
            </button>
          </div>
        </div>
      </div>
      {isAboutOpen && (
        <div
          className="fpt-header__about-overlay"
          role="presentation"
          onMouseDown={() => setIsAboutOpen(false)}
        >
          <section
            className="fpt-header__about-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="fpt-header-about-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="fpt-header__about-close"
              onClick={() => setIsAboutOpen(false)}
              aria-label={aboutCopy.close}
            >
              <X size={20} />
            </button>
            <ThemeAsset
              lightSrc={wtmLight}
              darkSrc={wtmDark}
              alt={aboutCopy.logo}
              className="fpt-header__about-logo"
            />
            <h2 id="fpt-header-about-title">{aboutCopy.title}</h2>
            <p>{aboutCopy.description}</p>
            <div className="fpt-header__about-links">
              <a href="/terms-of-use">{aboutCopy.terms}</a>
              <span aria-hidden="true">|</span>
              <a href="/contact-us">{aboutCopy.contact}</a>
            </div>
            <p className="fpt-header__about-meta">
              {aboutCopy.version} Hlw_2026_3.1.0
              <br />© 2026 · FPTU Halloween · {aboutCopy.developed}
            </p>
          </section>
        </div>
      )}
    </header>
  );
}

export default Header;
