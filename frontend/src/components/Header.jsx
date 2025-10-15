import React from "react";
import "./Header.css";
import wtm from "../assets/wtm.png";
import { Icon } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";
import InstagramIcon from "@mui/icons-material/Instagram";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  return (
    <header className="fpt-header">
      <div className="fpt-header__container">
        <div className="fpt-header__content">
          <div className="fpt-header__contact">
            <span
              className="fpt-header__contact-icon"
              style={{ color: "white" }}
            >
              @
            </span>
            <span
              className="fpt-header__contact-text"
              style={{ color: "white" }}
            >
              fptuhalloween@gmail.com
            </span>
          </div>

          <div className="fpt-header__actions">
            <div className="fpt-header__social">
              <button
                onClick={() =>
                  window.open(
                    "https://www.facebook.com/fptuhalloween",
                    "_blank"
                  )
                }
                className="fpt-header__social-btn fpt-header__social-btn--facebook"
              >
                <FacebookIcon sx={{ color: "white" }} />
              </button>
              <button
                onClick={() =>
                  window.open(
                    "https://www.facebook.com/fuboardgameclub",
                    "_blank"
                  )
                }
                className="fpt-header__social-btn fpt-header__social-btn--tiktok"
              >
                <InstagramIcon sx={{ color: "white" }} />
              </button>
              <button onClick={() =>
                  window.open(
                    "https://www.tiktok.com/@fptu.halloween2025",
                    "_blank"
                  )
                } className="fpt-header__social-btn fpt-header__social-btn--youtube">
                <YouTubeIcon sx={{ color: "white" }} />
              </button>
            </div>
            <button onClick={() => navigate("/ticket-game")} className="fpt-header__cta-btn">ĐĂNG KÝ</button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
