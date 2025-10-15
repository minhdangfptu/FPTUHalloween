import React from "react";
import "./IntroduceEvent.css";

import cover from "../../assets/cover-01.png";
import avatar from "../../assets/wtm.png";
import avatarriel from "../../assets/avatar.jpg";

const page = {
  name: "FPTU Halloween",
  username: "@fptuhalloween",
  verified: true,
  category: "Event · College & University",
  likes: 18342,
  followers: 20105,
  rating: 4.9,
  about:
    "Lễ hội Halloween tại Đại học FPT là sự kiện thường niên bùng nổ – một đặc sản văn hóa sinh viên không thể bỏ qua.",
  website: "https://myfevent.fptu.vn/halloween-2025",
  email: "halloween@fptu.edu.vn",
  phone: "0901 234 567",
  location: "Khuôn viên Đại học FPT Hà Nội, Hòa Lạc",
  hours: "09:00 – 22:00",
};

const albums = [
  { id: 1, title: "FPTU Halloween 2025", thumb: 'https://scontent.fhan2-3.fna.fbcdn.net/v/t39.30808-6/557548210_783742787847613_9207811038853147592_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=cc71e4&_nc_eui2=AeFUV1lHfyPBqIYOuYAUu1rBmyXqMbmOts-bJeoxuY62z6ItcD8p3wVOS3mNaMqtLoD86ucHQHtCoW3Mc2oGRwTn&_nc_ohc=eKZ5xU-KvCQQ7kNvwGAMcKi&_nc_oc=AdnBYBnyu61rJnWVfc5vTTPwAVSCPI7Vithm7_1u12Vd3YdKn0HqC9EppzQFMLRyRz0&_nc_zt=23&_nc_ht=scontent.fhan2-3.fna&_nc_gid=6Z4wcYkKCCiRYipmbYbqpg&oh=00_Aff9sSwzXD4YOI3rQIwGUPc90Uc0GlYoJa2kbo-lVZlRuA&oe=68F3E60D', count: 'Wishbound' },
  { id: 2, title: "FPTU Halloween 2024", thumb: 'https://scontent.fhan2-3.fna.fbcdn.net/v/t39.30808-6/483800792_624546830433877_4457845983010099236_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=86c6b0&_nc_eui2=AeG2-KQ9lknJGqJ9ZWzMKPzle2oQLQ__Yft7ahAtD_9h--of5zYWQDSSPtl117aUcYqNtRnzEnP6RSsRFlhCzGZA&_nc_ohc=86VDQM0OA1cQ7kNvwHt_K67&_nc_oc=AdlXQQxNXpvdnI8YDpZ3ybYJbDr48-wScRO6_ewdfRvANajQsSGGSBOZ89MJhcRNSvA&_nc_zt=23&_nc_ht=scontent.fhan2-3.fna&_nc_gid=33zEXy1us3cClaQzBSRAbQ&oh=00_AffMHoaR-aZiYM2CEJTl0njv72VLfq6K3nF5er70hsgn5A&oe=68F3E304', count: 'U Linh Ký' },
  { id: 3, title: "FPTU Halloween 2023", thumb: 'https://scontent.fhan2-5.fna.fbcdn.net/v/t39.30808-6/387759817_290264400528790_6818600665982154478_n.png?stp=dst-jpg_tt6&_nc_cat=106&ccb=1-7&_nc_sid=86c6b0&_nc_eui2=AeHl4s3-dYQpK6J_dTl5u8d5mSBRNUmCwwyZIFE1SYLDDHHipMECBSBW7u9yZblFmDzc-ZS6Sza5J4_aZg87mZiS&_nc_ohc=sJ8XuzjKJp0Q7kNvwEZ1QWC&_nc_oc=AdmUDmGS8aEw9_L1tHyO9hRaxphbjAMMXNRSDg4pU-yfIC_SdqR57uX4GRFOeccd23k&_nc_zt=23&_nc_ht=scontent.fhan2-5.fna&_nc_gid=TdYmIQsP6sb2PFOEW93MLw&oh=00_AffGHDe7rB5A4-NHShIQcH4iUAOyyUmOp8TRpQ65wbmnXw&oe=68F3DD7F', count: 'Haunted Fest' },
  { id: 4, title: "FPTU Halloween 2022", thumb: 'https://scontent.fhan2-3.fna.fbcdn.net/v/t39.30808-6/312648132_121214774100421_8068566281214762802_n.png?stp=dst-jpg_tt6&_nc_cat=108&ccb=1-7&_nc_sid=86c6b0&_nc_eui2=AeFN9xRwnpMsT8IdhfZFyAQajI_fgtALO1yMj9-C0As7XJYuiCJ2YtMepMs3gM7n3MIrSeX7sc3f_GU1rlQizl3r&_nc_ohc=uRRMFB_ngx8Q7kNvwHtZy3D&_nc_oc=AdmJ6JDr3V9EyYppjFswhi_tcKShldhJHDsGcmt1X5OVGqMYPM1VZ7kZJwbVdEeOOSU&_nc_zt=23&_nc_ht=scontent.fhan2-3.fna&_nc_gid=zvp4OMH2ZzJHI7ltx5Vn5w&oh=00_Afdi2JEvB38JYIMiynKu3667QOxFvv73hU_9r2qz3y9CEw&oe=68F3FB65', count: 'Fear Corner' },
  { id: 5, title: "FPTU Halloween 2020", thumb: 'https://scontent.fhan2-4.fna.fbcdn.net/v/t1.6435-9/122703558_211287113687074_6599718321829311704_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeHYJanfAqo4i6Yct_8FLhUq6zOfo-_8h9DrM5-j7_yH0Jz30o2wGg7DLr2iQ5JO_CMG03IvIwh39FISRwEQT4x6&_nc_ohc=KLcf0dODldQQ7kNvwFC0zs2&_nc_oc=AdkuZcF-mJxc-J3MQ_WbTp6qxLZzmrQPzcFHP_4i6V4XQIC2t-HEYdkY_6ZoCQptF_g&_nc_zt=23&_nc_ht=scontent.fhan2-4.fna&_nc_gid=_HNWI0PVHzCoRzcJn0MQSQ&oh=00_AfcQHDg-xKIP_Onmei8EBEiJrW4LRuCSBueg5cnBUQBSPg&oe=6915927C', count: 'The Haunted Forest' },
];

