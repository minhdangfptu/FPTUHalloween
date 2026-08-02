"use client"

import { Box, Container, Typography, Card, CardMedia, CardContent, Grid, Stack } from "@mui/material"
import { AccessTime } from "@mui/icons-material"
import { Link } from "react-router-dom"
import "./News.css"
import { useTranslation } from "react-i18next"

export default function News() {
  const { t } = useTranslation()
  const page = (key, options) => t(`eventPages.news.${key}`, options)
  const titles = page("titles", { returnObjects: true })
  // Sample news data
  const featuredNews = {
    id: 1,
    title: titles[0],
    image: "/halloween-event-2025.jpg",
    source: "FPTU HALLOWEEN",
    time: page("hour", { count: 2 }),
    views: page("views", { count: "1,234" }),
  }

  const secondaryNews = [
    {
      id: 2,
      title: titles[1],
      image: "/halloween-art-performance.jpg",
      source: "FPTU NEWS",
      time: page("hour", { count: 3 }),
      views: "",
    },
    {
      id: 3,
      title: titles[2],
      image: "/halloween-ticket-guide.jpg",
      source: "FPTU GUIDE",
      time: page("hour", { count: 4 }),
      views: "",
    },
  ]

  const newsList = [
    {
      id: 4,
      title: titles[3],
      image: "/halloween-activities.jpg",
      source: "FPTU EVENTS",
      time: page("hour", { count: 5 }),
      views: page("views", { count: 856 }),
    },
    {
      id: 5,
      title: titles[4],
      image: "/halloween-location.jpg",
      source: "FPTU INFO",
      time: page("hour", { count: 6 }),
      views: page("views", { count: 432 }),
    },
    {
      id: 6,
      title: titles[5],
      image: "/halloween-tips.jpg",
      source: "FPTU TIPS",
      time: page("hour", { count: 7 }),
      views: page("views", { count: "1,567" }),
    },
    {
      id: 7,
      title: titles[6],
      image: "/halloween-discounts.jpg",
      source: "FPTU OFFERS",
      time: page("hour", { count: 8 }),
      views: page("views", { count: "2,345" }),
    },
    {
      id: 8,
      title: titles[7],
      image: "/halloween-workshops.jpg",
      source: "FPTU WORKSHOPS",
      time: page("hour", { count: 9 }),
      views: page("views", { count: 789 }),
    },
    {
      id: 9,
      title: titles[8],
      image: "/halloween-sponsors.jpg",
      source: "FPTU SPONSORS",
      time: page("hour", { count: 10 }),
      views: page("views", { count: 654 }),
    },
  ]

  return (
    <div className="fptu-halloween-news-container">
      <header className="fptu-halloween-contact-header">
        <div className="fptu-halloween-contact-banner">
          <h1 className="fptu-halloween-contact-banner-title">
            {page("title")}
          </h1>
        </div>
      </header>
      
      <div className="fptu-halloween-news-content">
        <div className="fptu-halloween-news-grid">
          {/* Left Column - Featured and Secondary News */}
          <div className="fptu-halloween-news-featured">
            <h2 className="fptu-halloween-news-featured-title">
              {page("featured")}
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
              {page("other")}
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
