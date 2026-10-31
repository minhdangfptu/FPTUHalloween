import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import heroImage from "../../assets/hlw_cover_2026_new.png";
import mapImage from "../../assets/map.png";
import pdpLogo from "../../assets/pdpava.png";
import fptuLogo from "../../assets/logo fptu.webp";
import fbgcLogo from "../../assets/ava_fbgc.png";
import alFrescosLogo from "../../assets/ntt/df08160e-da91-4f6c-824a-a29a654173e0.png";
import khangPhuDatLogo from "../../assets/ntt/2821f40a-eec6-4d44-b511-7c7a87692452.png";
import villaParamountLogo from "../../assets/ntt/1 (1).png";
import nhaBenRungLogo from "../../assets/ntt/Asset 1.png";
import gauUniformLogo from "../../assets/ntt/Logo Gấu xanh.png";
import tranLongLogo from "../../assets/ntt/05a96034-44bb-448c-b5e8-ecb50402b022.png";
import "./HomePage.scss";

const EVENT_DATE = new Date("2026-10-29T15:00:00+07:00");

const getCountdown = () => {
  const difference = Math.max(EVENT_DATE.getTime() - Date.now(), 0);
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
    tone: "dark",
  },
  {
    number: "02",
    tone: "red",
  },
  {
    number: "03",
    tone: "violet",
  },
  {
    number: "04",
    tone: "paper",
  },
  {
    number: "05",
    tone: "orange",
  },
  {
    number: "06",
    tone: "yellow",
  },
  {
    number: "07",
    tone: "ink",
  },
];

const organizers = [
  {
    key: "fptu",
    nameKey: "organizerNames.fptu",
    image: fptuLogo,
    width: 240,
    height: 96,
  },
  {
    key: "pdp",
    nameKey: "organizerNames.pdp",
    image: pdpLogo,
    width: 1265,
    height: 361,
  },
  {
    key: "fbgc",
    nameKey: "organizerNames.fbgc",
    image: fbgcLogo,
    width: 552,
    height: 552,
  },
];

const sponsors = [
  {
    key: "khang-phu-dat",
    nameKey: "sponsorNames.khangPhuDat",
    tierKey: "sponsorTiers.gold",
    tier: "gold",
    image: khangPhuDatLogo,
    width: 2047,
    height: 2048,
  },
  {
    key: "tran-long",
    nameKey: "sponsorNames.tranLong",
    tierKey: "sponsorTiers.gold",
    tier: "gold",
    image: tranLongLogo,
    width: 2528,
    height: 1696,
  },
  {
    key: "villa-paramount",
    nameKey: "sponsorNames.villaParamount",
    tierKey: "sponsorTiers.silver",
    tier: "silver",
    image: villaParamountLogo,
    width: 1323,
    height: 862,
  },
  {
    key: "nha-ben-rung",
    nameKey: "sponsorNames.nhaBenRung",
    tierKey: "sponsorTiers.silver",
    tier: "silver",
    image: nhaBenRungLogo,
    width: 1323,
    height: 862,
  },
  {
    key: "al-frescos",
    nameKey: "sponsorNames.alFrescos",
    tierKey: "sponsorTiers.bronze",
    tier: "bronze",
    image: alFrescosLogo,
    width: 810,
    height: 477,
  },
  {
    key: "gau-uniform",
    nameKey: "sponsorNames.gauUniform",
    tierKey: "sponsorTiers.costume",
    tier: "costume",
    image: gauUniformLogo,
    width: 11815,
    height: 10214,
  },
];

const countdownItems = ["days", "hours", "minutes", "seconds"];

