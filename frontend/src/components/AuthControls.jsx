import React, { useEffect, useRef, useState } from "react";
import { Languages, Moon, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";
import useTheme from "../hooks/use-theme";
import "./AuthControls.css";

const languageOptions = [
  { code: "vi", label: "VI" },
  { code: "en", label: "EN" },
  { code: "ja", label: "JA" },
];

function AuthControls() {
  const { i18n, t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
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

  return (
    <div className="auth-controls" ref={languageRef}>
      <div className="auth-controls__language">
        <button
          type="button"
          className="auth-controls__button"
          onClick={() => setIsLanguageOpen((open) => !open)}
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
                onClick={() => {
                  i18n.changeLanguage(option.code);
                  setIsLanguageOpen(false);
                }}
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
        onClick={toggleTheme}
        aria-label={theme === "light" ? t("header.darkMode") : t("header.lightMode")}
        title={theme === "light" ? t("header.darkMode") : t("header.lightMode")}
      >
        {theme === "light" ? <Moon size={18} aria-hidden="true" /> : <Sun size={18} aria-hidden="true" />}
      </button>
    </div>
  );
}

export default AuthControls;
