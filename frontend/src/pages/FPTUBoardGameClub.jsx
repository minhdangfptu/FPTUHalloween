"use client";

import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Paper,
  Avatar,
  Grid,
  Chip,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import cover from "../assets/cover.jpg";
import coverImg from "../assets/cover.jpg";
import FacebookIcon from "@mui/icons-material/Facebook";
export default function FPTUBoardGameClub() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Default club data if none provided
  const defaultClub = {
    club_name: "FPTU Board Game Club",
    club_description:
      "FPTU Boardgame Club là nơi quy tụ những bạn trẻ yêu thích boardgame và tổ chức sự kiện. Sau 6 năm hoạt động, CLB đã ghi dấu ấn với nhiều sự kiện lớn nhỏ như FPTU Halloween (2020–2022–2023) hay BOARDGAME TOURNAMENT mùa 1–2. Với tinh thần sáng tạo và gắn kết, CLB đang trở thành điểm hẹn quen thuộc của sinh viên FPTU để cùng thư giãn và kết nối.",
    club_banner_url: { cover },
    club_logo_url:
      "https://scontent.fhan15-1.fna.fbcdn.net/v/t39.30808-6/340081295_212862661390181_8263369182237071276_n.png?_nc_cat=105&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeGT18yEf143jCHSuNOf18tkQqfwDNKwW4RCp_AM0rBbhIbw4IzCGSMselWo4OUe9rLdsZJ6mWm9dQFPw6Ud5xVB&_nc_ohc=KUnF4z_d0yoQ7kNvwHMQ7g7&_nc_oc=AdmocczKDWV4Cvn1fBQsDjYSSvcHTdgf2vwzR1U3T8wRqViq1xjC1WFj1i1ei4tdOL4&_nc_zt=23&_nc_ht=scontent.fhan15-1.fna&_nc_gid=r4IkxAm9FiKhKx7i_Ykwzg&oh=00_AffLrBL7uaM4FcmfVG2dKDZsOmfMKjmDC7tzFxRr6ct_jw&oe=68F4E00D",
    president_name: "Lê Quỳnh Anh",
    contact_email: "fuboardgameclub@gmail.com",
    contact_facebook: "https://fb.me/fuboardgameclub",
    contact_phone: "0355987238",
    location: "Sân Băng – Đại học FPT Hà Nội",
    member_count: 200,
    established_year: 2019,
  };

  const clubData = defaultClub;

  return (
    <Box>
      <header className="fptu-halloween-contact-header">
        <div className="fptu-halloween-contact-banner">
          <h1 className="fptu-halloween-contact-banner-title">
            VỀ FPTU BOARD GAME CLUB
          </h1>
        </div>
      </header>
      <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 4 }}>
        <Container maxWidth="lg">
          {/* Banner and Logo Section */}
          <Paper
            elevation={0}
            sx={{ mb: 3, overflow: "hidden", borderRadius: 2 }}
          >
            {/* Banner Image */}
            <Box
              sx={{
                height: { xs: 200, md: 300 },
                position: "relative",
                bgcolor: "grey.200",
              }}
            >
              {clubData.club_banner_url ? (
                <Box
                  component="img"
                  src={coverImg}
                  alt="Club banner"
                  sx={{
                    width: "100%",
                    height: "100%",

                    objectPosition: "center",
                    background: "grey.200",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              ) : (
                /* placeholder như bạn đang có */
                <Box sx={{ textAlign: "center", color: "grey.400" }}>
                  NO IMAGE AVAILABLE
                </Box>
              )}
            </Box>
            {/* Club Logo Avatar */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: -8,
                mb: 2,
              }}
            >
              <Avatar
                src={clubData.club_logo_url}
                alt={clubData.club_name}
                sx={{
                  width: 120,
                  height: 120,
                  border: "4px solid white",
                  bgcolor: "grey.300",
                  fontSize: "0.75rem",
                  color: "grey.500",
                }}
              >
                {!clubData.club_logo_url && (
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="caption" sx={{ fontSize: "0.6rem" }}>
                      NO IMAGE
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ fontSize: "0.6rem", display: "block" }}
                    >
                      AVAILABLE
                    </Typography>
                  </Box>
                )}
              </Avatar>
            </Box>

            {/* Club Name */}
            <Typography
              variant="h5"
              sx={{
                textAlign: "center",
                fontWeight: 600,
                color: "red",
                mb: 3,
              }}
            >
              {clubData.club_name}
            </Typography>

            {/* Tabs */}
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              sx={{
                borderBottom: 1,
                borderColor: "divider",
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 500,
                  color: "text.secondary",
                  "&.Mui-selected": {
                    color: "red",
                  },
                },
                "& .MuiTabs-indicator": {
                  bgcolor: "red",
                  height: 3,
                },
              }}
            >
              <Tab label="Giới thiệu" />
              <Tab label="Sinh hoạt hàng tuần" />
              <Tab label="Sự kiện" />
              <Tab label="Thành tích" />
            </Tabs>
          </Paper>

          {/* Content Area */}
          <Grid container spacing={3}>
            {/* Left Column - Main Content */}
            <Grid item xs={12} md={8}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
                {activeTab === 0 && (
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ mb: 2, fontWeight: 600, color: "red" }}
                    >
                      Giới thiệu
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: "text.secondary", lineHeight: 1.8 }}
                    >
                      {clubData.club_description}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: "text.secondary", lineHeight: 1.8 }}
                    >
                      Là CLB Tổ chức sự kiện FPTU Halloween thường niên của
                      trường Đại học FPT Hà Nội. Sự kiện được nhuộm màu ma mị
                      với chủ đề độc đáo mỗi năm, trở thành sân khấu cho những
                      màn hóa trang đỉnh cao và sáng tạo có 1 không 2 của các
                      Cóc. Với năm 2025, sự kiện đã được nhuộm màu "Wishbound" -
                      những giấc mơ và ước mơ đầy hứa hẹn. Chắc chắn sẽ là một
                      đêm hội kỳ bí, chất lừ và đáng nhớ, củng cố tinh thần năng
                      động và gắn kết của cộng đồng sinh viên FPT.
                    </Typography>

                    {/* Additional Info */}
                    <Box
                      sx={{ mt: 3, display: "flex", gap: 2, flexWrap: "wrap" }}
                    >
                      <Chip
                        label={`${clubData.member_count} thành viên`}
                        color="red"
                        variant="outlined"
                      />
                      <Chip
                        label={`Thành lập ${clubData.established_year}`}
                        color="red"
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                )}

                {activeTab === 1 && (
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ mb: 2, fontWeight: 600, color: "red" }}
                    >
                      Sinh hoạt hàng tuần
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: "text.secondary" }}
                    >
                      Đại gia đình Bê Gờ mở cửa chào đón tất cả mọi người đến sinh hoạt vào <br></br>thứ 5 hằng tuần (19h30 - 21h30) tại sân băng nhé các tình yêu 💖
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      <Box
                        component="img"
                        src="https://scontent.fhan15-2.fna.fbcdn.net/v/t39.30808-6/558640148_1438506497878768_4673805905158913483_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeHSSkSqgc-3C4StpHL4AMOMgGs6KyTPQ-GAazorJM9D4Q6wGvhPybpRL4btSkk2XgcpnhKo1RsKatFSXWG67MrV&_nc_ohc=kdKU2FRC-rAQ7kNvwGvFnHt&_nc_oc=Admxpb4df4Wa8wegJplMf0m5Q9vpjhwD4cDxV1ubvSDyxSo3ZCssn9jofLGjLkjZc1c&_nc_zt=23&_nc_ht=scontent.fhan15-2.fna&_nc_gid=OQ97Qya-8ax4DgMjUl1P5A&oh=00_AfcyLVzlwhX8CL5aqT1yAE61iZmvslVQPPlVvQ5rbb6bRQ&oe=68F4E2D6"
                        alt="Thành tích"
                        sx={{
                          width: "70%",
                          maxWidth: 600,
                          borderRadius: 2,
                          boxShadow: 3,
                          mt: 2,
                        }}
                      />
                    </Box>
                  </Box>
                )}

                {activeTab === 2 && (
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ mb: 2, fontWeight: 600, color: "red" }}
                    >
                      Sự kiện
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: "text.secondary" }}
                    >
                      Hệ thống đang cập nhật sự kiện của câu lạc bộ, vui lòng quay lại sau...
                    </Typography>
                  </Box>
                )}

                {activeTab === 3 && (
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ mb: 2, fontWeight: 600, color: "red" }}
                    >
                      Thành tích
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: "text.secondary" }}
                    >
                      Câu lạc bộ phong trào xuất sắc kì FA24
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      <Box
                        component="img"
                        src="https://scontent.fhan15-2.fna.fbcdn.net/v/t39.30808-6/491951064_1293132839082802_8405279153751387439_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeGWk9Le5C14GsWJ4RqaZS6VOmy0CqE0alo6bLQKoTRqWpcQFqBfhnrRIINIZbsCIESU3QbujZlSfYx_EVc0OaHS&_nc_ohc=zfNZU7kg7ugQ7kNvwGTvyy5&_nc_oc=AdlcJNpaKuxyj_tuDrS6KOEhaE3VyvGP-Vf6yyHhedaXqZGc6HUXqMUQlz5YERA44tU&_nc_zt=23&_nc_ht=scontent.fhan15-2.fna&_nc_gid=qBtiqmArHDJ4dBvA2Byqow&oh=00_AfesFM0J9LNdlr2f8ps2YRBgYjmXamUJPDZj6YahQa8XtQ&oe=68F4E543"
                        alt="Thành tích"
                        sx={{
                          width: "70%",
                          maxWidth: 600,
                          borderRadius: 2,
                          boxShadow: 3,
                          mt: 2,
                        }}
                      />
                    </Box>
                  </Box>
                )}
              </Paper>
            </Grid>

            {/* Right Column - Contact Info */}
            <Grid item xs={12} md={4}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
                <Typography
                  variant="h6"
                  sx={{ mb: 3, fontWeight: 600, color: "red" }}
                >
                  Liên hệ
                </Typography>

                {/* President */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <PersonIcon sx={{ color: "red", mr: 1 }} />
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      Chủ nhiệm:{" "}
                      <Typography
                        component="span"
                        sx={{ color: "red", fontWeight: 500 }}
                      >
                        {clubData.president_name}
                      </Typography>
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <FacebookIcon sx={{ color: "red", mr: 1 }} />
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      Facebook:{" "}
                      <Typography
                        component="span"
                        sx={{ color: "red", fontWeight: 500 }}
                      >
                        {clubData.contact_facebook}
                      </Typography>
                    </Typography>
                  </Box>
                </Box>

                {/* Email */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <EmailIcon sx={{ color: "red", mr: 1 }} />
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {clubData.contact_email}
                  </Typography>
                </Box>

                {/* Phone */}
                {clubData.contact_phone && (
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <PhoneIcon sx={{ color: "red", mr: 1 }} />
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      {clubData.contact_phone}
                    </Typography>
                  </Box>
                )}

                {/* Location */}
                {clubData.location && (
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <LocationOnIcon sx={{ color: "red", mr: 1 }} />
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      {clubData.location}
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
