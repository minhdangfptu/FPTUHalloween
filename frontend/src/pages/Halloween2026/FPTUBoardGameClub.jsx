"use client";

import { useState } from "react";
// eslint-disable-next-line no-unused-vars -- namespace icons are rendered as JSX member components.
import * as ClubIcons from "lucide-react";
import clubAvatar from "../../assets/ava_fbgc.jpg";
import heroImage from "../../assets/fbgc_thumbnail.jpg";
import achievementImageOne from "../../assets/ptxs.jpg";
import achievementImageTwo from "../../assets/ptxs2.jpg";
import weeklyImageOne from "../../assets/shht1.jpg";
import weeklyImageTwo from "../../assets/shht2.jpg";
import weeklyImageThree from "../../assets/shht3.jpg";
import "./FPTUBoardGameClub.scss";

const clubData = {
  clubName: "FPTU Board Game Club",
  logoUrl: clubAvatar,
  clubDescription:
    "FPTU Boardgame Club là nơi quy tụ những bạn trẻ yêu thích boardgame và tổ chức sự kiện. Sau 6 năm hoạt động, CLB đã ghi dấu ấn với nhiều sự kiện lớn nhỏ như FPTU Halloween (2020–2022–2023) hay BOARDGAME TOURNAMENT mùa 1–2. Với tinh thần sáng tạo và gắn kết, CLB đang trở thành điểm hẹn quen thuộc của sinh viên FPTU để cùng thư giãn và kết nối.",
  president: "Nguyễn Cảnh Hưng",
  email: "fuboardgameclub@gmail.com",
  facebook: "https://fb.me/fuboardgameclub",
  phone: "0944989980",
  location: "Sân Băng – Đại học FPT Hà Nội",
  memberCount: 200,
  establishedYear: 2019,
  weeklyImage:
    "https://scontent.fhan15-2.fna.fbcdn.net/v/t39.30808-6/558640148_1438506497878768_4673805905158913483_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeHSSkSqgc-3C4StpHL4AMOMgGs6KyTPQ-GAazorJM9D4Q6wGvhPybpRL4btSkk2XgcpnhKo1RsKatFSXWG67MrV&_nc_ohc=kdKU2FRC-rAQ7kNvwGvFnHt&_nc_oc=Admxpb4df4Wa8wegJplMf0m5Q9vpjhwD4cDxV1ubvSDyxSo3ZCssn9jofLGjLkjZc1c&_nc_zt=23&_nc_ht=scontent.fhan15-2.fna&_nc_gid=OQ97Qya-8ax4DgMjUl1P5A&oh=00_AfcyLVzlwhX8CL5aqT1yAE61iZmvslVQPPlVvQ5rbb6bRQ&oe=68F4E2D6",
  achievementImage:
    "https://scontent.fhan15-2.fna.fbcdn.net/v/t39.30808-6/491951064_1293132839082802_8405279153751387439_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeGWk9Le5C14GsWJ4RqaZS6VOmy0CqE0alo6bLQKoTRqWpcQFqBfhnrRIINIZbsCIESU3QbujZlSfYx_EVc0OaHS&_nc_ohc=zfNZU7kg7ugQ7kNvwGTvyy5&_nc_oc=AdlcJNpaKuxyj_tuDrS6KOEhaE3VyvGP-Vf6yyHhedaXqZGc6HUXqMUQlz5YERA44tU&_nc_zt=23&_nc_ht=scontent.fhan15-2.fna&_nc_gid=qBtiqmArHDJ4dBvA2Byqow&oh=00_AfesFM0J9LNdlr2f8ps2YRBgYjmXamUJPDZj6YahQa8XtQ&oe=68F4E543",
};

const tabItems = [
  { id: "about", label: "Giới thiệu" },
  { id: "weekly", label: "Sinh hoạt" },
  { id: "events", label: "Sự kiện" },
  { id: "achievements", label: "Thành tích" },
];

