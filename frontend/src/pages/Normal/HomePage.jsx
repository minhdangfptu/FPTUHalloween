// src/pages/HomePage.jsx
import React, { useState, useEffect, use } from "react";
import "./HomePage.css";
import halloweensApi from "../../apis/halloweensAPI";

import hero from "../../assets/cover-01.png";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const highlights = [
  {
    title: "Nhà Ma – Wishbound",
    desc: "Trải nghiệm lời nguyền điều ước.",
    img: hero,
  },
  { title: "Main Stage", desc: "Âm nhạc – DJ – Lightshow.", img: hero },
  {
    title: "Cosplay & Parade",
    desc: "Hóa thân & diễu hành chủ đề.",
    img: hero,
  },
];

const values = [
  {
    title: "FPTU Halloween",
    desc: "Sự kiện Halloween lớn nhất FPTU.",
    link: "/overall",
  },
  {
    title: "FPTU Board Game Club",
    desc: "CLB Tổ chức sự kiện Halloween",
    link: "/fbgc",
  },
  {
    title: "Tin tức mới nhất",
    desc: "Cập nhật tin tức về sự kiện",
    link: "/news",
  },
  {
    title: "Liên hệ và phản hồi",
    desc: "Phản hồi với chúng tôi",
    link: "/contact-us",
  },
];

