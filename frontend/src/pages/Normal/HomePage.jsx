import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import heroImage from "../../assets/cover-01.png";
import pdpLogo from "../../assets/pdp_avatar.jpg";
import fptuLogo from "../../assets/logo fptu.webp";
import fbgcLogo from "../../assets/fbgc.png";
import wtmLogo from "../../assets/wtm.png";
import "./HomePage.scss";

const EVENT_DATE = new Date("2026-10-31T18:00:00+07:00").getTime();

const getCountdown = () => {
  const difference = Math.max(EVENT_DATE - Date.now(), 0);
  const totalSeconds = Math.floor(difference / 1000);

  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    complete: difference === 0,
  };
};

const highlights = [
  {
    number: "01",
    title: "Nhà ma",
    description:
      "Một tuyến trải nghiệm nhập vai, nơi mỗi cánh cửa mở ra một lớp chuyện mới.",
    tone: "dark",
  },
  {
    number: "02",
    title: "Game zone",
    description:
      "Game sân khấu, big game, minigame và những thử thách kéo mọi người vào cuộc.",
    tone: "red",
  },
  {
    number: "03",
    title: "Cosplay",
    description:
      "Hóa thân theo chủ đề năm và bước vào một đêm Halloween có dấu ấn riêng.",
    tone: "violet",
  },
  {
    number: "04",
    title: "Photobooth",
    description:
      "Một góc lưu lại outfit, hội bạn và những khoảnh khắc không lặp lại.",
    tone: "paper",
  },
  {
    number: "05",
    title: "Main stage",
    description:
      "Tiết mục, khách mời và nhịp sân khấu được xếp thành một đêm diễn liền mạch.",
    tone: "orange",
  },
  {
    number: "06",
    title: "Lucky draw",
    description:
      "Quà tặng và những bất ngờ nhỏ khép lại hành trình của bạn tại lễ hội.",
    tone: "ink",
  },
];

const timeline = [
  {
    time: "01",
    title: "Mở cổng",
    description: "Đón khách, check-in và nhận thông tin hành trình.",
  },
  {
    time: "02",
    title: "Khám phá",
    description: "Nhà ma, game zone, photobooth và các hoạt động bên lề.",
  },
  {
    time: "03",
    title: "Lên sân khấu",
    description: "Tiết mục, khách mời và những màn tương tác theo chủ đề.",
  },
  {
    time: "04",
    title: "Khép đêm",
    description: "Lucky draw, quà tặng và lời hẹn cho mùa Halloween tiếp theo.",
  },
];

const sponsors = [
  { key: "pdp", label: "PDP", image: pdpLogo, alt: "Logo PDP" },
  { key: "fptu", label: "FPTU", image: fptuLogo, alt: "Logo FPT University" },
  { key: "fbgc", label: "FBGC", image: fbgcLogo, alt: "Logo FPTU Board Game Club" },
  { key: "hlw26", label: "HLW26", image: wtmLogo, alt: "Logo FPTU Halloween 2026" },
];

const countdownItems = [
  "days",
  "hours",
  "minutes",
  "seconds",
];

