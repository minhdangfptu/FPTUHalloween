import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import heroImage from "../../assets/cover-01.png";
import pdpLogo from "../../assets/pdp_avatar.jpg";
import fptuLogo from "../../assets/logo fptu.webp";
import fbgcLogo from "../../assets/fbgc.png";
import wtmLogo from "../../assets/wtm.png";
import "./HomePage.scss";

const EVENT_DATE = new Date("2026-10-31T18:00:00+07:00").getTime();

const getCountdown = () => {
  const difference = Math.max(EVENT_DATE - Date.now(), 0);
  const totalSeconds = Math.floor(difference / 1000);

  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    complete: difference === 0,
  };
};

const highlights = [
  {
    number: "01",
    title: "Nhà ma",
    description:
      "Một tuyến trải nghiệm nhập vai, nơi mỗi cánh cửa mở ra một lớp chuyện mới.",
    tone: "dark",
  },
  {
    number: "02",
    title: "Game zone",
    description:
      "Game sân khấu, big game, minigame và những thử thách kéo mọi người vào cuộc.",
    tone: "red",
  },
  {
    number: "03",
    title: "Cosplay",
    description:
      "Hóa thân theo chủ đề năm và bước vào một đêm Halloween có dấu ấn riêng.",
    tone: "violet",
  },
  {
    number: "04",
    title: "Photobooth",
    description:
      "Một góc lưu lại outfit, hội bạn và những khoảnh khắc không lặp lại.",
    tone: "paper",
  },
  {
    number: "05",
    title: "Main stage",
    description:
      "Tiết mục, khách mời và nhịp sân khấu được xếp thành một đêm diễn liền mạch.",
    tone: "orange",
  },
  {
    number: "06",
    title: "Lucky draw",
    description:
      "Quà tặng và những bất ngờ nhỏ khép lại hành trình của bạn tại lễ hội.",
    tone: "ink",
  },
];

const timeline = [
  {
    time: "01",
    title: "Mở cổng",
    description: "Đón khách, check-in và nhận thông tin hành trình.",
  },
  {
    time: "02",
    title: "Khám phá",
    description: "Nhà ma, game zone, photobooth và các hoạt động bên lề.",
  },
  {
    time: "03",
    title: "Lên sân khấu",
    description: "Tiết mục, khách mời và những màn tương tác theo chủ đề.",
  },
  {
    time: "04",
    title: "Khép đêm",
    description: "Lucky draw, quà tặng và lời hẹn cho mùa Halloween tiếp theo.",
  },
];

const sponsors = [
  { key: "pdp", label: "PDP", image: pdpLogo, alt: "Logo PDP" },
  { key: "fptu", label: "FPTU", image: fptuLogo, alt: "Logo FPT University" },
  { key: "fbgc", label: "FBGC", image: fbgcLogo, alt: "Logo FPTU Board Game Club" },
  { key: "hlw26", label: "HLW26", image: wtmLogo, alt: "Logo FPTU Halloween 2026" },
];

const countdownItems = [
  ["days", "Ngày"],
  ["hours", "Giờ"],
  ["minutes", "Phút"],
  ["seconds", "Giây"],
];

