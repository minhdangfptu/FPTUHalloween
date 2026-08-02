import React from "react";
import "./Fanpage.css";
import { useTranslation } from "react-i18next";

export default function Fanpage() {
  const { t } = useTranslation();
  const page = (key) => t(`eventPages.fanpage.${key}`);
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
        <h2>{page("title")}</h2>
        <p>
          {page("intro")}
        </p>
        <ul>
          <li>📍{page("location")}</li>
          <li>🗓 {page("date")}</li>
          <li>🎟 {page("tickets")}</li>
          <li>☎ {page("contact")}</li>
        </ul>

        <a
          href="https://www.facebook.com/fptuhalloween"
          className="fptu-halloween-fanpage-btn-primary"
        >
          {page("visit")}
        </a>
      </div>
    </div>
  );
}
