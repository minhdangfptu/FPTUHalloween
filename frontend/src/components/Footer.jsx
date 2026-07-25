// eslint-disable-next-line no-unused-vars -- React Router Link is rendered in the footer groups below.
import { Link } from "react-router-dom";
import "./Footer.css";
import wtm from "../assets/wtm.png";
// eslint-disable-next-line no-unused-vars -- icon is rendered in the social anchors below.
import FacebookIcon from "@mui/icons-material/Facebook";

const linkGroups = [
  {
    title: "Khám phá",
    links: [
      ["Trang chủ", "/"],
      ["Giới thiệu Halloween 2026", "/introduce-hlw26"],
      ["Câu chuyện nhà ma", "/haunted-ghost"],
      ["Lưu trữ các mùa Halloween", "/old-event"],
    ],
  },
  {
    title: "Về sự kiện",
    links: [
      ["Giới thiệu sự kiện", "/event-page"],
      ["Tổng quan sự kiện", "/overall"],
      ["Timeline / Agenda", "/agenda"],
      // ["Tin tức", "/news"],
    ],
  },
  {
    title: "Vé & hỗ trợ",
    links: [
      ["Mua vé", "/tickets"],
      ["Vé của tôi", "/my-ticket"],
      ["Câu hỏi thường gặp", "/faq"],
      ["Liên hệ", "/contact-us"],
    ],
  },
  {
    title: "Ban tổ chức",
    links: [
      ["Đội Core Sự kiện", "/btc-fuhlw"],
      ["PDP FPTU Hà Nội", "/pdp"],
      ["FPTU Board Game Club", "/fbgc"],
      ["Fanpage", "/fanpage"],
    ],
  },
  {
    title: "Pháp lý",
    links: [
      ["Chính sách dữ liệu", "/data-policy"],
      ["Điều khoản sử dụng", "/terms-of-use"],
      ["Chính sách vé", "/ticket-policy"],
    ],
  },
  {
    title: "Tài khoản",
    links: [
      ["Đăng nhập", "/login"],
      ["Đăng ký", "/register"],
      ["Hồ sơ cá nhân", "/user-profile"],
    ],
  },
];

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="fpt-footer">
      <div className="fpt-footer__container">
        <div className="fpt-footer__grid">
          <div className="fpt-footer__contact-section">
            <Link to="/" aria-label="Về trang chủ FPTU Halloween">
              <img
                src={wtm}
                alt="FPTU Halloween"
                className="fpt-footer__logo"
              />
            </Link>
            <h3 className="fpt-footer__contact-title">Thông tin liên hệ</h3>
            <div className="fpt-footer__contact-item">
              <span className="fpt-footer__contact-icon">@</span>
              <p className="fpt-footer__contact-text">
                fptuhalloween@gmail.com
              </p>
            </div>
            <div className="fpt-footer__contact-item">
              <span className="fpt-footer__contact-icon">⌖</span>
              <p className="fpt-footer__contact-text">
                Trường Đại học FPT
                <br />
                Khu CNC Hòa Lạc, Km29 Đại lộ Thăng Long, Hà Nội
              </p>
            </div>
            <h4 className="fpt-footer__social-title">Kết nối với chúng tôi</h4>
            <div className="fpt-header__social">
              <a
                href="https://www.facebook.com/fptuhalloween"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook FPTU Halloween"
                className="fpt-header__social-btn fpt-header__social-btn--facebook"
              >
                <FacebookIcon />
              </a>
              <a
                href="https://www.facebook.com/fuboardgameclub"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook FPTU Board Game Club"
                className="fpt-header__social-btn fpt-header__social-btn--tiktok"
              >
                <FacebookIcon />
              </a>
              <a
                href="https://www.tiktok.com/@fptu.halloween2025"
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok FPTU Halloween"
                className="fpt-header__social-btn fpt-header__social-btn--youtube"
              >
                <span aria-hidden="true">T</span>
              </a>
            </div>
          </div>

          <div className="fpt-footer__links-grid">
            {linkGroups.map((group) => (
              <div className="fpt-footer__link-group" key={group.title}>
                <h4 className="fpt-footer__link-title">{group.title}</h4>
                {group.links.map(([label, href]) => (
                  <Link className="fpt-footer__link" to={href} key={href}>
                    {label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <hr className="fpt-footer__divider" />
      <div className="fpt-footer__copyright">
        Phát triển bởi đội ngũ FPTU Halloween
        <br />
        Bản quyền © 2019-{year}. Bảo lưu mọi quyền.
      </div>
    </footer>
  );
}

export default Footer;