export default function HomePage() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(getCountdown);

  const handleExploreClick = (event) => {
    event.preventDefault();
    const target = document.getElementById("home-intro");
    if (!target) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    target.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  useEffect(() => {
    if (sessionStorage.getItem("showLoginWelcome") !== "1") return;
    sessionStorage.removeItem("showLoginWelcome");
    const user = JSON.parse(localStorage.getItem("user") || "null");
    toast.success(`Xin chào ${user?.fullName || user?.name || "bạn"}!`);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setCountdown(getCountdown()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <main className="home-page">
      <section
        className="home-hero"
        aria-label="Hero banner FPTU Halloween 2026"
      >
        <img
          className="home-hero__image"
          src={heroImage}
          alt="Không gian FPTU Halloween"
        />
      </section>

      <section className="home-hero-copy" aria-labelledby="home-hero-title">
        <div className="home-hero-copy__inner">
          <div className="home-hero__masthead">
            <span>FPTU HALLOWEEN</span>
            <div
              className="home-lockup"
              aria-label="FPT University, PDP, FPTU Board Game Club và FPTU Halloween 2026"
            >
              <span className="home-lockup__mark home-lockup__mark--university">
                FPT UNIVERSITY
              </span>
              <span className="home-lockup__mark home-lockup__mark--pdp">
                PDP
              </span>
              <span className="home-lockup__mark home-lockup__mark--fbgc">
                FBGC
              </span>
              <span className="home-lockup__mark home-lockup__mark--hlw">
                HLW26
              </span>
            </div>
            <span>2026 / FPTU HÀ NỘI</span>
          </div>
          <p className="home-eyebrow">THEME OF THE YEAR · COMING SOON</p>
          <h1 id="home-hero-title">
            AI SỢ THÌ ĐI VỀ
            <span>Hòa Lạc không ngủ.</span>
          </h1>
          <p className="home-hero__lede">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Một mùa
            Halloween mới đang được mở khóa tại FPTU Hà Nội.
          </p>
          <div className="home-hero__actions">
            <button
              className="home-button home-button--primary"
              type="button"
              onClick={() => navigate("/tickets")}
            >
              Mua vé
            </button>
            <a
              className="home-button home-button--quiet"
              href="#home-intro"
              onClick={handleExploreClick}
            >
              Xem sự kiện <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
      </section>

      <section
        className="home-countdown-section"
        aria-labelledby="home-countdown-title"
      >
        <div className="home-countdown">
          <div className="home-countdown__heading">
            <p id="home-countdown-title" className="home-countdown__label">
              COUNTDOWN D-DAY
            </p>
            <span>
              {countdown.complete ? "Đã đến ngày diễn ra" : "Thời gian còn lại"}
            </span>
          </div>
          <div className="home-countdown__grid" aria-live="polite">
            {countdownItems.map(([key, label]) => (
              <div className="home-countdown__unit" key={key}>
                <strong>{String(countdown[key]).padStart(2, "0")}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="home-section home-intro"
        id="home-intro"
        aria-labelledby="home-intro-title"
      >
        <div className="home-section__head">
          <p className="home-eyebrow">01 · CONCEPT NOTE</p>
          <h2 id="home-intro-title">
            Một concept đủ gần để chạm vào, đủ lạ để nhớ.
          </h2>
        </div>
        <div className="home-intro__body">
          <p className="home-intro__lead">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. FPTU
            Halloween 2026 là nơi câu chuyện, âm nhạc và những cuộc gặp bất ngờ
            cùng tồn tại trong một đêm.
          </p>
          <p>
            Chọn một lối đi, nhập vai theo cách của bạn và để những chi tiết nhỏ
            dẫn đường. Nội dung năm nay sẽ được cập nhật dần trong thời gian
            tới.
          </p>
        </div>
      </section>

      <section
        className="home-section home-highlights"
        aria-labelledby="home-highlights-title"
      >
        <div className="home-section__head home-section__head--line">
          <p className="home-eyebrow">02 · THE NIGHT MAP</p>
          <h2 id="home-highlights-title">Điểm nổi bật</h2>
          <p>Những điểm dừng tạo nên toàn bộ nhịp điệu của đêm hội.</p>
        </div>
        <div className="home-highlights__list">
          {highlights.map((item) => (
            <article
              className={`home-highlight home-highlight--${item.tone}`}
              key={item.number}
            >
              <span className="home-highlight__number">{item.number}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
              <span className="home-highlight__arrow" aria-hidden="true">
                ↗
              </span>
            </article>
          ))}
        </div>
      </section>

      <section
        className="home-section home-timeline"
        aria-labelledby="home-timeline-title"
      >
        <div className="home-section__head">
          <p className="home-eyebrow">03 · RUN OF SHOW</p>
          <h2 id="home-timeline-title">Timeline chương trình</h2>
        </div>
        <div className="home-timeline__layout">
          <p className="home-timeline__note">
            Lịch trình chi tiết sẽ được công bố khi chương trình hoàn tất các
            mốc chuẩn bị.
          </p>
          <ol className="home-timeline__list">
            {timeline.map((item) => (
              <li key={item.time}>
                <span>{item.time}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        className="home-section home-map-section"
        aria-labelledby="home-map-title"
      >
        <div className="home-section__head">
          <p className="home-eyebrow">04 · FIND YOUR WAY</p>
          <h2 id="home-map-title">Map preview</h2>
        </div>
        <div className="home-map">
          <div className="home-map__grid" aria-hidden="true" />
          <span
            className="home-map__route home-map__route--one"
            aria-hidden="true"
          />
          <span
            className="home-map__route home-map__route--two"
            aria-hidden="true"
          />
          <span className="home-map__point home-map__point--main">
            MAIN GATE
          </span>
          <span className="home-map__point home-map__point--house">NHÀ MA</span>
          <span className="home-map__point home-map__point--stage">STAGE</span>
          <span className="home-map__caption">
            Sơ đồ minh họa · cập nhật sau
          </span>
        </div>
      </section>

      <section
        className="home-section home-sponsors"
        aria-labelledby="home-sponsors-title"
      >
        <div className="home-section__head home-section__head--compact">
          <p className="home-eyebrow">05 · WITH SUPPORT FROM</p>
          <h2 id="home-sponsors-title">Nhà tài trợ</h2>
        </div>
        <div className="home-sponsors__row">
          {sponsors.map((sponsor) => (
            <div className={`home-sponsor home-sponsor--${sponsor.key}`} key={sponsor.label}>
              {sponsor.image ? (
                <img src={sponsor.image} alt={sponsor.alt} />
              ) : (
                <span>{sponsor.label}</span>
              )}
            </div>
          ))}
        </div>
        <p className="home-sponsors__note">
          Lorem ipsum dolor sit amet. Danh sách đối tác đồng hành sẽ được cập
          nhật.
        </p>
      </section>
    </main>
  );
}
