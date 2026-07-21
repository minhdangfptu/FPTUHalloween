import React, { useState, useEffect, useRef } from "react";
import "./Navbar.css";
import wtm from "../assets/wtm.png";
import { Icon, Tooltip } from "@mui/material";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import { useNavigate, useLocation } from "react-router-dom"; // Add useLocation import
import {
  CircleUserRound,
  KeyRound,
  KeyRoundIcon,
  LogOut,
  Package,
  User,
  WalletCards,
} from "lucide-react";
import { authAPI } from "../apis/authAPI";
import LogoutModal from "./LogoutModal";
import toast, { Toaster } from "react-hot-toast";
import { translateSuccess } from "../utils/translateResponse";
const navigationItems = [
  {
    label: "TRANG CHỦ",
    href: "/",
  },
  {
    label: "GIỚI THIỆU",
    href: "#",
    children: [
      { label: "Giới thiệu chung", href: "/event-page" },
      { label: "Đơn vị tổ chức", href: "/old-event" },
    ],
  },
  {
    label: "NHÀ MA HALLOWEEN",
    href: "#",
    children: [
      { label: "Câu chuyện", href: "/overall" },
      { label: "Mua vé", href: "/overall" },
      // { label: "Thông tin", href: "/agenda" },
      // { label: "Tin tức", href: "/news" },
    ],
  },
  // {
  //   label: "ĐĂNG KÝ",
  //   href: "#",
  //   children: [
  //     // { label: "Vé nhà ma", href: "/ticket-ghost" },
  //     { label: "Big game", href: "/ticket-game" },
  //     // { label: "Cuộc thi hóa trang", href: "/jnbwueoini0" },
  //   ],
  // },
  {
    label: "VỀ CHÚNG TÔI",
    href: "#",
    children: [
      { label: "Ban tổ chức FPTU Halloween 2026", href: "/fbgc" },
      { label: "Cơ cấu tổ chức", href: "/fbgc" },
      // { label: "Fanpage", style: { cursor: "pointer" }, onClick: () => navigate("https://www.facebook.com/fuboardgameclub") },
      // { label: "Hoạt động", href: "#" },
    ],
  },
  {
    label: "LIÊN HỆ",
    href: "/contact-us",
  },
];

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const userDropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation(); // Add location hook
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  });

  useEffect(() => {
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

  const handleLogout = async () => {
    await authAPI.logout();
    setUser(null);
    setShowUserDropdown(false);
    setShowLogoutModal(false);
    toast.success(translateSuccess("Logout successful"));
    navigate("/");
  };

  const requestLogout = () => {
    setShowUserDropdown(false);
    setShowLogoutModal(true);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMouseEnter = (index) => {
    setHoveredItem(index);
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  const handleUserClick = () => {
    setShowUserDropdown(!showUserDropdown);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setShowUserDropdown(false);
      }
    };

    if (showUserDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserDropdown]);

  // Helper function to check if link is active
  const isActive = (path) => {
    if (path === "#") return false;
    return location.pathname === path;
  };

  // Helper function to check if dropdown has active child
  const hasActiveChild = (children) => {
    if (!children) return false;
    return children.some((child) => isActive(child.href));
  };

  return (
    <>
      <Toaster position="top-center" />
      <nav className="fpt-navbar">
        <div className="fpt-navbar__container">
          <div className="fpt-navbar__content">
            {/* Logo */}
            <div className="fpt-navbar__logo">
              <img
                src={wtm}
                onClick={() => navigate("/")}
                alt="FPTU Halloween"
                className="fpt-navbar__logo-img"
              />
            </div>

            {/* Desktop Navigation */}
            <div className="fpt-navbar__desktop-nav">
              {navigationItems.map((item, index) => (
                <div
                  key={item.label}
                  className="fpt-navbar__nav-item"
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                >
                  <a
                    href={item.href}
                    className={`fpt-navbar__nav-link ${
                      isActive(item.href) || hasActiveChild(item.children)
                        ? "active"
                        : ""
                    }`}
                    onClick={(e) => {
                      if (item.href !== "#") {
                        e.preventDefault();
                        navigate(item.href);
                      }
                    }}
                  >
                    {item.label}
                    {item.children && (
                      <span className="fpt-navbar__nav-arrow">▼</span>
                    )}
                  </a>
                  {item.children && hoveredItem === index && (
                    <div className="fpt-navbar__dropdown">
                      {item.children.map((child) => (
                        <a
                          key={child.label}
                          href={child.href}
                          className={`fpt-navbar__dropdown-link ${
                            isActive(child.href) ? "active" : ""
                          }`}
                          onClick={(e) => {
                            if (child.href !== "#") {
                              e.preventDefault();
                              navigate(child.href);
                            }
                          }}
                        >
                          {child.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <Tooltip title="Đơn hàng của bạn">
                <button
                  className="fpt-navbar__search-btn"
                  onClick={() => navigate("/user-profile")}
                  aria-label="Mở trang đơn hàng"
                >
                  <Package size={24} />
                </button>
              </Tooltip>
              <div ref={userDropdownRef} className="fpt-navbar__user-item">
                <Tooltip title="Tài khoản">
                  <button
                    className="fpt-navbar__search-btn"
                    onClick={handleUserClick}
                  >
                    <PermIdentityIcon
                      sx={{
                        fontSize: 25,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    />
                  </button>
                </Tooltip>
                <div
                  className={`fpt-navbar__user-dropdown ${
                    showUserDropdown ? "show" : ""
                  }`}
                >
                  {user && (
                    <div className="fpt-navbar__account-menu">
                      <div className="fpt-navbar__account-greeting">
                        <CircleUserRound size={18} />
                        <span>
                          Xin chào {user.fullName || user.name || "bạn"}
                        </span>
                      </div>
                      <a
                        href="/user-profile"
                        className="fpt-navbar__dropdown-link fpt-navbar__logout-button"
                      >
                        <WalletCards size={16} /> Tài khoản của bạn
                      </a>
                      <a
                        href="/change-password"
                        className="fpt-navbar__dropdown-link fpt-navbar__logout-button"
                      >
                        <KeyRound size={16} /> Đổi mật khẩu
                      </a>
                      <a
                        className="fpt-navbar__dropdown-link fpt-navbar__logout-button"
                        onClick={requestLogout}
                      >
                        <LogOut size={16} /> Đăng xuất
                      </a>
                    </div>
                  )}
                  <a
                    href="/login"
                    style={{ display: user ? "none" : undefined }}
                    className="fpt-navbar__dropdown-link"
                  >
                    Đăng nhập
                  </a>
                  <a
                    href="/register"
                    style={{ display: user ? "none" : undefined }}
                    className="fpt-navbar__dropdown-link"
                  >
                    Đăng ký
                  </a>
                  {/* <a
                    href="/forgot-password"
                    className="fpt-navbar__dropdown-link"
                  >
                    🔑 Quên mật khẩu
                  </a> */}
                </div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="fpt-navbar__mobile-toggle"
              onClick={handleDrawerToggle}
              aria-label="Toggle mobile menu"
            >
              ☰
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div
        className={`fpt-navbar__mobile-drawer ${
          mobileOpen ? "fpt-navbar__mobile-drawer--open" : ""
        }`}
      >
        <div
          className="fpt-navbar__mobile-overlay"
          onClick={handleDrawerToggle}
        ></div>
        <div className="fpt-navbar__mobile-content">
          <div className="fpt-navbar__mobile-header">
            <h3>Menu</h3>
            <button
              className="fpt-navbar__mobile-close"
              onClick={handleDrawerToggle}
            >
              ✕
            </button>
          </div>
          <div className="fpt-navbar__mobile-nav">
            {navigationItems.map((item) => (
              <div key={item.label} className="fpt-navbar__mobile-group">
                <a
                  href={item.href}
                  className="fpt-navbar__mobile-link"
                  onClick={(e) => {
                    if (item.href !== "#") {
                      e.preventDefault();
                      navigate(item.href);
                    }
                    handleDrawerToggle();
                  }}
                >
                  {item.label}
                </a>
                {item.children && (
                  <div className="fpt-navbar__mobile-sub">
                    {item.children.map((child) => (
                      <a
                        key={child.label}
                        href={child.href}
                        className="fpt-navbar__mobile-sublink"
                        onClick={(e) => {
                          if (child.href !== "#") {
                            e.preventDefault();
                            navigate(child.href);
                          }
                          handleDrawerToggle();
                        }}
                      >
                        {child.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="fpt-navbar__mobile-group">
              <div
                className="fpt-navbar__mobile-link"
                style={{ fontWeight: "bold", color: "#ce0000" }}
              >
                👤 Tài khoản
              </div>
              <div className="fpt-navbar__mobile-sub">
                <a
                  href="/login"
                  className="fpt-navbar__mobile-sublink"
                  onClick={handleDrawerToggle}
                >
                  🔐 Đăng nhập
                </a>
                <a
                  href="/register"
                  className="fpt-navbar__mobile-sublink"
                  onClick={handleDrawerToggle}
                >
                  📝 Đăng ký
                </a>
                {/* <a
                  href="/forgot-password"
                  className="fpt-navbar__mobile-sublink"
                  onClick={handleDrawerToggle}
                >
                  🔑 Quên mật khẩu
                </a> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}

export default Navbar;
