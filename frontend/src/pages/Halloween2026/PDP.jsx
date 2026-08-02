"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
// eslint-disable-next-line no-unused-vars -- namespace icons are rendered as JSX member components.
import * as PdpIcons from "lucide-react";
import pdpAvatar from "../../assets/pdp_avatar_to.jpg";
import pdpHeroImage from "../../assets/pdp_thubnail.jpg";
import "./PDP.scss";

const pdpData = {
  title: "PDP - Chương trình Phát triển Cá nhân FPTU Hà Nội",
  description:
    "Chương trình Phát triển Cá nhân (PDP - Personal Development Program) kiến tạo môi trường trải nghiệm năng động cho sinh viên Trường Đại học FPT Hà Nội.",
  audience: "Cao đẳng & Đại học",
  followers: "35K người theo dõi",
  following: "88 đang theo dõi",
  location: "Trường Đại học FPT Hà Nội",
  pillars: "Câu lạc bộ · Sự kiện · Khóa học",
  support:
    "PDP là đơn vị bảo trợ cho sự kiện FPTU Halloween, đồng hành cùng các câu lạc bộ và sinh viên trong những hoạt động trải nghiệm, kết nối và phát triển toàn diện.",
};

const tabItems = [
  { id: "about", label: "Tổng quan" },
  { id: "pillars", label: "3 trụ cột" },
  { id: "halloween", label: "FPTU Halloween" },
  { id: "impact", label: "Dấu ấn" },
];

const infoItems = [
  { icon: "UserRound", label: "Đơn vị", value: "PDP FPTU Hà Nội" },
  {
    icon: "Share2",
    label: "Vai trò",
    value: "Bảo trợ sự kiện FPTU Halloween",
  },
  { icon: "Mail", label: "3 trụ cột", value: pdpData.pillars },
  {
    icon: "Phone",
    label: "Đối tượng",
    value: "Sinh viên FPTU Hà Nội",
  },
  { icon: "MapPin", label: "Địa điểm", value: pdpData.location },
];

const renderIcon = (name, props = {}) => {
  const Icon = PdpIcons[name];
  return <Icon {...props} aria-hidden="true" />;
};

export default function PDP() {
  const [activeTab, setActiveTab] = useState("about");
  const { t } = useTranslation();
  const page = (key) => t(`nav.${key}`);

  return (
    <main className="fptu-club-page">
      <section
        className="fptu-club-hero"
        style={{ backgroundImage: `url(${pdpHeroImage})` }}
      >
        <div className="fptu-club-hero-overlay" />
        <div className="fptu-club-hero-content">
          <p className="fptu-club-eyebrow">
            PROGRAM PROFILE · PDP FPTU HÀ NỘI · PERSONAL DEVELOPMENT
          </p>
          <h1>
            PDP
            <br />
            <span>FPTU HÀ NỘI</span>
          </h1>
          <p className="fptu-club-hero-lede">{pdpData.description}</p>
          <a className="fptu-club-scroll-link" href="#pdp-profile">
            {t("nav.introduceGeneral")} PDP {renderIcon("ArrowDown", { size: 16 })}
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
              <img src={pdpAvatar} alt="Logo PDP FPTU Hà Nội" loading="lazy" />
              <span aria-hidden="true">PDP</span>
            </div>
            <div className="fptu-club-brand-copy">
              <p className="fptu-club-brand-kicker">FPTU · HÀ NỘI</p>
              <h2 id="pdp-profile-title">{pdpData.title}</h2>
              <p>
                {renderIcon("MapPin", { size: 15 })} {pdpData.location}
              </p>
            </div>
          </header>

          <div className="fptu-club-content-layout">
            <article className="fptu-club-story">
              <div
                className="fptu-club-tabs"
                role="tablist"
                aria-label="Nội dung về chương trình PDP"
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
                    {tab.label}
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
                    <p className="fptu-club-lede">{pdpData.description}</p>
                    <p>{pdpData.support}</p>
                    <div
                      className="fptu-club-stat-row"
                      aria-label="Thông tin chương trình PDP"
                    >
                      <div>
                        <strong>3</strong>
                        <span>trụ cột phát triển</span>
                      </div>
                      <div>
                        <strong>35K</strong>
                        <span>người theo dõi</span>
                      </div>
                      <div>
                        <strong>88</strong>
                        <span>đang theo dõi</span>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === "pillars" && (
                  <>
                    <h3>Ba trụ cột phát triển</h3>
                    <p className="fptu-club-lede">
                      PDP kết nối sinh viên với những trải nghiệm thực tế thông qua
                      câu lạc bộ, sự kiện và khóa học.
                    </p>
                    <div className="fptu-club-stat-row">
                      <div>
                        <strong>01</strong>
                        <span>Câu lạc bộ</span>
                      </div>
                      <div>
                        <strong>02</strong>
                        <span>Sự kiện</span>
                      </div>
                      <div>
                        <strong>03</strong>
                        <span>Khóa học</span>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === "halloween" && (
                  <div className="fptu-club-empty-state">
                    <span>01</span>
                    <h3>PDP bảo trợ FPTU Halloween</h3>
                    <p>{pdpData.support}</p>
                  </div>
                )}

                {activeTab === "impact" && (
                  <>
                    <h3>Môi trường phát triển toàn diện</h3>
                    <p className="fptu-club-lede">
                      Từ những hoạt động học tập đến trải nghiệm cộng đồng, PDP
                      giúp sinh viên chủ động khám phá năng lực và xây dựng kết nối
                      tại FPTU Hà Nội.
                    </p>
                    <p>
                      Chương trình hướng đến một hành trình phát triển cân bằng:
                      học hỏi, trải nghiệm, kết nối và tạo ra giá trị cho cộng đồng
                      sinh viên.
                    </p>
                  </>
                )}
              </div>
            </article>

            <aside
              className="fptu-club-contact"
              aria-labelledby="pdp-info-title"
            >
              <div className="fptu-club-contact-mark">
                {renderIcon("UserRound", { size: 17 })} PDP · FPTU HÀ NỘI
              </div>
              <h3 id="pdp-info-title">Thông tin chương trình</h3>
              <dl>
                {infoItems.map((item) => (
                  <div className="fptu-club-contact-item" key={item.label}>
                    {renderIcon(item.icon, { size: 17 })}
                    <div>
                      <dt>{item.label}</dt>
                      <dd>{item.value}</dd>
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
