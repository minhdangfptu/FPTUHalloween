# FPTU Halloween

**FPTU Halloween** là hệ thống website được xây dựng nhằm hỗ trợ **tổ chức, vận hành và tham gia sự kiện FPTU Halloween**.

Hệ thống cung cấp các chức năng quản lý sự kiện, tin tức, vé, thanh toán, check-in, bình chọn, phản hồi và hỗ trợ vận hành cho Staff/Admin.

## ✨ Chức năng chính

* 🔐 Đăng ký, đăng nhập, OTP & Google Authentication
* 👤 Quản lý tài khoản & phân quyền
* 📰 Tin tức & Hot News
* 🎟️ Mua và quản lý vé
* 🛒 Giỏ hàng & đơn hàng
* 💳 Thanh toán trực tuyến qua PayOS
* 📱 QR Code & check-in
* 🗳️ D-Day Voting
* 📝 Feedback & khảo sát
* 💬 Staff Chat thời gian thực
* 📊 Thống kê & quản trị hệ thống
* 🌐 Đa ngôn ngữ

## 🛠️ Công nghệ

**Frontend:** React, React Router, Axios, Bootstrap, SCSS, Redux/Context API, Socket.IO

**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, Socket.IO

**Tích hợp:** Google, Facebook API, PayOS, Cloudinary, Email Service

## 🏗️ Kiến trúc

```text
Người dùng
    │
    ▼
React Frontend
    │
    │ REST API / WebSocket
    ▼
Node.js + Express
    │
    ├── Routes
    ├── Controllers
    ├── Services
    ├── Middleware
    └── Models
    │
    ├──────────────┐
    ▼              ▼
 MongoDB      External Services
              ├── PayOS
              ├── Google
              ├── Facebook
              └── Cloudinary
```

## 📂 Cấu trúc

```text
FPTUHalloween/
├── frontend/
├── backend/
├── docs/
└── README.md
```

## 🚀 Cài đặt

```bash
git clone https://github.com/minhdangfptu/FPTUHalloween.git
cd FPTUHalloween

cd frontend
npm install

cd ../backend
npm install
```

Cấu hình các biến môi trường cần thiết trong file `.env`, sau đó chạy:

```bash
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm start
```

## 📚 Tài liệu

Các tài liệu phân tích và đặc tả hệ thống được lưu trong thư mục `docs/`:

* Function Checklist
* Business Flow
* Actors & Permissions
* System Structure
* Business Rules
* Use Case
* SRS

## 📞 Liên hệ

**FPTU Halloween**
* 🧑‍💻 Phát triển bởi Minh Đặng
* 📞 Số điện thoại: 0398826650
* 🌐 Website: [FPTU Halloween](https://github.com/minhdangfptu/FPTUHalloween)
* 📘 Facebook: [FPTU Halloween](https://www.facebook.com/fptuhalloween)

> Mọi thông tin về sự kiện, lịch trình và thông báo mới nhất được cập nhật trên Fanpage chính thức của FPTU Halloween.
