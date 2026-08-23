"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
// eslint-disable-next-line no-unused-vars -- namespace icons are rendered as JSX member components.
import * as ClubIcons from "lucide-react";
import clubAvatar from "../../assets/ava_fbgc.jpg";
import heroImage from "../../assets/fbgc_thumbnail.jpg";
import achievementImageOne from "../../assets/ptxs.jpg";
import achievementImageTwo from "../../assets/ptxs2.jpg";
import weeklyImageOne from "../../assets/shht1.jpg";
import weeklyImageTwo from "../../assets/shht2.jpg";
import weeklyImageThree from "../../assets/shht3.jpg";
import handleSectionScroll from "../../utils/scroll-to-section";
import "./FPTUBoardGameClub.scss";

const clubData = {
  logoUrl: clubAvatar,
  email: "fuboardgameclub@gmail.com",
  facebook: "https://fb.me/fuboardgameclub",
  phone: "0944989980",
  memberCount: 200,
  establishedYear: 2019,
  weeklyImage:
    "https://scontent.fhan15-2.fna.fbcdn.net/v/t39.30808-6/558640148_1438506497878768_4673805905158913483_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeHSSkSqgc-3C4StpHL4AMOMgGs6KyTPQ-GAazorJM9D4Q6wGvhPybpRL4btSkk2XgcpnhKo1RsKatFSXWG67MrV&_nc_ohc=kdKU2FRC-rAQ7kNvwGvFnHt&_nc_oc=Admxpb4df4Wa8wegJplMf0m5Q9vpjhwD4cDxV1ubvSDyxSo3ZCssn9jofLGjLkjZc1c&_nc_zt=23&_nc_ht=scontent.fhan15-2.fna&_nc_gid=OQ97Qya-8ax4DgMjUl1P5A&oh=00_AfcyLVzlwhX8CL5aqT1yAE61iZmvslVQPPlVvQ5rbb6bRQ&oe=68F4E2D6",
  achievementImage:
    "https://scontent.fhan15-2.fna.fbcdn.net/v/t39.30808-6/491951064_1293132839082802_8405279153751387439_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeGWk9Le5C14GsWJ4RqaZS6VOmy0CqE0alo6bLQKoTRqWpcQFqBfhnrRIINIZbsCIESU3QbujZlSfYx_EVc0OaHS&_nc_ohc=zfNZU7kg7ugQ7kNvwGTvyy5&_nc_oc=AdlcJNpaKuxyj_tuDrS6KOEhaE3VyvGP-Vf6yyHhedaXqZGc6HUXqMUQlz5YERA44tU&_nc_zt=23&_nc_ht=scontent.fhan15-2.fna&_nc_gid=qBtiqmArHDJ4dBvA2Byqow&oh=00_AfesFM0J9LNdlr2f8ps2YRBgYjmXamUJPDZj6YahQa8XtQ&oe=68F4E543",
};

const tabItems = [
  { id: "about", labelKey: "tabs.about" },
  { id: "weekly", labelKey: "tabs.weekly" },
  { id: "events", labelKey: "tabs.events" },
  { id: "achievements", labelKey: "tabs.achievements" },
];