export default function HomePage() {
  const [halloweenEvents, setHalloweenEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (sessionStorage.getItem("showLoginWelcome") !== "1") return;
    sessionStorage.removeItem("showLoginWelcome");
    const user = JSON.parse(localStorage.getItem("user") || "null");
    toast.success(`Xin chào ${user?.fullName || user?.name || "bạn"}!`);
  }, []);
  useEffect(() => {
    const fetchHalloweenEvents = async () => {
      try {
        setLoading(true);
        const data = await halloweensApi.listAllHalloween();
        console.log(data);
        // Xử lý cấu trúc API với field items
        if (data && Array.isArray(data.items)) {
          setHalloweenEvents(data.items);
        } else if (Array.isArray(data)) {
          setHalloweenEvents(data);
        } else if (data && Array.isArray(data.data)) {
          // Nếu API trả về { data: [...] }
          setHalloweenEvents(data.data);
        } else if (data && Array.isArray(data.events)) {
          // Nếu API trả về { events: [...] }
          setHalloweenEvents(data.events);
        } else {
          // Nếu data không phải array, sử dụng fallback
          console.warn("API returned non-array data:", data);
          setHalloweenEvents(highlights);
        }
        setError(null);
      } catch (err) {
        console.error("Error fetching halloween events:", err);
        setError("Không thể tải dữ liệu sự kiện Halloween");
        // Fallback to static data if API fails
        setHalloweenEvents(highlights);
      } finally {
        setLoading(false);
      }
    };

    fetchHalloweenEvents();
  }, []);

  return (
    <div className="fptu-halloween-page">
      <Toaster position="top-center" />
      {/* HERO */}
      <section className="fptu-halloween-hero">
        <img src={hero} alt="" className="fptu-halloween-hero__bg" />
        <div className="fptu-halloween-hero__overlay" />
        <div className="fptu-halloween-hero__content">
          <h1>FPTU HALLOWEEN 2025 WISHBOUND</h1>
          <p>Nơi hòa quyện của niềm vui và nỗi sợ.</p>
          <div className="fptu-halloween-hero__cta">
            <a
              href="/event-page"
              className="fptu-halloween-btn fptu-halloween-btn--primary"
            >
              Khám phá
            </a>
            <a
              href="/ticket-game"
              className="fptu-halloween-btn fptu-halloween-btn--ghost"
            >
              Mua vé ngay
            </a>
          </div>
        </div>
      </section>

      {/* VIDEO SECTION */}
      <section className="fptu-halloween-video-section">
        <div className="fptu-halloween-video-container">
          <div className="fptu-halloween-video-content">
            <div className="fptu-halloween-video-column">
              <div className="fptu-halloween-video-wrapper">
                <div className="fptu-halloween-video-embed">
                  <iframe
                    src="https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1481935782850269%2F&show_text=false&width=560&t=0&autoplay=1&mute=1"
                    width="100%"
                    height="420"
                    style={{
                      border: "none",
                      overflow: "hidden",
                      borderRadius: "16px",
                    }}
                    scrolling="no"
                    frameBorder="0"
                    allowFullScreen={true}
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    title="FPTU Halloween Video"
                    className="fptu-halloween-video-embed-iframe"
                  ></iframe>
                </div>
              </div>
            </div>

            <div className="fptu-halloween-video-description">
              <h2>FPTU Halloween 2025</h2>
              <p className="fptu-halloween-video-subtitle">
                Mỗi đêm, vào ngày 31/10 hằng năm, giữa màn sương dày đặc, thị
                trấn ma quái 𝐖𝐢𝐬𝐡𝐛𝐨𝐮𝐧𝐝 xuất hiện rồi biến mất như chưa từng tồn
                tại…. Nhưng năm nay, sau hàng thế kỷ ẩn mình, cái tên bao năm ám
                ảnh thị trấn hóa ra chỉ là một mặt nạ khác của Joker - thực thể
                tàn nhẫn chỉ sống để đánh tráo điều ước, nuốt chửng linh hồn và
                biến hy vọng thành lời nguyền. Lúc ấy, ở nơi trung tâm thi trấn
                mới rõ hình Quán rượu cổ, nơi mọi điều ước đều có giá, mọi “quy
                tắc trò chơi” chỉ để dẫn dắt những ván đấu chết chóc do hắn bày
                ra.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      {/* <section className="fptu-halloween-section">
        <h2>Các sự kiện Halloween từng tổ chức tại FPTU</h2>
        {loading ? (
          <div className="fptu-halloween-loading">
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : error ? (
          <div className="fptu-halloween-error">
            <p>{error}</p>
          </div>
        ) : (
          <div className="fptu-halloween-cards" style={{ cursor: "pointer" }}>
            {Array.isArray(halloweenEvents) && halloweenEvents.length > 0 ? (
              halloweenEvents.map((event, index) => (
                <article
                  key={event._id || event.id || index}
                  className="fptu-halloween-card"
                >
                  <img
                    src={event.event_image_url || hero}
                    alt={event.event_name || event.title}
                  />
                  <div className="fptu-halloween-card__body">
                    <h3>{event.event_name || event.title || event.name}</h3>
                    <p>
                      {event.event_description ||
                        event.description ||
                        event.desc}
                    </p>
                    <div className="fptu-halloween-card__details">
                      {event.event_concept && (
                        <div className="fptu-halloween-card__concept">
                          <span>🎭 {event.event_concept}</span>
                        </div>
                      )}
                      {event.event_start_time && (
                        <div className="fptu-halloween-card__date">
                          <span>
                            📅{" "}
                            {new Date(
                              event.event_start_time
                            ).toLocaleDateString("vi-VN")}
                          </span>
                        </div>
                      )}
                      {event.event_location && (
                        <div className="fptu-halloween-card__location">
                          <span>📍 {event.event_location}</span>
                        </div>
                      )}
                      {event.event_year && (
                        <div className="fptu-halloween-card__year">
                          <span>🗓️ Năm {event.event_year}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="fptu-halloween-no-data">
                <p>Không có dữ liệu sự kiện Halloween</p>
              </div>
            )}
          </div>
        )}
      </section> */}

      {/* CORE VALUES */}
      <section className="fptu-halloween-section">
        <h2>Khám phá cùng chúng tôi</h2>
        <div className="fptu-halloween-grid">
          {values.map((v) => (
            <div
              key={v.title}
              className="fptu-halloween-feature"
              role="button"
              tabIndex={0}
              onClick={() => navigate(v.link)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") navigate(v.link);
              }}
            >
              <h3>{v.title}</h3>
              <p>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
