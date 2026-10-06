/* Hallmark · macrostructure: organization board · genre: editorial event operations · motion: cut */
import React from "react";
import { ArrowUpRight, Mail, ShieldCheck, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import coverArt from "../../assets/cover-01.png";
import groupPhoto from "../../assets/cover.jpg";
import "./BTCFUHLW.scss";

export const coreTeam = [
  {
    name: "Nguyễn Thảo Vy",
    role: "Trưởng ban Tổ chức · Trưởng ban Đối Ngoại",
    email: "ntvy04@gmail.com",
  },
  { name: "Nguyễn Thị Phương Thảo", role: "HR", email: "npt2056@gmail.com" },
  {
    name: "Trần Quang Anh",
    role: "Trưởng ban Nhà Ma",
    email: "qanhthanhcong05@gmail.com",
  },
  {
    name: "Nguyễn Hà Phương",
    role: "Phó ban Nhà Ma",
    email: "nguyenhaphuong3009@gmail.com",
  },
  {
    name: "Trương Bá Hoàng",
    role: "Phó ban Nhà Ma",
    email: "hoangtb020304@gmail.com",
  },
  {
    name: "Võ Xuân Quỳnh",
    role: "Phó ban Nhà Ma",
    email: "xquynhhh3010@gmail.com",
  },
  {
    name: "Lê Thị Thuỳ",
    role: "Trưởng ban Truyền Thông",
    email: "lethithuy15072005@gmail.com",
  },
  {
    name: "Phùng Thị Thanh Thủy",
    role: "Phó ban Truyền Thông",
    email: "phungthithanhthuy30102007@gmail.com",
  },
  {
    name: "Nguyễn Hương Ly",
    role: "Trưởng ban Nội Dung · Trưởng ban Văn thể",
    email: "huongly30102006@gmail.com",
  },
  {
    name: "Nguyễn Tạ Đăng Duy",
    role: "Phó ban Nội Dung",
    email: "nguyentadangduy24122006@gmail.com",
  },
  {
    name: "Nguyễn Việt Trung",
    role: "Trưởng ban Hậu Cần",
    email: "ngviettrung0803@gmail.com",
  },
  {
    name: "Nguyễn Huy Phước",
    role: "Phó ban Hậu Cần",
    email: "huyphuoc204@gmail.com",
  },
  {
    name: "Nguyễn Linh Nga",
    role: "Phó ban Hậu Cần",
    email: "nguyenlinhnga2005@gmail.com",
  },
  {
    name: "Bùi Mai Chi",
    role: "Trưởng ban Take Care",
    email: "chi141005@gmail.com",
  },
  {
    name: "Trịnh Thị Hiền",
    role: "Phó ban Take Care",
    email: "trinhhien0702@gmail.com",
  },
  {
    name: "Đặng Đình Minh",
    role: "Trưởng ban Media",
    email: "minhdangdinh261004@gmail.com",
  },
  {
    name: "Hoàng Khánh Chi",
    role: "Trưởng ban Design",
    email: "khankhichibd2005@gmail.com",
  },
  {
    name: "Khuất Kim Bảo",
    role: "Phó ban Media - Design",
    email: "kimbao20040@gmail.com",
  },
  {
    name: "Nguyễn Thế Dương",
    role: "Phó ban Media - Design",
    email: "nguyentheduong3110@gmail.com",
  },
];

export const departments = [
  "HR",
  "Đối Ngoại",
  "Media - Design",
  "Nội Dung",
  "Hậu Cần",
  "Take Care",
  "Nhà Ma",
  "Truyền Thông",
  "Văn thể",
];

const hierarchyLevels = [
  {
    key: "chair",
    match: (person) => person.role.includes("Trưởng ban Tổ chức"),
  },
  {
    key: "hr",
    match: (person) => person.role === "HR",
  },
  {
    key: "lead",
    match: (person) =>
      person.role.includes("Trưởng ban") && !person.role.includes("Phó ban"),
  },
  {
    key: "sublead",
    match: (person) => person.role.includes("Phó ban"),
  },
];

const PersonCard = ({ person, index, level, labels }) => (
  <article className={`btc-person-card btc-person-card--${level}`}>
    <div className="btc-person-card__media">
      <img
        src={coverArt}
        alt={person.avatarAlt}
        onError={(event) => {
          event.currentTarget.onerror = null;
          event.currentTarget.src = coverArt;
        }}
      />
      <span>{String(index + 1).padStart(2, "0")}</span>
    </div>
    <div className="btc-person-card__body">
      <div className="btc-person-card__eyebrow">
        <span>{labels.cardKicker}</span>
        <span>{labels.cardSeason}</span>
      </div>
      <h3>{person.name}</h3>
      <p className="btc-person-card__role">{person.displayRole}</p>
      <a
        className={person.email.includes("@") ? "" : "is-pending"}
        href={person.email.includes("@") ? `mailto:${person.email}` : undefined}
      >
        <Mail size={14} aria-hidden="true" />
        <span>{person.displayEmail}</span>
      </a>
    </div>
    <div className="btc-person-card__footer">
      <span>{labels.brand}</span>
      <ArrowUpRight size={16} aria-hidden="true" />
    </div>
  </article>
);

export default function BTCFUHLW() {
  const { t } = useTranslation();
  const btc = t("normal.btc", { returnObjects: true });
  const roleLabel = (role) => {
    if (role.includes("Nội Dung") && role.includes("Văn thể"))
      return `${btc.roles.contentLead} · ${btc.roles.cultureLead}`;
    if (role.includes("Media - Design"))
      return btc.roles.designDeputy.replace("Design", "Media - Design");
    const roleKey = role.includes("Trưởng ban Tổ chức")
      ? "chair"
      : role === "HR"
        ? "hr"
        : role.includes("Nhà Ma")
          ? role.includes("Trưởng")
            ? "hauntedLead"
            : "hauntedDeputy"
          : role.includes("Truyền Thông")
            ? role.includes("Trưởng")
              ? "mediaLead"
              : "mediaDeputy"
            : role.includes("Nội Dung")
              ? role.includes("Trưởng")
                ? "contentLead"
                : "contentDeputy"
              : role.includes("Hậu Cần")
                ? role.includes("Trưởng")
                  ? "logisticsLead"
                  : "logisticsDeputy"
                : role.includes("Take Care")
                  ? role.includes("Trưởng")
                    ? "careLead"
                    : "careDeputy"
                  : role.includes("Media")
                    ? "mediaTeamLead"
                    : role.includes("Design")
                      ? role.includes("Trưởng")
                        ? "designLead"
                        : "designDeputy"
                      : null;
    return roleKey ? btc.roles[roleKey] : role;
  };
  const displayTeam = coreTeam.map((person) => ({
    ...person,
    displayRole: roleLabel(person.role),
    displayEmail: person.email.includes("@") ? person.email : btc.pendingEmail,
    avatarAlt: t("normal.btc.avatarAlt", { name: person.name }),
  }));
  const translatedDepartments = [
    btc.departments[1],
    btc.departments[0],
    `${btc.departments[2]} - ${btc.departments[3]}`,
    ...btc.departments.slice(4),
  ];
  const translatedHierarchy = {
    chair: btc.hierarchy.chair,
    hr: btc.hierarchy.hr,
    lead: btc.hierarchy.lead,
    sublead: btc.hierarchy.sublead,
  };
  return (
    <main className="btc-page">
      <section className="btc-hero">
        <div className="btc-hero__eyebrow">
          <span /> {btc.heroLabel}
        </div>
        <div className="btc-hero__content">
          <div>
            <p className="btc-kicker">{btc.kicker}</p>
            <h1>
              {btc.titleBefore}
              <br />
              <em>{btc.titleAfter}</em> {btc.titleEnd}
            </h1>
          </div>
          <p className="btc-hero__intro">{btc.intro}</p>
        </div>
        <div className="btc-hero__meta">
          <span>01 / {btc.about}</span>
          <span>{btc.coreTeam}</span>
          <span>{btc.location}</span>
        </div>
      </section>

      <section className="btc-intro" aria-labelledby="btc-intro-title">
        <div className="btc-section-label">
          <span>01</span>
          <span>{btc.introLabel}</span>
        </div>
        <div className="btc-intro__grid">
          <h2 id="btc-intro-title">
            {btc.introTitle}
            <br />
            {btc.introTitleAfter}
          </h2>
          <div>
            <p>{btc.introText}</p>
            <p className="btc-muted">{btc.introMuted}</p>
          </div>
        </div>
      </section>

      <section
        className="btc-group-photo"
        aria-labelledby="btc-group-photo-title"
      >
        <div className="btc-group-photo__heading">
          <div className="btc-section-label">
            <span>{btc.groupPhoto}</span>
          </div>
          <h2 id="btc-group-photo-title">
            {btc.groupTitle}
            <br />
            <em>{btc.groupTitleAfter}</em>
          </h2>
        </div>
        <figure>
          <img src={groupPhoto} alt={btc.groupAlt} />
          <figcaption>{btc.groupCaption}</figcaption>
        </figure>
      </section>

      <section className="btc-org" aria-labelledby="btc-org-title">
        <div className="btc-section-heading">
          <div className="btc-section-label">
            <span>02</span>
            <span>{btc.organization}</span>
          </div>
          <h2 id="btc-org-title">
            {btc.organizationTitle}
            <br />
            <em>{btc.organizationTitleAfter}</em>
          </h2>
          <p>{btc.organizationIntro}</p>
        </div>

        <div className="btc-org__board">
          <div className="btc-board-heading">
            <div className="btc-board-heading__icon">
              <ShieldCheck size={22} />
            </div>
            <div>
              <span>{btc.coreTeamLabel}</span>
              <h3>{btc.boardTitle}</h3>
            </div>
            <Users size={22} className="btc-board-heading__mark" />
          </div>
          <div className="btc-hierarchy">
            <div className="btc-executive-row">
              {hierarchyLevels.slice(0, 2).map((level) => {
                const people = displayTeam.filter(level.match);

                return (
                  <section
                    className={`btc-level btc-level--${level.key}`}
                    key={level.key}
                  >
                    <div className="btc-level__heading">
                      <span>{btc.hierarchyNotes[level.key]}</span>
                      <h3>{translatedHierarchy[level.key]}</h3>
                    </div>
                    <div
                      className={`btc-person-grid btc-person-grid--${level.key}`}
                    >
                      {people.map((person) => (
                        <PersonCard
                          key={`${person.name}-${person.role}`}
                          person={person}
                          index={displayTeam.indexOf(person)}
                          level={level.key}
                          labels={btc}
                        />
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
            {hierarchyLevels.slice(2).map((level) => {
              const people = displayTeam.filter(level.match);

              return (
                <section
                  className={`btc-level btc-level--${level.key}`}
                  key={level.key}
                >
                  <div className="btc-level__heading">
                    <span>{btc.hierarchyNotes[level.key]}</span>
                    <h3>{translatedHierarchy[level.key]}</h3>
                  </div>
                  <div
                    className={`btc-person-grid btc-person-grid--${level.key}`}
                  >
                    {people.map((person) => (
                      <PersonCard
                        key={`${person.name}-${person.role}`}
                        person={person}
                        index={displayTeam.indexOf(person)}
                        level={level.key}
                        labels={btc}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>

        <div className="btc-departments" aria-label={btc.departmentsLabel}>
          {departments.map((department, index) => (
            <Link
              className="btc-department"
              key={department}
              to={`/btc-fuhlw/department/${index + 1}`}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{translatedDepartments[index]}</strong>
              <small>{btc.departmentTeam}</small>
            </Link>
          ))}
        </div>
      </section>

      <section className="btc-closing">
        <div>
          <span className="btc-section-label">
            <span>03</span>
            <span>{btc.greeting}</span>
          </span>
          <h2>
            {btc.closingTitle}
            <br />
            <em>{btc.closingTitleAfter}</em>
          </h2>
        </div>
        <div className="btc-closing__aside">
          <p>{btc.closingText}</p>
          <Link to="/contact-us">
            {btc.contact} <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>
    </main>
  );
}
