// src/pages/HomePage.jsx
import React from "react";
import "./HomePage.css";

import hero from "../../assets/cover-01.png";

const kpis = [
  { label: "Khách tham dự", value: "~ 8,000" },
  { label: "Gian hàng/Booth", value: "40+" },
  { label: "Nghệ sĩ/Show", value: "10+" },
  { label: "Tình nguyện viên", value: "300+" },
];

const highlights = [
  { title: "Nhà Ma – Wishbound", desc: "Trải nghiệm lời nguyền điều ước.", img: hero },
  { title: "Main Stage", desc: "Âm nhạc – DJ – Lightshow.", img: hero },
  { title: "Cosplay & Parade", desc: "Hóa thân & diễu hành chủ đề.", img: hero },
];

const values = [
  { title: "An toàn", desc: "Quy trình – y tế – PCCC đầy đủ." },
  { title: "Sáng tạo", desc: "Concept, décor, minigame độc đáo." },
  { title: "Trải nghiệm", desc: "Check-in, photobooth, thử thách." },
  { title: "Cộng đồng", desc: "Lan tỏa tinh thần thiện nguyện." },
  { title: "Công nghệ", desc: "Vé điện tử – checkin QR." },
];

const news = [
  { date: "10/10/2025", title: "Mở bán vé sớm – Early Bird", href: "#" },
  { date: "05/10/2025", title: "Công bố line-up nghệ sĩ", href: "#" },
  { date: "28/09/2025", title: "Cuộc thi cosplay Wishbound", href: "#" },
];

const agenda = [
  { day: "29/10", item: "Opening Fair & Booth" },
  { day: "30/10", item: "House of Wishbound (preview)" },
  { day: "31/10", item: "Grand Night & Live Show" },
];

export default function HalloweenLanding() {
  return (
    <div className="fptu-halloween-page">
      {/* HERO */}
      <section className="fptu-halloween-hero">
        <img src={hero} alt="" className="fptu-halloween-hero__bg" />
        <div className="fptu-halloween-hero__overlay" />
        <div className="fptu-halloween-hero__content">
          <h1>FPTU HALLOWEEN 2025 WISHBOUND</h1>
          <p>Nơi hòa quyện của niềm vui và nỗi sợ.</p>
          <div className="fptu-halloween-hero__cta">
            <a href="/ticket" className="fptu-halloween-btn fptu-halloween-btn--primary">Khám phá</a>
            <a href="/volunteer" className="fptu-halloween-btn fptu-halloween-btn--ghost">Mua vé ngay</a>
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="fptu-halloween-section">
        <h2>Điểm nhấn</h2>
        <div className="fptu-halloween-cards">
          {highlights.map((h) => (
            <article key={h.title} className="fptu-halloween-card">
              <img src={h.img} alt="" />
              <div className="fptu-halloween-card__body">
                <h3>{h.title}</h3>
                <p>{h.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* KPI */}
      <section className="fptu-halloween-section fptu-halloween-section--dark">
        <h2>Con số ấn tượng</h2>
        <div className="fptu-halloween-kpis">
          {kpis.map((k) => (
            <div key={k.label} className="fptu-halloween-kpi">
              <div className="fptu-halloween-kpi__value">{k.value}</div>
              <div className="fptu-halloween-kpi__label">{k.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="fptu-halloween-section">
        <h2>Giá trị trải nghiệm</h2>
        <div className="fptu-halloween-grid">
          {values.map((v) => (
            <div key={v.title} className="fptu-halloween-feature">
              <h3>{v.title}</h3>
              <p>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* NEWS */}
      <section className="fptu-halloween-section fptu-halloween-section--dark">
        <div className="fptu-halloween-section__head">
          <h2>Tin tức & cập nhật</h2>
          <a href="/news" className="fptu-halloween-link">Xem tất cả</a>
        </div>
        <div className="fptu-halloween-news">
          {news.map((n) => (
            <a key={n.title} className="fptu-halloween-news__item" href={n.href}>
              <time>{n.date}</time>
              <span>{n.title}</span>
            </a>
          ))}
        </div>
      </section>

      {/* UPCOMING */}
      <section className="fptu-halloween-section">
        <h2>Sự kiện sắp diễn ra</h2>
        <div className="fptu-halloween-agenda">
          {agenda.map((a) => (
            <div key={a.day} className="fptu-halloween-agenda__row">
              <span className="fptu-halloween-agenda__day">{a.day}</span>
              <span>{a.item}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