export default function FPTUBoardGameClub() {
  const [activeTab, setActiveTab] = useState("about");

  return (
    <main className="fptu-club-page">
      <section
        className="fptu-club-hero"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="fptu-club-hero-overlay" />
        <div className="fptu-club-hero-content">
          <p className="fptu-club-eyebrow">
            CLUB PROFILE · FPTU BOARD GAME CLUB · NEVER LET YOU ALONE
          </p>
          <h1>
            CÂU LẠC BỘ
            <br />
            <span>BOARD GAME</span>
          </h1>
          <p className="fptu-club-hero-lede">
            Một cộng đồng yêu boardgame, nơi mỗi ván chơi mở ra một cuộc gặp
            mới.
          </p>
          <a className="fptu-club-scroll-link" href="#club-profile">
            Đọc hồ sơ CLB <ClubIcons.ArrowDown size={16} aria-hidden="true" />
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
            <ClubIcons.Gamepad2 size={18} aria-hidden="true" /> Hồ sơ câu lạc bộ
          </div>

          <header className="fptu-club-brand">
            <div className="fptu-club-avatar">
              <img src={clubData.logoUrl} alt="" loading="lazy" />
              <span aria-hidden="true">F</span>
            </div>
            <div className="fptu-club-brand-copy">
              <p className="fptu-club-brand-kicker">FPTU · HÀ NỘI</p>
              <h2 id="club-profile-title">{clubData.clubName}</h2>
              <p>
                <ClubIcons.MapPin size={15} aria-hidden="true" />{" "}
                {clubData.location}
              </p>
            </div>
          </header>

          <div className="fptu-club-content-layout">
            <article className="fptu-club-story">
              <div
                className="fptu-club-tabs"
                role="tablist"
                aria-label="Nội dung về câu lạc bộ"
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
                    {tab.label}
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
                    <p className="fptu-club-lede">{clubData.clubDescription}</p>
                    <p>
                      Là CLB tổ chức sự kiện FPTU Halloween thường niên của
                      trường Đại học FPT Hà Nội, Board Game Club đưa tinh thần
                      sáng tạo và gắn kết vào từng hoạt động. Với năm 2025, sự
                      kiện được nhuộm màu “Wishbound” – những giấc mơ và ước mơ
                      đầy hứa hẹn.
                    </p>
                    <div
                      className="fptu-club-stat-row"
                      aria-label="Thông tin câu lạc bộ"
                    >
                      <div>
                        <strong>{clubData.memberCount}</strong>
                        <span>thành viên</span>
                      </div>
                      <div>
                        <strong>{clubData.establishedYear}</strong>
                        <span>năm thành lập</span>
                      </div>
                      <div>
                        <strong>2024</strong>
                        <span>CLB PHONG TRÀO XUẤT SẮC</span>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === "weekly" && (
                  <>
                    <h3>Sinh hoạt hàng tuần</h3>
                    <p className="fptu-club-lede">
                      Đại gia đình Bê Gờ mở cửa chào đón tất cả mọi người đến
                      sinh hoạt vào thứ 5 hàng tuần, từ 19h30 đến 21h30 tại Sân
                      Băng.
                    </p>
                    <figure className="fptu-club-image-frame">
                      <img
                        src={clubData.weeklyImage}
                        alt="Sinh hoạt hàng tuần của FPTU Board Game Club"
                        loading="lazy"
                      />
                      <figcaption>Thứ 5 · 19h30–21h30 · Sân Băng</figcaption>
                    </figure>
                    <div className="fptu-club-weekly-gallery">
                      <figure className="fptu-club-image-frame">
                        <img
                          src={weeklyImageOne}
                          alt="Sinh hoạt hàng tuần của FPTU Board Game Club"
                          loading="lazy"
                        />
                        <figcaption>Buổi sinh hoạt 01</figcaption>
                      </figure>
                      <figure className="fptu-club-image-frame">
                        <img
                          src={weeklyImageTwo}
                          alt="Thành viên FPTU Board Game Club sinh hoạt"
                          loading="lazy"
                        />
                        <figcaption>Buổi sinh hoạt 02</figcaption>
                      </figure>
                      <figure className="fptu-club-image-frame">
                        <img
                          src={weeklyImageThree}
                          alt="Hoạt động board game của câu lạc bộ"
                          loading="lazy"
                        />
                        <figcaption>Buổi sinh hoạt 03</figcaption>
                      </figure>
                    </div>
                  </>
                )}

                {activeTab === "events" && (
                  <div className="fptu-club-empty-state">
                    <h3>Sự kiện đang được cập nhật</h3>
                    <p>
                      Thông tin các sự kiện sắp tới của câu lạc bộ sẽ được công
                      bố tại đây.
                    </p>
                  </div>
                )}

                {activeTab === "achievements" && (
                  <>
                    <h3>Thành tích</h3>
                    <p className="fptu-club-lede">
                      Câu lạc bộ phong trào xuất sắc kì FA24.
                    </p>
                    <div className="fptu-club-achievement-gallery">
                      <figure className="fptu-club-image-frame">
                        <img
                          src={achievementImageOne}
                          alt="FPTU Board Game Club nhận bằng khen phong trào"
                          loading="lazy"
                        />
                        <figcaption>Thành tích phong trào</figcaption>
                      </figure>
                      <figure className="fptu-club-image-frame">
                        <img
                          src={achievementImageTwo}
                          alt="FPTU Board Game Club tại sự kiện"
                          loading="lazy"
                        />
                        <figcaption>Dấu ấn hoạt động của CLB</figcaption>
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
                <ClubIcons.UserRound size={17} aria-hidden="true" /> Người giữ
                nhịp
              </div>
              <h3 id="club-contact-title">Liên hệ CLB</h3>
              <dl>
                <div className="fptu-club-contact-item">
                  <ClubIcons.UserRound size={17} aria-hidden="true" />
                  <div>
                    <dt>Chủ nhiệm</dt>
                    <dd>{clubData.president}</dd>
                  </div>
                </div>
                <div className="fptu-club-contact-item">
                  <ClubIcons.Share2 size={17} aria-hidden="true" />
                  <div>
                    <dt>Facebook</dt>
                    <dd>
                      <a
                        href={clubData.facebook}
                        target="_blank"
                        rel="noreferrer"
                      >
                        fb.me/fuboardgameclub
                      </a>
                    </dd>
                  </div>
                </div>
                <div className="fptu-club-contact-item">
                  <ClubIcons.Mail size={17} aria-hidden="true" />
                  <div>
                    <dt>Email</dt>
                    <dd>
                      <a href={`mailto:${clubData.email}`}>{clubData.email}</a>
                    </dd>
                  </div>
                </div>
                <div className="fptu-club-contact-item">
                  <ClubIcons.Phone size={17} aria-hidden="true" />
                  <div>
                    <dt>Điện thoại</dt>
                    <dd>
                      <a href={`tel:${clubData.phone}`}>{clubData.phone}</a>
                    </dd>
                  </div>
                </div>
                <div className="fptu-club-contact-item">
                  <ClubIcons.MapPin size={17} aria-hidden="true" />
                  <div>
                    <dt>Địa điểm</dt>
                    <dd>{clubData.location}</dd>
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
