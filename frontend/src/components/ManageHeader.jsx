import React, { useEffect, useState } from "react";
import { Bell, Menu } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ManageHeader.scss";

const ManageHeader = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [unreadCount, setUnreadCount] = useState(() => Number(localStorage.getItem("staffChatUnreadCount") || 0));
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleSidebarToggle = (event) => setIsSidebarCollapsed(event.detail);
    window.addEventListener("manage-sidebar-toggle", handleSidebarToggle);
    return () => window.removeEventListener("manage-sidebar-toggle", handleSidebarToggle);
  }, []);

  useEffect(() => { const syncUnread = () => setUnreadCount(Number(localStorage.getItem("staffChatUnreadCount") || 0)); window.addEventListener("staff-chat:unread", syncUnread); return () => window.removeEventListener("staff-chat:unread", syncUnread); }, []);

  return (
    <>
      <header className={`manage-header ${isSidebarCollapsed ? "manage-header--sidebar-collapsed" : ""}`}>
        <button className="manage-header__menu-button" type="button" aria-label={isSidebarCollapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"} aria-expanded={!isSidebarCollapsed} onClick={() => { const nextValue = !isSidebarCollapsed; setIsSidebarCollapsed(nextValue); window.dispatchEvent(new CustomEvent("manage-sidebar-toggle", { detail: nextValue })); }}>
          <Menu size={21} />
        </button>
        <p className="manage-header__title">Hệ thống quản lý và điều hành sự kiện FPTU Halloween Online</p>
        <button className="manage-header__notification" type="button" aria-label="Thông báo tin nhắn chưa đọc" onClick={() => { localStorage.setItem("staffChatUnreadCount", "0"); setUnreadCount(0); navigate(location.pathname.startsWith("/admin") ? "/admin/chat" : "/staff/chat"); }}><Bell size={21} />{unreadCount > 0 && <span>{unreadCount > 99 ? "99+" : unreadCount}</span>}</button>
      </header>
    </>
  );
};

export default ManageHeader;
