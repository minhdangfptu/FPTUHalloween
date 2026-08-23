/* Hallmark · macrostructure: Rainbow directory · tone: botanical carnival · anchor hue: spectral rainbow */
import "./AboutTwoBars.scss";
import { useTranslation } from "react-i18next";
import antonie from "../../assets/easteregg/antonie.jpg";
import chutich from "../../assets/easteregg/chutich.jpg";
import cuong from "../../assets/easteregg/cuong.jpg";
import gh from "../../assets/easteregg/gh.jpg";
import hkc from "../../assets/easteregg/hkc.png";
import kkb from "../../assets/easteregg/bao.png";
import md from "../../assets/easteregg/md.png";
import td from "../../assets/easteregg/td.jpg";
import triet from "../../assets/easteregg/triet.jpg";

const featuredPeople = [
  {
    key: "president",
    image: chutich,
    tone: "coral",
  },
];

const teamPeople = [
  {
    key: "rightHand",
    image: antonie,
    tone: "yellow",
  },
  { key: "deputy", image: gh, tone: "pink" },
  {
    key: "assistant",
    image: hkc,
    tone: "blue",
  },
  {
    key: "drama",
    image: kkb,
    tone: "orange",
  },
  {
    key: "wax",
    image: md,
    tone: "lilac",
  },
  {
    key: "scare",
    image: td,
    tone: "green",
  },
  {
    key: "joy",
    image: triet,
    tone: "aqua",
  },
  {
    key: "heir",
    image: cuong,
    tone: "red",
  },
];

const AboutTwoBars = () => {
  const { t } = useTranslation();
  const easter = (key) => t(`easterEgg.${key}`);

  return (
    <main className="easter-page">
      <div className="easter-page__confetti" aria-hidden="true">
        <span className="easter-page__petal easter-page__petal--one" />
        <span className="easter-page__petal easter-page__petal--two" />
        <span className="easter-page__petal easter-page__petal--three" />
        <span className="easter-page__spark easter-page__spark--one">✦</span>
        <span className="easter-page__spark easter-page__spark--two">✧</span>
      </div>

      <section className="easter-directory" aria-labelledby="easter-title">
        <header className="easter-directory__masthead">
          <p className="easter-kicker">
            {easter("kicker")}
          </p>
          <h1 id="easter-title">{easter("title")}</h1>
          <p className="easter-directory__intro">
            {easter("intro")}
          </p>
        </header>

        <div className="easter-featured-bar">
          {featuredPeople.map((person) => (
            <article
              className={`easter-featured-card easter-featured-card--${person.tone}`}
              key={person.key}
            >
              <div className="easter-avatar easter-avatar--featured">
                <img src={person.image} alt="" />
                <span aria-hidden="true">✦</span>
              </div>
              <div className="easter-featured-card__copy">
                <p className="easter-label">{easter(`people.${person.key}.eyebrow`)}</p>
                <h2>{easter(`people.${person.key}.name`)}</h2>
                <p>{easter(`people.${person.key}.note`)}</p>
              </div>
              <span className="easter-featured-card__number" aria-hidden="true">
                ✺
              </span>
            </article>
          ))}
        </div>
      </section>

      <section className="easter-team" aria-labelledby="easter-team-title">
        <div className="easter-team__heading">
          <p className="easter-kicker">{easter("teamKicker")}</p>
          <h2 id="easter-team-title">{easter("teamTitle")}</h2>
          <span className="easter-team__orbit" aria-hidden="true" />
        </div>

        <div className="easter-team__bar">
          <div className="easter-team__track">
            {[...teamPeople, ...teamPeople].map((person, index) => (
              <article
                className={`easter-team-card easter-team-card--${person.tone}`}
                key={`${person.key}-${index}`}
              >
                <div className="easter-avatar">
                  <img src={person.image} alt="" />
                </div>
                <p className="easter-team-card__name">{easter(`people.${person.key}.name`)}</p>
                <p className="easter-team-card__role">{easter(`people.${person.key}.role`)}</p>
                <span className="easter-team-card__index">
                  0{(index % teamPeople.length) + 1}
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="easter-closing" aria-label={easter("closingAria")}>
        <span className="easter-closing__flower" aria-hidden="true">
          ✿
        </span>
        <p>{easter("closing")}</p>
        <span className="easter-closing__flower" aria-hidden="true">
          ✿
        </span>
      </section>
    </main>
  );
};

export default AboutTwoBars;
