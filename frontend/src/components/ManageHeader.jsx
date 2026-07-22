import React, { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import "./ManageHeader.scss";

const ManageHeader = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const handleSidebarToggle = (event) => setIsSidebarCollapsed(event.detail);
    window.addEventListener("manage-sidebar-toggle", handleSidebarToggle);
    return () => window.removeEventListener("manage-sidebar-toggle", handleSidebarToggle);
  }, []);

  return (
    <>
      <header className={`manage-header ${isSidebarCollapsed ? "manage-header--sidebar-collapsed" : ""}`}>
        <button className="manage-header__menu-button" type="button" aria-label={isSidebarCollapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"} aria-expanded={!isSidebarCollapsed} onClick={() => { const nextValue = !isSidebarCollapsed; setIsSidebarCollapsed(nextValue); window.dispatchEvent(new CustomEvent("manage-sidebar-toggle", { detail: nextValue })); }}>
          <Menu size={21} />
        </button>
        <p className="manage-header__title">Hệ thống quản lý và điều hành sự kiện FPTU Halloween Online</p>
      </header>
    </>
  );
};

export default ManageHeader;
