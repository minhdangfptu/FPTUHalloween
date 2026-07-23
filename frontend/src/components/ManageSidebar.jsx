import React from "react";
import {
  BadgeCheck,
  CircleUserRound,
  ContactRound,
  Home,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Menu,
  ReceiptText,
  Tags,
  TicketCheck,
  Tickets,
  UsersRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../apis/authAPI";
import LogoutModal from "./LogoutModal";
import toast from "react-hot-toast";
import { translateSuccess } from "../utils/translateResponse";
import "./ManageSidebar.scss";
import avatar from "../assets/avatar.jpg";

const MENU_BY_ROLE = {
  admin: [
    { id: "dashboard", label: "Tổng quan", icon: LayoutDashboard },
    { id: "check-in", label: "Checkin vé", icon: BadgeCheck },
    { id: "users", label: "Quản lý người dùng", icon: UsersRound },
    { id: "tickets", label: "Danh sách loại vé", icon: TicketCheck },
    {
      id: "purchased-tickets",
      label: "Danh sách vé đã mua",
      icon: Tickets,
    },
    { id: "orders", label: "Đơn hàng", icon: ReceiptText },
    { id: "contacts", label: "Liên hệ", icon: ContactRound },
    { id: "home", label: "Về trang sự kiện", icon: Home },
  ],
  staff: [
    { id: "dashboard", label: "Tổng quan", icon: LayoutDashboard },
    { id: "ticket-types", label: "Danh sách loại vé", icon: TicketCheck },
    { id: "purchased-tickets", label: "Danh sách vé đã mua", icon: Tickets },
    { id: "check-in", label: "Checkin vé", icon: BadgeCheck },
    { id: "home", label: "Về trang sự kiện", icon: Home },
  ],
};

const getRoleName = (user) =>
  user?.role?.roleName ||
  user?.roleName ||
  user?.role ||
  user?.roleId?.roleName ||
  user?.roleId;

const normalizeRole = (role) =>
  String(role || "staff")
    .trim()
    .toLowerCase() === "admin"
    ? "admin"
    : "staff";

const ManageSidebar = ({ role, activeItem = "dashboard", onNavigate }) => {
  const navigate = useNavigate();
  const [user, setUser] = React.useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  });
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);
  const dropdownRef = React.useRef(null);
  const resolvedRole = normalizeRole(getRoleName(user) || role);

  React.useEffect(() => {
    const syncUser = () => {
      try {
        setUser(JSON.parse(localStorage.getItem("user") || "null"));
      } catch {
        setUser(null);
      }
    };
    window.addEventListener("storage", syncUser);
    window.addEventListener("auth:login", syncUser);
    window.addEventListener("auth:logout", syncUser);
    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("auth:login", syncUser);
      window.removeEventListener("auth:logout", syncUser);
    };
  }, []);

  React.useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target))
        setShowDropdown(false);
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleLogout = async () => {
    await authAPI.logout();
    setUser(null);
    setShowDropdown(false);
    setShowLogoutModal(false);
    toast.success(translateSuccess("Logout successful"));
    navigate("/");
  };

  const userName = user?.fullName || user?.name || "bạn";

  React.useEffect(() => {
    const handleSidebarToggle = (event) => setIsCollapsed(event.detail);
    window.addEventListener("manage-sidebar-toggle", handleSidebarToggle);
    return () =>
      window.removeEventListener("manage-sidebar-toggle", handleSidebarToggle);
  }, []);
  const menuItems = MENU_BY_ROLE[resolvedRole] || MENU_BY_ROLE.staff;
  const defaultRoutes = {
    dashboard:
      resolvedRole === "admin" ? "/admin/dashboard" : "/staff/dashboard",
    "check-in":
      resolvedRole === "admin" ? "/admin/check-in" : "/staff/check-in",
    users: "/admin/users",
    tickets: "/admin/tickets",
    orders: "/admin/orders",
    contacts: "/admin/contacts",
    "ticket-types": "/staff/ticket-types",
    "purchased-tickets": resolvedRole === "admin" ? "/admin/purchased-tickets" : "/staff/purchased-tickets",
    home: "/",
  };

  return (
    <aside
      className={`manage-sidebar ${isCollapsed ? "manage-sidebar--collapsed" : ""}`}
      aria-label="Điều hướng quản trị"
    >
      <div className="manage-sidebar__brand">
        <img
          className="manage-sidebar__avatar"
          src={avatar}
          alt="Ảnh đại diện"
        />
        <div className="manage-sidebar__brand-copy">
          <strong>FPTU Event</strong>
          <span>
            {resolvedRole === "admin" ? "Quản trị viên" : "Thành viên"}
          </span>
        </div>
        <button
          className="manage-sidebar__collapse-old"
          type="button"
          onClick={() =>
            setIsCollapsed((value) => {
              const nextValue = !value;
              window.dispatchEvent(
                new CustomEvent("manage-sidebar-toggle", { detail: nextValue }),
              );
              return nextValue;
            })
          }
          aria-expanded={!isCollapsed}
          aria-label="Thu gọn sidebar"
        >
          <Menu size={18} />
        </button>
      </div>

      <nav className="manage-sidebar__nav">
        {menuItems.map(({ id, label, icon: Icon }) => (
          <button
            className={`manage-sidebar__item ${activeItem === id ? "manage-sidebar__item--active" : ""}`}
            key={id}
            type="button"
            onClick={() =>
              onNavigate ? onNavigate(id) : navigate(defaultRoutes[id])
            }
            aria-current={activeItem === id ? "page" : undefined}
          >
            <Icon size={20} strokeWidth={1.9} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="manage-sidebar__account" ref={dropdownRef}>
        <button
          className="manage-sidebar__account-button"
          type="button"
          onClick={() => setShowDropdown((value) => !value)}
          aria-expanded={showDropdown}
        >
          <CircleUserRound size={21} />
          <span>
            <strong>{userName}</strong>
            <small>{resolvedRole === "admin" ? "Admin" : "Staff"}</small>
          </span>
        </button>
        {showDropdown && (
          <div className="manage-sidebar__account-dropdown">
            <div className="manage-sidebar__account-greeting">
              <CircleUserRound size={17} />
              <span>Xin chào {userName}</span>
            </div>
            <button type="button" onClick={() => navigate("/user-profile")}>
              <CircleUserRound size={16} /> Tài khoản của bạn
            </button>
            <button type="button" onClick={() => navigate("/change-password")}>
              <KeyRound size={16} /> Đổi mật khẩu
            </button>
            <button
              type="button"
              onClick={() => {
                setShowDropdown(false);
                setShowLogoutModal(true);
              }}
            >
              <LogOut size={16} /> Đăng xuất
            </button>
          </div>
        )}
      </div>

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </aside>
  );
};

export default ManageSidebar;
