import React from "react";
import "./Fanpage.css";

export default function Fanpage() {
  return (
    <div className="fptu-halloween-fanpage-container">
        
      {/* Cột trái: Facebook embed */}
      <div className="fptu-halloween-fanpage-column fptu-halloween-fanpage-left">
        <div
          className="fb-page"
          data-href="https://www.facebook.com/fptuniversityhanoi" // 👉 thay bằng link fanpage của bạn
          data-tabs="timeline"
          data-width="100%"
          data-small-header="false"
          data-adapt-container-width="true"
          data-hide-cover="false"
          data-show-facepile="true"
        >
          <iframe
            src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Ffptuhalloween&tabs&width=340&height=600&small_header=false&adapt_container_width=false&hide_cover=false&show_facepile=true&appId"
            width="340"
            height="100%"
            style={{border: "none", overflow: "hidden", justifyContent: "center", alignItems: "center", display: "flex"}}
            scrolling="no"
            frameBorder="0"
            allowFullScreen={true}
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          ></iframe>
          
        </div>
      </div>

      {/* Cột phải: mô tả sự kiện */}
      <div className="fptu-halloween-fanpage-column fptu-halloween-fanpage-right">
        <h2>🎃 FPTU Halloween 2025 – Wishbound</h2>
        <p>
          Sự kiện Halloween thường niên lớn nhất tại Đại học FPT Hà Nội!
        </p>
        <ul>
          <li>📍Địa điểm: Đường 30m, Khuôn viên Đại học FPT, Hòa Lạc</li>
          <li>🗓 Thời gian: 28–31/10/2025</li>
          <li>🎟 Vé: "Link vé"</li>
          <li>☎ Liên hệ: fptuhalloween@gmail.com</li>
        </ul>

        <a
          href="https://www.facebook.com/fptuhalloween"
          className="fptu-halloween-fanpage-btn-primary"
        >
          Truy cập ngay
        </a>
      </div>
    </div>
  );
}
