import React from "react";
import "./Header.css";
import wtm from "../assets/wtm.png";
import { Icon } from "@mui/material";
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';
function Header() {
  return (
    <header className="fpt-header">
      <div className="fpt-header__container">
        <div className="fpt-header__content">
          <div className="fpt-header__contact">
            <span className="fpt-header__contact-icon">@</span>
            <span className="fpt-header__contact-text">fptuhalloween@gmail.com</span>
          </div>
          
          <div className="fpt-header__actions">
            <div className="fpt-header__social">
              <button className="fpt-header__social-btn fpt-header__social-btn--facebook">
                <FacebookIcon />
              </button>
              <button className="fpt-header__social-btn fpt-header__social-btn--tiktok">
                <InstagramIcon />
              </button>
              <button className="fpt-header__social-btn fpt-header__social-btn--youtube">
                <YouTubeIcon />
              </button>
            </div>
            <button className="fpt-header__cta-btn">
              MUA VÉ NHÀ MA
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;