import React, { useState, useEffect, useRef } from "react";
import "./Navbar.css";
import wtm from "../assets/wtm.png";
import { Icon, Tooltip } from "@mui/material";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import { useNavigate, useLocation } from "react-router-dom"; // Add useLocation import
const navigationItems = [
  {
    label: "TRANG CHỦ",
    href: "/",
  },
  {
    label: "GIỚI THIỆU",
    href: "#",
    children: [
      { label: "Về sự kiện Halloween", href: "/event-page" },
      { label: "Về các mùa đã qua", href: "/old-event" },
      { label: "Fanpage Sự kiện", href: "/fanpage" },
    ],
  },
  {
    label: "FPTU HALLOWEEN 2025",
    href: "#",
    children: [
      { label: "Tổng quan sự kiện", href: "/overall" },
      // { label: "Thông tin", href: "/agenda" },
      // { label: "Tin tức", href: "/news" },
    ],
  },
  {
    label: "ĐĂNG KÝ",
    href: "#",
    children: [
      // { label: "Vé nhà ma", href: "/ticket-ghost" },
      { label: "Big game", href: "/ticket-game" },
      // { label: "Cuộc thi hóa trang", href: "/jnbwueoini0" },
    ],
  },
  {
    label: "VỀ CHÚNG TÔI",
    href: "#",
    children: [
      { label: "FPTU Board Game Club", href: "/fbgc" },
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
  const userDropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation(); // Add location hook

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

  const handleUserMouseLeave = () => {
    setShowUserDropdown(false);
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
              <div
                ref={userDropdownRef}
                className="fpt-navbar__user-item"
                onMouseLeave={handleUserMouseLeave}
              >
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
                  <a href="/login" className="fpt-navbar__dropdown-link">
                    🔐 Đăng nhập
                  </a>
                  <a href="/register" className="fpt-navbar__dropdown-link">
                    📝 Đăng ký
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
    </>
  );
}

export default Navbar;
