"use client";

import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Paper,
  Grid,
  Chip,
  Button,
} from "@mui/material";
import {
  CalendarToday,
  LocationOn,
  ConfirmationNumber,
} from "@mui/icons-material";

export default function Overall({ event }) {
  const [activeTab, setActiveTab] = useState(0);
  event = {
    event_name: "FPTU HALLOWEEN 2025: WISHBOUND",
    event_concept: `😈 Mỗi đêm, vào ngày 31/10 hằng năm, giữa màn sương dày đặc, thị trấn ma quái 𝐖𝐢𝐬𝐡𝐛𝐨𝐮𝐧𝐝 xuất hiện rồi biến mất như chưa từng tồn tại…. Nhưng năm nay, sau hàng thế kỷ ẩn mình, cái tên bao năm ám ảnh thị trấn hóa ra chỉ là một mặt nạ khác của Joker - thực thể tàn nhẫn chỉ sống để đánh tráo điều ước, nuốt chửng linh hồn và biến hy vọng thành lời nguyền. Lúc ấy, ở nơi trung tâm thi trấn mới rõ hình Quán rượu cổ, nơi mọi điều ước đều có giá, mọi “quy tắc trò chơi” chỉ để dẫn dắt những ván đấu chết chóc do hắn bày ra.
👻 Người bước chân vào vùng đất này sẽ phải đặt cược chính linh hồn của mình: thắng sẽ chạm tới điều ước sâu thẳm nhất, còn thua sẽ bị phong ấn vĩnh viễn giữa bốn vùng đất tội lỗi: Cơ, Rô, Bích, Tép - nơi phản chiếu mặt tối của mỗi người. 
🎃 Liệu bạn là người chiến thắng… hay là kẻ bị phong ấn? Còn rất nhiều điều bí ẩn sẽ được soi chiếu tại 𝐇𝐚𝐥𝐥𝐨𝐰𝐞𝐞𝐧 𝟐𝟎𝟐𝟓: 𝐖𝐢𝐬𝐡𝐛𝐨𝐮𝐧𝐝, sự kiện kinh dị và kỳ bí bậc nhất Đại học FPT. Vậy nên, đừng bỏ lỡ mùa Halloween đặc sắc lần này nhé!`,
    event_description: `🎃 "FPTU Halloween" là sự kiện Halloween thường niên lớn nhất của FPTU Hà Nội, 
quy tụ hàng nghìn sinh viên tham gia. 
Sự kiện gồm 4 khu vực chính:
- Nhà ma kinh dị
- Khu game rùng rợn
- Khu ẩm thực đêm
- Sân khấu trình diễn nghệ thuật
  
Đặc biệt, CUỘC THI HÓA TRANG 𝐆𝐋𝐎𝐑𝐈𝐎𝐔𝐒" sẽ trao thưởng cho những hóa trang ấn tượng nhất.`,
    event_image_url:
      "https://scontent.fhan15-1.fna.fbcdn.net/v/t39.30808-6/557548210_783742787847613_9207811038853147592_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=cc71e4&_nc_eui2=AeFUV1lHfyPBqIYOuYAUu1rBmyXqMbmOts-bJeoxuY62z6ItcD8p3wVOS3mNaMqtLoD86ucHQHtCoW3Mc2oGRwTn&_nc_ohc=eKZ5xU-KvCQQ7kNvwE4yYmp&_nc_oc=Adl9LDtaf5x_cOvY2HHyHCCw1goUqaBNmKnP3x1P68aTEu9la7dos4wqE22CVvoqBOg&_nc_zt=23&_nc_ht=scontent.fhan15-1.fna&_nc_gid=sMLkjPtp_Y4wWSYwTQpWrg&oh=00_Afd1rgL90qAc7j_CJZ37h8a4C-4pbY87QmebqYfZ8c1VUQ&oe=68F4FF4D",
    event_year: 2025,
    event_start_time: "2025-10-27T18:00:00Z",
    event_end_time: "2025-10-30T23:00:00Z",
    event_location: "Đường 30m Đại học FPT Hà Nội (Nhà ma trong tòa Delta)",
    event_status: 1, // 0: nháp, 1: sắp diễn ra, 2: kết thúc, 3: hủy
    ticket_url: "https://forms.gle/BViHc5dYp9HxgKCo6",
  };
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Format date range
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatDateRange = () => {
    const start = formatDate(event.event_start_time);
    const end = formatDate(event.event_end_time);
    return start === end ? start : `${start} - ${end}`;
  };

  // Get status info
  const getStatusInfo = (status) => {
    const statusMap = {
      0: { label: "Bản nháp", color: "default" },
      1: { label: "Sắp diễn ra", color: "success" },
      2: { label: "Đã kết thúc", color: "error" },
      3: { label: "Đã hủy", color: "warning" },
    };
    return statusMap[status] || statusMap[1];
  };

  const statusInfo = getStatusInfo(event.event_status);

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        {/* Page Title */}
        <Typography
          variant="h5"
          sx={{
            textAlign: "center",
            mb: 3,
            fontWeight: 600,
            color: "text.primary",
          }}
        >
          Xem thông tin sự kiện
        </Typography>

        {/* Banner Section */}
        <Paper
          elevation={0}
          sx={{ mb: 3, overflow: "hidden", borderRadius: 2 }}
        >
          {/* Event Banner Image */}
          <Box
            sx={{
              height: { xs: 250, md: 500 },
              bgcolor: "grey.200",
              backgroundImage: event.event_image_url
                ? `url(${event.event_image_url})`
                : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {!event.event_image_url && (
              <Box sx={{ textAlign: "center", color: "grey.400" }}>
                <Box
                  component="img"
                  src="/placeholder.svg?height=100&width=100"
                  alt="No image"
                  sx={{ width: 100, height: 100, opacity: 0.5 }}
                />
                <Typography variant="h6" sx={{ mt: 1 }}>
                  NO IMAGE AVAILABLE
                </Typography>
              </Box>
            )}
          </Box>

          {/* Event Name */}
          <Typography
            variant="h4"
            sx={{
              textAlign: "center",
              fontWeight: 700,
              color: "error.main",
              my: 3,
              px: 2,
            }}
          >
            {event.event_name}
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
                  color: "error.main",
                },
              },
              "& .MuiTabs-indicator": {
                bgcolor: "error.main",
                height: 3,
              },
            }}
          >
            <Tab label="Giới thiệu" />
            <Tab label="Thông tin" />
            <Tab label="Đăng ký" />
          </Tabs>
        </Paper>

        {/* Content Area */}
        <Grid container spacing={3}>
          {/* Left Column - Main Content */}
          <Grid item xs={12} md={8}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
              {/* Tab 0: Giới thiệu */}
              {activeTab === 0 && (
                <Box>
                  <Typography
                    variant="h6"
                    sx={{ mb: 2, fontWeight: 600, color: "error.main" }}
                  >
                    Giới thiệu
                  </Typography>

                  {/* Event Concept */}
                  {event.event_concept && (
                    <Box
                      sx={{ mb: 3, p: 2, bgcolor: "grey.50", borderRadius: 1 }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 600, mb: 1, color: "text.primary" }}
                      >
                        Concept sự kiện
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          fontStyle: "italic",
                          color: "text.secondary",
                          lineHeight: 1.8,
                          whiteSpace: "pre-line",
                        }}
                      >
                        {event.event_concept}
                      </Typography>
                    </Box>
                  )}

                  {/* Event Description */}
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 600, mb: 1, color: "text.primary" }}
                  >
                    Chi tiết sự kiện
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "text.secondary",
                      lineHeight: 1.8,
                      whiteSpace: "pre-line",
                    }}
                  >
                    {event.event_description ||
                      "Chưa có mô tả chi tiết cho sự kiện này."}
                  </Typography>
                </Box>
              )}

              {/* Tab 1: Thông tin */}
              {activeTab === 1 && (
                <Box>
                  <Typography
                    variant="h6"
                    sx={{ mb: 3, fontWeight: 600, color: "error.main" }}
                  >
                    Thông tin sự kiện
                  </Typography>

                  {/* Event Year */}
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 600, mb: 1, color: "text.primary" }}
                    >
                      Năm tổ chức
                    </Typography>
                    <Chip
                      label={event.event_year}
                      color="primary"
                      variant="outlined"
                    />
                  </Box>

                  {/* Date Range */}
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 600, mb: 1, color: "text.primary" }}
                    >
                      Thời gian
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <CalendarToday
                        sx={{ mr: 1, color: "text.secondary", fontSize: 20 }}
                      />
                      <Typography
                        variant="body1"
                        sx={{ color: "text.secondary" }}
                      >
                        {formatDateRange()}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Location */}
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 600, mb: 1, color: "text.primary" }}
                    >
                      Địa điểm
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <LocationOn
                        sx={{ mr: 1, color: "text.secondary", fontSize: 20 }}
                      />
                      <Typography
                        variant="body1"
                        sx={{ color: "text.secondary" }}
                      >
                        {event.event_location || "Chưa xác định"}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Status */}
                 
                </Box>
              )}

              {/* Tab 2: Đăng ký */}
              {activeTab === 2 && (
                <Box>
                  <Typography
                    variant="h6"
                    sx={{ mb: 3, fontWeight: 600, color: "error.main" }}
                  >
                    Đăng ký tham gia
                  </Typography>

                  {event.ticket_url && event.event_status === 1 ? (
                    <Box>
                      <Typography
                        variant="body1"
                        sx={{ mb: 3, color: "text.secondary", lineHeight: 1.8 }}
                      >
                        Sự kiện đang mở đăng ký game chặng. Nhấn vào nút bên dưới để đăng
                        ký tham gia game chặng sự kiện.
                      </Typography>
                      <Button
                        variant="contained"
                        color="error"
                        size="large"
                        startIcon={<ConfirmationNumber />}
                        href={event.ticket_url}
                        target="_blank"
                        sx={{
                          px: 4,
                          py: 1.5,
                          fontWeight: 600,
                          textTransform: "none",
                          fontSize: "1rem",
                        }}
                      >
                        Đăng ký ngay
                      </Button>
                    </Box>
                  ) : (
                    <Box sx={{ textAlign: "center", py: 4 }}>
                      <Typography
                        variant="body1"
                        sx={{ color: "text.secondary" }}
                      >
                        {event.event_status === 2
                          ? "Sự kiện đã kết thúc. Không thể đăng ký."
                          : event.event_status === 3
                          ? "Sự kiện đã bị hủy."
                          : "Sự kiện chưa mở đăng ký."}
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Right Column - Quick Info */}
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
              <Typography
                variant="h6"
                sx={{ mb: 3, fontWeight: 600, color: "error.main" }}
              >
                Thông tin nhanh
              </Typography>

              {/* Status */}
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", mb: 1 }}
                >
                  Trạng thái sự kiện:
                </Typography>
                <Chip
                  label={statusInfo.label}
                  color={statusInfo.color}
                  size="small"
                  sx={{ fontWeight: 500 }}
                />
              </Box>

              {/* Date */}
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", mb: 1 }}
                >
                  Thời gian:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {formatDateRange()}
                </Typography>
              </Box>

              {/* Location */}
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", mb: 1 }}
                >
                  Địa điểm:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {event.event_location || "Chưa xác định"}
                </Typography>
              </Box>

              {/* Organizer */}
              <Box>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", mb: 1 }}
                >
                  Câu lạc bộ Tổ chức
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 500, color: "error.main" }}
                >
                  FPTU Board Game Club (FBGC)
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