export default function IntroduceEvent() {
  return (
    <div className="fp-page">
      {/* Cover */}
      <header className="fp-cover">
        <img src={cover} className="fp-cover__img" alt="" />
        <div className="fp-cover__overlay" />
        <div className="fp-cover__bar">
          <div className="fp-avatar">
            <img src={avatarriel} alt="avatar" />
          </div>
          <div className="fp-head">
            <h1 className="fp-title">
              {page.name}
              {page.verified && (
                <span className="fp-badge" aria-label="verified">
                  ✔
                </span>
              )}
            </h1>
            <div className="fp-sub">
              {page.username} · {page.category}
            </div>
            <div className="fp-stats">
              <span>{page.likes.toLocaleString()} likes</span>
              <span>·</span>
              <span>{page.followers.toLocaleString()} followers</span>
              <span>·</span>
              <span>⭐ {page.rating}</span>
            </div>
          </div>

          {/* <div className="fp-actions">
            <button className="btn btn--primary">Like</button>
            <button className="btn btn--ghost">Follow</button>
            <button className="btn btn--ghost">Share</button>
          </div> */}
        </div>
      </header>

      {/* Tabs (mock) */}
      {/* <nav className="fp-tabs" aria-label="page sections">
        <a href="#about" className="fp-tab fp-tab--active">About</a>
        <a href="#posts" className="fp-tab">Posts</a>
        <a href="#albums" className="fp-tab">Albums</a>
        <a href="#contact" className="fp-tab">Contact</a>
      </nav> */}

      {/* Content */}
      <main className="fp-content">
        {/* Left column */}
        <section className="fp-col fp-col--left">
          <article id="about" className="fp-card">
            <h3 className="fp-card__title">Về sự kiện</h3>
            <p className="fp-text">{page.about}</p>
            <p className="fp-text">Được tổ chức bởi <strong style={{color: 'red'}}>FPTU Board Game Club</strong>, sự kiện được nhuộm màu ma mị với chủ đề độc đáo mỗi năm, trở thành sân khấu cho những màn hóa trang đỉnh cao và sáng tạo có 1 không 2 của các Cóc. </p>
            <p className="fp-text">Với những hoạt động như Nhà ma rùng rợn, sự kiện sôi động, hay các cuộc thi gay cấn, Halloween FPT luôn mang đến một đêm hội kỳ bí, chất lừ và đáng nhớ, củng cố tinh thần năng động và gắn kết của cộng đồng sinh viên FPT.  </p>
            {/* <ul className="fp-meta">
              <li>
                <strong>Website:</strong>{" "}
                <a href={page.website}>{page.website}</a>
              </li>
              <li>
                <strong>Location:</strong> {page.location}
              </li>
              <li>
                <strong>Hours:</strong> {page.hours}
              </li>
            </ul> */}
          </article>

          {/* <article id="contact" className="fp-card">
            <h3 className="fp-card__title">Contact</h3>
            <ul className="fp-list">
              <li>📧 {page.email}</li>
              <li>📞 {page.phone}</li>
              <li>📍 {page.location}</li>
            </ul>
            <div className="fp-cta-row">
              <a className="btn btn--primary" href="mailto:halloween@fptu.edu.vn">Email</a>
              <a className="btn btn--ghost" href="tel:0901234567">Call</a>
              <a className="btn btn--ghost" href="https://maps.google.com" target="_blank" rel="noreferrer">Map</a>
            </div>
          </article> */}

          {/* <article className="fp-card">
            <h3 className="fp-card__title">Team & Organizers</h3>
            <ul className="fp-list">
              {team.map(m => <li key={m.name}><strong>{m.name}</strong> — {m.role}</li>)}
            </ul>
          </article> */}
        </section>

        {/* Right column */}
        <section className="fp-col fp-col--right">
          <article id="albums" className="fp-card">
            <div className="fp-card__title-row">
              <h3 className="fp-card__title">Các sự kiện gần nhất</h3>
              <a className="fp-link" href="/old-event">
                Xem tất cả
              </a>
            </div>
            <div className="fp-albums">
              {albums.map((a) => (
                <a key={a.id} href="#" className="fp-album">
                  <img src={a.thumb} alt="" />
                  <div className="fp-album__meta">
                    <div className="fp-album__title">{a.title}</div>
                    <div className="fp-album__count">{a.count}</div>
                  </div>
                </a>
              ))}
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
