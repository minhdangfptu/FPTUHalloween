import React from "react";
import "./Footer.css";
import wtm from "../assets/wtm.png";
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';
function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="fpt-footer">
      <div className="fpt-footer__container">
        <div className="fpt-footer__grid">
          <div className="fpt-footer__contact-section">
            <img src={wtm} alt="FPT Schools" className="fpt-footer__logo" />
            <h3 className="fpt-footer__contact-title">THÔNG TIN LIÊN HỆ</h3>
            <div className="fpt-footer__contact-item">
              <span className="fpt-footer__contact-icon">@</span>
              <p className="fpt-footer__contact-text">
                fptuhalloween@gmail.com
              </p>
            </div>
            <div className="fpt-footer__contact-item">
              <span className="fpt-footer__contact-icon">📍</span>
              <p className="fpt-footer__contact-text">
                Trường Đại học FPT
                <br />
                Khu CNC Hòa Lạc, Km29 Đại lộ Thăng Long, Hà Nội
              </p>
            </div>
            <h4 className="fpt-footer__social-title">Liên kết mạng xã hội</h4>
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
            
          </div>

          <div className="fpt-footer__links-grid">
            <div className="fpt-footer__link-group">
              <h4 className="fpt-footer__link-title">Giới thiệu</h4>
              <a href="#" className="fpt-footer__link">
                Về sự kiện Halloween
              </a>
              <a href="#" className="fpt-footer__link">
                Về các mùa đã qua
              </a>
              <a href="#" className="fpt-footer__link">
                Fanpage Sự kiện
              </a>
             
            </div>
            <div className="fpt-footer__link-group">
              <h4 className="fpt-footer__link-title">Về FPTU Halloween 2025</h4>
              <a href="#" className="fpt-footer__link">
                Tổng quan sự kiện
              </a>
              <a href="#" className="fpt-footer__link">
                Agenda
              </a>
              <a href="#" className="fpt-footer__link">
                Tin tức
              </a>
            </div>
            <div className="fpt-footer__link-group">
              <h4 className="fpt-footer__link-title">Mua vé nhà ma</h4>
              <a href="#" className="fpt-footer__link">
                Hướng dẫm mua vé
              </a>
              <a href="#" className="fpt-footer__link">
                Bảng giá
              </a>
              <a href="#" className="fpt-footer__link">
                Câu hỏi thường gặp
              </a>
            </div>
            <div className="fpt-footer__link-group">
              <h4 className="fpt-footer__link-title">Về FPTU Board Game Club</h4>
              <a href="#" className="fpt-footer__link">
                Câu chuyện
              </a>
              <a href="#" className="fpt-footer__link">
                Hoạt động
              </a>
            </div>
            <div className="fpt-footer__link-group">
              <h4 className="fpt-footer__link-title">Tin tức</h4>
              <a href="#" className="fpt-footer__link">
                Tin nổi bật
              </a>
              <a href="#" className="fpt-footer__link">
                Tin gần đây
              </a>
            </div>
            <div className="fpt-footer__link-group">
              <h4 className="fpt-footer__link-title">Liên hệ</h4>
              <a href="#" className="fpt-footer__link">
                Đóng góp ý kiến
              </a>
              <a href="#" className="fpt-footer__link">
                Liên hệ
              </a>
            </div>
          </div>
        </div>
      </div>
      <hr className="fpt-footer__divider" />
      <div className="fpt-footer__copyright">
        Phát triển bởi Măng Định hẹ hẹ
        <br /> Bản quyền © 2019-{year} thuộc về FPTU Board Game Club. Bảo lưu
        mọi quyền.
      </div>
    </footer>
  );
}

export default Footer;
