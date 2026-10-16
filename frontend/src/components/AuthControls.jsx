import React, { useEffect, useRef, useState } from "react";
import { Languages, Moon, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";
import useTheme from "../hooks/use-theme";
import "./AuthControls.css";
import toast from "react-hot-toast";

const languageOptions = [
  { code: "vi", label: "VI" },
  { code: "en", label: "EN" },
  { code: "ja", label: "JA" },
];

function AuthControls() {
  const { i18n, t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isLanguageChanging, setIsLanguageChanging] = useState(false);
  const [isThemeChanging, setIsThemeChanging] = useState(false);
  const languageRef = useRef(null);
  const language = ["vi", "en", "ja"].includes(i18n.resolvedLanguage)
    ? i18n.resolvedLanguage
    : "vi";

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!languageRef.current?.contains(event.target)) setIsLanguageOpen(false);
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleLanguageChange = async (nextLanguage) => {
    if (isLanguageChanging || nextLanguage === language) {
      setIsLanguageOpen(false);
      return;
    }

    setIsLanguageOpen(false);
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

  return (
    <div className="auth-controls" ref={languageRef}>
      <div className="auth-controls__language">
        <button
          type="button"
          className="auth-controls__button"
          onClick={() => setIsLanguageOpen((open) => !open)}
          disabled={isLanguageChanging}
          aria-busy={isLanguageChanging}
          aria-label={t("header.selectLanguage", { defaultValue: "Select language" })}
          aria-expanded={isLanguageOpen}
          title={t("header.selectLanguage", { defaultValue: "Select language" })}
        >
          <Languages size={18} aria-hidden="true" />
        </button>
        {isLanguageOpen && (
          <div className="auth-controls__menu" role="listbox">
            {languageOptions.map((option) => (
              <button
                type="button"
                key={option.code}
                className={language === option.code ? "is-active" : ""}
                onClick={() => handleLanguageChange(option.code)}
                disabled={isLanguageChanging}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <button
        type="button"
        className="auth-controls__button"
        onClick={handleThemeChange}
        disabled={isThemeChanging}
        aria-busy={isThemeChanging}
        aria-label={theme === "light" ? t("header.darkMode") : t("header.lightMode")}
        title={theme === "light" ? t("header.darkMode") : t("header.lightMode")}
      >
        {theme === "light" ? <Moon size={18} aria-hidden="true" /> : <Sun size={18} aria-hidden="true" />}
      </button>
    </div>
  );
}

export default AuthControls;
