import React, { useEffect, useState } from "react";
import { Bell, Menu } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import useTheme from "../hooks/use-theme";
import { useManageSidebar } from "../contexts/manage-sidebar-context";
import "./ManageHeader.scss";

const ManageHeader = () => {
  const { i18n, t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const componentText = (key) => t(`components.${key}`);
  const language = i18n.language === "en" ? "en" : "vi";
  const { isSidebarCollapsed, toggleSidebar } = useManageSidebar();
  const [isLanguageChanging, setIsLanguageChanging] = useState(false);
  const [unreadCount, setUnreadCount] = useState(() => Number(localStorage.getItem("staffChatUnreadCount") || 0));
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => { const syncUnread = () => setUnreadCount(Number(localStorage.getItem("staffChatUnreadCount") || 0)); window.addEventListener("staff-chat:unread", syncUnread); return () => window.removeEventListener("staff-chat:unread", syncUnread); }, []);

  const handleLanguageChange = async () => {
    if (isLanguageChanging) return;

    setIsLanguageChanging(true);
    const loadingToast = toast.loading(componentText("changingLanguage"));

    await new Promise((resolve) => window.setTimeout(resolve, 2000));

    try {
      await i18n.changeLanguage(language === "vi" ? "en" : "vi");
      toast.success(i18n.t("components.languageChanged"), { id: loadingToast });
    } catch {
      toast.error(i18n.t("components.languageChangeError"), { id: loadingToast });
    } finally {
      setIsLanguageChanging(false);
    }
  };

  return (
    <>
      <header className={`manage-header ${isSidebarCollapsed ? "manage-header--sidebar-collapsed" : ""}`}>
        <button className="manage-header__menu-button" type="button" aria-label={componentText(isSidebarCollapsed ? "expandSidebar" : "collapseSidebar")} aria-expanded={!isSidebarCollapsed} onClick={toggleSidebar}>
          <Menu size={21} />
        </button>
        <p className="manage-header__title">{componentText("manageTitle")}</p>
        <div className="manage-header__actions">
          <button
            className="manage-header__action-button"
            type="button"
            aria-label={language === "vi" ? t("header.switchToEnglish") : t("header.switchToVietnamese")}
            title={language === "vi" ? t("header.switchToEnglish") : t("header.switchToVietnamese")}
            disabled={isLanguageChanging}
            onClick={handleLanguageChange}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="M3 12h18" />
              <path d="M12 3c2.5 2.5 3.8 5.5 3.8 9S14.5 18.5 12 21c-2.5-2.5-3.8-5.5-3.8-9S9.5 5.5 12 3Z" />
            </svg>
          </button>
          <button
            className="manage-header__action-button"
            type="button"
            aria-label={theme === "light" ? t("header.darkMode") : t("header.lightMode")}
            title={theme === "light" ? t("header.darkMode") : t("header.lightMode")}
            onClick={toggleTheme}
          >
            {theme === "light" ? (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3 6.7 6.7 0 0 0 21 12.8Z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
              </svg>
            )}
          </button>
          <button className="manage-header__notification" type="button" aria-label={componentText("unreadMessages")} onClick={() => { localStorage.setItem("staffChatUnreadCount", "0"); setUnreadCount(0); navigate(location.pathname.startsWith("/admin") ? "/admin/chat" : "/staff/chat"); }}><Bell size={21} />{unreadCount > 0 && <span>{unreadCount > 99 ? "99+" : unreadCount}</span>}</button>
        </div>
      </header>
    </>
  );
};

export default ManageHeader;
