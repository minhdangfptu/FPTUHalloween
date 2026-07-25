import React from "react";
import { ArrowDown, CalendarDays, Ghost } from "lucide-react";
import cover from "../../assets/cover-01.png";
import event2020 from "../../assets/hlw/2020.jpg";
import event2022 from "../../assets/hlw/2022.jpg";
import event2023 from "../../assets/hlw/2023.jpg";
import event2024 from "../../assets/hlw/2024.jpg";
import event2025 from "../../assets/hlw/2025.jpg";
import "./IntroduceHLW26.scss";

const sections = [
  {
    label: "01",
    title: "Halloween FPTU là gì?",
    text: "Halloween FPTU là lễ hội thường niên của sinh viên FPTU — nơi tinh thần sáng tạo, sự kết nối và không khí kỳ bí gặp nhau trong một đêm hội đáng nhớ.",
  },
  {
    label: "02",
    title: "Sứ mệnh",
    text: "Tạo ra một không gian để sinh viên được trải nghiệm, thể hiện cá tính và cùng nhau xây dựng những kỷ niệm đặc biệt trong đời sống đại học.",
  },
  {
    label: "03",
    title: "Giá trị",
    text: "Sáng tạo · Gắn kết · Dũng cảm · Tôn trọng. Mỗi hoạt động đều được thiết kế để khuyến khích tinh thần tham gia và tôn trọng trải nghiệm của cộng đồng.",
  },
  {
    label: "04",
    title: "Quy mô",
    text: "Thông tin quy mô chương trình Halloween FPTU 2026 sẽ được Ban tổ chức cập nhật trong thời gian tới.",
  },
];

const seasons = [
  {
    year: "2026",
    title: "FPTU Halloween 2026",
    concept: "Đang cập nhật",
    image: null,
    scale: "Đang cập nhật",
    detail: "/introduce-hlw26",
  },
  {
    year: "2025",
    title: "FPTU Halloween 2025",
    concept: "Wishbound",
    image: event2025,
    scale: "Đang cập nhật",
    detail: "/old-event#halloween-2025",
  },
  {
    year: "2024",
    title: "FPTU Halloween 2024",
    concept: "U Linh Ký",
    image: event2024,
    scale: "Đang cập nhật",
    detail: "/old-event#halloween-2024",
  },
  {
    year: "2023",
    title: "FPTU Halloween 2023",
    concept: "Haunted Fest",
    image: event2023,
    scale: "Đang cập nhật",
    detail: "/old-event#halloween-2023",
  },
  {
    year: "2022",
    title: "FPTU Halloween 2022",
    concept: "Fear Corner",
    image: event2022,
    scale: "Đang cập nhật",
    detail: "/old-event#halloween-2022",
  },
  {
    year: "2020",
    title: "FPTU Halloween 2020",
    concept: "The Haunted Forest",
    image: event2020,
    scale: "Đang cập nhật",
    detail: "/old-event#halloween-2020",
  },
];

const handleSectionScroll = (event) => {
  event.preventDefault();

  const targetId = event.currentTarget.getAttribute("href");
  const target = targetId ? document.querySelector(targetId) : null;

  target?.scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth",
    block: "start",
  });
};

export default function IntroduceHLW26() {
  return (
    <main className="introduce-hlw26">
      <section
        className="introduce-hlw26__hero"
        style={{ backgroundImage: `url(${cover})` }}
      >
        <div className="introduce-hlw26__hero-overlay" />
        <div className="introduce-hlw26__hero-content">
          <p className="introduce-hlw26__eyebrow">FPTU HALLOWEEN · 2026</p>
          <h1>
            Giới thiệu một
            <br />
            <span>đêm hội.</span>
          </h1>
          <p>Nơi hòa quyện niềm vui và nỗi sợ</p>
          <a
            href="#overview"
            className="introduce-hlw26__scroll"
            onClick={handleSectionScroll}
          >
            Khám phá <ArrowDown size={16} />
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
          <Ghost size={18} /> Tổng quan
        </div>
        <div>
          <h2 id="overview-title">
            Một sự kiện
            <br />
            <span>bùng nổ nhất nhì xứ FU.</span>
          </h2>
          <p>
            Lễ hội Halloween tại Đại học FPT là sự kiện thường niên bùng nổ –
            một đặc sản văn hóa sinh viên không thể bỏ qua. Được tổ chức bởi
            FPTU Board Game Club, sự kiện được nhuộm màu ma mị với chủ đề độc
            đáo mỗi năm, trở thành sân khấu cho những màn hóa trang đỉnh cao và
            sáng tạo có 1 không 2 của các Cóc. Với những hoạt động như Nhà ma
            rùng rợn, sự kiện sôi động, hay các cuộc thi gay cấn, Halloween FPT
            luôn mang đến một đêm hội kỳ bí, chất lừ và đáng nhớ, củng cố tinh
            thần năng động và gắn kết của cộng đồng sinh viên FPT.F
          </p>
        </div>
      </section>

      <section
        className="introduce-hlw26__facts"
        aria-label="Thông tin Halloween FPTU"
      >
        {sections.map((section) => (
          <article className="introduce-hlw26__fact" key={section.label}>
            <span>{section.label}</span>
            <h3>{section.title}</h3>
            <p>{section.text}</p>
          </article>
        ))}
      </section>

      <section
        className="introduce-hlw26__seasons"
        aria-labelledby="seasons-title"
      >
        <div className="introduce-hlw26__seasons-head">
          <div className="introduce-hlw26__section-mark">
            <CalendarDays size={18} /> Dấu mốc
          </div>
          <h2 id="seasons-title">Các mùa Halloween</h2>
          <p>
            Những mùa lễ hội đã tạo nên ký ức và bản sắc của Halloween FPTU.
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
                  <img src={season.image} alt={`${season.title} thumbnail`} />
                ) : (
                  <span className="introduce-hlw26__coming-soon">
                    Coming soon
                  </span>
                )}
              </div>
              <div>
                <span>{season.year}</span>
                <strong>{season.title}</strong>
                <small>Concept · {season.concept}</small>
                <small>Quy mô · {season.scale}</small>
              </div>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