export default function HomePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const home = (key, options) => t(`normal.home.${key}`, options);
  const [countdown, setCountdown] = useState(getCountdown);

  const handleExploreClick = (event) => {
    event.preventDefault();
    const target = document.getElementById("home-intro");
    if (!target) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    target.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  useEffect(() => {
    if (sessionStorage.getItem("showLoginWelcome") !== "1") return;
    sessionStorage.removeItem("showLoginWelcome");
    const user = JSON.parse(localStorage.getItem("user") || "null");
    toast.success(t("normal.home.welcome", { name: user?.fullName || user?.name || (t("nav.home") === "HOME" ? "there" : "bạn") }));
  }, [t]);

  useEffect(() => {
    const timer = window.setInterval(() => setCountdown(getCountdown()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <main className="home-page">
      <section
        className="home-hero"
        aria-label="FPTU Halloween 2026 hero banner"
      >
        <img
          className="home-hero__image"
          src={heroImage}
          alt={home("heroAlt")}
        />
      </section>

      <section className="home-hero-copy" aria-labelledby="home-hero-title">
        <div className="home-hero-copy__inner">
          <div className="home-hero__masthead">
            <span>FPTU HALLOWEEN</span>
            <div
              className="home-lockup"
              aria-label={home("lockupAlt")}
            >
              <span className="home-lockup__mark home-lockup__mark--university">
                FPT UNIVERSITY
              </span>
              <span className="home-lockup__mark home-lockup__mark--pdp">
                PDP
              </span>
              <span className="home-lockup__mark home-lockup__mark--fbgc">
                FBGC
              </span>
              <span className="home-lockup__mark home-lockup__mark--hlw">
                HLW26
              </span>
            </div>
            <span>2026 / FPTU HÀ NỘI</span>
          </div>
          <p className="home-eyebrow">{home("eyebrow")}</p>
          <h1 id="home-hero-title">
            {home("slogan")}
            <span>{home("subSlogan")}</span>
          </h1>
          <p className="home-hero__lede">
            {home("lede")}
          </p>
          <div className="home-hero__actions">
            <button
              className="home-button home-button--primary"
              type="button"
              onClick={() => navigate("/tickets")}
            >
              {home("buy")}
            </button>
            <a
              className="home-button home-button--quiet"
              href="#home-intro"
              onClick={handleExploreClick}
            >
              {home("explore")} <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
      </section>

      <section
        className="home-countdown-section"
        aria-labelledby="home-countdown-title"
      >
        <div className="home-countdown">
          <div className="home-countdown__heading">
            <p id="home-countdown-title" className="home-countdown__label">
              COUNTDOWN D-DAY
            </p>
            <span>
              {countdown.complete ? home("countdownDone") : home("countdownLeft")}
            </span>
          </div>
          <div className="home-countdown__grid" aria-live="polite">
            {countdownItems.map((key) => (
              <div className="home-countdown__unit" key={key}>
                <strong>{String(countdown[key]).padStart(2, "0")}</strong>
                <span>{home(key)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="home-section home-intro"
        id="home-intro"
        aria-labelledby="home-intro-title"
      >
        <div className="home-section__head">
          <p className="home-eyebrow">01 · CONCEPT NOTE</p>
          <h2 id="home-intro-title">
            {home("concept")}
          </h2>
        </div>
        <div className="home-intro__body">
          <p className="home-intro__lead">
            {home("conceptLead")}
          </p>
          <p>
            {home("conceptBody")}
          </p>
        </div>
      </section>

      <section
        className="home-section home-highlights"
        aria-labelledby="home-highlights-title"
      >
        <div className="home-section__head home-section__head--line">
          <p className="home-eyebrow">02 · THE NIGHT MAP</p>
          <h2 id="home-highlights-title">{home("highlights")}</h2>
          <p>{home("highlightsIntro")}</p>
        </div>
        <div className="home-highlights__list">
          {highlights.map((item) => (
            <article
              className={`home-highlight home-highlight--${item.tone}`}
              key={item.number}
            >
              <span className="home-highlight__number">{item.number}</span>
              <div>
                <h3>{home("highlightTitles", { returnObjects: true })[Number(item.number) - 1]}</h3>
                <p>{home("highlightDescriptions", { returnObjects: true })[Number(item.number) - 1]}</p>
              </div>
              <span className="home-highlight__arrow" aria-hidden="true">
                ↗
              </span>
            </article>
          ))}
        </div>
      </section>

      <section
        className="home-section home-timeline"
        aria-labelledby="home-timeline-title"
      >
        <div className="home-section__head">
          <p className="home-eyebrow">03 · RUN OF SHOW</p>
          <h2 id="home-timeline-title">{home("timeline")}</h2>
        </div>
        <div className="home-timeline__layout">
          <p className="home-timeline__note">
            {home("timelineNote")}
          </p>
          <ol className="home-timeline__list">
            {timeline.map((item) => (
              <li key={item.time}>
                <span>{item.time}</span>
                <div>
                  <h3>{home("timelineTitles", { returnObjects: true })[Number(item.time) - 1]}</h3>
                  <p>{home("timelineDescriptions", { returnObjects: true })[Number(item.time) - 1]}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        className="home-section home-map-section"
        aria-labelledby="home-map-title"
      >
        <div className="home-section__head">
          <p className="home-eyebrow">04 · FIND YOUR WAY</p>
          <h2 id="home-map-title">{home("map")}</h2>
        </div>
        <div className="home-map">
          <div className="home-map__grid" aria-hidden="true" />
          <span
            className="home-map__route home-map__route--one"
            aria-hidden="true"
          />
          <span
            className="home-map__route home-map__route--two"
            aria-hidden="true"
          />
          <span className="home-map__point home-map__point--main">
            MAIN GATE
          </span>
          <span className="home-map__point home-map__point--house">{home("hauntedHouse")}</span>
          <span className="home-map__point home-map__point--stage">STAGE</span>
          <span className="home-map__caption">
            {home("mapCaption")}
          </span>
        </div>
      </section>

      <section
        className="home-section home-sponsors"
        aria-labelledby="home-sponsors-title"
      >
        <div className="home-section__head home-section__head--compact">
          <p className="home-eyebrow">05 · WITH SUPPORT FROM</p>
          <h2 id="home-sponsors-title">{home("sponsors")}</h2>
        </div>
        <div className="home-sponsors__row">
          {sponsors.map((sponsor) => (
            <div className={`home-sponsor home-sponsor--${sponsor.key}`} key={sponsor.label}>
              {sponsor.image ? (
                <img src={sponsor.image} alt={home("sponsorsAlt", { name: sponsor.label })} />
              ) : (
                <span>{sponsor.label}</span>
              )}
            </div>
          ))}
        </div>
        <p className="home-sponsors__note">
          {home("sponsorsNote")}
        </p>
      </section>
    </main>
  );
}