export default function FPTUBoardGameClub() {
  const [activeTab, setActiveTab] = useState("about");
  const { t } = useTranslation();
  const club = (key, options) => t(`eventPages.club.${key}`, options);

  return (
    <main className="fptu-club-page">
      <section
        className="fptu-club-hero"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="fptu-club-hero-overlay" />
        <div className="fptu-club-hero-content">
          <p className="fptu-club-eyebrow">
            {club("eyebrow")}
          </p>
          <h1>
            {club("heroTitle")}
            <br />
            <span>{club("heroTitleAfter")}</span>
          </h1>
          <p className="fptu-club-hero-lede">
            {club("heroLede")}
          </p>
          <a
            className="fptu-club-scroll-link"
            href="#club-profile"
            onClick={handleSectionScroll}
          >
            {t("nav.introduceGeneral")} <ClubIcons.ArrowDown size={16} aria-hidden="true" />
          </a>
        </div>
        <div className="fptu-club-hero-year" aria-hidden="true">
          19
        </div>
      </section>

      <section
        className="fptu-club-profile"
        id="club-profile"
        aria-labelledby="club-profile-title"
      >
        <div className="fptu-club-profile-main">
          <div className="fptu-club-section-mark">
            <ClubIcons.Gamepad2 size={18} aria-hidden="true" /> {t("nav.boardGameClub")}
          </div>

          <header className="fptu-club-brand">
            <div className="fptu-club-avatar">
              <img src={clubData.logoUrl} alt="" loading="lazy" />
              <span aria-hidden="true">F</span>
            </div>
            <div className="fptu-club-brand-copy">
              <p className="fptu-club-brand-kicker">{club("brandKicker")}</p>
              <h2 id="club-profile-title">{club("clubName")}</h2>
              <p>
                <ClubIcons.MapPin size={15} aria-hidden="true" />{" "}
                {club("location")}
              </p>
            </div>
          </header>

          <div className="fptu-club-content-layout">
            <article className="fptu-club-story">
              <div
                className="fptu-club-tabs"
                role="tablist"
                aria-label={club("tabsAria")}
              >
                {tabItems.map((tab) => (
                  <button
                    className={activeTab === tab.id ? "is-active" : ""}
                    id={`club-tab-${tab.id}`}
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    aria-controls={`club-panel-${tab.id}`}
                    tabIndex={activeTab === tab.id ? 0 : -1}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {club(tab.labelKey)}
                  </button>
                ))}
              </div>

              <div
                className="fptu-club-panel"
                id={`club-panel-${activeTab}`}
                role="tabpanel"
                aria-labelledby={`club-tab-${activeTab}`}
                aria-live="polite"
              >
                {activeTab === "about" && (
                  <>
                    <p className="fptu-club-lede">{club("description")}</p>
                    <p>{club("aboutBody")}</p>
                    <div
                      className="fptu-club-stat-row"
                      aria-label={club("statsAria")}
                    >
                      <div>
                        <strong>{clubData.memberCount}</strong>
                        <span>{club("members")}</span>
                      </div>
                      <div>
                        <strong>{clubData.establishedYear}</strong>
                        <span>{club("established")}</span>
                      </div>
                      <div>
                        <strong>2024</strong>
                        <span>{club("excellentClub")}</span>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === "weekly" && (
                  <>
                    <h3>{club("weeklyTitle")}</h3>
                    <p className="fptu-club-lede">{club("weeklyBody")}</p>
                    <div className="fptu-club-weekly-gallery">
                      <figure className="fptu-club-image-frame">
                        <img
                          src={weeklyImageOne}
                          alt={club("weeklyAlt1")}
                          loading="lazy"
                        />
                        <figcaption>{club("weeklyCaption1")}</figcaption>
                      </figure>
                      <figure className="fptu-club-image-frame">
                        <img
                          src={weeklyImageTwo}
                          alt={club("weeklyAlt2")}
                          loading="lazy"
                        />
                        <figcaption>{club("weeklyCaption2")}</figcaption>
                      </figure>
                      <figure className="fptu-club-image-frame">
                        <img
                          src={weeklyImageThree}
                          alt={club("weeklyAlt3")}
                          loading="lazy"
                        />
                        <figcaption>{club("weeklyCaption3")}</figcaption>
                      </figure>
                    </div>
                  </>
                )}

                {activeTab === "events" && (
                  <div className="fptu-club-empty-state">
                    <h3>{club("eventsTitle")}</h3>
                    <p>{club("eventsBody")}</p>
                  </div>
                )}

                {activeTab === "achievements" && (
                  <>
                    <h3>{club("achievementsTitle")}</h3>
                    <p className="fptu-club-lede">{club("achievementsBody")}</p>
                    <div className="fptu-club-achievement-gallery">
                      <figure className="fptu-club-image-frame">
                        <img
                          src={achievementImageOne}
                          alt={club("achievementAlt1")}
                          loading="lazy"
                        />
                        <figcaption>{club("achievementCaption1")}</figcaption>
                      </figure>
                      <figure className="fptu-club-image-frame">
                        <img
                          src={achievementImageTwo}
                          alt={club("achievementAlt2")}
                          loading="lazy"
                        />
                        <figcaption>{club("achievementCaption2")}</figcaption>
                      </figure>
                    </div>
                  </>
                )}
              </div>
            </article>

            <aside
              className="fptu-club-contact"
              aria-labelledby="club-contact-title"
            >
              <div className="fptu-club-contact-mark">
                <ClubIcons.UserRound size={17} aria-hidden="true" /> {club("contactMark")}
              </div>
              <h3 id="club-contact-title">{club("contactTitle")}</h3>
              <dl>
                <div className="fptu-club-contact-item">
                  <ClubIcons.UserRound size={17} aria-hidden="true" />
                  <div>
                    <dt>{club("presidentLabel")}</dt>
                    <dd>{club("president")}</dd>
                  </div>
                </div>
                <div className="fptu-club-contact-item">
                  <ClubIcons.Share2 size={17} aria-hidden="true" />
                  <div>
                    <dt>{club("facebook")}</dt>
                    <dd>
                      <a
                        href={clubData.facebook}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {club("facebookHandle")}
                      </a>
                    </dd>
                  </div>
                </div>
                <div className="fptu-club-contact-item">
                  <ClubIcons.Mail size={17} aria-hidden="true" />
                  <div>
                    <dt>{club("email")}</dt>
                    <dd>
                      <a href={`mailto:${clubData.email}`}>{clubData.email}</a>
                    </dd>
                  </div>
                </div>
                <div className="fptu-club-contact-item">
                  <ClubIcons.Phone size={17} aria-hidden="true" />
                  <div>
                    <dt>{club("phone")}</dt>
                    <dd>
                      <a href={`tel:${clubData.phone}`}>{clubData.phone}</a>
                    </dd>
                  </div>
                </div>
                <div className="fptu-club-contact-item">
                  <ClubIcons.MapPin size={17} aria-hidden="true" />
                  <div>
                    <dt>{club("locationLabel")}</dt>
                    <dd>{club("location")}</dd>
                  </div>
                </div>
              </dl>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
