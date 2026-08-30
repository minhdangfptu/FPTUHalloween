import React from "react";
import { ArrowLeft, ArrowUpRight, Users } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import coverArt from "../../assets/cover-01.png";
import { coreTeam, departments } from "./BTCFUHLW";
import "./DepartmentDetail.scss";

const DepartmentDetail = () => {
  const { i18n, t } = useTranslation();
  const { departmentId } = useParams();
  const btc = t("normal.btc", { returnObjects: true });
  const memberLabel = i18n.language.startsWith("en") ? "Member" : i18n.language.startsWith("ja") ? "メンバー" : "Thành viên";
  const pendingLabel = i18n.language.startsWith("en") ? "To be updated" : i18n.language.startsWith("ja") ? "更新予定" : "Đang cập nhật";
  const departmentLabel = i18n.language.startsWith("en") ? "Department" : i18n.language.startsWith("ja") ? "部署" : "Ban";
  const departmentIndex = Math.max(0, Number(departmentId) - 1);
  const departmentName = departments[departmentIndex] || departments[0];
  const translatedDepartmentIndexes = [0, 1, 2, 4, 5, 6, 7, 8];
  const translatedName = departmentName === "Media - Design"
    ? `${btc.departments[2]} - ${btc.departments[3]}`
    : btc.departments[translatedDepartmentIndexes[departmentIndex]] || departmentName;
  const members = coreTeam.filter((person) =>
    departmentName === "Media - Design"
      ? person.role.includes("Media") || person.role.includes("Design")
      : person.role.includes(departmentName),
  );
  const leader = members.find((person) =>
    person.role.includes("TrÆ°á»Ÿng ban"),
  );
  const deputy = members.find((person) => person.role.includes("PhĂ³ ban"));
  const basePlaceholders = Array.from({ length: 5 }, (_, index) => ({
    name: `Thành viên ${String(index + 1).padStart(2, "0")}`,
    role: "Đang cập nhật",
  }));
  const placeholders = basePlaceholders.map((person, index) => ({
    ...person,
    name: `${memberLabel} ${String(index + 1).padStart(2, "0")}`,
    role: pendingLabel,
  }));
  const leaderMembers = departmentName === "Media - Design" ? members.slice(0, 2) : members.slice(0, 1);
  const deputyMembers = departmentName === "Media - Design" ? members.slice(2) : members.slice(1);
  const managementMembers = [...leaderMembers, ...deputyMembers];

  const getRole = (person) =>
    person.role.includes("Trưởng ban") ? btc.hierarchy.lead : btc.roles.designDeputy.replace("Design", "Media - Design");
  const getImage = (person) => person?.image || coverArt;
  const getDisplayRole = (person) => {
    const role = person.role;
    const isLeader = role.includes("Tr\u01b0\u1edfng ban");
    if (departmentName === "Media - Design") {
      if (role.includes("Design")) return isLeader ? btc.roles.designLead : btc.roles.designDeputy;
      return isLeader ? btc.roles.mediaTeamLead : btc.roles.designDeputy;
    }
    if (departmentName === "Hậu Cần") return isLeader ? btc.roles.logisticsLead : btc.roles.logisticsDeputy;
    if (departmentName === "Nội Dung") return isLeader ? btc.roles.contentLead : btc.roles.contentDeputy;
    if (departmentName === "Nhà Ma") return isLeader ? btc.roles.hauntedLead : btc.roles.hauntedDeputy;
    if (departmentName === "Truyền Thông") return isLeader ? btc.roles.mediaLead : btc.roles.mediaDeputy;
    if (departmentName === "Take Care") return isLeader ? btc.roles.careLead : btc.roles.careDeputy;
    return person.displayRole || role;
  };

  return (
    <main className="department-page">
      <section className="department-hero">
        <Link className="department-back" to="/btc-fuhlw">
          <ArrowLeft size={16} /> {btc.boardTitle}
        </Link>
        <div className="department-hero__content">
          <p>{btc.organization}</p>
          <h1>{translatedName}</h1>
          <span>{btc.departmentTeam}</span>
        </div>
      </section>

      <section className="department-content">
        <div className="department-heading">
          <div className="department-heading__icon">
            <Users size={22} />
          </div>
          <div>
            <span>{departmentLabel}</span>
            <h2>{translatedName}</h2>
          </div>
        </div>

        <div className="department-section-heading">
          <span>01</span>
          <h2>{btc.hierarchy.lead} &amp; {btc.hierarchy.sublead.split(" /")[0]}</h2>
        </div>
        <div className="department-leaders" style={{ "--department-columns": Math.min(managementMembers.length, 4) || 1 }}>
          {managementMembers.map((person, index) => (
            <article
              className="department-person department-person--leader"
              key={person.name}
            >
              <div className="department-person__media">
                <img
                  src={getImage(person)}
                  alt={t("normal.btc.avatarAlt", { name: person.name })}
                />
                <span>0{index + 1}</span>
              </div>
              <div className="department-person__body">
                <small>{btc.departmentTeam}</small>
                <h3>{person.name}</h3>
                <p>{getDisplayRole(person)}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="department-section-heading department-section-heading--deputy">
          <span>02</span>
          <h2>{btc.roles.designDeputy.replace("Design", "Media - Design")}</h2>
        </div>
        <div className="department-leaders department-deputies" style={{ "--department-columns": Math.min(deputyMembers.length, 4) || 1 }}>
          {deputyMembers.map((person, index) => (
            <article className="department-person department-person--leader" key={person.name}>
              <div className="department-person__media"><img src={getImage(person)} alt={t("normal.btc.avatarAlt", { name: person.name })} /><span>{String(index + 1).padStart(2, "0")}</span></div>
              <div className="department-person__body"><small>{btc.roles.designDeputy.replace("Design", "Media - Design")}</small><h3>{person.name}</h3><p>{getDisplayRole(person)}</p></div>
            </article>
          ))}
        </div>

        <div className="department-members">
          <div className="department-members__heading">
            <span>02</span>
            <h2>{memberLabel}</h2>
          </div>
          <div className="department-members__grid" style={{ "--department-columns": 5 }}>
            {placeholders.map((person, index) => (
              <article className="department-person" key={person.name}>
                <div className="department-person__media">
                  <img
                    src={getImage(person)}
                    alt={t("normal.btc.avatarAlt", { name: person.name })}
                  />
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </div>
                <div className="department-person__body">
                  <small>{btc.departmentTeam}</small>
                  <h3>{person.name}</h3>
                  <p>{person.role}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="department-closing">
        <p>{btc.closingText}</p>
        <Link to="/btc-fuhlw">
          {btc.boardTitle} <ArrowUpRight size={17} />
        </Link>
      </section>
    </main>
  );
};

export default DepartmentDetail;
