"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import * as PdpIcons from "lucide-react";
import pdpAvatar from "../../assets/pdp_avatar_to.jpg";
import pdpHeroImage from "../../assets/pdp_thubnail.jpg";
import handleSectionScroll from "../../utils/scroll-to-section";
import "./PDP.scss";

const tabItems = [
  { id: "about", labelKey: "tabs.about" },
  { id: "pillars", labelKey: "tabs.pillars" },
  { id: "halloween", labelKey: "tabs.halloween" },
  { id: "impact", labelKey: "tabs.impact" },
];

const infoItems = [
  { icon: "UserRound", key: "unit" },
  { icon: "Share2", key: "role" },
  { icon: "Mail", key: "pillars" },
  { icon: "Phone", key: "audience" },
  { icon: "MapPin", key: "location" },
];

const renderIcon = (name, props = {}) => {
  const Icon = PdpIcons[name];
  return <Icon {...props} aria-hidden="true" />;
};

export default function PDP() {
  const [activeTab, setActiveTab] = useState("about");
  const { t } = useTranslation();
  const pdp = (key) => t(`eventPages.pdp.${key}`);

  return (
    <main className="fptu-club-page">
      <section
        className="fptu-club-hero"
        style={{ backgroundImage: `url(${pdpHeroImage})` }}
      >
        <div className="fptu-club-hero-overlay" />
        <div className="fptu-club-hero-content">
          <p className="fptu-club-eyebrow">
            {pdp("eyebrow")}
          </p>
          <h1>
            {pdp("heroTitle")}
            <br />
            <span>{pdp("heroTitleAfter")}</span>
          </h1>
          <p className="fptu-club-hero-lede">{pdp("description")}</p>
          <a
            className="fptu-club-scroll-link"
            href="#pdp-profile"
            onClick={handleSectionScroll}
          >
            {pdp("explore")} {renderIcon("ArrowDown", { size: 16 })}
          </a>
        </div>
        <div className="fptu-club-hero-year" aria-hidden="true">
          PDP
        </div>
      </section>

      <section
        className="fptu-club-profile"
        id="pdp-profile"
        aria-labelledby="pdp-profile-title"
      >
        <div className="fptu-club-profile-main">
          <div className="fptu-club-section-mark">
            {renderIcon("UserRound", { size: 18 })} PDP
          </div>

          <header className="fptu-club-brand">
            <div className="fptu-club-avatar">
              <img src={pdpAvatar} alt={pdp("logoAlt")} loading="lazy" />
              <span aria-hidden="true">PDP</span>
            </div>
            <div className="fptu-club-brand-copy">
              <p className="fptu-club-brand-kicker">{pdp("brandKicker")}</p>
              <h2 id="pdp-profile-title">{pdp("title")}</h2>
              <p>
                {renderIcon("MapPin", { size: 15 })} {pdp("locationValue")}
              </p>
            </div>
          </header>

          <div className="fptu-club-content-layout">
            <article className="fptu-club-story">
              <div
                className="fptu-club-tabs"
                role="tablist"
                aria-label={pdp("tabsAria")}
              >
                {tabItems.map((tab) => (
                  <button
                    className={activeTab === tab.id ? "is-active" : ""}
                    id={`pdp-tab-${tab.id}`}
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    aria-controls={`pdp-panel-${tab.id}`}
                    tabIndex={activeTab === tab.id ? 0 : -1}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {pdp(tab.labelKey)}
                  </button>
                ))}
              </div>

              <div
                className="fptu-club-panel"
                id={`pdp-panel-${activeTab}`}
                role="tabpanel"
                aria-labelledby={`pdp-tab-${activeTab}`}
                aria-live="polite"
              >
                {activeTab === "about" && (
                  <>
                    <p className="fptu-club-lede">{pdp("description")}</p>
                    <p>{pdp("support")}</p>
                    <div
                      className="fptu-club-stat-row"
                      aria-label={pdp("statsAria")}
                    >
                      <div>
                        <strong>3</strong>
                        <span>{pdp("developmentPillars")}</span>
                      </div>
                      <div>
                        <strong>35K</strong>
                        <span>{pdp("followers")}</span>
                      </div>
                      <div>
                        <strong>88</strong>
                        <span>{pdp("following")}</span>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === "pillars" && (
                  <>
                    <h3>{pdp("pillarsTitle")}</h3>
                    <p className="fptu-club-lede">{pdp("pillarsBody")}</p>
                    <div className="fptu-club-stat-row">
                      <div>
                        <strong>01</strong>
                        <span>{pdp("club")}</span>
                      </div>
                      <div>
                        <strong>02</strong>
                        <span>{pdp("events")}</span>
                      </div>
                      <div>
                        <strong>03</strong>
                        <span>{pdp("courses")}</span>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === "halloween" && (
                  <div className="fptu-club-empty-state">
                    <span>01</span>
                    <h3>{pdp("halloweenTitle")}</h3>
                    <p>{pdp("support")}</p>
                  </div>
                )}

                {activeTab === "impact" && (
                  <>
                    <h3>{pdp("impactTitle")}</h3>
                    <p className="fptu-club-lede">{pdp("impactLead")}</p>
                    <p>{pdp("impactBody")}</p>
                  </>
                )}
              </div>
            </article>

            <aside
              className="fptu-club-contact"
              aria-labelledby="pdp-info-title"
            >
              <div className="fptu-club-contact-mark">
                {renderIcon("UserRound", { size: 17 })} {pdp("infoMark")}
              </div>
              <h3 id="pdp-info-title">{pdp("infoTitle")}</h3>
              <dl>
                {infoItems.map((item) => (
                  <div className="fptu-club-contact-item" key={item.key}>
                    {renderIcon(item.icon, { size: 17 })}
                    <div>
                      <dt>{pdp(`info.${item.key}.label`)}</dt>
                      <dd>{pdp(`info.${item.key}.value`)}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
