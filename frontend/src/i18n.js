import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  vi: {
    translation: {
      header: {
        tickerFallback: 'Chào mừng bạn đến với FPTU Halloween! Hãy sẵn sàng cho đêm hội kinh hoàng và bùng nổ nhất năm!',
        newsLabel: 'Thông báo sự kiện',
        darkMode: 'Bật dark mode',
        lightMode: 'Bật light mode',
        buyTicket: 'MUA VÉ NGAY',
      },
      nav: {
        home: 'TRANG CHỦ', introduce: 'GIỚI THIỆU', introduceGeneral: 'Giới thiệu chung',
        boardGameClub: 'Về CLB FPTU Board Game', pdp: 'Về PDP - Chương trình Phát triển Cá nhân FPTU Hà Nội',
        hauntedHouse: 'NHÀ MA HALLOWEEN', story: 'Câu chuyện', tickets: 'Mua vé',
        btc: 'VỀ BTC FPTU HALLOWEEN', contact: 'LIÊN HỆ', management: 'QUẢN TRỊ', feedback: 'ĐÁNH GIÁ',
        cart: 'Giỏ hàng của bạn', cartTickets: '{{count}} vé trong giỏ hàng', account: 'Tài khoản',
        hello: 'Xin chào {{name}}', yourAccount: 'Tài khoản của bạn', yourTickets: 'Vé của bạn',
        changePassword: 'Đổi mật khẩu', login: 'Đăng nhập', register: 'Đăng ký', logout: 'Đăng xuất',
        mobileMenu: 'Mở menu',
      },
      footer: {
        explore: 'Khám phá', home: 'Trang chủ', halloween: 'Giới thiệu Halloween 2026', story: 'Câu chuyện nhà ma', archive: 'Lưu trữ các mùa Halloween',
        event: 'Về sự kiện', eventIntro: 'Giới thiệu sự kiện', overview: 'Tổng quan sự kiện', timeline: 'Timeline / Agenda',
        ticketsSupport: 'Vé & hỗ trợ', buyTickets: 'Mua vé', myTickets: 'Vé của tôi', faq: 'Câu hỏi thường gặp', contact: 'Liên hệ',
        organizers: 'Ban tổ chức', coreTeam: 'Đội Core Sự kiện', pdp: 'PDP FPTU Hà Nội', club: 'FPTU Board Game Club', fanpage: 'Fanpage',
        legal: 'Pháp lý', dataPolicy: 'Chính sách dữ liệu', terms: 'Điều khoản sử dụng', ticketPolicy: 'Chính sách vé',
        account: 'Tài khoản', login: 'Đăng nhập', register: 'Đăng ký', profile: 'Hồ sơ cá nhân',
        homeAria: 'Về trang chủ FPTU Halloween', contactInfo: 'Thông tin liên hệ', address: 'Trường Đại học FPT',
        addressDetail: 'Khu CNC Hòa Lạc, Km29 Đại lộ Thăng Long, Hà Nội', connect: 'Kết nối với chúng tôi',
        copyright: 'Bản quyền © 2019-{{year}}. Bảo lưu mọi quyền.',
        developedBy: 'Phát triển bởi MINH ĐẶNG - Trưởng ban Media & Design thích làm thợ code',
      },
    },
  },
  en: {
    translation: {
      header: {
        tickerFallback: 'Welcome to FPTU Halloween! Get ready for the most thrilling night of the year!',
        newsLabel: 'Event announcements', darkMode: 'Enable dark mode', lightMode: 'Enable light mode', buyTicket: 'BUY TICKETS',
      },
      nav: {
        home: 'HOME', introduce: 'ABOUT', introduceGeneral: 'Overview', boardGameClub: 'About FPTU Board Game Club',
        pdp: 'About PDP - FPTU Hanoi Personal Development Program', hauntedHouse: 'HALLOWEEN HAUNTED HOUSE',
        story: 'The story', tickets: 'Buy tickets', btc: 'ABOUT FPTU HALLOWEEN TEAM', contact: 'CONTACT',
        management: 'MANAGEMENT', feedback: 'FEEDBACK', cart: 'Your cart', cartTickets: '{{count}} tickets in your cart',
        account: 'Account', hello: 'Hello {{name}}', yourAccount: 'Your account', yourTickets: 'Your tickets',
        changePassword: 'Change password', login: 'Log in', register: 'Register', logout: 'Log out', mobileMenu: 'Open menu',
      },
      footer: {
        explore: 'Explore', home: 'Home', halloween: 'FPTU Halloween 2026', story: 'Haunted house story', archive: 'Halloween archive',
        event: 'The event', eventIntro: 'Event introduction', overview: 'Event overview', timeline: 'Timeline / Agenda',
        ticketsSupport: 'Tickets & support', buyTickets: 'Buy tickets', myTickets: 'My tickets', faq: 'Frequently asked questions', contact: 'Contact',
        organizers: 'Organizers', coreTeam: 'Event Core Team', pdp: 'PDP FPTU Hanoi', club: 'FPTU Board Game Club', fanpage: 'Fanpage',
        legal: 'Legal', dataPolicy: 'Data policy', terms: 'Terms of use', ticketPolicy: 'Ticket policy',
        account: 'Account', login: 'Log in', register: 'Register', profile: 'Personal profile',
        homeAria: 'Go to FPTU Halloween homepage', contactInfo: 'Contact information', address: 'FPT University',
        addressDetail: 'Hoa Lac Hi-Tech Park, Km29 Thang Long Boulevard, Hanoi', connect: 'Connect with us',
        copyright: 'Copyright © 2019-{{year}}. All rights reserved.',
        developedBy: 'Developed by MINH ĐẶNG - Media & Design Lead who loves to code',
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem('language') || 'vi',
  fallbackLng: 'vi',
  interpolation: { escapeValue: false },
});

i18n.on('languageChanged', (language) => localStorage.setItem('language', language));

export default i18n;
