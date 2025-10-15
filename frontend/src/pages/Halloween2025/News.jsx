"use client"

import { Box, Container, Typography, Card, CardMedia, CardContent, Grid, Stack } from "@mui/material"
import { AccessTime } from "@mui/icons-material"
import { Link } from "react-router-dom"
import "./News.css"

export default function News() {
  // Sample news data
  const featuredNews = {
    id: 1,
    title: "FPTU Halloween 2025: Sự kiện Wishbound sắp diễn ra với nhiều hoạt động hấp dẫn",
    image: "/halloween-event-2025.jpg",
    source: "FPTU HALLOWEEN",
    time: "2 giờ",
    views: "1,234 lượt xem",
  }

  const secondaryNews = [
    {
      id: 2,
      title: "Chương trình nghệ thuật đặc sắc tại FPTU Halloween 2025",
      image: "/halloween-art-performance.jpg",
      source: "FPTU NEWS",
      time: "3 giờ",
      views: "",
    },
    {
      id: 3,
      title: "Hướng dẫn mua vé và tham gia sự kiện Halloween",
      image: "/halloween-ticket-guide.jpg",
      source: "FPTU GUIDE",
      time: "4 giờ",
      views: "",
    },
  ]

  const newsList = [
    {
      id: 4,
      title: "Các hoạt động chính trong FPTU Halloween 2025",
      image: "/halloween-activities.jpg",
      source: "FPTU EVENTS",
      time: "5 giờ",
      views: "856 lượt xem",
    },
    {
      id: 5,
      title: "Thông tin về địa điểm và thời gian sự kiện",
      image: "/halloween-location.jpg",
      source: "FPTU INFO",
      time: "6 giờ",
      views: "432 lượt xem",
    },
    {
      id: 6,
      title: "Những điều cần biết khi tham gia Halloween tại FPTU",
      image: "/halloween-tips.jpg",
      source: "FPTU TIPS",
      time: "7 giờ",
      views: "1,567 lượt xem",
    },
    {
      id: 7,
      title: "Chương trình ưu đãi đặc biệt cho sinh viên FPTU",
      image: "/halloween-discounts.jpg",
      source: "FPTU OFFERS",
      time: "8 giờ",
      views: "2,345 lượt xem",
    },
    {
      id: 8,
      title: "Cách thức đăng ký tham gia các workshop Halloween",
      image: "/halloween-workshops.jpg",
      source: "FPTU WORKSHOPS",
      time: "9 giờ",
      views: "789 lượt xem",
    },
    {
      id: 9,
      title: "Thông tin về các nhà tài trợ của sự kiện",
      image: "/halloween-sponsors.jpg",
      source: "FPTU SPONSORS",
      time: "10 giờ",
      views: "654 lượt xem",
    },
  ]

  return (
    <div className="fptu-halloween-news-container">
      <header className="fptu-halloween-contact-header">
        <div className="fptu-halloween-contact-banner">
          <h1 className="fptu-halloween-contact-banner-title">
            TIN TỨC
          </h1>
        </div>
      </header>
      
      <div className="fptu-halloween-news-content">
        <div className="fptu-halloween-news-grid">
          {/* Left Column - Featured and Secondary News */}
          <div className="fptu-halloween-news-featured">
            <h2 className="fptu-halloween-news-featured-title">
              Tin tức nổi bật
            </h2>
            {/* Featured News */}
            <div className="fptu-halloween-news-featured-main">
              <img 
                src={featuredNews.image} 
                alt={featuredNews.title}
                className="fptu-halloween-news-featured-image"
              />
              <div className="fptu-halloween-news-featured-content">
                <h2 className="fptu-halloween-news-featured-title">
                  {featuredNews.title}
                </h2>
                <div className="fptu-halloween-news-featured-meta">
                  <span className="fptu-halloween-news-featured-source">
                    {featuredNews.source}
                  </span>
                  <div className="fptu-halloween-news-featured-time">
                    <AccessTime sx={{ fontSize: 16 }} />
                    <span>{featuredNews.time}</span>
                  </div>
                  {featuredNews.views && (
                    <span className="fptu-halloween-news-featured-views">
                      {featuredNews.views}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Secondary News */}
            <div className="fptu-halloween-news-secondary">
              {secondaryNews.map((news) => (
                <div key={news.id} className="fptu-halloween-news-secondary-item">
                  <img 
                    src={news.image} 
                    alt={news.title}
                    className="fptu-halloween-news-secondary-image"
                  />
                  <div className="fptu-halloween-news-secondary-content">
                    <h3 className="fptu-halloween-news-secondary-title">
                      {news.title}
                    </h3>
                    <div className="fptu-halloween-news-secondary-meta">
                      <span className="fptu-halloween-news-secondary-source">
                        {news.source}
                      </span>
                      <div className="fptu-halloween-news-secondary-time">
                        <AccessTime sx={{ fontSize: 14 }} />
                        <span>{news.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - News List */}
          <div className="fptu-halloween-news-sidebar">
            <h2 className="fptu-halloween-news-sidebar-title">
              Tin tức khác
            </h2>
            {newsList.map((news, index) => (
              <div 
                key={news.id} 
                className="fptu-halloween-news-list-item"
                style={{ '--item-index': index }}
              >
                <h3 className="fptu-halloween-news-list-title">
                  {news.title}
                </h3>
                <div className="fptu-halloween-news-list-meta">
                  <span className="fptu-halloween-news-list-source">
                    {news.source}
                  </span>
                  <div className="fptu-halloween-news-list-time">
                    <AccessTime sx={{ fontSize: 12 }} />
                    <span>{news.time}</span>
                  </div>
                </div>
                {news.views && (
                  <div className="fptu-halloween-news-list-views">
                    {news.views}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}