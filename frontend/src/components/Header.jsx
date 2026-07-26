import React, { useEffect, useState } from "react";
import "./Header.css";
import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";
import InstagramIcon from "@mui/icons-material/Instagram";
import { Circle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import hotNewsAPI from "../apis/hotNewsAPI";
import { ScrollBasedVelocity } from "./ui/scroll-based-velocity";

const HOT_NEWS_ERROR_FALLBACK =
  "Chào mừng bạn đến với FPTU Halloween! Hãy chuẩn bị sẵn sàng tinh thần để bước vào đêm hội kinh hoàng và bùng nổ nhất năm!";

const renderTickerContent = (items) => (
  items.map((item, index) => (
    <React.Fragment key={item._id || index}>
      <span className="fpt-header__ticker-item">
        {item.link ? (
          <a href={item.link} target="_blank" rel="noreferrer">
            {item.content}
          </a>
        ) : (
          item.content
        )}
      </span>
      <span className="fpt-header__ticker-separator" aria-hidden="true">
        <Circle size={7} strokeWidth={0} fill="currentColor" />
      </span>
    </React.Fragment>
  ))
);

function Header() {
  const navigate = useNavigate();
  const [activeHotNews, setActiveHotNews] = useState([]);
  const [hotNewsState, setHotNewsState] = useState("loading");

  useEffect(() => {
    let isMounted = true;

    hotNewsAPI
      .getActiveList()
      .then((items) => {
        if (!isMounted) return;
        setActiveHotNews(items);
        setHotNewsState("ready");
      })
      .catch(() => {
        if (!isMounted) return;
        setHotNewsState("error");
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const tickerItems = hotNewsState === "error"
    ? [{ _id: "error", content: HOT_NEWS_ERROR_FALLBACK }]
    : hotNewsState === "ready"
      ? activeHotNews
      : [];

  return (
    <header className="fpt-header">
      <div className="fpt-header__container">
        <div className="fpt-header__content">
          <div
            className="fpt-header__ticker"
            aria-label="Thông báo sự kiện"
            aria-live="polite"
          >
            {tickerItems.length > 0 && (
              <ScrollBasedVelocity
                text={renderTickerContent(tickerItems)}
                default_velocity={60}
                className="fpt-header__ticker-track"
                startFromRight
              />
            )}
          </div>

          <div className="fpt-header__actions">
            <div className="fpt-header__social">
              <button
                onClick={() =>
                  window.open(
                    "https://www.facebook.com/fptuhalloween",
                    "_blank",
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
                    "_blank",
                  )
                }
                className="fpt-header__social-btn fpt-header__social-btn--tiktok"
              >
                <InstagramIcon sx={{ color: "white" }} />
              </button>
              <button
                onClick={() =>
                  window.open(
                    "https://www.tiktok.com/@fptu.halloween2025",
                    "_blank",
                  )
                }
                className="fpt-header__social-btn fpt-header__social-btn--youtube"
              >
                <YouTubeIcon sx={{ color: "white" }} />
              </button>
            </div>
            <button
              onClick={() => navigate("/tickets")}
              className="fpt-header__cta-btn"
            >
              MUA VÉ NGAY
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
