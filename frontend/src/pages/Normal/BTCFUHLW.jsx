/* Hallmark · macrostructure: organization board · genre: editorial event operations · motion: cut */
import React from "react";
import { ArrowUpRight, Mail, ShieldCheck, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import coverArt from "../../assets/cover-01.png";
import groupPhoto from "../../assets/cover.jpg";
import baoKk from "../../assets/core/baokk.jpg";
import chiBm from "../../assets/core/chibm.jpg";
import chiHk from "../../assets/core/chihk.jpg";
import duongNt from "../../assets/core/duongnt.jpg";
import haPhuong from "../../assets/core/haphuong.jpg";
import hien from "../../assets/core/hien.jpg";
import leThiThuy from "../../assets/core/lethithuy.jfif";
import minhDd from "../../assets/core/minhdd.jpg";
import thanhThuy from "../../assets/core/thanhthuy.jpg";
import vietTrung from "../../assets/core/viettrung.JPG";
import "./BTCFUHLW.scss";

const coreTeam = [
  {
    name: "Nguyễn Thảo Vy",
    role: "Trưởng ban Tổ chức · Trưởng ban Đối Ngoại",
    email: "ntvy04@gmail.com",
  },
  { name: "Nguyễn Thị Phương Thảo", role: "HR", email: "npt2056@gmail.com" },
  {
    name: "Trần Quang Anh",
    role: "Trưởng ban Nhà Ma",
    email: "Email đang cập nhật",
  },
  {
    name: "Nguyễn Hà Phương",
    role: "Phó ban Nhà Ma",
    email: "nguyenhaphuong3009@gmail.com",
    image: haPhuong,
  },
  {
    name: "Trương Bá Hoàng",
    role: "Phó ban Nhà Ma",
    email: "hoangtb020304@gmail.com",
  },
  { name: "Xuân Quỳnh", role: "Phó ban Nhà Ma", email: "Email đang cập nhật" },
  {
    name: "Lê Thị Thủy",
    role: "Trưởng ban Truyền Thông",
    email: "lethithuy15072005@gmail.com",
    image: leThiThuy,
  },
  {
    name: "Phùng Thị Thanh Thúy",
    role: "Phó ban Truyền Thông",
    email: "phungthithanhthuy30102007@gmail.com",
    image: thanhThuy,
  },
  {
    name: "Nguyễn Hương Ly",
    role: "Trưởng ban Nội Dung",
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
    image: vietTrung,
  },
  {
    name: "Nguyễn Huy Phước",
    role: "Phó ban Hậu Cần",
    email: "huyphuoc204@gmail.com",
  },
  {
    name: "Nga Nguyễn",
    role: "Phó ban Hậu Cần",
    email: "nguyenlinhnga2005@gmail.com",
  },
  {
    name: "Bùi Mai Chi",
    role: "Trưởng ban Take Care",
    email: "chi141005@gmail.com",
    image: chiBm,
  },
  {
    name: "Trịnh Hiền",
    role: "Phó ban Take Care",
    email: "trinhhien0702@gmail.com",
    image: hien,
  },
  {
    name: "Đặng Đình Minh",
    role: "Trưởng ban Media",
    email: "minhdangdinh261004@gmail.com",
    image: minhDd,
  },
  {
    name: "Hoàng Khánh Chi",
    role: "Trưởng ban Design",
    email: "khankhichibd2005@gmail.com",
    image: chiHk,
  },
  {
    name: "Khuất Kim Bảo",
    role: "Phó ban Design",
    email: "kimbao20040@gmail.com",
    image: baoKk,
  },
  {
    name: "Nguyễn Thế Dương",
    role: "Phó ban Design",
    email: "nguyentheduong3110@gmail.com",
    image: duongNt,
  },
];

const departments = [
  "Đối Ngoại",
  "HR",
  "Media",
  "Design",
  "Nội Dung",
  "Hậu Cần",
  "Take Care",
  "Nhà Ma",
  "Truyền Thông",
];

const hierarchyLevels = [
  {
    key: "chair",
    label: "Tổng phụ trách",
    note: "01 · Trưởng ban Tổ chức",
    match: (person) => person.role.includes("Trưởng ban Tổ chức"),
  },
  {
    key: "hr",
    label: "Điều phối nhân sự",
    note: "02 · HR",
    match: (person) => person.role === "HR",
  },
  {
    key: "lead",
    label: "Trưởng ban",
    note: "03 · LEAD",
    match: (person) =>
      person.role.includes("Trưởng ban") && !person.role.includes("Phó ban"),
  },
  {
    key: "sublead",
    label: "Phó ban / Phó ban",
    note: "04 · SUBLEAD",
    match: (person) => person.role.includes("Phó ban"),
  },
];

const PersonCard = ({ person, index, level }) => (
  <article className={`btc-person-card btc-person-card--${level}`}>
    <div className="btc-person-card__media">
      <img
        src={person.image || coverArt}
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
        <span>CORE TEAM</span>
        <span>HLW26</span>
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
      <span>FPTU HALLOWEEN</span>
      <ArrowUpRight size={16} aria-hidden="true" />
    </div>
  </article>
);

export default function BTCFUHLW() {
  const { t } = useTranslation();
  const btc = t("normal.btc", { returnObjects: true });
  const roleLabel = (role) => {
    const roleKey = role.includes("Trưởng ban Tổ chức") ? "chair" : role === "HR" ? "hr" : role.includes("Nhà Ma") ? (role.includes("Trưởng") ? "hauntedLead" : "hauntedDeputy") : role.includes("Truyền Thông") ? (role.includes("Trưởng") ? "mediaLead" : "mediaDeputy") : role.includes("Nội Dung") ? (role.includes("Trưởng") ? "contentLead" : "contentDeputy") : role.includes("Hậu Cần") ? (role.includes("Trưởng") ? "logisticsLead" : "logisticsDeputy") : role.includes("Take Care") ? (role.includes("Trưởng") ? "careLead" : "careDeputy") : role.includes("Media") ? "mediaTeamLead" : role.includes("Design") ? (role.includes("Trưởng") ? "designLead" : "designDeputy") : null;
    return roleKey ? btc.roles[roleKey] : role;
  };
  const displayTeam = coreTeam.map((person) => ({ ...person, displayRole: roleLabel(person.role), displayEmail: person.email.includes("@") ? person.email : btc.pendingEmail, avatarAlt: t("normal.btc.avatarAlt", { name: person.name }) }));
  const translatedDepartments = btc.departments;
  const translatedHierarchy = { chair: btc.hierarchy.chair, hr: btc.hierarchy.hr, lead: btc.hierarchy.lead, sublead: btc.hierarchy.sublead };
  return (
    <main className="btc-page">
      <section className="btc-hero">
        <div className="btc-hero__eyebrow">
          <span /> FPTU HALLOWEEN 2025 · CORE TEAM
        </div>
        <div className="btc-hero__content">
          <div>
            <p className="btc-kicker">{btc.kicker}</p>
            <h1>
              {btc.titleBefore}
              <br />
              <em>{btc.titleAfter}</em> sự kiện.
            </h1>
          </div>
          <p className="btc-hero__intro">
            {btc.intro}
          </p>
        </div>
        <div className="btc-hero__meta">
          <span>01 / {btc.about}</span>
          <span>Core Team HLW26</span>
          <span>FPT University · Hà Nội</span>
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
            <p>
              {btc.introText}
            </p>
            <p className="btc-muted">
              {btc.introMuted}
            </p>
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
          <p>
            {btc.organizationIntro}
          </p>
        </div>

        <div className="btc-org__board">
          <div className="btc-board-heading">
            <div className="btc-board-heading__icon">
              <ShieldCheck size={22} />
            </div>
            <div>
              <span>CORE TEAM</span>
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
                      <span>{level.note}</span>
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
                    <span>{level.note}</span>
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
            <div className="btc-department" key={department}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{translatedDepartments[index]}</strong>
              <small>Team HLW26</small>
            </div>
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
          <p>
            {btc.closingText}
          </p>
          <Link to="/contact-us">
            {btc.contact} <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>
    </main>
  );
}
