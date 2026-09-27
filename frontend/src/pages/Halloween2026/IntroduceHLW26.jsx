import React from "react";
import { ArrowDown, CalendarDays, Ghost } from "lucide-react";
import cover from "../../assets/cover-01.png";
import { useTranslation } from "react-i18next";
import event2020 from "../../assets/hlw/2020.jpg";
import event2022 from "../../assets/hlw/2022.jpg";
import event2023 from "../../assets/hlw/2023.jpg";
import event2024 from "../../assets/hlw/2024.jpg";
import event2025 from "../../assets/hlw/2025.jpg";
import handleSectionScroll from "../../utils/scroll-to-section";
import "./IntroduceHLW26.scss";

const sections = [
  { label: "01", key: "what" },
  { label: "02", key: "mission" },
  { label: "03", key: "values" },
  { label: "04", key: "size" },
];

const seasons = [
  {
    year: "2026",
    conceptKey: "bunnysNightmare",
    image: cover,
    scaleKey: "updating",
    detail: "/old-event#halloween-2026",
  },
  {
    year: "2025",
    conceptKey: "wishbound",
    image: event2025,
    scaleKey: "updating",
    detail: "/old-event#halloween-2025",
  },
  {
    year: "2024",
    conceptKey: "uLinhKy",
    image: event2024,
    scaleKey: "updating",
    detail: "/old-event#halloween-2024",
  },
  {
    year: "2023",
    conceptKey: "hauntedFest",
    image: event2023,
    scaleKey: "updating",
    detail: "/old-event#halloween-2023",
  },
  {
    year: "2022",
    conceptKey: "fearCorner",
    image: event2022,
    scaleKey: "updating",
    detail: "/old-event#halloween-2022",
  },
  {
    year: "2020",
    conceptKey: "hauntedForest",
    image: event2020,
    scaleKey: "updating",
    detail: "/old-event#halloween-2020",
  },
];

export default function IntroduceHLW26() {
  const { t } = useTranslation();
  const page = (key, options) => t(`eventPages.hlwIntro.${key}`, options);
  return (
    <main className="introduce-hlw26">
      <section
        className="introduce-hlw26__hero"
        style={{ backgroundImage: `url(${cover})` }}
      >
        <div className="introduce-hlw26__hero-overlay" />
        <div className="introduce-hlw26__hero-content">
          <p className="introduce-hlw26__eyebrow">{page("kicker")}</p>
          <h1>
            {page("title")}
            <br />
            <span>{page("titleAfter")}</span>
          </h1>
          <p>{page("subtitle")}</p>
          <a
            href="#overview"
            className="introduce-hlw26__scroll"
            onClick={handleSectionScroll}
          >
            {page("explore")} <ArrowDown size={16} />
          </a>
        </div>
        <div className="introduce-hlw26__year" aria-hidden="true">
          26
        </div>
      </section>

      <section
        className="introduce-hlw26__overview"
        id="overview"
        aria-labelledby="overview-title"
      >
        <div className="introduce-hlw26__section-mark">
          <Ghost size={18} /> {page("overview")}
        </div>
        <div>
          <h2 id="overview-title">
            {page("overviewTitle")}
            <br />
            <span>{page("overviewTitleAfter")}</span>
          </h2>
          <p>{page("overviewBody")}</p>
        </div>
      </section>

      <section
        className="introduce-hlw26__facts"
        aria-label={page("factsLabel")}
      >
        {sections.map((section) => (
          <article className="introduce-hlw26__fact" key={section.label}>
            <span>{section.label}</span>
            <h3>{page(`facts.${section.key}.title`)}</h3>
            <p>{page(`facts.${section.key}.text`)}</p>
          </article>
        ))}
      </section>

      <section
        className="introduce-hlw26__seasons"
        aria-labelledby="seasons-title"
      >
        <div className="introduce-hlw26__seasons-head">
          <div className="introduce-hlw26__section-mark">
            <CalendarDays size={18} /> {page("milestone")}
          </div>
          <h2 id="seasons-title">{page("seasons")}</h2>
          <p>
            {page("seasonsIntro")}
          </p>
        </div>
        <div className="introduce-hlw26__season-list">
          {[...seasons].reverse().map((season) => (
            <a
              className="introduce-hlw26__season"
              href={season.detail}
              key={season.year}
            >
              <div className="introduce-hlw26__season-thumb">
                {season.image ? (
                  <img src={season.image} alt={page("seasonThumbnail", { year: season.year })} />
                ) : (
                  <span className="introduce-hlw26__coming-soon">
                    {page("comingSoon")}
                  </span>
                )}
              </div>
              <div>
                <span>{season.year}</span>
                <strong>{page("seasonTitle", { year: season.year })}</strong>
                <small>{page("concept")} · {page(`concepts.${season.conceptKey}`)}</small>
                <small>{page("scale")} · {page(season.scaleKey)}</small>
              </div>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
