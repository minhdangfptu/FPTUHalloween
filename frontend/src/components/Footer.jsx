import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./Footer.css";
import wtm from "../assets/wtm.png";
import EmailIcon from "@mui/icons-material/Email";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import YouTubeIcon from "@mui/icons-material/YouTube";

const linkGroups = [
  { titleKey: "footer.explore", links: [["footer.home", "/"], ["footer.halloween", "/introduce-hlw26"], ["footer.story", "/haunted-ghost"], ["footer.archive", "/old-event"]] },
  { titleKey: "footer.event", links: [["footer.eventIntro", "/event-page"], ["footer.overview", "/overall"], ["footer.timeline", "/agenda"]] },
  { titleKey: "footer.ticketsSupport", links: [["footer.buyTickets", "/tickets"], ["footer.myTickets", "/my-ticket"], ["footer.faq", "/faq"], ["footer.contact", "/contact-us"]] },
  { titleKey: "footer.organizers", links: [["footer.coreTeam", "/btc-fuhlw"], ["footer.pdp", "/pdp"], ["footer.club", "/fbgc"], ["footer.fanpage", "/fanpage"]] },
  { titleKey: "footer.legal", links: [["footer.dataPolicy", "/data-policy"], ["footer.terms", "/terms-of-use"], ["footer.ticketPolicy", "/ticket-policy"]] },
  { titleKey: "footer.account", links: [["footer.login", "/login"], ["footer.register", "/register"], ["footer.profile", "/user-profile"]] },
];

function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="fpt-footer">
      <div className="fpt-footer__container">
        <div className="fpt-footer__grid">
          <div className="fpt-footer__contact-section">
            <Link to="/" aria-label={t("footer.homeAria")}>
              <img src={wtm} alt="FPTU Halloween" className="fpt-footer__logo" />
            </Link>
            <h3 className="fpt-footer__contact-title">{t("footer.contactInfo")}</h3>
            <div className="fpt-footer__contact-item">
              <span className="fpt-footer__contact-icon" aria-hidden="true"><EmailIcon fontSize="small" /></span>
              <p className="fpt-footer__contact-text">fptuhalloween@gmail.com</p>
            </div>
            <div className="fpt-footer__contact-item">
              <span className="fpt-footer__contact-icon" aria-hidden="true"><LocationOnIcon fontSize="small" /></span>
              <p className="fpt-footer__contact-text">
                {t("footer.address")}<br />
                {t("footer.addressDetail")}
              </p>
            </div>
            <h4 className="fpt-footer__social-title">{t("footer.connect")}</h4>
            <div className="fpt-footer__social-buttons">
              <a href="https://www.facebook.com/fptuhalloween" target="_blank" rel="noreferrer" aria-label="Facebook FPTU Halloween" className="fpt-footer__social-btn fpt-footer__social-btn--facebook"><FacebookIcon /></a>
              <a href="https://www.facebook.com/fuboardgameclub" target="_blank" rel="noreferrer" aria-label="Facebook FPTU Board Game Club" className="fpt-footer__social-btn fpt-footer__social-btn--instagram"><InstagramIcon /></a>
              <a href="https://www.tiktok.com/@fptu.halloween2025" target="_blank" rel="noreferrer" aria-label="TikTok FPTU Halloween" className="fpt-footer__social-btn fpt-footer__social-btn--youtube"><YouTubeIcon /></a>
            </div>
          </div>

          <div className="fpt-footer__links-grid">
            {linkGroups.map((group) => (
              <div className="fpt-footer__link-group" key={group.titleKey}>
                <h4 className="fpt-footer__link-title">{t(group.titleKey)}</h4>
                {group.links.map(([labelKey, href]) => (
                  <Link className="fpt-footer__link" to={href} key={href}>{t(labelKey)}</Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <hr className="fpt-footer__divider" />
      <div className="fpt-footer__copyright">
        {t("footer.developedBy")}<br />
        {t("footer.copyright", { year })}
      </div>
    </footer>
  );
}

export default Footer;

