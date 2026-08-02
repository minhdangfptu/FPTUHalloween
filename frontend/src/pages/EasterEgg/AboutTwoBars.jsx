/* Hallmark · macrostructure: Rainbow directory · tone: botanical carnival · anchor hue: spectral rainbow */
import "./AboutTwoBars.scss";
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
    image: chutich,
    eyebrow: "CHỦ TỊCH TỔNG TÀI",
    name: "Ngài Chủ tịch vũ trụ",
    note: "Bận ký giấy tờ, duyệt ngân sách và nhìn deadline bằng ánh mắt khiến deadline tự biến mất.",
    tone: "coral",
  },
];

const teamPeople = [
  {
    image: antonie,
    name: "Cánh tay phải",
    role: "Gọi chủ tịch dậy họp",
    tone: "yellow",
  },
  { image: gh, name: "Phó tổng", role: "Duyệt meme cấp tốc", tone: "pink" },
  {
    image: hkc,
    name: "Trợ lý riêng",
    role: "Giữ bình tĩnh hộ sếp",
    tone: "blue",
  },
  {
    image: kkb,
    name: "Giám đốc drama",
    role: "Tạo plot twist mỗi ngày",
    tone: "orange",
  },
  {
    image: md,
    name: "Trưởng ban keo nến",
    role: "Dính là không gỡ",
    tone: "lilac",
  },
  {
    image: td,
    name: "CEO hù dọa",
    role: "Chốt đơn cú giật mình",
    tone: "green",
  },
  {
    image: triet,
    name: "Giám đốc niềm vui",
    role: "Cười trước, tính sau",
    tone: "aqua",
  },
  {
    image: cuong,
    name: "Tổng tài dự bị",
    role: "Ký duyệt bằng ánh mắt",
    tone: "red",
  },
];

const AboutTwoBars = () => {
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
            FPTU HALLOWEEN / HỒ SƠ MẬT CẤP TỔNG TÀI
          </p>
          <h1 id="easter-title">Biết Chủ tịch này nhé.</h1>
          <p className="easter-directory__intro">
            Hồ sơ mật của vị tổng tài đã biến deadline, ngân sách và một ít keo
            nến thành đế chế Halloween lấp lánh.
          </p>
        </header>

        <div className="easter-featured-bar">
          {featuredPeople.map((person) => (
            <article
              className={`easter-featured-card easter-featured-card--${person.tone}`}
              key={person.name}
            >
              <div className="easter-avatar easter-avatar--featured">
                <img src={person.image} alt="" />
                <span aria-hidden="true">✦</span>
              </div>
              <div className="easter-featured-card__copy">
                <p className="easter-label">{person.eyebrow}</p>
                <h2>{person.name}</h2>
                <p>{person.note}</p>
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
          <p className="easter-kicker">BAN LÃNH ĐẠO KHÔNG AI BỔ NHIỆM</p>
          <h2 id="easter-team-title">Đội ngũ dưới trướng Chủ tịch.</h2>
          <span className="easter-team__orbit" aria-hidden="true" />
        </div>

        <div className="easter-team__bar">
          <div className="easter-team__track">
            {[...teamPeople, ...teamPeople].map((person, index) => (
              <article
                className={`easter-team-card easter-team-card--${person.tone}`}
                key={`${person.name}-${index}`}
              >
                <div className="easter-avatar">
                  <img src={person.image} alt="" />
                </div>
                <p className="easter-team-card__name">{person.name}</p>
                <p className="easter-team-card__role">{person.role}</p>
                <span className="easter-team-card__index">
                  0{(index % teamPeople.length) + 1}
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="easter-closing" aria-label="Lời nhắn của Chủ tịch">
        <span className="easter-closing__flower" aria-hidden="true">
          ✿
        </span>
        <p>
          Đằng sau mỗi cú hù là một đế chế đang vận hành. Và Chủ tịch thì vẫn
          chưa duyệt đơn xin nghỉ.
        </p>
        <span className="easter-closing__flower" aria-hidden="true">
          ✿
        </span>
      </section>
    </main>
  );
};

export default AboutTwoBars;