export default function HomePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const home = (key, options) => t(`normal.home.${key}`, options);
  const mapLegendItems = home("mapLegendItems", { returnObjects: true });
  const countdownLabelWords = home("countdownLabel").split(" ");
  const countdownLabelMain = countdownLabelWords.slice(0, -1).join(" ");
  const countdownLabelEmphasis = countdownLabelWords.at(-1);

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
    toast.success(
      t("normal.home.welcome", {
        name:
          user?.fullName ||
          user?.name ||
          (t("nav.home") === "HOME" ? "there" : "bạn"),
      }),
    );
  }, [t]);

  useEffect(() => {
    const timer = window.setInterval(() => setCountdown(getCountdown()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <main className="home-page">
      <section className="home-hero" aria-label={home("heroAria")}>
        <img
          className="home-hero__image"
          src={heroImage}
          alt={home("heroAlt")}
        />
      </section>

      <section className="home-hero-copy" aria-labelledby="home-hero-title">
        <div className="home-hero-copy__inner">
          <div className="home-hero__masthead">
            <span>{home("brand")}</span>
            <div className="home-lockup" aria-label={home("lockupAlt")}>
              <span className="home-lockup__mark home-lockup__mark--university">
                {home("university")}
              </span>
              <span className="home-lockup__mark home-lockup__mark--pdp">
                {home("pdp")}
              </span>
              <span className="home-lockup__mark home-lockup__mark--fbgc">
                {home("fbgc")}
              </span>
              <span className="home-lockup__mark home-lockup__mark--hlw">
                {home("hlw26")}
              </span>
            </div>
            <span>{home("eventMeta")}</span>
          </div>
          <p className="home-eyebrow">{home("eyebrow")}</p>
          <h1 id="home-hero-title">
            {home("slogan")}
            <span>{home("subSlogan")}</span>
          </h1>
          <p className="home-hero__lede">{home("lede")}</p>
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
            <div className="home-countdown__topline">
              <p id="home-countdown-title" className="home-countdown__label">
                <span>{countdownLabelMain}</span>
                <span className="home-countdown__label-emphasis">
                  {countdownLabelEmphasis}
                </span>
              </p>
              <time
                className="home-countdown__target"
                dateTime={EVENT_DATE.toISOString()}
              >
                {home("countdownTarget")}
              </time>
            </div>
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
          <p className="home-eyebrow">{home("conceptLabel")}</p>
          <h2 id="home-intro-title">
            {home("conceptLines", { returnObjects: true }).map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h2>
        </div>
        <div className="home-intro__body">
          <p className="home-intro__lead">{home("conceptLead")}</p>
          <p>{home("conceptBody")}</p>
        </div>
      </section>

      <section
        className="home-section home-highlights"
        aria-labelledby="home-highlights-title"
      >
        <div className="home-section__head home-section__head--line">
          <p className="home-eyebrow">{home("highlightsLabel")}</p>
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
                <h3>
                  {
                    home("highlightTitles", { returnObjects: true })[
                      Number(item.number) - 1
                    ]
                  }
                </h3>
                <p>
                  {
                    home("highlightDescriptions", { returnObjects: true })[
                      Number(item.number) - 1
                    ]
                  }
                </p>
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
        <div className="home-section__head home-timeline__header">
          <p className="home-eyebrow">{home("timelineLabel")}</p>
          <h2 id="home-timeline-title">{home("timeline")}</h2>
        </div>
        <div className="home-timeline__layout">
          <article className="home-timeline__panel home-timeline__panel--activities">
            <h3>{home("timelineActivitiesTitle")}</h3>
            <div className="home-timeline__activity-list">
              {home("timelineActivities", { returnObjects: true }).map(
                (activity) => (
                  <div
                    className={`home-timeline__activity home-timeline__activity--${activity.tone}`}
                    key={activity.title}
                  >
                    <div>
                      <strong>{activity.title}</strong>
                      {activity.items.map((item) => (
                        <p key={item}>{item}</p>
                      ))}
                    </div>
                    <span>{activity.time}</span>
                  </div>
                ),
              )}
            </div>
            <p className="home-timeline__footnote">
              {home("timelineFootnote")}
            </p>
          </article>
          <article className="home-timeline__panel home-timeline__panel--stage">
            <h3>{home("timelineStageTitle")}</h3>
            <ol className="home-timeline__list">
              {home("timelineStageItems", { returnObjects: true }).map(
                (item) => (
                  <li
                    key={item.time}
                    className={item.featured ? "is-featured" : ""}
                  >
                    <span>{item.time}</span>
                    <strong>{item.title}</strong>
                    <em>{item.note}</em>
                  </li>
                ),
              )}
            </ol>
          </article>
        </div>
        <p className="home-timeline__disclaimer">
          {home("timelineDisclaimer")}
        </p>
      </section>

      <section
        className="home-section home-map-section"
        aria-labelledby="home-map-title"
      >
        <div className="home-section__head">
          <p className="home-eyebrow">{home("mapLabel")}</p>
          <h2 id="home-map-title">{home("map")}</h2>
          <aside
            className="home-map__legend"
            aria-labelledby="home-map-legend-title"
          >
            <h3 id="home-map-legend-title">{home("mapLegendTitle")}</h3>
            <div className="home-map__legend-grid">
              {mapLegendItems.map((item) => (
                <div className="home-map__legend-item" key={item.title}>
                  <span className="home-map__legend-marker" aria-hidden="true">
                    {item.marker}
                  </span>
                  <p>
                    <strong>{item.title}</strong>
                    <span>{item.detail}</span>
                  </p>
                </div>
              ))}
            </div>
          </aside>
        </div>
        <div className="home-map">
          <img className="home-map__image" src={mapImage} alt={home("map")} />
        </div>
      </section>

      <section
        className="home-section home-sponsors"
        aria-labelledby="home-sponsors-title"
      >
        <div className="home-sponsors__heading">
          <p className="home-eyebrow">{home("sponsorsLabel")}</p>
          <h2 id="home-sponsors-title">{home("organizers")}</h2>
        </div>
        <ul className="home-organizers" aria-label={home("organizers")}>
          {organizers.map((organizer) => (
            <li
              className={`home-sponsor home-organizer home-organizer--${organizer.key}`}
              key={organizer.key}
            >
              <figure>
                <div className="home-sponsor__logo">
                  <img
                    src={organizer.image}
                    alt=""
                    width={organizer.width}
                    height={organizer.height}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <figcaption>
                  <strong>{home(organizer.nameKey)}</strong>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <div className="home-sponsors__subheading">
          <h3>{home("sponsors")}</h3>
          <span aria-hidden="true" />
        </div>
        <ul className="home-sponsors__grid" aria-label={home("sponsors")}>
          {sponsors.map((sponsor) => (
            <li
              className={`home-sponsor home-sponsor--${sponsor.tier} home-sponsor--${sponsor.key}`}
              key={sponsor.key}
            >
              <figure>
                <div className="home-sponsor__logo">
                  <img
                    src={sponsor.image}
                    alt=""
                    width={sponsor.width}
                    height={sponsor.height}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <figcaption>
                  <strong>{home(sponsor.nameKey)}</strong>
                  <span>{home(sponsor.tierKey)}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
