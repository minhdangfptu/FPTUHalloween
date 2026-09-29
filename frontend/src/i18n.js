import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ja from './locales/ja.js';

const resources = {
  vi: {
    translation: {
      ticketHero: { titleBefore: 'Mua vé nhà ma', titleAfter: 'ngay hôm nay.', intro: 'Một trải nghiệm kinh dị. Ba ngày để lựa chọn. Chọn ngày bạn muốn bước vào Nhà Ma.', note: 'Vé điện tử được lưu sau khi mua thành công', sectionKicker: 'CỬA HÀNG VÉ', sectionTitle: 'Chọn ngày tham gia', filterLabel: 'Lọc theo ngày' },
      header: {
        tickerFallback: 'Chào mừng bạn đến với FPTU Halloween! Hãy sẵn sàng cho đêm hội kinh hoàng và bùng nổ nhất năm!', switchToEnglish: 'English', switchToVietnamese: 'Tiếng Việt',
        newsLabel: 'Thông báo sự kiện',
        darkMode: 'Bật dark mode',
        lightMode: 'Bật light mode',
        buyTicket: 'MUA VÉ NGAY',
      },
      nav: {
        home: 'TRANG CHỦ', introduce: 'GIỚI THIỆU', introduceGeneral: 'Giới thiệu chung', news: 'Tin tức',
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
        developedBy: 'Phát triển bởi MINH ĐẶNG hẹ hẹ',
      },
      profilePage: { loading: 'Đang tải dữ liệu...', updateLoading: 'Đang cập nhật thông tin...', user: 'Người dùng FPTU', notUpdated: 'Chưa cập nhật', expired: 'Đã hết thời gian', remaining: 'Còn lại {{time}}', pending: 'Chờ thanh toán', processing: 'Đang xử lý', paid: 'Đã thanh toán', cancelled: 'Đã huỷ', detailsTab: 'Chi tiết Người dùng', cancelEdit: 'Hủy chỉnh sửa', edit: 'Chỉnh sửa', delete: 'Xóa tài khoản', deleteUnavailable: 'Xóa tài khoản chưa được hỗ trợ.', disabled: 'Đã vô hiệu hóa', active: 'Đang hoạt động', phone: 'Số điện thoại', details: 'Thông tin chi tiết', verified: 'Đã xác minh', unverified: 'Chưa xác minh', save: 'Lưu thay đổi', orders: 'Đơn hàng của bạn', ordersIntro: 'Theo dõi và xem lại các đơn hàng đã đặt.', filterStatus: 'Lọc trạng thái', filterOrderStatus: 'Lọc trạng thái đơn hàng', all: 'Tất cả', fullName: 'Họ và tên', email: 'Email', joined: 'Ngày tham gia', department: 'Ban Sự kiện', position: 'Chức vụ', authMethod: 'Phương thức đăng nhập', verificationStatus: 'Trạng thái xác minh', orderCode: 'Mã đơn', orderDate: 'Ngày đặt', product: 'Sản phẩm', total: 'Tổng tiền', status: 'Trạng thái', action: 'Thao tác', noOrders: 'Bạn chưa có đơn hàng nào.', tickets: '{{count}} vé', continuePayment: 'Tiếp tục thanh toán', viewTicket: 'Xem vé', unknown: 'Chưa xác định', digitalTickets: 'Vé điện tử của bạn', noTickets: 'Bạn chưa có vé điện tử nào.', ticketFallback: 'Vé FPTU Halloween', ticketStatus: 'Trạng thái: {{status}}', viewQr: 'Xem mã QR', qrPending: 'Chưa phát hành mã QR', googleAccount: 'Tài khoản Google', emailAccount: 'Tài khoản Email' },
      components: { ticketOrder: 'Đơn hàng #{{code}}', eTickets: 'Vé điện tử của bạn', close: 'Đóng', noIssuedTickets: 'Chưa có vé được phát hành cho đơn hàng này.', loadTicketsError: 'Không thể tải danh sách vé của đơn hàng.', ticketFallback: 'Vé FPTU Halloween', notUpdated: 'Chưa cập nhật', ticketPrice: 'Giá vé: {{price}}', ticketStatus: 'Trạng thái: {{status}}', unknown: 'Chưa xác định', viewQr: 'Xem mã QR', qrPending: 'Chưa phát hành mã QR', qrTitle: 'Mã QR vé điện tử', qrHelp: 'Đưa mã này cho BTC để kiểm tra vé.', logoutTitle: 'Đăng xuất', logoutDescription: 'Bạn đang rời đi<br />Bạn chắc chắn chứ?', logoutCancel: 'Không, đùa chút thôi', logoutConfirm: 'Đúng, đăng xuất cho tôi', creatingTicket: 'Đang tạo loại vé...', addTicket: 'Thêm loại vé', ticketType: 'Loại vé', ticketName: 'Tên loại vé', ticketPriceLabel: 'Giá vé', date: 'Ngày', time: 'Giờ', availableQuantity: 'Số vé còn lại', totalQuantity: 'Tổng số vé', model3d: 'Mô hình 3D', cancel: 'Hủy', saving: 'Đang lưu...', create: 'Tạo loại vé', system: 'Hệ thống quản lý sự kiện', developing: 'Tính năng đang được phát triển', adminProfile: 'Hồ sơ người dùng', active: 'Đang hoạt động', disabled: 'Đã vô hiệu hóa', unknownRole: 'Chưa xác định', fullName: 'Họ và tên', username: 'Tên người dùng', email: 'Email', phone: 'Số điện thoại', authMethod: 'Phương thức đăng nhập', department: 'Phòng ban', position: 'Vị trí', verified: 'Đã xác thực', unverified: 'Chưa xác thực', created: 'Ngày tạo', updated: 'Cập nhật', enableAccount: 'Gỡ vô hiệu hóa', disableAccount: 'Vô hiệu hóa tài khoản', expandSidebar: 'Mở rộng sidebar', collapseSidebar: 'Thu gọn sidebar', manageTitle: 'Hệ thống quản lý và điều hành sự kiện FPTU Halloween Toàn cầu', unreadMessages: 'Thông báo tin nhắn chưa đọc', messengerStatus: 'Thường trả lời ngay lập tức', messengerGreeting: 'Xin chào!', messengerHelp: 'FPTUHalloween có thể giúp gì cho bạn hôm nay?', messengerChat: 'Chat trên Messenger', openChat: 'Mở khung chat', openFaq: 'Mở trang câu hỏi thường gặp', faq: 'Câu hỏi thường gặp', menu: 'Menu', management: 'QUẢN TRỊ', feedback: 'Đánh giá', account: 'Tài khoản', yourAccount: 'Tài khoản của bạn', yourTickets: 'Vé của bạn', changePassword: 'Đổi mật khẩu', logout: 'Đăng xuất', admin: 'Quản trị viên', staff: 'Thành viên', manageNavigation: 'Điều hướng quản trị', avatarAlt: 'Ảnh đại diện', greeting: 'Xin chào {{name}}', dashboard: 'Tổng quan', chat: 'HolaWeen Chat', checkIn: 'Checkin vé', users: 'Quản lý người dùng', ticketTypes: 'Danh sách loại vé', purchasedTickets: 'Danh sách vé đã mua', orders: 'Đơn hàng', contacts: 'Liên hệ', hotNews: 'Thêm thông báo', feedbackManagement: 'Phản hồi sự kiện', eventHome: 'Về trang sự kiện' },
      archive: { eyebrow: 'FPTU HALLOWEEN · LƯU TRỮ', heroTitle: 'Những mùa lễ hội,', heroTitleAfter: 'những thế giới khác.', heroLede: 'Một kho lưu trữ những concept đã tạo nên ký ức Halloween FPTU.', viewArchive: 'Xem kho lưu trữ', milestone: 'Dấu mốc', archiveTitle: 'Từ khu rừng ma', archiveTitleAfter: 'đến thị trấn điều ước.', archiveLede: 'Chọn một mùa Halloween để đọc lại concept và câu chuyện phía sau sự kiện.', readConcept: 'Đọc concept {{title}}', comingSoon: 'Sắp ra mắt', year: 'Năm', time: 'Thời gian', location: 'Địa điểm', scale: 'Quy mô', readConceptShort: 'Đọc concept', dialogKicker: 'Kho concept', concept: 'Concept', closeConcept: 'Đóng concept', eventInfo: 'Thông tin {{title}}', event6Status: 'Sắp diễn ra', event6Date: '27/10/2026 - 29/10/2026', event6Location: 'Sân trước tòa nhà Delta, Đại học FPT Hà Nội (Haunted House in Delta Building)', event6Scale: 'Đang cập nhật', event1Status: 'Đã kết thúc', event1Location: 'Đường 30m Đại học FPT Hà Nội (Nhà ma trong tòa Delta)', event1Scale: 'Đang cập nhật', event2Status: 'Đã kết thúc', event2Location: 'Đường 30m Đại học FPT Hà Nội (Nhà ma trong tòa Delta)', event2Scale: 'Đang cập nhật', event3Status: 'Đã kết thúc', event3Location: 'Sân trước tòa nhà Delta, Đại học FPT Hà Nội (Haunted House in Delta Building)', event3Scale: 'Đang cập nhật', event4Status: 'Đã kết thúc', event4Location: 'Sân trước tòa nhà Delta', event4Scale: 'Đang cập nhật', event5Status: 'Đã kết thúc', event5Location: 'Đang cập nhật', event5Scale: 'Đang cập nhật' },
      feedbackPage: { requiredQuestion: 'Vui lòng trả lời câu hỏi {{order}}.', loading: 'Đang mở sổ phản hồi…', errorTitle: 'Cuốn sổ đang khép lại', retry: 'Thử lại', emptyTitle: 'Chưa có biểu mẫu đang mở', emptyText: 'Ban tổ chức sẽ mở sổ phản hồi trong khung thời gian phù hợp.', submittedLabel: 'ĐÃ GHI NHẬN', submittedTitle: 'Cảm ơn bạn đã để lại dấu vết.', submittedText: 'Phản hồi của bạn đã được gửi vào kho lưu trữ của mùa sự kiện.', review: 'Xem lại phản hồi', staffAudience: 'nội bộ vận hành', attendeeAudience: 'người tham dự', eyebrow: 'Phản hồi, đánh giá sự kiện', descriptionFallback: 'Một vài dòng thật lòng để mùa Halloween sau được tổ chức tốt hơn.', open: 'Đang mở', until: 'đến', chooseForm: 'Chọn biểu mẫu', openForm: 'Biểu mẫu đang mở', questions: '{{count}} câu hỏi', answered: '{{count}} đã trả lời', required: 'Bắt buộc', rating: '{{count}} sao', placeholder: 'Viết điều bạn thật sự nghĩ…', savedWithRole: 'Phản hồi sẽ được lưu cùng vai trò {{role}} của bạn.', sending: 'Đang gửi…', submit: 'Gửi phản hồi' },
      normal: {
        overall: { location: 'Đường 30m Đại học FPT Hà Nội (Nhà ma trong tòa Delta)', draft: 'Bản nháp', upcoming: 'Sắp diễn ra', ended: 'Đã kết thúc', cancelled: 'Đã hủy', viewEvent: 'Xem thông tin sự kiện', noImage: 'Không có hình ảnh', noImageAvailable: 'Chưa có hình ảnh', intro: 'Giới thiệu', information: 'Thông tin', registration: 'Đăng ký', eventConcept: 'Concept sự kiện', eventDetails: 'Chi tiết sự kiện', noDescription: 'Chưa có mô tả chi tiết cho sự kiện này.', eventInformation: 'Thông tin sự kiện', eventYear: 'Năm tổ chức', time: 'Thời gian', locationLabel: 'Địa điểm', unknown: 'Chưa xác định', registerToAttend: 'Đăng ký tham gia', registrationOpen: 'Sự kiện đang mở đăng ký game chặng. Nhấn vào nút bên dưới để đăng ký tham gia game chặng sự kiện.', registerNow: 'Đăng ký ngay', registrationEnded: 'Sự kiện đã kết thúc. Không thể đăng ký.', registrationCancelled: 'Sự kiện đã bị hủy.', registrationNotOpen: 'Sự kiện chưa mở đăng ký.', quickInformation: 'Thông tin nhanh', eventStatus: 'Trạng thái sự kiện', organizer: 'Câu lạc bộ Tổ chức', concept: '😈 Mỗi đêm, thị trấn ma quái Wishbound xuất hiện giữa màn sương. Joker đánh tráo điều ước, nuốt chửng linh hồn và biến hy vọng thành lời nguyền. Người bước vào phải đặt cược linh hồn giữa bốn vùng đất tội lỗi. Bạn sẽ chiến thắng hay bị phong ấn?', description: '🎃 FPTU Halloween là sự kiện Halloween thường niên của FPTU Hà Nội với nhà ma, khu game, khu ẩm thực đêm và sân khấu nghệ thuật. Cuộc thi hóa trang GLORIOUS trao thưởng cho những bộ trang phục ấn tượng.' },
        home: {
          heroAlt: 'Không gian FPTU Halloween', lockupAlt: 'FPT University, PDP, FPTU Board Game Club và FPTU Halloween 2026',
          eyebrow: 'CHỦ ĐỀ NĂM · SẮP RA MẮT', slogan: 'AI SỢ THÌ ĐI VỀ', subSlogan: 'Hòa Lạc không ngủ.',
          lede: 'Một mùa Halloween mới đang được mở khóa tại FPTU Hà Nội.', buy: 'Mua vé', explore: 'Xem sự kiện',
          countdownDone: 'Đã đến ngày diễn ra', countdownLeft: 'Thời gian còn lại', days: 'Ngày', hours: 'Giờ', minutes: 'Phút', seconds: 'Giây',
          concept: 'Một concept đủ gần để chạm vào, đủ lạ để nhớ.', conceptLead: 'FPTU Halloween 2026 là nơi câu chuyện, âm nhạc và những cuộc gặp bất ngờ cùng tồn tại trong một đêm.', conceptBody: 'Chọn một lối đi, nhập vai theo cách của bạn và để những chi tiết nhỏ dẫn đường. Nội dung năm nay sẽ được cập nhật dần trong thời gian tới.',
          highlights: 'Điểm nổi bật', highlightsIntro: 'Những điểm dừng tạo nên toàn bộ nhịp điệu của đêm hội.', timeline: 'Timeline chương trình', timelineNote: 'Lịch trình chi tiết sẽ được công bố khi chương trình hoàn tất các mốc chuẩn bị.', map: 'Map preview', mapCaption: 'Sơ đồ minh họa · cập nhật sau', sponsors: 'Nhà tài trợ', sponsorsNote: 'Danh sách đối tác đồng hành sẽ được cập nhật.',
          highlightTitles: ['Nhà ma', 'Những Zone check-in', 'Cosplay', 'Photobooth', 'Tarot', 'Main stage', 'Lucky draw'],
          highlightDescriptions: ['Một tuyến trải nghiệm nhập vai, nơi mỗi cánh cửa mở ra một lớp chuyện mới.', 'Những góc check-in mang đậm dấu ấn Halloween, nơi bạn lưu giữ khoảnh khắc riêng.', 'Hóa thân theo chủ đề năm và bước vào một đêm Halloween có dấu ấn riêng.', 'Một góc lưu lại outfit, hội bạn và những khoảnh khắc không lặp lại.', 'Một trải nghiệm bói Tarot bí ẩn, hé lộ những điều đang chờ bạn phía trước.', 'Kịch sân khấu, những màn trình diễn cuốn hút và DJ sôi động khuấy động không khí đêm hội.', 'Quà tặng và những bất ngờ nhỏ khép lại hành trình của bạn tại lễ hội.'],
          timelineTitles: ['Mở cổng', 'Khám phá', 'Lên sân khấu', 'Khép đêm'],
          timelineDescriptions: ['Đón khách, check-in và nhận thông tin hành trình.', 'Nhà ma, game zone, photobooth và các hoạt động bên lề.', 'Tiết mục, khách mời và những màn tương tác theo chủ đề.', 'Lucky draw, quà tặng và lời hẹn cho mùa Halloween tiếp theo.'],
          welcome: 'Xin chào {{name}}!', mainGate: 'MAIN GATE', hauntedHouse: 'NHÀ MA', sponsorsAlt: 'Logo {{name}}',
        },
        faq: {
          eyebrow: 'FPTU Halloween · Hỏi đáp', title: 'Giải đáp trước giờ vào cổng', intro: 'Từ lúc chọn vé, thanh toán bằng QR đến lúc check-in — mọi điều cần biết đều ở đây.', tickets: 'Xem loại vé', support: 'Cần hỗ trợ?', important: 'Thông tin quan trọng', importantText: 'Vé chỉ hợp lệ khi đơn đã thanh toán và mã QR được phát hành.', quickInfo: 'Thông tin nhanh', beforeAsk: 'Trước khi bạn hỏi', railTitle: 'Những điều cần lưu ý trước giờ G', railIntro: 'Lưu lại ba điều này để hành trình mua vé và vào cổng diễn ra gọn gàng.', ticketDate: 'Ngày trên vé', ticketDateText: 'Check-in đúng ngày đã chọn', qrTime: '15 phút', qrTimeText: 'Thời hạn của mã QR thanh toán', location: 'Đại học FPT Hà Nội', locationText: 'Khu CNC Hòa Lạc', readTickets: 'Đọc chính sách vé', dataPolicy: 'Chính sách dữ liệu', answer: 'Giải đáp', noAnswer: 'Không thấy câu trả lời?', noAnswerText: 'Ban tổ chức sẵn sàng kiểm tra cùng bạn.', contact: 'Liên hệ ban tổ chức',
          groups: ['Vé & mua hàng', 'Thanh toán & đơn hàng', 'Nhận vé & check-in', 'Tài khoản & hỗ trợ'],
          questions: [['Mua vé bắt đầu từ đâu?', 'Mở Danh sách vé, chọn loại vé còn bán, số lượng rồi thêm vào giỏ. Bạn cần đăng nhập để sử dụng giỏ hàng và tiếp tục thanh toán.', 'Tôi có thể mua mấy vé?', 'Bạn có thể chọn số lượng là số nguyên dương, tối đa theo số vé còn lại của từng loại. Hệ thống sẽ báo lỗi nếu số lượng vượt quá tồn vé.', 'Có thể đổi ngày vé không?', 'Mỗi loại vé gắn với một ngày và mốc giờ cụ thể. Hãy kiểm tra thông tin trước khi thanh toán; việc đổi hoặc hoàn tiền được xử lý theo chính sách vé và tình trạng đơn hàng.'], ['Thanh toán bằng cách nào?', 'Sau khi xác nhận thông tin người mua, hệ thống tạo mã QR VietQR qua PayOS. Bạn chuyển khoản đúng số tiền và nội dung hiển thị trên màn hình thanh toán.', 'Mã QR thanh toán có hạn bao lâu?', 'Mã QR có thời hạn 15 phút. Khi hết hạn, đơn chưa thanh toán sẽ được đóng và bạn cần tạo lại phiên thanh toán từ giỏ hàng.', 'Thanh toán xong nhưng chưa thấy vé?', 'Hệ thống tự kiểm tra trạng thái PayOS và webhook sẽ xác nhận giao dịch. Nếu màn hình chưa cập nhật, hãy kiểm tra lại trong Tài khoản của bạn sau ít phút và giữ lại mã đơn hàng.', 'Đơn chưa thanh toán có hủy được không?', 'Bạn có thể hủy đơn đang chờ thanh toán trên màn hình QR. Đơn đã thanh toán không thể hủy trực tiếp bằng thao tác này; hãy liên hệ ban tổ chức để được kiểm tra.'], ['Vé điện tử nằm ở đâu?', 'Sau khi đơn được thanh toán, mở Vé của bạn để xem từng vé và mã QR. Hãy đăng nhập đúng tài khoản đã dùng khi mua.', 'Mã QR có dùng lại được không?', 'Không. Mỗi mã QR chỉ được check-in một lần. Sau khi sử dụng, vé chuyển sang trạng thái đã check-in và không thể xác nhận lại.', 'Tôi check-in vào ngày nào?', 'Bạn chỉ có thể check-in vào đúng ngày ghi trên loại vé. Nhân sự tại cổng sẽ quét mã QR và đối chiếu thông tin vé trước khi xác nhận.', 'Điểm tổ chức ở đâu?', 'Sự kiện diễn ra tại Trường Đại học FPT Hà Nội, khu CNC Hòa Lạc. Vui lòng xem thông báo chính thức và thông tin trên vé trước ngày tham dự.'], ['Vì sao tôi cần xác nhận email?', 'Tài khoản mới cần xác nhận OTP qua email trước khi đăng nhập. Email cũng được dùng để nhận thông tin người mua và hỗ trợ đối soát đơn hàng.', 'Quên mật khẩu thì làm gì?', 'Chọn Quên mật khẩu tại màn hình đăng nhập, nhập email và hoàn tất bước OTP để đặt mật khẩu mới.', 'Thanh toán lỗi cần làm gì?', 'Không tạo nhiều giao dịch liên tiếp. Hãy kiểm tra số tiền, nội dung chuyển khoản và trạng thái đơn; nếu vẫn lỗi, lưu mã đơn hàng rồi liên hệ ban tổ chức.', 'Liên hệ ban tổ chức ở đâu?', 'Gửi yêu cầu qua trang Liên hệ hoặc email fptuhalloween@gmail.com. Khi cần hỗ trợ đơn, hãy gửi kèm email tài khoản và mã đơn hàng.']],
        },
        policy: { ticketEyebrow: 'Mua vé rõ ràng', ticketTitle: 'Chính sách vé', ticketIntro: 'Một vài điều quan trọng giúp bạn mua, nhận và sử dụng vé thuận lợi trong ngày diễn ra sự kiện.', dataEyebrow: 'Thông tin minh bạch', dataTitle: 'Chính sách bảo mật dữ liệu', dataIntro: 'Chúng tôi tôn trọng quyền riêng tư và chỉ sử dụng thông tin cần thiết để vận hành trải nghiệm FPTU Halloween.', termsEyebrow: 'Thỏa thuận sử dụng', termsTitle: 'Điều khoản sử dụng', termsIntro: 'Khi truy cập website hoặc sử dụng dịch vụ của FPTU Halloween, bạn đồng ý với các điều khoản dưới đây.', note: 'Việc tiếp tục sử dụng website đồng nghĩa với việc bạn đã đọc và hiểu các nội dung trên.', contactNote: 'Nếu chưa tìm thấy câu trả lời, hãy gửi yêu cầu qua trang Liên hệ.', dataNote: 'Thông tin trên trang này giúp bạn hiểu cách chúng tôi vận hành dữ liệu. Nếu cần làm rõ, hãy liên hệ Ban tổ chức.', ticketSections: [['1. Mua và thanh toán', 'Vé được ghi nhận sau khi đơn hàng thanh toán thành công. Vui lòng kiểm tra thông tin người mua và loại vé trước khi hoàn tất giao dịch.'], ['2. Nhận và sử dụng vé', 'Mã QR được phát hành cho vé hợp lệ. Mỗi mã chỉ được sử dụng một lần và cần được xuất trình tại cổng check-in theo hướng dẫn của Ban tổ chức.'], ['3. Đổi, huỷ và hoàn tiền', 'Việc đổi hoặc hoàn tiền được thực hiện theo thông báo của chương trình và tình trạng của từng đơn hàng. Vé đã check-in hoặc đã hết hạn không thể sử dụng lại.'], ['4. Hỗ trợ', 'Nếu thông tin vé có sai lệch hoặc bạn gặp vấn đề khi thanh toán, hãy lưu lại mã đơn hàng và liên hệ Ban tổ chức để được kiểm tra.']], termsSections: [['1. Sử dụng website', 'Bạn cam kết cung cấp thông tin chính xác, không sử dụng website cho mục đích gian lận, gây hại hoặc làm gián đoạn hệ thống.'], ['2. Tài khoản người dùng', 'Bạn chịu trách nhiệm bảo mật thông tin đăng nhập và mọi hoạt động phát sinh từ tài khoản của mình. Hãy thông báo ngay cho Ban tổ chức nếu phát hiện truy cập bất thường.'], ['3. Nội dung và thương hiệu', 'Nội dung, hình ảnh và dấu hiệu nhận diện trên website thuộc phạm vi quản lý của đơn vị tổ chức. Việc sao chép hoặc sử dụng lại cần được cho phép.'], ['4. Thay đổi dịch vụ', 'Ban tổ chức có thể cập nhật nội dung, lịch trình hoặc tính năng website khi cần. Các thay đổi quan trọng sẽ được thông báo qua kênh phù hợp.']], dataSections: [['1. Thông tin chúng tôi thu thập', 'Khi bạn đăng ký, mua vé hoặc liên hệ, chúng tôi có thể tiếp nhận họ tên, email, số điện thoại và thông tin giao dịch cần thiết.', 'Mã vé và dữ liệu check-in được dùng để xác thực quyền tham dự sự kiện.'], ['2. Mục đích sử dụng', 'Thông tin được dùng để xử lý đơn hàng, phát hành vé, hỗ trợ người tham gia, gửi thông báo cần thiết và bảo đảm an toàn tại sự kiện.'], ['3. Bảo vệ và lưu trữ', 'Dữ liệu được giới hạn quyền truy cập theo vai trò và được lưu trữ trong thời gian phù hợp với mục đích vận hành, đối soát và nghĩa vụ liên quan.'], ['4. Quyền của bạn', 'Bạn có thể yêu cầu xem, cập nhật hoặc giải đáp về dữ liệu của mình bằng cách liên hệ Ban tổ chức qua kênh Liên hệ.']] },
        contact: { title: 'GÓP Ý - PHẢN HỒI', heading: 'Góp ý cho chúng tôi', description: 'Chúng tôi luôn sẵn sàng lắng nghe mọi ý kiến đóng góp của bạn để phát triển sự kiện ngày càng tốt hơn.', name: 'Tên của bạn', phone: 'Số điện thoại', email: 'Email', subject: 'Tiêu đề', content: 'Nội dung', submit: 'Gửi ý kiến', sending: 'Đang gửi thông tin...', required: '{{field}} là bắt buộc', invalid: '{{field}} không hợp lệ', address: 'Địa chỉ', organizer: 'Trưởng Ban Tổ Chức', communications: 'Trưởng Ban Truyền thông' },
        btc: { kicker: 'Đằng sau cánh gà nhà ma', titleBefore: 'Những người', titleAfter: 'làm nên', intro: 'Một tập thể đứng sau từng trải nghiệm của FPTU Halloween — từ ý tưởng đầu tiên đến khoảnh khắc cánh cửa Nhà Ma mở ra.', about: 'Về chúng tôi', introLabel: 'Giới thiệu BTC', introTitle: 'Không chỉ là một', introTitleAfter: 'sự kiện Halloween.', introText: 'FPTU Halloween là nơi những câu chuyện kinh dị, trải nghiệm nhập vai và tinh thần sinh viên gặp nhau. Để tạo nên một mùa lễ hội trọn vẹn, Core Team cùng các ban đã phối hợp như một hệ thống duy nhất.', introMuted: 'Mỗi người góp một vai trò riêng. Cùng nhau, chúng tôi biến những bản phác thảo thành trải nghiệm thật.', groupPhoto: 'Ảnh tập thể', groupTitle: 'Một tập thể,', groupTitleAfter: 'một dấu ấn.', groupAlt: 'Ảnh tập thể FPTU Halloween', groupCaption: 'FPTU Halloween · Những người đứng sau sự kiện', organization: 'Cơ cấu tổ chức', organizationTitle: 'Một đội ngũ.', organizationTitleAfter: 'Nhiều nhịp đập.', organizationIntro: 'Gặp gỡ những thành viên đứng sau từng mảnh ghép của FPTU Halloween 2026.', boardTitle: 'Ban tổ chức HLW26', departmentsLabel: 'Các ban trong ban tổ chức', greeting: 'Lời chào', closingTitle: 'Hẹn gặp bạn', closingTitleAfter: 'trong bóng tối.', closingText: 'Cảm ơn bạn đã quan tâm đến những người đứng sau FPTU Halloween. Nếu cần kết nối với ban tổ chức, chúng mình luôn sẵn sàng lắng nghe.', contact: 'Liên hệ ban tổ chức', pendingEmail: 'Email đang cập nhật', avatarAlt: 'Ảnh đại diện của {{name}}', roles: { chair: 'Trưởng ban Tổ chức · Trưởng ban Đối Ngoại', hr: 'HR', hauntedLead: 'Trưởng ban Nhà Ma', hauntedDeputy: 'Phó ban Nhà Ma', mediaLead: 'Trưởng ban Truyền Thông', mediaDeputy: 'Phó ban Truyền Thông', contentLead: 'Trưởng ban Nội Dung', cultureLead: 'Trưởng ban Văn thể', contentDeputy: 'Phó ban Nội Dung', logisticsLead: 'Trưởng ban Hậu Cần', logisticsDeputy: 'Phó ban Hậu Cần', careLead: 'Trưởng ban Take Care', careDeputy: 'Phó ban Take Care', mediaTeamLead: 'Trưởng ban Media', designLead: 'Trưởng ban Design', designDeputy: 'Phó ban Design' }, hierarchy: { chair: 'Tổng phụ trách', hr: 'Điều phối nhân sự', lead: 'Trưởng ban', sublead: 'Phó ban / Phó ban' }, departments: ['Đối Ngoại', 'HR', 'Media', 'Design', 'Nội Dung', 'Hậu Cần', 'Take Care', 'Nhà Ma', 'Truyền Thông', 'Văn thể'] },
      },
      pages: { errors: { backHome: 'Về trang chủ', back: 'Quay lại', forbiddenTitle: 'Cửa này không dành cho tài khoản của bạn.', forbiddenDescription: 'Bạn đã đăng nhập, nhưng tài khoản hiện tại không có quyền mở đường dẫn này.', notFoundTitle: 'Trang này không có trong bản đồ.', notFoundDescription: 'Đường dẫn không trỏ tới một trang đang được mở trong FPTU Halloween.', illustrationAlt: 'Minh hoạ chiếc nồi bị lạc giữa vùng màu đỏ' }, payment: { checking: 'Đang xác nhận thanh toán', success: 'Thanh toán thành công', waiting: 'Đang chờ xác nhận', checkingText: 'Hệ thống đang kiểm tra giao dịch và phát hành vé điện tử.', successText: 'Vé điện tử của bạn đã được phát hành thành công.', waitingText: 'Giao dịch chưa hoàn tất. Vui lòng chờ webhook hoặc thử lại sau.', myTickets: 'Xem vé của tôi', home: 'Về trang chủ', notConfirmed: 'Thanh toán chưa được xác nhận hoàn tất.', statusError: 'Không thể kiểm tra trạng thái đơn hàng.' } },
      ticket: { loadingList: 'Đang tải danh sách vé...', loadingDetail: 'Đang tải chi tiết vé...', loadingPayment: 'Đang tải thông tin thanh toán...', retry: 'Thử lại', backStore: 'Quay lại cửa hàng vé', backCart: 'Quay lại giỏ vé', backCheckout: 'Quay lại xác nhận đơn', buy: 'Mua ngay', addCart: 'Thêm vào giỏ hàng', adding: 'Đang thêm...', active: 'Đang mở bán', paused: 'Tạm ngưng', unavailable: 'Vé không còn được bán', soldOut: 'Hết vé', updating: 'Đang cập nhật', day: 'Ngày', time: 'Giờ', price: 'Giá vé', location: 'Địa điểm', remaining: 'Còn lại', tickets: 'vé', dateSuffix: 'tháng 10, 2026', quantity: 'Số lượng vé', subtotal: 'Tạm tính', total: 'Tổng cộng', serviceFee: 'Phí dịch vụ', continue: 'Tiếp tục thanh toán', empty: 'Chưa có loại vé nào.', hauntedHouse: 'Nhà Ma Âm Dương Tử Khí', venue: 'Sảnh Toà nhà Delta (trước thư viện)', cartTitle: 'Giỏ vé của bạn', cartEmpty: 'Giỏ vé đang trống', cartEmptyText: 'Chọn một trải nghiệm Halloween để bắt đầu hành trình của bạn.', ticketList: 'Cửa hàng vé', removeAll: 'Xóa tất cả', selectAll: 'Chọn tất cả', orderSummary: 'Tóm tắt đơn hàng', checkoutNotice: 'Bạn sẽ được chuyển đến trang xác nhận thanh toán.', checkoutTitle: 'Xác nhận đơn hàng', buyerInfo: 'Thông tin người mua', buyerHint: 'Nhập thông tin để nhận vé điện tử.', fullName: 'Họ và tên', fullNamePlaceholder: 'Nhập họ và tên', phone: 'Số điện thoại', phonePlaceholder: 'Nhập số điện thoại', coupon: 'Mã giảm giá', couponHint: 'Nếu có, nhập mã ưu đãi của bạn.', couponPlaceholder: 'Nhập mã giảm giá', apply: 'Áp dụng', discount: 'Giảm giá', secure: 'Thông tin của bạn được lưu an toàn trong phiên thanh toán này.', confirmPayment: 'Xác nhận thanh toán', confirmPaymentText: 'Bạn sẽ được chuyển đến màn hình mã QR để hoàn tất thanh toán.<br />Bạn có muốn tiếp tục không?', cancel: 'Quay lại', qrCreate: 'Đang tạo mã QR thanh toán...', qrCreated: 'Tạo mã QR thanh toán thành công', qrExpired: 'Mã QR đã hết hạn. Vui lòng tạo thanh toán lại.', cancelOrder: 'Huỷ đơn hàng', canceling: 'Đang huỷ đơn...', cancelOrderText: 'Bạn muốn huỷ đơn hàng này?<br />Bạn có chắc chắn không?', keepOrder: 'Không, giữ lại đơn', confirmCancel: 'Đúng, huỷ đơn hàng', noPayment: 'Chưa có đơn thanh toán', cannotPayment: 'Không thể tạo thanh toán', scanQr: 'Quét mã để thanh toán', scanQrText: 'Hoàn tất thanh toán để nhận vé điện tử.', paymentAmount: 'Số tiền cần thanh toán', paymentTime: 'Thời gian thanh toán còn lại', bankInfo: 'Thông tin chuyển khoản', bank: 'Ngân hàng', bankName: 'MB - Ngân hàng TMCP Quân Đội', accountNumber: 'Số tài khoản', accountName: 'Tên tài khoản', transferContent: 'Nội dung chuyển khoản', paymentNotice: 'Sau khi chuyển khoản, hệ thống sẽ xác nhận và phát hành vé điện tử.', payExpired: 'Mã QR đã hết hạn', payAgain: 'Vui lòng thanh toán lại.', paymentSuccess: 'Thanh toán thành công. Vé đã được phát hành.', cancelled: 'Đã huỷ đơn hàng.', noOrders: 'Vé không còn được bán. Vui lòng quay lại giỏ hàng.', cartItemsAria: 'Các vé trong giỏ hàng', selectForPayment: 'Chọn {{name}} để thanh toán', removeTicket: 'Xóa {{name}}', dateTime: 'Ngày {{date}} tháng 10, 2026', timeUpdating: 'Thời gian sẽ được cập nhật', subtotalTickets: 'Tạm tính ({{count}} vé)', removeUnavailableWarning: 'Hãy bỏ chọn hoặc xóa vé không còn được bán trước khi thanh toán.', selectAtLeastWarning: 'Hãy chọn ít nhất một loại vé để thanh toán.', all: 'Tất cả', detail: 'Xem trải nghiệm', featureExperience: 'Trải nghiệm Nhà Ma', featurePersonal: 'Vé điện tử cá nhân', featureEventDay: 'Dùng trong ngày sự kiện', purchaseInfo: 'Thông tin mua vé', simplePurchase: 'Mua vé đơn giản', chooseDay: 'Chọn ngày bạn muốn tham gia', digitalTicket: 'Vé điện tử', receiveAfterPayment: 'Nhận vé sau khi thanh toán thành công', oneTicket: 'Một vé, một kỷ niệm', useOnEventDay: 'Lưu vé để sử dụng trong ngày sự kiện', status: 'Trạng thái', includes: 'Vé của bạn bao gồm', experience: 'Quyền tham gia trải nghiệm Nhà Ma', personalTicket: 'Vé điện tử cá nhân', selectedDay: 'Sử dụng trong đúng ngày đã chọn', decrease: 'Giảm số lượng', increase: 'Tăng số lượng', detailNote: 'Bạn sẽ được chuyển đến bước xác nhận đơn hàng sau khi chọn mua.', couponApplied: 'Mã giảm giá đã được áp dụng.', couponInvalid: 'Mã giảm giá không hợp lệ hoặc đã hết hạn.', stepOne: 'Bước 1 / 2', stepTwo: 'Bước 2 / 2', emailNotice: 'Lưu ý: Hãy kiểm tra địa chỉ Email thật kĩ vì chúng tôi sẽ gửi vé điện tử về địa chỉ này.', selectedTickets: 'Vé đã chọn', qrLabel: 'Mã QR thanh toán', qrAlt: 'Mã QR VietQR thanh toán PayOS', paidButton: 'Tôi đã thanh toán', loadError: 'Không thể tải danh sách vé của bạn.', wallet: 'Ví vé điện tử', qrInstruction: 'Giữ mã QR bên bạn để xuất trình khi đến sự kiện.', issued: 'vé đã phát hành', filter: 'Bộ lọc vé', displayed: 'vé đang hiển thị', filterStatus: 'Lọc trạng thái vé', allStatuses: 'Tất cả trạng thái', pending: 'Chờ sử dụng', processing: 'Đang xử lý', checked: 'Đã check-in', cancelledStatus: 'Đã huỷ', noMatching: 'Chưa có vé phù hợp', purchasedHere: 'Vé đã mua sẽ xuất hiện tại đây.', viewQr: 'Xem mã QR', qrNotIssued: 'Mã QR chưa phát hành', heroIntro: 'Nhà Ma Âm Dương Tử Khí. Chọn ngày tham gia.', searchTitle: 'Tìm vé theo lịch', searchIntro: 'Chọn ngày, giờ và địa điểm để xem các khung vé phù hợp.', searchDate: 'Ngày tham gia', searchTime: 'Giờ vào', searchLocation: 'Địa điểm', searchLocationPlaceholder: 'Nhập địa điểm', searchButton: 'Tìm kiếm', imagePlaceholder: 'Ảnh vé placeholder', imageNote: 'Khu vực hình ảnh vé' },
      auth: {
        login: { title: 'Đăng nhập', welcome: 'Chào mừng bạn trở lại với FPTU Halloween', password: 'Mật khẩu', hide: 'Ẩn mật khẩu', show: 'Hiện mật khẩu', loading: 'Đang đăng nhập...', forgot: 'Quên mật khẩu?', or: 'Hoặc', google: 'Đăng nhập với Google', clubQuestion: 'Bạn là thành viên FPTU Board Game Club?', fbgc: 'Đăng nhập với tài khoản FBGC', noAccount: 'Bạn chưa có tài khoản?', register: 'Đăng ký', googleLoading: 'Đang đăng nhập với Google...' },
        register: { title: 'Đăng ký', subtitle: 'Tạo tài khoản để tham gia FPTU Halloween', fullName: 'Họ và tên', fullNamePlaceholder: 'Nhập họ và tên', emailPlaceholder: 'Nhập email', phone: 'Số điện thoại', phonePlaceholder: 'Nhập số điện thoại', passwordPlaceholder: 'Nhập mật khẩu', confirmPassword: 'Xác nhận mật khẩu', confirmPlaceholder: 'Nhập lại mật khẩu', hide: 'Ẩn mật khẩu', show: 'Hiện mật khẩu', loading: 'Đang đăng ký...', submit: 'Đăng ký', or: 'Hoặc', google: 'Tiếp tục với Google', hasAccount: 'Đã có tài khoản?', login: 'Đăng nhập', registering: 'Đang đăng ký...', success: 'Đăng ký thành công! Đang chuyển về trang đăng nhập...', error: 'Có lỗi xảy ra khi đăng ký', required: '{{field}} là bắt buộc', invalid: '{{field}} không hợp lệ', minPassword: 'Mật khẩu phải có ít nhất 6 ký tự', passwordMismatch: 'Mật khẩu không khớp', minName: 'Họ tên phải có ít nhất 2 ký tự', googleLoading: 'Đang đăng nhập với Google...' },
        forgot: { length: 'Ít nhất 8 ký tự', weak: 'Yếu', strong: 'Mạnh', sendOtp: 'Đang gửi mã xác thực...', verifyOtp: 'Đang xác thực OTP...', reset: 'Đang đặt lại mật khẩu...', titleEmail: 'Quên mật khẩu', titleOtp: 'Xác thực OTP', titleReset: 'Đặt lại mật khẩu', subtitleEmail: 'Nhập email để nhận mã xác thực', subtitleOtp: 'Nhập mã OTP đã được gửi đến email của bạn', subtitleReset: 'Tạo mật khẩu mới cho tài khoản của bạn', emailPlaceholder: 'Nhập email', otpPlaceholder: 'Nhập mã OTP', password: 'Mật khẩu mới', passwordPlaceholder: 'Nhập mật khẩu mới', confirm: 'Nhập lại mật khẩu mới', mismatch: 'Mật khẩu xác nhận không khớp', processing: 'Đang xử lý...', send: 'Gửi mã xác thực', verify: 'Xác thực OTP', submit: 'Đặt lại mật khẩu', back: 'Quay lại đăng nhập' },
        changePassword: { old: 'Mật khẩu cũ', new: 'Mật khẩu mới', confirm: 'Xác nhận mật khẩu mới', oldPlaceholder: 'Nhập mật khẩu cũ', newPlaceholder: 'Nhập mật khẩu mới', confirmPlaceholder: 'Nhập lại mật khẩu mới', verifyOld: 'Xác minh mật khẩu cũ', enterNew: 'Nhập mật khẩu mới', verifyDescription: 'Để bảo mật tài khoản, vui lòng xác minh mật khẩu hiện tại trước', newDescription: 'Vui lòng nhập mật khẩu mới cho tài khoản của bạn', checking: 'Đang kiểm tra mật khẩu cũ...', verifying: 'Đang xác minh...', processing: 'Đang xử lý...', continue: 'Tiếp tục', confirmAction: 'Xác nhận', forgot: 'Quên mật khẩu?', backLogin: 'Quay lại đăng nhập', back: 'Quay lại', hidden: 'Ẩn mật khẩu', visible: 'Hiện mật khẩu', minLength: 'Mật khẩu phải có ít nhất 8 ký tự', mismatch: 'Mật khẩu xác nhận không khớp', weak: 'Yếu', strong: 'Mạnh', ruleLength: 'Ít nhất 8 ký tự', accountMissing: 'Không tìm thấy thông tin tài khoản', oldInvalid: 'Mật khẩu cũ không đúng. Vui lòng thử lại.' },
        fbgc: { title: 'Đăng nhập', welcome: 'Chào mừng bạn trở lại với FPTU Board Game Club', username: 'Tên đăng nhập', usernamePlaceholder: 'Nhập tên đăng nhập', passwordPlaceholder: 'Nhập mật khẩu', loading: 'Đang đăng nhập...', back: 'Quay lại trang đăng nhập FPTU Halloween' },
        confirm: { title: 'Xác thực Email', sent: 'Chúng tôi đã gửi mã xác thực đến email {{email}}', instruction: 'Vui lòng nhập mã 6 số dưới đây để hoàn tất đăng ký', code: 'Mã xác thực', placeholder: 'Nhập mã 6 số', submit: 'Xác thực', notReceived: 'Chưa nhận được mã?', sending: 'Đang gửi...', resend: 'Gửi lại mã', back: 'Quay lại', register: 'Đăng ký', success: 'Xác thực thành công! Bạn có thể đăng nhập.', invalid: 'Mã xác thực không đúng', required: 'Mã xác thực là bắt buộc', length: 'Mã xác thực phải có đúng 6 số' },
        complete: { title: 'Đăng ký thành công!', text: 'Chúc mừng! Tài khoản của bạn đã được tạo thành công.', instruction: 'Bạn có thể đăng nhập ngay bây giờ để bắt đầu trải nghiệm FPTU Halloween', login: 'Đăng nhập ngay', support: 'Cần hỗ trợ?', contact: 'Liên hệ chúng tôi' },
      },
      eventPages: {
        fanpage: { title: '🎃 FPTU Halloween 2026 – Wishbound', intro: 'Sự kiện Halloween thường niên lớn nhất tại Đại học FPT Hà Nội!', location: 'Địa điểm: Đường 30m, Khuôn viên Đại học FPT, Hòa Lạc', date: 'Thời gian: 28–31/10/2026', tickets: 'Vé: "Link vé"', contact: 'Liên hệ: fptuhalloween@gmail.com', visit: 'Truy cập ngay' },
        agenda: { kicker: 'FPTU HALLOWEEN 2026 / WISHBOUND', title: 'Lịch trình', titleAfter: 'sự kiện.', summary: 'Hai tài liệu để bạn định vị thời gian, không gian và những điểm chạm quan trọng của đêm Halloween.', section: 'Tài liệu sự kiện', heading: 'Mọi điểm chạm,', headingAfter: ' trên cùng một trang.', description: 'Lịch trình và sơ đồ sẽ được cập nhật trực tiếp vào hai khung bên dưới khi ảnh chính thức sẵn sàng.', placeholder: 'Ảnh sẽ được thêm vào', schedule: 'Lịch trình sự kiện', scheduleDescription: 'Khung placeholder cho ảnh lịch trình chương trình.', map: 'Sơ đồ sự kiện', mapDescription: 'Khung placeholder cho ảnh sơ đồ khu vực sự kiện.' },
        news: { title: 'TIN TỨC', featured: 'Tin tức nổi bật', other: 'Tin tức khác', hour: '{{count}} giờ', views: '{{count}} lượt xem', titles: ['FPTU Halloween 2026: Sự kiện Wishbound sắp diễn ra với nhiều hoạt động hấp dẫn', 'Chương trình nghệ thuật đặc sắc tại FPTU Halloween 2026', 'Hướng dẫn mua vé và tham gia sự kiện Halloween', 'Các hoạt động chính trong FPTU Halloween 2026', 'Thông tin về địa điểm và thời gian sự kiện', 'Những điều cần biết khi tham gia Halloween tại FPTU', 'Chương trình ưu đãi đặc biệt cho sinh viên FPTU', 'Cách thức đăng ký tham gia các workshop Halloween', 'Thông tin về các nhà tài trợ của sự kiện'] },
        haunted: { kicker: 'FPTU HALLOWEEN 2026 · TRANG GIỚI THIỆU', title: 'Nhà Ma', titleAfter: 'mở cửa.', intro: 'Một đêm, một lối vào và những điều không ai kể lại giống nhau.', storyLabel: '01 · Bối cảnh', storyTitle: 'Story Nhà Ma', storyText: 'Đây là phần placeholder cho câu chuyện Nhà Ma. Nội dung chính thức sẽ được cập nhật sau, kể về hành trình bước qua những căn phòng tối, các dấu vết kỳ lạ và những lựa chọn không thể quay đầu của người tham gia. Hãy để trí tưởng tượng dẫn lối, nhưng đừng quên rằng mỗi âm thanh trong đêm Halloween đều có thể là một lời cảnh báo.', trailerLabel: '02 · Không khí', trailer: 'Trailer', trailerText: 'Khung này đã sẵn sàng để thay bằng trailer video chính thức.', trailerPlaceholder: 'Trailer placeholder · video sẽ được cập nhật', imageAlt: 'Không gian Nhà Ma Halloween', rulesLabel: '03 · Trước khi bước vào', rulesTitle: 'Nội quy Nhà Ma', ticketLabel: '04 · Chọn lối vào', ticketTitle: 'Bảng giá vé Nhà Ma', ticketIntro: 'Thông tin ngày, giờ, giá vé và số lượng còn lại.', loading: 'Đang tải thông tin vé...', loaded: 'Đã tải thông tin vé thành công', retry: 'Thử lại', empty: 'Hiện chưa có vé đang mở bán.', day: 'Ngày', time: 'Giờ', price: 'Giá vé', location: 'Địa điểm', remaining: 'Còn lại', buy: 'Mua ngay', venue: 'Sảnh Tòa nhà Delta (trước thư viện)', tickets: '{{count}} vé', rules: ['Xếp hàng và làm theo hướng dẫn của Ban tổ chức trước khi vào Nhà Ma.', 'Không chạm vào đạo cụ, diễn viên hoặc tự ý mở cửa trong khu vực trải nghiệm.', 'Không sử dụng đèn flash, quay phim hoặc livestream khi chưa được cho phép.', 'Không chạy và không tách khỏi nhóm trong suốt hành trình.', 'Ban tổ chức có quyền từ chối phục vụ nếu người tham gia không tuân thủ nội quy.'] },
        hlwIntro: { kicker: 'FPTU HALLOWEEN · 2026', title: 'Giới thiệu một', titleAfter: 'đêm hội.', subtitle: 'Nơi hòa quyện niềm vui và nỗi sợ', explore: 'Khám phá', overview: 'Tổng quan', overviewTitle: 'Một sự kiện', overviewTitleAfter: 'bùng nổ nhất nhì xứ FU.', factsLabel: 'Thông tin Halloween FPTU', milestone: 'Dấu mốc', seasons: 'Các mùa Halloween', seasonsIntro: 'Những mùa lễ hội đã tạo nên ký ức và bản sắc của Halloween FPTU.', concept: 'Concept', scale: 'Quy mô', comingSoon: 'Sắp ra mắt' },
        introduceEvent: { about: 'Về sự kiện', organized: 'Được tổ chức bởi', description: 'Với những hoạt động như Nhà ma rùng rợn, sự kiện sôi động và các cuộc thi gay cấn, Halloween FPT luôn mang đến một đêm hội kỳ bí, chất lừ và đáng nhớ.', recent: 'Các sự kiện gần nhất', viewAll: 'Xem tất cả', likes: 'lượt thích', followers: 'người theo dõi', verified: 'đã xác minh' },
      },
    },
  },
  en: {
    translation: {
      ticketHero: { titleBefore: 'Buy tickets', titleAfter: 'today.', intro: 'A frightening experience. Three days to choose from. Pick the day you want to enter the Haunted House.', note: 'E-tickets are saved after a successful purchase', sectionKicker: 'TICKET STORE', sectionTitle: 'Choose your day', filterLabel: 'Filter by day' },
      header: {
        tickerFallback: 'Welcome to FPTU Halloween! Get ready for the most thrilling night of the year!',
        newsLabel: 'Event announcements', darkMode: 'Enable dark mode', lightMode: 'Enable light mode', buyTicket: 'BUY TICKETS', switchToEnglish: 'English', switchToVietnamese: 'Vietnamese',
      },
      nav: {
        home: 'HOME', introduce: 'ABOUT', introduceGeneral: 'Overview', news: 'News', boardGameClub: 'About FPTU Board Game Club',
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
        developedBy: 'Developed by MINH ĐẶNG hẹ hẹ',
      },
      profilePage: { loading: 'Loading data...', updateLoading: 'Updating information...', user: 'FPTU user', notUpdated: 'Not updated', expired: 'Time expired', remaining: '{{time}} remaining', pending: 'Awaiting payment', processing: 'Processing', paid: 'Paid', cancelled: 'Cancelled', detailsTab: 'User details', cancelEdit: 'Cancel editing', edit: 'Edit', delete: 'Delete account', deleteUnavailable: 'Account deletion is not supported yet.', disabled: 'Disabled', active: 'Active', phone: 'Phone number', details: 'Details', verified: 'Verified', unverified: 'Not verified', save: 'Save changes', orders: 'Your orders', ordersIntro: 'Track and review the orders you have placed.', filterStatus: 'Filter status', filterOrderStatus: 'Filter order status', all: 'All', fullName: 'Full name', email: 'Email', joined: 'Joined', department: 'Event department', position: 'Position', authMethod: 'Sign-in method', verificationStatus: 'Verification status', orderCode: 'Order code', orderDate: 'Order date', product: 'Product', total: 'Total', status: 'Status', action: 'Action', noOrders: 'You do not have any orders yet.', tickets: '{{count}} tickets', continuePayment: 'Continue payment', viewTicket: 'View tickets', unknown: 'Unknown', digitalTickets: 'Your e-tickets', noTickets: 'You do not have any e-tickets yet.', ticketFallback: 'FPTU Halloween ticket', ticketStatus: 'Status: {{status}}', viewQr: 'View QR code', qrPending: 'QR code not issued', googleAccount: 'Google account', emailAccount: 'Email account' },
      components: { ticketOrder: 'Order #{{code}}', eTickets: 'Your e-tickets', close: 'Close', noIssuedTickets: 'No tickets have been issued for this order.', loadTicketsError: 'Unable to load tickets for this order.', ticketFallback: 'FPTU Halloween ticket', notUpdated: 'Not updated', ticketPrice: 'Ticket price: {{price}}', ticketStatus: 'Status: {{status}}', unknown: 'Unknown', viewQr: 'View QR code', qrPending: 'QR code not issued', qrTitle: 'E-ticket QR code', qrHelp: 'Show this code to the organizers to verify your ticket.', logoutTitle: 'Log out', logoutDescription: 'You are leaving<br />Are you sure?', logoutCancel: 'No, keep me here', logoutConfirm: 'Yes, log me out', creatingTicket: 'Creating ticket type...', addTicket: 'Add ticket type', ticketType: 'Ticket type', ticketName: 'Ticket type name', ticketPriceLabel: 'Ticket price', date: 'Date', time: 'Time', availableQuantity: 'Tickets remaining', totalQuantity: 'Total tickets', model3d: '3D model', cancel: 'Cancel', saving: 'Saving...', create: 'Create ticket type', system: 'Event management system', developing: 'This feature is under development', adminProfile: 'User profile', active: 'Active', disabled: 'Disabled', unknownRole: 'Unknown', fullName: 'Full name', username: 'Username', email: 'Email', phone: 'Phone number', authMethod: 'Sign-in method', department: 'Department', position: 'Position', verified: 'Verified', unverified: 'Not verified', created: 'Created', updated: 'Updated', enableAccount: 'Enable account', disableAccount: 'Disable account', expandSidebar: 'Expand sidebar', collapseSidebar: 'Collapse sidebar', manageTitle: 'FPTU Halloween Worldwide event management and operations', unreadMessages: 'Unread message notifications', messengerStatus: 'Usually replies instantly', messengerGreeting: 'Hello!', messengerHelp: 'How can FPTUHalloween help you today?', messengerChat: 'Chat on Messenger', openChat: 'Open chat', openFaq: 'Open frequently asked questions', faq: 'Frequently asked questions', menu: 'Menu', management: 'MANAGEMENT', feedback: 'Feedback', account: 'Account', yourAccount: 'Your account', yourTickets: 'Your tickets', changePassword: 'Change password', logout: 'Log out', admin: 'Admin', staff: 'Staff', manageNavigation: 'Management navigation', avatarAlt: 'Profile picture', greeting: 'Hello {{name}}', dashboard: 'Dashboard', chat: 'HolaWeen Chat', checkIn: 'Ticket check-in', users: 'User management', ticketTypes: 'Ticket types', purchasedTickets: 'Purchased tickets', orders: 'Orders', contacts: 'Contacts', hotNews: 'Add announcement', feedbackManagement: 'Event feedback', eventHome: 'Event page' },
      archive: { eyebrow: 'FPTU HALLOWEEN · ARCHIVE', heroTitle: 'Festival seasons,', heroTitleAfter: 'different worlds.', heroLede: 'An archive of concepts that shaped FPTU Halloween memories.', viewArchive: 'View archive', milestone: 'Milestones', archiveTitle: 'From the haunted forest', archiveTitleAfter: 'to the wishbound town.', archiveLede: 'Choose a Halloween season to revisit its concept and story.', readConcept: 'Read the {{title}} concept', comingSoon: 'Coming soon', year: 'Year', time: 'Time', location: 'Location', scale: 'Scale', readConceptShort: 'Read concept', dialogKicker: 'Concept archive', concept: 'Concept', closeConcept: 'Close concept', eventInfo: 'Information about {{title}}', event6Status: 'Upcoming', event6Date: '27/10/2026 - 29/10/2026', event6Location: 'Delta Building front yard, FPT University Hanoi (Haunted House in Delta Building)', event6Scale: 'To be announced', event6Description: "Nhiều năm trước, vào đúng đêm lễ hội 𝐇𝐚𝐥𝐥𝐨𝐰𝐞𝐞𝐧, một vụ án mạng kinh hoàng đã xảy ra tại khu vui chơi 𝐁𝐮𝐧𝐧𝐲's 𝐏𝐥𝐚𝐲𝐡𝐨𝐮𝐬𝐞. Sau vụ nổ thiêu rụi toàn bộ khu vui chơi, kẻ sát nhân và mọi dấu vết của hắn cũng biến mất. Người ta tưởng rằng tất cả đã kết thúc cho đến khi những vụ mất tích và tai nạn bí ẩn liên tiếp xuất hiện tại khu vui chơi được xây dựng lại trên chính nền đất năm xưa. Đáng sợ hơn, trước mỗi vụ việc, người ta lại nhìn thấy một mascot thỏ với bộ lông cháy xém xuất hiện giữa những đống đổ nát rồi biến mất không dấu vết.\n\nĐêm 𝐇𝐚𝐥𝐥𝐨𝐰𝐞𝐞𝐧 năm nay, một tổ điều tra mật nhận được tài liệu về những hiện tượng kỳ lạ tại 𝐁𝐮𝐧𝐧𝐲's 𝐏𝐥𝐚𝐲𝐡𝐨𝐮𝐬𝐞. Họ tiến vào khu vui chơi bỏ hoang giữa rừng thông để tìm lời giải cho vụ án đã bị chôn vùi suốt nhiều năm. Nhưng ngay khi cánh cửa phía sau khép lại, họ nhận ra rằng mình không phải những người duy nhất đang ở đó. Liệu sự thật nào đang bị che giấu dưới lớp đổ nát của 𝐁𝐮𝐧𝐧𝐲's 𝐏𝐥𝐚𝐲𝐡𝐨𝐮𝐬𝐞? Và gã Thỏ thực sự đã biến mất hay chưa?\n\nLiệu bạn có đủ can đảm bước vào và khám phá sự thật phía sau những vụ mất tích bí ẩn? Hay sẽ trở thành một phần của câu chuyện bị chôn vùi nơi đây? Những bí mật vẫn đang chờ được hé lộ tại 𝐅𝐏𝐓𝐔 𝐇𝐚𝐥𝐥𝐨𝐰𝐞𝐞𝐧 𝟐𝟎𝟐𝟔. Vậy nên, hãy sẵn sàng cho sự kiện kinh dị và ma mị bậc nhất Đại học FPT!", event1Status: 'Ended', event1Location: '30m Road, FPT University Hanoi (Haunted House in Delta Building)', event1Scale: 'To be announced', event1Description: 'Wishbound: a mysterious town where every wish has a price, ruled by a cruel Joker who turns hope into a curse. Visitors must risk their souls across four lands shaped by the suits of a deck of cards.', event2Status: 'Ended', event2Location: '30m Road, FPT University Hanoi (Haunted House in Delta Building)', event2Scale: 'To be announced', event2Description: 'U Linh Ky – Am Duong Tu Khi: an ancient book draws villagers into a world of Vietnamese spirits, where they must protect their memories and find a way back to the living world.', event3Status: 'Ended', event3Location: 'Delta Building front yard, FPT University Hanoi (Haunted House in Delta Building)', event3Scale: 'To be announced', event3Description: 'Haunted Fest follows the rise of Lucifear and the stolen souls trapped between two worlds. Brave visitors must enter a ghost wedding and survive its terrifying games.', event4Status: 'Ended', event4Location: 'Delta Building front yard', event4Scale: 'To be announced', event4Description: 'Fear Corner turns the FPTU campus into a mysterious Halloween neighborhood where spirits return, visitors disguise themselves and explore eerie stalls, games and performances.', event5Status: 'Ended', event5Location: 'To be announced', event5Scale: 'To be announced', event5Description: 'The Haunted Forest was FPTU Halloween 2020, a first journey into a haunted forest filled with games, cosplay, a haunted house and frightening stories.' },
      feedbackPage: { requiredQuestion: 'Please answer question {{order}}.', loading: 'Opening the feedback book…', errorTitle: 'The book is closed', retry: 'Try again', emptyTitle: 'No feedback form is open', emptyText: 'The organizers will open a feedback form at the right time.', submittedLabel: 'RECEIVED', submittedTitle: 'Thank you for leaving your mark.', submittedText: 'Your feedback has been added to the event season archive.', review: 'Review feedback', staffAudience: 'operations team', attendeeAudience: 'attendee', eyebrow: 'Event feedback and rating', descriptionFallback: 'A few honest lines can help make the next Halloween better.', open: 'Open', until: 'until', chooseForm: 'Choose a form', openForm: 'Open form', questions: '{{count}} questions', answered: '{{count}} answered', required: 'Required', rating: '{{count}} stars', placeholder: 'Write what you really think…', savedWithRole: 'Your feedback will be saved with your role: {{role}}.', sending: 'Sending…', submit: 'Send feedback' },
      normal: {
        overall: { location: '30m Road, FPT University Hanoi (Haunted House in Delta Building)', draft: 'Draft', upcoming: 'Upcoming', ended: 'Ended', cancelled: 'Cancelled', viewEvent: 'View event information', noImage: 'No image', noImageAvailable: 'No image available', intro: 'Introduction', information: 'Information', registration: 'Registration', eventConcept: 'Event concept', eventDetails: 'Event details', noDescription: 'No detailed description is available for this event.', eventInformation: 'Event information', eventYear: 'Event year', time: 'Time', locationLabel: 'Location', unknown: 'Unknown', registerToAttend: 'Register to attend', registrationOpen: 'Registration for the game route is open. Use the button below to register.', registerNow: 'Register now', registrationEnded: 'The event has ended. Registration is unavailable.', registrationCancelled: 'The event was cancelled.', registrationNotOpen: 'Registration is not open yet.', quickInformation: 'Quick information', eventStatus: 'Event status', organizer: 'Organizing club', concept: '😈 Each night, the mysterious town of Wishbound appears in the mist. The Joker trades wishes, consumes souls and turns hope into a curse. Visitors must risk their souls across four sinful lands. Will you win or be sealed away?', description: '🎃 FPTU Halloween is FPTU Hanoi’s annual Halloween event with a haunted house, game zone, night food area and live performances. The GLORIOUS costume contest rewards the most impressive looks.' },
        home: { heroAlt: 'FPTU Halloween atmosphere', lockupAlt: 'FPT University, PDP, FPTU Board Game Club and FPTU Halloween 2026', eyebrow: 'THEME OF THE YEAR · COMING SOON', slogan: 'IF YOU ARE SCARED, GO HOME', subSlogan: 'Hoa Lac never sleeps.', lede: 'A new Halloween season is unlocking at FPTU Hanoi.', buy: 'Buy tickets', explore: 'Explore the event', countdownDone: 'Event day has arrived', countdownLeft: 'Time remaining', days: 'Days', hours: 'Hours', minutes: 'Minutes', seconds: 'Seconds', concept: 'Close enough to touch, strange enough to remember.', conceptLead: 'FPTU Halloween 2026 is where stories, music and unexpected encounters coexist for one night.', conceptBody: 'Choose your path, step into your role and let the small details guide you. This year’s content will be updated gradually.', highlights: 'Highlights', highlightsIntro: 'The stops that shape the rhythm of the night.', timeline: 'Event timeline', timelineNote: 'The detailed schedule will be announced once preparations reach the relevant milestones.', map: 'Map preview', mapCaption: 'Illustrative map · coming later', sponsors: 'Sponsors', sponsorsNote: 'Our partner list will be updated.', highlightTitles: ['Haunted house', 'Check-in zones', 'Cosplay', 'Photobooth', 'Tarot', 'Main stage', 'Lucky draw'], highlightDescriptions: ['An immersive route where every door opens a new layer of the story.', 'Themed check-in spots where you can capture your own Halloween moments.', 'Dress to this year’s theme and enter a Halloween night with your own signature.', 'A place to capture outfits, friends and once-only moments.', 'A mysterious reading to reveal the path waiting for you.', 'Stage plays, captivating performances and energetic DJ sets that keep the festival night alive.', 'Gifts and small surprises to close your festival journey.'], timelineTitles: ['Gates open', 'Explore', 'On stage', 'Night finale'], timelineDescriptions: ['Welcome, check-in and receive your event route.', 'Haunted house, game zone, photobooth and side activities.', 'Performances, guests and themed interactions.', 'Lucky draw, gifts and a promise to meet again next Halloween.'], welcome: 'Hello {{name}}!', mainGate: 'MAIN GATE', hauntedHouse: 'HAUNTED HOUSE', sponsorsAlt: '{{name}} logo' },
        faq: { eyebrow: 'FPTU Halloween · FAQ', title: 'Answers before you enter', intro: 'From choosing tickets and paying by QR to check-in — everything you need to know is here.', tickets: 'View tickets', support: 'Need help?', important: 'Important information', importantText: 'A ticket is valid only after the order is paid and its QR code is issued.', quickInfo: 'Quick information', beforeAsk: 'Before you ask', railTitle: 'Things to note before showtime', railIntro: 'Keep these three things in mind for a smooth ticket and entry journey.', ticketDate: 'Date on ticket', ticketDateText: 'Check in on the selected date', qrTime: '15 minutes', qrTimeText: 'Payment QR validity', location: 'FPT University Hanoi', locationText: 'Hoa Lac Hi-Tech Park', readTickets: 'Read ticket policy', dataPolicy: 'Data policy', answer: 'Answers', noAnswer: 'Still have questions?', noAnswerText: 'The organizers are ready to check it with you.', contact: 'Contact the organizers', groups: ['Tickets & shopping', 'Payment & orders', 'Tickets & check-in', 'Account & support'], questions: [['Where do I start buying tickets?', 'Open the ticket list, choose an available ticket, select the quantity and add it to your cart. You need to log in to use the cart and continue checkout.', 'How many tickets can I buy?', 'Choose a positive whole number up to the remaining quantity for each ticket type. The system will show an error if the quantity exceeds inventory.', 'Can I change the ticket date?', 'Each ticket type has a specific date and time. Check the details before paying; changes and refunds follow the ticket policy and order status.'], ['How can I pay?', 'After confirming buyer information, the system creates a VietQR code through PayOS. Transfer the exact amount and description shown on the payment screen.', 'How long is the payment QR valid?', 'The QR code is valid for 15 minutes. Once it expires, the unpaid order closes and you need to create a new payment session from your cart.', 'I paid but cannot see my ticket?', 'The system checks PayOS and the webhook confirms the transaction. If the screen has not updated, check your account again after a few minutes and keep your order code.', 'Can I cancel an unpaid order?', 'You can cancel a pending order on the QR screen. A paid order cannot be cancelled directly this way; contact the organizers for assistance.'], ['Where is my e-ticket?', 'After payment, open My tickets to view each ticket and its QR code. Log in with the account used for purchase.', 'Can a QR code be reused?', 'No. Each QR code can only be checked in once. After use, the ticket is marked as checked in and cannot be confirmed again.', 'Which day do I check in?', 'You can check in only on the date printed on the ticket. Staff at the gate will scan the QR code and verify the ticket details.', 'Where is the event held?', 'The event takes place at FPT University Hanoi, Hoa Lac Hi-Tech Park. Check official announcements and your ticket before attending.'], ['Why do I need to verify my email?', 'New accounts must verify an email OTP before logging in. Email is also used for buyer information and order reconciliation support.', 'What should I do if I forget my password?', 'Choose Forgot password on the login screen, enter your email and complete the OTP step to set a new password.', 'What should I do if payment fails?', 'Do not create multiple consecutive transactions. Check the amount, transfer description and order status; if it still fails, save the order code and contact the organizers.', 'Where can I contact the organizers?', 'Send a request through the Contact page or email fptuhalloween@gmail.com. Include your account email and order code when asking about an order.']] },
        policy: { ticketEyebrow: 'Clear ticketing', ticketTitle: 'Ticket policy', ticketIntro: 'A few important points to help you buy, receive and use tickets smoothly on event day.', dataEyebrow: 'Transparency', dataTitle: 'Data privacy policy', dataIntro: 'We respect your privacy and use only the information needed to operate the FPTU Halloween experience.', termsEyebrow: 'User agreement', termsTitle: 'Terms of use', termsIntro: 'By accessing the website or using FPTU Halloween services, you agree to the terms below.', note: 'Continuing to use this website means you have read and understood the content above.', contactNote: 'If you cannot find an answer, send a request through the Contact page.', dataNote: 'This page explains how we operate data. Contact the organizers if you need clarification.', ticketSections: [['1. Purchase and payment', 'Tickets are recorded after an order is paid successfully. Check buyer information and ticket type before completing the transaction.'], ['2. Receiving and using tickets', 'A QR code is issued for a valid ticket. Each code can be used once and must be shown at the check-in gate as instructed by the organizers.'], ['3. Changes, cancellation and refunds', 'Changes or refunds follow the program announcement and each order’s status. Checked-in or expired tickets cannot be reused.'], ['4. Support', 'If ticket information is incorrect or you have a payment issue, save the order code and contact the organizers for checking.']], termsSections: [['1. Website use', 'You agree to provide accurate information and not use the website for fraud, harm or disruption.'], ['2. User accounts', 'You are responsible for protecting your login information and activity from your account. Notify the organizers immediately if you notice unusual access.'], ['3. Content and brand', 'Website content, images and identity marks are managed by the organizing unit. Copying or reuse requires permission.'], ['4. Service changes', 'The organizers may update website content, schedules or features when needed. Important changes will be announced through suitable channels.']], dataSections: [['1. Information we collect', 'When you register, buy tickets or contact us, we may receive your name, email, phone number and necessary transaction information.', 'Ticket codes and check-in data are used to verify event access.'], ['2. Purpose of use', 'Information is used to process orders, issue tickets, support attendees, send necessary notices and ensure event safety.'], ['3. Protection and storage', 'Data access is limited by role and stored for a period appropriate to operations, reconciliation and related obligations.'], ['4. Your rights', 'You may request to view, update or ask about your data by contacting the organizers through the Contact channel.']] },
        contact: { title: 'FEEDBACK', heading: 'Share your feedback', description: 'We are always ready to listen to your ideas and make the event better.', name: 'Your name', phone: 'Phone number', email: 'Email', subject: 'Subject', content: 'Message', submit: 'Send feedback', sending: 'Sending...', required: '{{field}} is required', invalid: '{{field}} is invalid', address: 'Address', organizer: 'Head of Organization', communications: 'Head of Communications' },
        btc: { kicker: 'Behind the haunted house curtain', titleBefore: 'The people', titleAfter: 'who make', intro: 'A team behind every FPTU Halloween experience — from the first idea to the moment the Haunted House doors open.', about: 'About us', introLabel: 'Meet the team', introTitle: 'More than a', introTitleAfter: 'Halloween event.', introText: 'FPTU Halloween is where horror stories, immersive experiences and student spirit meet. To create a complete festival, the Core Team and departments work together as one system.', introMuted: 'Everyone brings a role. Together, we turn sketches into real experiences.', groupPhoto: 'Group photo', groupTitle: 'One team,', groupTitleAfter: 'one mark.', groupAlt: 'FPTU Halloween group photo', groupCaption: 'FPTU Halloween · The people behind the event', organization: 'Organization', organizationTitle: 'One team.', organizationTitleAfter: 'Many heartbeats.', organizationIntro: 'Meet the members behind every piece of FPTU Halloween 2026.', boardTitle: 'HLW26 organizing team', departmentsLabel: 'Departments in the organizing team', greeting: 'A note from us', closingTitle: 'See you', closingTitleAfter: 'in the dark.', closingText: 'Thank you for caring about the people behind FPTU Halloween. If you need to connect with the organizers, we are always ready to listen.', contact: 'Contact the organizers', pendingEmail: 'Email pending', avatarAlt: 'Portrait of {{name}}', roles: { chair: 'Head of Organization · Head of External Relations', hr: 'HR', hauntedLead: 'Haunted House Lead', hauntedDeputy: 'Haunted House Sub-lead', mediaLead: 'Communications Lead', mediaDeputy: 'Communications Sub-lead', contentLead: 'Content Lead', cultureLead: 'Culture & Sports Lead', contentDeputy: 'Content Sub-lead', logisticsLead: 'Logistics Lead', logisticsDeputy: 'Logistics Sub-lead', careLead: 'Take Care Lead', careDeputy: 'Take Care Sub-lead', mediaTeamLead: 'Media Lead', designLead: 'Design Lead', designDeputy: 'Design Sub-lead' }, hierarchy: { chair: 'Overall lead', hr: 'People coordination', lead: 'Department lead', sublead: 'Sub-lead' }, departments: ['External Relations', 'HR', 'Media', 'Design', 'Content', 'Logistics', 'Take Care', 'Haunted House', 'Communications', 'Culture & Sports'] },
      },
      auth: {
        login: { title: 'Log in', welcome: 'Welcome back to FPTU Halloween', password: 'Password', hide: 'Hide password', show: 'Show password', loading: 'Logging in...', forgot: 'Forgot password?', or: 'Or', google: 'Log in with Google', clubQuestion: 'Are you a member of FPTU Board Game Club?', fbgc: 'Log in with FBGC account', noAccount: 'Don’t have an account?', register: 'Register', googleLoading: 'Logging in with Google...' },
        register: { title: 'Register', subtitle: 'Create an account to join FPTU Halloween', fullName: 'Full name', fullNamePlaceholder: 'Enter your full name', emailPlaceholder: 'Enter email', phone: 'Phone number', phonePlaceholder: 'Enter phone number', passwordPlaceholder: 'Enter password', confirmPassword: 'Confirm password', confirmPlaceholder: 'Re-enter password', hide: 'Hide password', show: 'Show password', loading: 'Registering...', submit: 'Register', or: 'Or', google: 'Continue with Google', hasAccount: 'Already have an account?', login: 'Log in', registering: 'Registering...', success: 'Registration successful! Redirecting to login...', error: 'Registration failed', required: '{{field}} is required', invalid: '{{field}} is invalid', minPassword: 'Password must be at least 6 characters', passwordMismatch: 'Passwords do not match', minName: 'Name must be at least 2 characters', googleLoading: 'Logging in with Google...' },
        forgot: { length: 'At least 8 characters', weak: 'Weak', strong: 'Strong', sendOtp: 'Sending verification code...', verifyOtp: 'Verifying OTP...', reset: 'Resetting password...', titleEmail: 'Forgot password', titleOtp: 'Verify OTP', titleReset: 'Reset password', subtitleEmail: 'Enter your email to receive a verification code', subtitleOtp: 'Enter the OTP sent to your email', subtitleReset: 'Create a new password for your account', emailPlaceholder: 'Enter email', otpPlaceholder: 'Enter OTP', password: 'New password', passwordPlaceholder: 'Enter new password', confirm: 'Re-enter new password', mismatch: 'Confirmation password does not match', processing: 'Processing...', send: 'Send verification code', verify: 'Verify OTP', submit: 'Reset password', back: 'Back to login' },
        changePassword: { old: 'Current password', new: 'New password', confirm: 'Confirm new password', oldPlaceholder: 'Enter current password', newPlaceholder: 'Enter new password', confirmPlaceholder: 'Re-enter new password', verifyOld: 'Verify current password', enterNew: 'Enter new password', verifyDescription: 'For account security, verify your current password first', newDescription: 'Enter a new password for your account', checking: 'Checking current password...', verifying: 'Verifying...', processing: 'Processing...', continue: 'Continue', confirmAction: 'Confirm', forgot: 'Forgot password?', backLogin: 'Back to login', back: 'Back', hidden: 'Hide password', visible: 'Show password', minLength: 'Password must be at least 8 characters', mismatch: 'Confirmation password does not match', weak: 'Weak', strong: 'Strong', ruleLength: 'At least 8 characters', accountMissing: 'Account information not found', oldInvalid: 'Current password is incorrect. Please try again.' },
        fbgc: { title: 'Log in', welcome: 'Welcome back to FPTU Board Game Club', username: 'Username', usernamePlaceholder: 'Enter username', passwordPlaceholder: 'Enter password', loading: 'Logging in...', back: 'Back to FPTU Halloween login' },
        confirm: { title: 'Verify email', sent: 'We sent a verification code to {{email}}', instruction: 'Enter the 6-digit code below to complete registration', code: 'Verification code', placeholder: 'Enter 6-digit code', submit: 'Verify', notReceived: 'Did not receive the code?', sending: 'Sending...', resend: 'Resend code', back: 'Back', register: 'Register', success: 'Verification successful! You can log in.', invalid: 'Incorrect verification code', required: 'Verification code is required', length: 'Verification code must contain exactly 6 digits' },
        complete: { title: 'Registration successful!', text: 'Congratulations! Your account has been created successfully.', instruction: 'You can log in now to start your FPTU Halloween experience', login: 'Log in now', support: 'Need help?', contact: 'Contact us' },
      },
      eventPages: {
        fanpage: { title: '🎃 FPTU Halloween 2026 – Wishbound', intro: 'The biggest annual Halloween event at FPT University Hanoi!', location: 'Location: 30m Road, FPT University campus, Hoa Lac', date: 'Date: 28–31/10/2026', tickets: 'Tickets: "Ticket link"', contact: 'Contact: fptuhalloween@gmail.com', visit: 'Visit now' },
        agenda: { kicker: 'FPTU HALLOWEEN 2026 / WISHBOUND', title: 'Event', titleAfter: 'schedule.', summary: 'Two documents to help you find your way through the time, space and key touchpoints of Halloween night.', section: 'Event documents', heading: 'Every touchpoint,', headingAfter: ' on one page.', description: 'The schedule and map will be updated in the two frames below when the official images are ready.', placeholder: 'Image coming soon', schedule: 'Event schedule', scheduleDescription: 'Placeholder for the event schedule image.', map: 'Event map', mapDescription: 'Placeholder for the event area map image.' },
        news: { title: 'NEWS', featured: 'Featured news', other: 'More news', hour: '{{count}} hours', views: '{{count}} views', titles: ['FPTU Halloween 2026: Wishbound event coming soon with exciting activities', 'Special art performances at FPTU Halloween 2026', 'How to buy tickets and join the Halloween event', 'Main activities at FPTU Halloween 2026', 'Event location and schedule information', 'What to know when joining Halloween at FPTU', 'Special offers for FPTU students', 'How to register for Halloween workshops', 'Information about event sponsors'] },
        haunted: { kicker: 'FPTU HALLOWEEN 2026 · INTRODUCTION', title: 'Haunted House', titleAfter: 'opens.', intro: 'One night, one entrance and stories no two people tell the same way.', storyLabel: '01 · Setting', storyTitle: 'The Haunted House story', storyText: 'This is a placeholder for the Haunted House story. Official content will be updated later, following a journey through dark rooms, strange traces and choices with no way back. Let your imagination lead, but remember that every sound on Halloween night could be a warning.', trailerLabel: '02 · Atmosphere', trailer: 'Trailer', trailerText: 'This space is ready for the official trailer video.', trailerPlaceholder: 'Trailer placeholder · video coming soon', imageAlt: 'Halloween Haunted House atmosphere', rulesLabel: '03 · Before entering', rulesTitle: 'Haunted House rules', ticketLabel: '04 · Choose your entrance', ticketTitle: 'Haunted House tickets', ticketIntro: 'Date, time, price and remaining ticket information.', loading: 'Loading ticket information...', loaded: 'Ticket information loaded', retry: 'Try again', empty: 'No tickets are currently on sale.', day: 'Date', time: 'Time', price: 'Price', location: 'Location', remaining: 'Remaining', buy: 'Buy now', venue: 'Delta Building lobby (in front of the library)', tickets: '{{count}} tickets', rules: ['Queue and follow the organizers’ instructions before entering.', 'Do not touch props or actors, or open doors in the experience area.', 'Do not use flash, film or livestream without permission.', 'Do not run or leave your group during the journey.', 'The organizers may refuse service if participants do not follow the rules.'] },
        hlwIntro: { kicker: 'FPTU HALLOWEEN · 2026', title: 'Introducing a', titleAfter: 'night of wonder.', subtitle: 'Where joy and fear meet', explore: 'Explore', overview: 'Overview', overviewTitle: 'An event', overviewTitleAfter: 'that lights up FU.', factsLabel: 'FPTU Halloween information', milestone: 'Milestones', seasons: 'Halloween seasons', seasonsIntro: 'The festivals that shaped FPTU Halloween memories and identity.', concept: 'Concept', scale: 'Scale', comingSoon: 'Coming soon' },
        introduceEvent: { about: 'About the event', organized: 'Organized by', description: 'With a haunted house, lively activities and exciting contests, FPT Halloween always brings a mysterious, memorable night that connects the FPT student community.', recent: 'Recent events', viewAll: 'View all', likes: 'likes', followers: 'followers', verified: 'verified' },
      },
      pages: { errors: { backHome: 'Go to homepage', back: 'Go back', forbiddenTitle: 'This door is not for your account.', forbiddenDescription: 'You are signed in, but your account cannot access this route.', notFoundTitle: 'This page is not on the map.', notFoundDescription: 'This route does not point to an open FPTU Halloween page.', illustrationAlt: 'Illustration of a lost pot in a red landscape' }, payment: { checking: 'Confirming payment', success: 'Payment successful', waiting: 'Awaiting confirmation', checkingText: 'The system is checking the transaction and issuing your e-ticket.', successText: 'Your e-ticket has been issued successfully.', waitingText: 'The transaction is not complete. Wait for the webhook or try again later.', myTickets: 'View my tickets', home: 'Go home', notConfirmed: 'Payment has not been confirmed as complete.', statusError: 'Unable to check the order status.' } },
      ticket: { loadingList: 'Loading tickets...', loadingDetail: 'Loading ticket details...', loadingPayment: 'Loading payment information...', retry: 'Try again', backStore: 'Back to ticket store', backCart: 'Back to cart', backCheckout: 'Back to order confirmation', buy: 'Buy now', addCart: 'Add to cart', adding: 'Adding...', active: 'On sale', paused: 'Paused', unavailable: 'Ticket is no longer on sale', soldOut: 'Sold out', updating: 'Updating', day: 'Date', time: 'Time', price: 'Ticket price', location: 'Location', remaining: 'Remaining', tickets: 'tickets', dateSuffix: 'October 2026', date: 'Date', dateLabel: 'Date', dateFormat: 'October {{date}}, 2026', dayLabel: 'Date', quantity: 'Quantity', subtotal: 'Subtotal', total: 'Total', serviceFee: 'Service fee', continue: 'Continue to payment', empty: 'No ticket types are available.', hauntedHouse: 'Yin-Yang Haunted House', venue: 'Delta Building lobby (in front of the library)', cartTitle: 'Your ticket cart', cartEmpty: 'Your cart is empty', cartEmptyText: 'Choose a Halloween experience to begin your journey.', ticketList: 'Ticket store', removeAll: 'Remove all', selectAll: 'Select all', orderSummary: 'Order summary', checkoutNotice: 'You will be redirected to payment confirmation.', checkoutTitle: 'Confirm order', buyerInfo: 'Buyer information', buyerHint: 'Enter your information to receive your e-ticket.', fullName: 'Full name', fullNamePlaceholder: 'Enter your full name', phone: 'Phone number', phonePlaceholder: 'Enter your phone number', coupon: 'Discount code', couponHint: 'Enter your promo code if you have one.', couponPlaceholder: 'Enter discount code', apply: 'Apply', discount: 'Discount', secure: 'Your information is stored securely during this payment session.', confirmPayment: 'Confirm payment', confirmPaymentText: 'You will be taken to the QR code screen to complete payment.<br />Would you like to continue?', cancel: 'Back', qrCreate: 'Creating payment QR code...', qrCreated: 'Payment QR code created successfully', qrExpired: 'The QR code has expired. Please create the payment again.', cancelOrder: 'Cancel order', canceling: 'Cancelling order...', cancelOrderText: 'Do you want to cancel the order?<br />Are you sure?', keepOrder: 'No, keep the order', confirmCancel: 'Yes, cancel the order', noPayment: 'No payment order found', cannotPayment: 'Unable to create payment', scanQr: 'Scan to pay', scanQrText: 'Complete payment to receive your e-ticket.', paymentAmount: 'Amount to pay', paymentTime: 'Time remaining', bankInfo: 'Bank transfer details', bank: 'Bank', bankName: 'MB - Military Commercial Joint Stock Bank', accountNumber: 'Account number', accountName: 'Account name', transferContent: 'Transfer description', paymentNotice: 'After the transfer, the system will confirm and issue your e-ticket.', payExpired: 'QR code expired', payAgain: 'Please make the payment again.', paymentSuccess: 'Payment successful. Your ticket has been issued.', cancelled: 'Order cancelled.', noOrders: 'Tickets are no longer on sale. Please return to your cart.', status: 'Status', includes: 'Includes', detail: 'View details', experience: 'Haunted House experience', personalTicket: 'Personal e-ticket', selectedDay: 'Use on the selected event date', decrease: 'Decrease quantity', increase: 'Increase quantity', detailNote: 'Ticket information and availability may change before the event.', couponApplied: 'Discount applied.', couponInvalid: 'Discount code could not be applied.', stepOne: 'Step 1 / 2', stepTwo: 'Step 2 / 2', emailNotice: 'Your e-ticket will be sent to this email address.', selectedTickets: 'Selected tickets', qrLabel: 'Payment QR code', qrAlt: 'PayOS VietQR payment code', paidButton: 'I have paid', loadError: 'Unable to load your tickets.', wallet: 'Digital ticket wallet', qrInstruction: 'Keep your QR code ready to present when you arrive at the event.', issued: 'tickets issued', filter: 'Ticket filter', displayed: 'tickets displayed', filterStatus: 'Filter ticket status', allStatuses: 'All statuses', pending: 'Pending use', processing: 'Processing', checked: 'Checked in', cancelledStatus: 'Cancelled', noMatching: 'No matching tickets', purchasedHere: 'Purchased tickets will appear here.', viewQr: 'View QR code', qrNotIssued: 'QR code not issued yet', cartItemsAria: 'Tickets in your cart', selectForPayment: 'Select {{name}} for payment', removeTicket: 'Remove {{name}}', dateTime: 'Date {{date}}, October 2026', timeUpdating: 'Time to be updated', subtotalTickets: 'Subtotal ({{count}} tickets)', removeUnavailableWarning: 'Unselect or remove tickets that are no longer on sale before paying.', selectAtLeastWarning: 'Select at least one ticket type to continue.', all: 'All', featureExperience: 'Haunted House experience', featurePersonal: 'Personal e-ticket', featureEventDay: 'Valid on the event date', purchaseInfo: 'Ticket purchase information', simplePurchase: 'Simple purchase', chooseDay: 'Choose your event date', digitalTicket: 'E-ticket', receiveAfterPayment: 'Receive it after successful payment', oneTicket: 'One ticket, one memory', useOnEventDay: 'Save it for the event day', heroIntro: 'Yin-Yang Haunted House. Choose your event date.', searchTitle: 'Search tickets by schedule', searchIntro: 'Choose a date, time and location to see matching ticket slots.', searchDate: 'Event date', searchTime: 'Entry time', searchLocation: 'Location', searchLocationPlaceholder: 'Enter a location', searchButton: 'Search tickets', imagePlaceholder: 'Ticket image placeholder', imageNote: 'Ticket image area' },
    },
  },
};

resources.ja = { translation: ja };

Object.assign(resources.vi.translation.components, {
  ddayVote: 'Bình chọn D-Day',
  you: 'bạn',
  eventBrand: 'Sự kiện FPTU',
  changingLanguage: 'Đang chuyển đổi ngôn ngữ...',
  languageChanged: 'Đã chuyển đổi ngôn ngữ sang Tiếng Việt',
  languageChangeError: 'Không thể chuyển đổi ngôn ngữ.',
  changingTheme: 'Đang chuyển sang chế độ {{mode}}...',
  themeChanged: 'Đã chuyển sang chế độ {{mode}}.',
  themeDark: 'tối',
  themeLight: 'sáng',
  themeChangeError: 'Không thể thay đổi chế độ hiển thị.',
});

Object.assign(resources.en.translation.components, {
  ddayVote: 'D-Day voting',
  you: 'you',
  eventBrand: 'FPTU Event',
  changingLanguage: 'Changing language...',
  languageChanged: 'Language changed to English',
  languageChangeError: 'Unable to change language.',
  changingTheme: 'Switching to {{mode}} mode...',
  themeChanged: 'Switched to {{mode}} mode.',
  themeDark: 'dark',
  themeLight: 'light',
  themeChangeError: 'Unable to change appearance mode.',
});

resources.vi.translation.management = {
  common: {
    all: 'Tất cả',
    refresh: 'Làm mới',
    retry: 'Thử lại',
    close: 'Đóng',
    cancel: 'Hủy',
    save: 'Lưu',
    saving: 'Đang lưu...',
    edit: 'Chỉnh sửa',
    delete: 'Xóa',
    search: 'Tìm kiếm',
    status: 'Trạng thái',
    actions: 'Thao tác',
    date: 'Ngày',
    time: 'Thời gian',
    page: 'Trang',
    previous: 'Trước',
    next: 'Sau',
    notUpdated: 'Chưa cập nhật',
    unknown: 'Chưa xác định',
    active: 'Đang hoạt động',
    disabled: 'Đã vô hiệu hóa',
    view: 'Xem',
    details: 'Chi tiết',
    loading: 'Đang tải...',
  },
  dashboard: {
    adminLoading: 'Đang tải dữ liệu tổng quan...',
    adminUpdated: 'Đã cập nhật bảng điều khiển.',
    adminKicker: 'Bảng điều phối · 2026',
    adminTitle: 'Toàn cảnh sự kiện',
    adminIntro: 'Nhịp vận hành, doanh thu và sức khỏe vé trong một màn hình.',
    staffLoading: 'Đang tải ca vận hành...',
    staffUpdated: 'Đã cập nhật dữ liệu ca trực.',
    staffKicker: 'Trực bàn Check-in · hôm nay',
    staffTitle: 'Nhịp check-in',
    staffIntro: 'Đừng ngừng cố gắng khi bạn vẫn còn điều có thể trao đi. Mỗi lượt check-in chính xác đều góp phần tạo nên một đêm sự kiện trọn vẹn.',
    refresh: 'Làm mới',
    totalRevenue: 'Doanh thu tổng',
    paidOrders: '{{count}} đơn đã thanh toán',
    issuedTickets: 'Tổng vé phát hành',
    checkedTickets: '{{count}} vé đã check-in',
    userAccounts: 'Tài khoản người dùng',
    currentAccountData: 'Dữ liệu tài khoản hiện tại',
    usageRate: 'Tỷ lệ sử dụng vé',
    byCheckInStatus: 'Theo trạng thái check-in',
    checkedIn: 'Đã check-in',
    unused: 'Chưa sử dụng',
    allShifts: 'Tất cả ca trực',
    todayTickets: 'Vé trong ngày',
    day: 'Ngày {{day}}',
    latestScan: 'Lượt gần nhất',
    serverTime: 'Theo thời gian máy chủ',
    ticketDistribution: 'Phân bố vé theo từng mốc giờ',
    checkInProgress: 'Tiến độ check-in mỗi ngày',
    eventScheduleChart: 'LỊCH SỰ KIỆN',
    quickScanChart: 'QUÉT NHANH',
    atGateChart: 'TẠI CỔNG',
    gateStatusChart: 'TÌNH HÌNH TẠI CỔNG',
    filterDistribution: 'Lọc phân bố vé theo ngày',
    filterProgress: 'Lọc tiến độ check-in theo ngày',
    date: 'Ngày',
    dayInOctober: 'Ngày {{day}}/10',
  },
};

resources.en.translation.management = {
  common: {
    all: 'All',
    refresh: 'Refresh',
    retry: 'Try again',
    close: 'Close',
    cancel: 'Cancel',
    save: 'Save',
    saving: 'Saving...',
    edit: 'Edit',
    delete: 'Delete',
    search: 'Search',
    status: 'Status',
    actions: 'Actions',
    date: 'Date',
    time: 'Time',
    page: 'Page',
    previous: 'Previous',
    next: 'Next',
    notUpdated: 'Not updated',
    unknown: 'Unknown',
    active: 'Active',
    disabled: 'Disabled',
    view: 'View',
    details: 'Details',
    loading: 'Loading...',
  },
  dashboard: {
    adminLoading: 'Loading dashboard data...',
    adminUpdated: 'Dashboard updated.',
    adminKicker: 'Operations dashboard · 2026',
    adminTitle: 'Event overview',
    adminIntro: 'Operations, revenue and ticket health in one view.',
    staffLoading: 'Loading shift data...',
    staffUpdated: 'Shift data updated.',
    staffKicker: 'Check-in desk · today',
    staffTitle: 'Check-in pulse',
    staffIntro: 'Keep going while you still have something to give. Every accurate check-in helps create a complete event night.',
    refresh: 'Refresh',
    totalRevenue: 'Total revenue',
    paidOrders: '{{count}} paid orders',
    issuedTickets: 'Tickets issued',
    checkedTickets: '{{count}} checked-in tickets',
    userAccounts: 'User accounts',
    currentAccountData: 'Current account data',
    usageRate: 'Ticket usage rate',
    byCheckInStatus: 'Based on check-in status',
    checkedIn: 'Checked in',
    unused: 'Unused',
    allShifts: 'All shifts',
    todayTickets: "Today's tickets",
    day: 'Day {{day}}',
    latestScan: 'Latest scan',
    serverTime: 'Server time',
    ticketDistribution: 'Ticket distribution by time slot',
    checkInProgress: 'Daily check-in progress',
    eventScheduleChart: 'EVENT SCHEDULE',
    quickScanChart: 'QUICK SCANS',
    atGateChart: 'AT THE GATE',
    gateStatusChart: 'GATE STATUS',
    filterDistribution: 'Filter ticket distribution by date',
    filterProgress: 'Filter check-in progress by date',
    date: 'Date',
    dayInOctober: 'October {{day}}',
  },
};

resources.vi.translation.management.ticketTypes = {
  loadingList: 'Đang tải danh sách loại vé...', loadingDetail: 'Đang tải chi tiết loại vé...',
  updating: 'Đang cập nhật loại vé...', updatingStatus: 'Đang cập nhật trạng thái...', kicker: 'Quản lý vé',
  title: 'Danh sách loại vé', intro: 'Thông tin các loại vé đang được phát hành cho sự kiện.', readOnly: 'Chế độ chỉ xem',
  search: 'Tìm loại vé', searchPlaceholder: 'Tìm loại vé...', filterDate: 'Lọc theo ngày', filterStatus: 'Lọc theo trạng thái',
  allStatuses: 'Tất cả trạng thái', selling: 'Đang bán', notSelling: 'Không bán', count: '{{count}} loại vé',
  empty: 'Không tìm thấy loại vé phù hợp.', entryPass: 'VÉ VÀO CỬA', soldOut: 'Đã bán hết', onSale: 'Đang mở bán',
  paused: 'Tạm ngưng', eventDate: 'Ngày {{day}}/10/2026', remainingCount: 'Còn lại {{count}} vé', viewDetails: 'Xem chi tiết', back: 'Quay lại danh sách vé',
  notFound: 'Không tìm thấy loại vé.', detailTitle: 'Chi tiết loại vé', cancelEdit: 'Hủy sửa', edit: 'Chỉnh sửa',
  disable: 'Vô hiệu hóa', enableSale: 'Mở bán', saving: 'Đang lưu...', saveChanges: 'Lưu thay đổi',
  modelFallback: 'Mô hình 3D vé Nhà Ma', participationDate: 'Ngày tham gia', eventDateLong: 'Ngày {{day}} tháng 10, 2026',
  totalQuantity: 'Tổng số lượng', ticketCount: '{{count}} vé', benefits: 'Quyền lợi vé',
  benefitExperience: 'Quyền tham gia trải nghiệm Nhà Ma', benefitPersonal: 'Vé điện tử cá nhân',
  benefitDate: 'Sử dụng trong đúng ngày đã chọn', remaining: 'Vé còn lại', typeCode: 'Mã loại vé: {{code}}',
};

resources.en.translation.management.ticketTypes = {
  loadingList: 'Loading ticket types...', loadingDetail: 'Loading ticket type details...',
  updating: 'Updating ticket type...', updatingStatus: 'Updating status...', kicker: 'Ticket management',
  title: 'Ticket types', intro: 'Information about ticket types currently issued for the event.', readOnly: 'Read-only mode',
  search: 'Search ticket types', searchPlaceholder: 'Search ticket types...', filterDate: 'Filter by date', filterStatus: 'Filter by status',
  allStatuses: 'All statuses', selling: 'On sale', notSelling: 'Not on sale', count: '{{count}} ticket types',
  empty: 'No matching ticket types found.', entryPass: 'ENTRY PASS', soldOut: 'Sold out', onSale: 'On sale',
  paused: 'Paused', eventDate: 'October {{day}}, 2026', remainingCount: '{{count}} tickets remaining', viewDetails: 'View details', back: 'Back to ticket types',
  notFound: 'Ticket type not found.', detailTitle: 'Ticket type details', cancelEdit: 'Cancel editing', edit: 'Edit',
  disable: 'Disable', enableSale: 'Put on sale', saving: 'Saving...', saveChanges: 'Save changes',
  modelFallback: 'Haunted House ticket 3D model', participationDate: 'Event date', eventDateLong: 'October {{day}}, 2026',
  totalQuantity: 'Total quantity', ticketCount: '{{count}} tickets', benefits: 'Ticket benefits',
  benefitExperience: 'Access to the Haunted House experience', benefitPersonal: 'Personal e-ticket',
  benefitDate: 'Valid on the selected date', remaining: 'Tickets remaining', typeCode: 'Ticket type code: {{code}}',
};

resources.vi.translation.management.contacts = {
  loading: 'Đang tải danh sách liên hệ...', updatingStatus: 'Đang cập nhật trạng thái...', kicker: 'Hòm thư liên hệ',
  title: 'Danh sách liên hệ', intro: 'Các yêu cầu và phản hồi được gửi từ người tham dự sự kiện.', contacts: 'liên hệ',
  search: 'Tìm theo tên', searchPlaceholder: 'Tìm theo tên...', filterStatus: 'Lọc theo trạng thái', pending: 'Chưa xử lý',
  done: 'Đã xử lý', role: 'Vai trò', filterRole: 'Lọc theo vai trò', user: 'Người dùng', guest: 'Khách',
  sortDate: 'Sắp xếp theo ngày', newest: 'Mới nhất', oldest: 'Cũ nhất', empty: 'Chưa có liên hệ nào.',
  sender: 'Người gửi', subject: 'Chủ đề', content: 'Nội dung', markPending: 'Đánh dấu chưa xử lý', markDone: 'Đánh dấu đã xử lý',
  pageOf: 'Trang {{page}} / {{total}}',
};
resources.en.translation.management.contacts = {
  loading: 'Loading contacts...', updatingStatus: 'Updating status...', kicker: 'Contact inbox',
  title: 'Contact requests', intro: 'Requests and feedback submitted by event attendees.', contacts: 'contacts',
  search: 'Search by name', searchPlaceholder: 'Search by name...', filterStatus: 'Filter by status', pending: 'Pending',
  done: 'Resolved', role: 'Role', filterRole: 'Filter by role', user: 'User', guest: 'Guest',
  sortDate: 'Sort by date', newest: 'Newest', oldest: 'Oldest', empty: 'No contact requests yet.',
  sender: 'Sender', subject: 'Subject', content: 'Message', markPending: 'Mark as pending', markDone: 'Mark as resolved',
  pageOf: 'Page {{page}} / {{total}}',
};

resources.vi.translation.management.users = {
  loading: 'Đang tải danh sách người dùng...', disabling: 'Đang vô hiệu hóa tài khoản...', enabling: 'Đang gỡ vô hiệu hóa tài khoản...',
  kicker: 'Quản trị người dùng', title: 'Danh sách người dùng', intro: 'Theo dõi thông tin tài khoản và trạng thái hoạt động trong hệ thống.',
  users: 'người dùng', search: 'Tìm theo tên', searchPlaceholder: 'Tìm theo tên...', role: 'Vai trò', filterRole: 'Lọc theo vai trò',
  department: 'Phòng ban', filterDepartment: 'Lọc theo phòng ban', position: 'Vị trí', filterPosition: 'Lọc theo vị trí',
  filterStatus: 'Lọc theo trạng thái', empty: 'Chưa có người dùng nào.', noMatch: 'Không tìm thấy người dùng phù hợp.',
  user: 'Người dùng', contact: 'Liên hệ', verified: 'Đã xác thực', unverified: 'Chưa xác thực', pageOf: 'Trang {{page}} / {{total}}',
};
resources.en.translation.management.users = {
  loading: 'Loading users...', disabling: 'Disabling account...', enabling: 'Enabling account...',
  kicker: 'User administration', title: 'Users', intro: 'Monitor account information and activity status across the system.',
  users: 'users', search: 'Search by name', searchPlaceholder: 'Search by name...', role: 'Role', filterRole: 'Filter by role',
  department: 'Department', filterDepartment: 'Filter by department', position: 'Position', filterPosition: 'Filter by position',
  filterStatus: 'Filter by status', empty: 'No users yet.', noMatch: 'No matching users found.',
  user: 'User', contact: 'Contact', verified: 'Verified', unverified: 'Not verified', pageOf: 'Page {{page}} / {{total}}',
};

resources.vi.translation.management.orders = {
  loadingList: 'Đang tải danh sách đơn hàng...', loadingDetail: 'Đang tải chi tiết đơn hàng...', detailLoaded: 'Đã tải chi tiết đơn hàng.',
  guest: 'Khách vãng lai', day: 'Ngày {{day}}', hour: 'Giờ {{time}}', ticketType: 'Loại vé', kicker: 'Vận hành bán vé',
  title: 'Đơn hàng', intro: 'Theo dõi thanh toán, người mua và trạng thái phát hành vé trong một luồng.', overview: 'Tổng quan đơn hàng',
  pageOrders: 'Tổng đơn trên trang', pageValue: 'Giá trị trên trang', paid: 'Đã thanh toán', list: 'Danh sách đơn hàng', orders: 'đơn hàng',
  search: 'Tìm đơn hàng', searchPlaceholder: 'Tìm mã đơn, người mua...', empty: 'Không tìm thấy đơn hàng phù hợp.',
  orderCode: 'Mã đơn', buyer: 'Người mua', createdAt: 'Ngày tạo', ticketQuantity: 'Số vé', value: 'Giá trị', noEmail: 'Chưa có email',
  pageOf: 'Trang {{page}} / {{total}}', detailTitle: 'Chi tiết đơn hàng', closeDetail: 'Đóng chi tiết', paymentTotal: 'Tổng thanh toán',
  method: 'Phương thức', onlinePayment: 'Thanh toán trực tuyến', orderTickets: 'Vé trong đơn', viewQr: 'Xem mã QR',
  qrPending: 'Chưa phát hành mã QR', noIssuedTickets: 'Chưa có vé được phát hành cho đơn này.',
  statusPending: 'Chờ thanh toán', statusProcessing: 'Đang xử lý', statusPaid: 'Đã thanh toán', statusCancelled: 'Đã hủy', statusUnknown: 'Không rõ',
  ticketStatusPending: 'Đang chờ sử dụng', ticketStatusChecked: 'Đã sử dụng', ticketStatusCancelled: 'Đã hủy',
};
resources.en.translation.management.orders = {
  loadingList: 'Loading orders...', loadingDetail: 'Loading order details...', detailLoaded: 'Order details loaded.',
  guest: 'Guest customer', day: 'Date {{day}}', hour: 'Time {{time}}', ticketType: 'Ticket type', kicker: 'Ticket sales operations',
  title: 'Orders', intro: 'Track payments, buyers and ticket issuance status in one workflow.', overview: 'Order overview',
  pageOrders: 'Orders on this page', pageValue: 'Value on this page', paid: 'Paid', list: 'Order list', orders: 'orders',
  search: 'Search orders', searchPlaceholder: 'Search order code or buyer...', empty: 'No matching orders found.',
  orderCode: 'Order code', buyer: 'Buyer', createdAt: 'Created', ticketQuantity: 'Tickets', value: 'Value', noEmail: 'No email',
  pageOf: 'Page {{page}} / {{total}}', detailTitle: 'Order details', closeDetail: 'Close details', paymentTotal: 'Payment total',
  method: 'Method', onlinePayment: 'Online payment', orderTickets: 'Tickets in order', viewQr: 'View QR code',
  qrPending: 'QR code not issued', noIssuedTickets: 'No tickets have been issued for this order.',
  statusPending: 'Awaiting payment', statusProcessing: 'Processing', statusPaid: 'Paid', statusCancelled: 'Cancelled', statusUnknown: 'Unknown',
  ticketStatusPending: 'Pending use', ticketStatusChecked: 'Used', ticketStatusCancelled: 'Cancelled',
};

resources.vi.translation.management.userTickets = {
  statusPending: 'Chờ sử dụng', statusChecked: 'Đã sử dụng', statusCancelled: 'Đã hủy', statusUnknown: 'Không rõ',
  kicker: 'Phát hành & kiểm soát', title: 'Danh sách vé đã mua',
  intro: 'Tra cứu người sở hữu, loại vé và trạng thái sử dụng trong một bảng điều hành.', ticketDate: 'Ngày vé',
  filterDate: 'Lọc theo ngày vé', allDates: 'Tất cả ngày', dayInOctober: 'Ngày {{day}}/10',
  searchPlaceholder: 'Tìm mã vé, người mua...', checkIn: 'Check-in vé', soldTotal: 'Tổng số vé đã bán',
  checkedTotal: 'Tổng số vé đã check-in', remainingTotal: 'Số vé còn lại', userTickets: 'Vé người dùng',
  recorded: '{{count}} vé được ghi nhận', filterStatus: 'Lọc trạng thái vé', allStatuses: 'Tất cả trạng thái',
  owner: 'Người sở hữu', ticketType: 'Loại vé', issuedDate: 'Ngày phát hành', empty: 'Không tìm thấy vé phù hợp.',
  noEmail: 'Chưa có email', unknownType: 'Loại vé không xác định', pageOf: 'Trang {{page}} / {{total}}',
  previousPage: 'Trang trước', nextPage: 'Trang sau', closeDetail: 'Đóng chi tiết', detailTitle: 'Chi tiết vé',
  eventTicket: 'Vé sự kiện', ticketCode: 'Mã vé', viewQr: 'Xem mã QR', order: 'Đơn hàng',
  issuedAt: 'Phát hành lúc', checkedAt: 'Check-in lúc',
};
resources.en.translation.management.userTickets = {
  statusPending: 'Pending use', statusChecked: 'Used', statusCancelled: 'Cancelled', statusUnknown: 'Unknown',
  kicker: 'Issuance & control', title: 'Purchased tickets',
  intro: 'Look up ticket owners, ticket types and usage status in one operations table.', ticketDate: 'Ticket date',
  filterDate: 'Filter by ticket date', allDates: 'All dates', dayInOctober: 'October {{day}}',
  searchPlaceholder: 'Search ticket code or buyer...', checkIn: 'Check in tickets', soldTotal: 'Tickets sold',
  checkedTotal: 'Tickets checked in', remainingTotal: 'Tickets remaining', userTickets: 'User tickets',
  recorded: '{{count}} tickets recorded', filterStatus: 'Filter ticket status', allStatuses: 'All statuses',
  owner: 'Owner', ticketType: 'Ticket type', issuedDate: 'Issued date', empty: 'No matching tickets found.',
  noEmail: 'No email', unknownType: 'Unknown ticket type', pageOf: 'Page {{page}} / {{total}}',
  previousPage: 'Previous page', nextPage: 'Next page', closeDetail: 'Close details', detailTitle: 'Ticket details',
  eventTicket: 'Event ticket', ticketCode: 'Ticket code', viewQr: 'View QR code', order: 'Order',
  issuedAt: 'Issued at', checkedAt: 'Checked in at',
};

resources.vi.translation.management.checkIn = {
  invalidQr: 'Vui lòng cung cấp mã QR hợp lệ.', attendee: 'Khách tham gia', ticketFallback: 'Vé FPTU Halloween',
  success: 'Check-in vé thành công.', cameraPermission: 'Trình duyệt chưa được cấp quyền camera.',
  cameraMissing: 'Không tìm thấy camera trên thiết bị.', cameraInUse: 'Camera đang được sử dụng ở ứng dụng hoặc tab khác.',
  httpsRequired: 'Trang quét QR phải được mở bằng HTTPS.', cameraUnsupported: 'Trình duyệt không hỗ trợ quét QR bằng camera.',
  kicker: 'Cổng vào sự kiện', title: 'Check-in vé', intro: 'Quét mã QR của khách và theo dõi các lượt check-in trong ca trực.',
  openCamera: 'Mở camera check-in', scannedToday: 'Đã quét hôm nay', latestScan: 'Lượt quét gần nhất',
  scannedTickets: 'Vé đã quét', scannedList: 'Danh sách lượt check-in trên tài khoản này',
  manualPlaceholder: 'Nhập mã QR nếu không dùng camera...', confirm: 'Xác nhận', emptyTitle: 'Chưa có lượt check-in',
  emptyText: 'Mở camera để bắt đầu quét vé của khách.', ticketInfo: 'Thông tin vé', qrRecognized: 'Đã nhận diện mã QR',
  ticketCode: 'Mã vé', phone: 'Số điện thoại: {{phone}}', ticketType: 'Loại vé',
  invalidTicketNote: 'Vé chỉ được check-in đúng ngày ghi trên vé và chưa từng được sử dụng.',
  wrongDateTitle: 'Vé chưa đúng ngày sử dụng', usedTitle: 'Vé đã hết hiệu lực check-in',
  wrongDateText: 'Vé này chỉ được check-in vào đúng ngày sự kiện ghi trên vé.',
  usedText: 'Vé này đã được check-in hoặc không còn ở trạng thái có thể sử dụng.', notes: 'Lưu ý',
  noteIdentity: 'Đối chiếu tên và số điện thoại với khách trước khi xác nhận.',
  noteDate: 'Chỉ check-in vé đúng ngày sự kiện, không xác nhận vé đã sử dụng.',
  noteMismatch: 'Nếu thông tin không khớp, giữ vé ở trạng thái chờ và báo trưởng ban hoặc điều phối.',
  processing: 'Đang xử lý...', confirmCheckIn: 'Xác nhận check-in', scanQr: 'Quét mã QR', scanning: 'Đang quét',
  positionQr: 'Đưa mã QR vào khung', closeCamera: 'Đóng camera', cameraHint: 'Giữ mã QR cách camera khoảng 15–30 cm.',
};
resources.en.translation.management.checkIn = {
  invalidQr: 'Please provide a valid QR code.', attendee: 'Attendee', ticketFallback: 'FPTU Halloween ticket',
  success: 'Ticket checked in successfully.', cameraPermission: 'Camera permission has not been granted.',
  cameraMissing: 'No camera was found on this device.', cameraInUse: 'The camera is being used by another app or tab.',
  httpsRequired: 'The QR scanner must be opened over HTTPS.', cameraUnsupported: 'This browser does not support camera QR scanning.',
  kicker: 'Event entrance', title: 'Ticket check-in', intro: 'Scan attendee QR codes and monitor check-ins during your shift.',
  openCamera: 'Open check-in camera', scannedToday: 'Scanned today', latestScan: 'Latest scan',
  scannedTickets: 'Scanned tickets', scannedList: 'Check-ins recorded on this account',
  manualPlaceholder: 'Enter a QR code when not using the camera...', confirm: 'Confirm', emptyTitle: 'No check-ins yet',
  emptyText: 'Open the camera to start scanning attendee tickets.', ticketInfo: 'Ticket information', qrRecognized: 'QR code recognized',
  ticketCode: 'Ticket code', phone: 'Phone: {{phone}}', ticketType: 'Ticket type',
  invalidTicketNote: 'A ticket can be checked in only on its event date and only if it has not been used.',
  wrongDateTitle: 'Ticket is not valid today', usedTitle: 'Ticket can no longer be checked in',
  wrongDateText: 'This ticket can be checked in only on the event date printed on it.',
  usedText: 'This ticket has already been checked in or is no longer usable.', notes: 'Notes',
  noteIdentity: 'Verify the attendee name and phone number before confirming.',
  noteDate: 'Check in tickets only on the correct event date and never confirm a used ticket.',
  noteMismatch: 'If the information does not match, leave the ticket pending and notify the lead or coordinator.',
  processing: 'Processing...', confirmCheckIn: 'Confirm check-in', scanQr: 'Scan QR code', scanning: 'Scanning',
  positionQr: 'Place the QR code inside the frame', closeCamera: 'Close camera', cameraHint: 'Hold the QR code 15–30 cm from the camera.',
};

resources.vi.translation.chat = {
  conversation: 'Cuộc trò chuyện', unnamed: 'Không tên', brand: 'HolaWeen Chat', messages: 'Tin nhắn',
  loadingConversations: 'Đang tải cuộc trò chuyện...', conversationsLoaded: 'Đã tải danh sách tin nhắn',
  loadMessagesError: 'Không thể tải tin nhắn', searchStaffError: 'Không thể tìm kiếm thành viên',
  realtimeError: 'Không thể kết nối chat thời gian thực', loadingMessages: 'Đang tải tin nhắn...',
  conversationOpened: 'Đã mở cuộc trò chuyện', joinError: 'Không thể tham gia đoạn chat', openError: 'Không thể mở cuộc trò chuyện',
  creatingConversation: 'Đang tạo cuộc trò chuyện...', readyToMessage: 'Đã sẵn sàng nhắn tin',
  createConversationError: 'Không thể tạo cuộc trò chuyện', groupValidation: 'Vui lòng nhập tên và chọn thành viên',
  creatingGroup: 'Đang tạo nhóm...', groupCreated: 'Đã tạo nhóm', createGroupError: 'Không thể tạo nhóm',
  searchMembersError: 'Không thể tìm thành viên', groupNameRequired: 'Vui lòng nhập tên nhóm',
  cannotRemoveCreator: 'Không thể xóa người tạo nhóm', updatingGroup: 'Đang cập nhật nhóm...',
  groupUpdated: 'Đã cập nhật nhóm', updateGroupError: 'Không thể cập nhật nhóm', leavingGroup: 'Đang rời nhóm...',
  groupLeft: 'Đã rời nhóm', leaveGroupError: 'Không thể rời nhóm', removingMember: 'Đang xóa thành viên...',
  memberRemoved: 'Đã xóa thành viên khỏi nhóm', removeMemberError: 'Không thể xóa thành viên',
  realtimeNotReady: 'Kết nối thời gian thực chưa sẵn sàng', serverMessageError: 'Không nhận được tin nhắn từ máy chủ',
  backToList: 'Quay lại danh sách', typing: 'Đang nhập...', eventGroup: 'Nhóm tin nhắn sự kiện',
  online: 'Đang hoạt động', offline: 'Ngoại tuyến', internalChannel: 'Kênh trao đổi nội bộ',
  conversationInfo: 'Thông tin cuộc trò chuyện', emptyMessages: 'Chưa có tin nhắn',
  startChatWith: 'Hãy bắt đầu trao đổi với {{name}}.', messagePlaceholder: 'Viết tin nhắn...',
  messageContent: 'Nội dung tin nhắn', sendMessage: 'Gửi tin nhắn', welcome: 'Chào mừng đến HolaWeen Chat',
  welcomeText: 'Chọn thành viên hoặc nhóm ở bên trái để bắt đầu.', chatInfo: 'Thông tin đoạn chat',
  internalGroup: 'Nhóm trao đổi nội bộ', members: 'Thành viên ({{count}})', departmentMissing: 'Chưa cập nhật bộ phận / chức vụ',
  removeMemberAria: 'Xóa {{name}} khỏi nhóm', removeFromGroup: 'Xóa khỏi nhóm', leaveGroup: 'Rời nhóm',
  staffUsername: 'staff', leaveConfirmTitle: 'Rời nhóm?', leaveConfirmText: 'Bạn sẽ không còn nhận được tin nhắn trong nhóm này.',
  removeConfirmTitle: 'Xóa thành viên?', removeConfirmText: 'Bạn muốn xóa {{name}} khỏi nhóm này?',
  removing: 'Đang xóa...', removeMember: 'Xóa thành viên', adminTool: 'CÔNG CỤ QUẢN TRỊ',
  editGroup: 'Chỉnh sửa nhóm chat', createGroup: 'Tạo nhóm chat', groupName: 'Tên nhóm',
  groupNamePlaceholder: 'Ví dụ: Core Truyền thông', description: 'Mô tả',
  descriptionPlaceholder: 'Mục đích của nhóm (không bắt buộc)', addMembers: 'Thêm thành viên',
  searchUsername: 'Tìm theo tên người dùng', selectedMembers: '{{count}} thành viên được chọn',
  updating: 'Đang cập nhật...', creating: 'Đang tạo...', saveChanges: 'Lưu thay đổi', createGroupAction: 'Tạo nhóm',
  conversationList: 'Danh sách cuộc trò chuyện', searchPlaceholder: 'Tìm thành viên hoặc nhóm', clearSearch: 'Xóa tìm kiếm',
  searchResults: 'KẾT QUẢ TÌM KIẾM', searching: 'Đang tìm kiếm...', noResults: 'Không tìm thấy kết quả',
  noResultsText: 'Thử tìm bằng tên nhóm hoặc tên người dùng khác.', startConversation: 'Bắt đầu cuộc trò chuyện',
  unread: 'Chưa đọc', editAria: 'Chỉnh sửa {{name}}', emptyConversations: 'Chưa có cuộc trò chuyện',
  emptyConversationsText: 'Tìm một thành viên để bắt đầu.',
};
resources.en.translation.chat = {
  conversation: 'Conversation', unnamed: 'Unnamed', brand: 'HolaWeen Chat', messages: 'Messages',
  loadingConversations: 'Loading conversations...', conversationsLoaded: 'Message list loaded',
  loadMessagesError: 'Unable to load messages', searchStaffError: 'Unable to search for staff',
  realtimeError: 'Unable to connect to realtime chat', loadingMessages: 'Loading messages...',
  conversationOpened: 'Conversation opened', joinError: 'Unable to join the chat', openError: 'Unable to open the conversation',
  creatingConversation: 'Creating conversation...', readyToMessage: 'Ready to message',
  createConversationError: 'Unable to create conversation', groupValidation: 'Enter a name and select at least one member',
  creatingGroup: 'Creating group...', groupCreated: 'Group created', createGroupError: 'Unable to create group',
  searchMembersError: 'Unable to search for members', groupNameRequired: 'Please enter a group name',
  cannotRemoveCreator: 'The group creator cannot be removed', updatingGroup: 'Updating group...',
  groupUpdated: 'Group updated', updateGroupError: 'Unable to update group', leavingGroup: 'Leaving group...',
  groupLeft: 'You left the group', leaveGroupError: 'Unable to leave group', removingMember: 'Removing member...',
  memberRemoved: 'Member removed from group', removeMemberError: 'Unable to remove member',
  realtimeNotReady: 'Realtime connection is not ready', serverMessageError: 'No message was received from the server',
  backToList: 'Back to list', typing: 'Typing...', eventGroup: 'Event message group',
  online: 'Online', offline: 'Offline', internalChannel: 'Internal communication channel',
  conversationInfo: 'Conversation information', emptyMessages: 'No messages yet',
  startChatWith: 'Start a conversation with {{name}}.', messagePlaceholder: 'Write a message...',
  messageContent: 'Message content', sendMessage: 'Send message', welcome: 'Welcome to HolaWeen Chat',
  welcomeText: 'Choose a member or group on the left to begin.', chatInfo: 'Chat information',
  internalGroup: 'Internal discussion group', members: 'Members ({{count}})', departmentMissing: 'Department / position not updated',
  removeMemberAria: 'Remove {{name}} from group', removeFromGroup: 'Remove from group', leaveGroup: 'Leave group',
  staffUsername: 'staff', leaveConfirmTitle: 'Leave group?', leaveConfirmText: 'You will no longer receive messages from this group.',
  removeConfirmTitle: 'Remove member?', removeConfirmText: 'Do you want to remove {{name}} from this group?',
  removing: 'Removing...', removeMember: 'Remove member', adminTool: 'ADMIN TOOL',
  editGroup: 'Edit chat group', createGroup: 'Create chat group', groupName: 'Group name',
  groupNamePlaceholder: 'Example: Communications Core', description: 'Description',
  descriptionPlaceholder: 'Purpose of the group (optional)', addMembers: 'Add members',
  searchUsername: 'Search by username', selectedMembers: '{{count}} members selected',
  updating: 'Updating...', creating: 'Creating...', saveChanges: 'Save changes', createGroupAction: 'Create group',
  conversationList: 'Conversation list', searchPlaceholder: 'Search members or groups', clearSearch: 'Clear search',
  searchResults: 'SEARCH RESULTS', searching: 'Searching...', noResults: 'No results found',
  noResultsText: 'Try another group name or username.', startConversation: 'Start a conversation',
  unread: 'Unread', editAria: 'Edit {{name}}', emptyConversations: 'No conversations yet',
  emptyConversationsText: 'Find a staff member to begin.',
};

resources.vi.translation.management.hotNews = {
  contentRequired: 'Nội dung thông báo không được để trống.', deleting: 'Đang xóa thông báo...',
  reordering: 'Đang cập nhật thứ tự...', reordered: 'Đã cập nhật thứ tự hiển thị',
  forbiddenTitle: 'Không có quyền truy cập', forbiddenText: 'Chỉ quản trị viên mới có thể quản lý thông báo.',
  kicker: 'Bảng tin sự kiện', title: 'Thông báo, đúng lúc.',
  intro: 'Soạn nội dung ngắn để đưa thông tin quan trọng lên đầu hành trình của người tham dự.',
  add: 'Thêm thông báo', currentList: 'Danh sách hiện tại', listTitle: 'Thông báo nổi bật', count: '{{count}} thông báo',
  emptyTitle: 'Chưa có thông báo nào.', emptyText: 'Thêm thông báo đầu tiên để cập nhật nhanh cho người tham dự.',
  visible: 'Đang hiển thị', hidden: 'Đang tắt', openLink: 'Mở liên kết', turnOff: 'Tắt', turnOn: 'Bật',
  moveUpAria: 'Đưa thông báo {{index}} lên trước', moveUp: 'Đưa lên', moveDownAria: 'Đưa thông báo {{index}} xuống sau',
  moveDown: 'Đưa xuống', deletingShort: 'Đang xóa…', editor: 'Biên tập', edit: 'Sửa thông báo',
  closeDialog: 'Đóng cửa sổ', contentLabel: 'Nội dung thông báo (hạn chế dùng biểu tượng và viết hoa)',
  contentPlaceholder: 'Ví dụ: Cổng check-in mở lúc 18:00 tại sảnh chính.', contentHelp: 'Tối đa 500 ký tự.',
  link: 'Liên kết', optional: '(không bắt buộc)', saving: 'Đang lưu…', saveChanges: 'Lưu thay đổi',
  deleteTitle: 'Xóa thông báo?', deleteDescription: 'Thông báo này sẽ bị xóa khỏi bảng tin.<br />Hành động này không thể hoàn tác.',
  deleteConfirm: 'Xóa thông báo',
};
resources.en.translation.management.hotNews = {
  contentRequired: 'Announcement content is required.', deleting: 'Deleting announcement...',
  reordering: 'Updating order...', reordered: 'Display order updated',
  forbiddenTitle: 'Access denied', forbiddenText: 'Only administrators can manage announcements.',
  kicker: 'Event bulletin', title: 'The right message, right on time.',
  intro: 'Write concise updates that put important information at the start of each attendee journey.',
  add: 'Add announcement', currentList: 'Current list', listTitle: 'Announcements', count: '{{count}} announcements',
  emptyTitle: 'No announcements yet.', emptyText: 'Add the first announcement to quickly update attendees.',
  visible: 'Visible', hidden: 'Hidden', openLink: 'Open link', turnOff: 'Turn off', turnOn: 'Turn on',
  moveUpAria: 'Move announcement {{index}} up', moveUp: 'Move up', moveDownAria: 'Move announcement {{index}} down',
  moveDown: 'Move down', deletingShort: 'Deleting…', editor: 'Editor', edit: 'Edit announcement',
  closeDialog: 'Close dialog', contentLabel: 'Announcement content (limit icons and uppercase text)',
  contentPlaceholder: 'Example: Check-in opens at 18:00 in the main lobby.', contentHelp: 'Maximum 500 characters.',
  link: 'Link', optional: '(optional)', saving: 'Saving…', saveChanges: 'Save changes',
  deleteTitle: 'Delete announcement?', deleteDescription: 'This announcement will be removed from the bulletin.<br />This action cannot be undone.',
  deleteConfirm: 'Delete announcement',
};

resources.vi.translation.management.feedback = {
  loading: 'Đang nạp kho phản hồi…', loadError: 'Không mở được kho phản hồi', kicker: 'BÀN PHẢN HỒI',
  title: 'Kho tiếng nói của mùa lễ hội.', intro: 'Soạn biểu mẫu riêng cho người tham dự và đội ngũ vận hành, rồi đọc tín hiệu sau mỗi lượt gửi.',
  createAttendeeFirst: 'Hãy tạo biểu mẫu dành cho người tham dự trước', hideFeedback: 'Ẩn nút đánh giá',
  showFeedback: 'Hiện nút đánh giá', newForm: 'Biểu mẫu mới', forms: 'Biểu mẫu', staffAudience: 'Đội ngũ vận hành',
  attendeeAudience: 'Người tham dự', staffShort: 'BTC', statusdraft: 'Bản nháp', statuspublished: 'Đang mở', statusclosed: 'Đã đóng',
  responseCount: '{{count}} phản hồi', opens: 'Mở: {{time}}', closes: 'Đóng: {{time}}',
  emptyForms: 'Chưa có biểu mẫu nào. Bắt đầu bằng một biểu mẫu mới.', editingLabel: 'ĐANG CHỈNH SỬA',
  newDraftLabel: 'BẢN NHÁP MỚI', editFormTitle: 'Chỉnh lại biểu mẫu phản hồi', newFormTitle: 'Mở một biểu mẫu mới',
  deleteForm: 'Xóa biểu mẫu', formTitle: 'Tiêu đề', titlePlaceholder: 'Ví dụ: Tổng kết nội bộ sau sự kiện', audience: 'Đối tượng',
  description: 'Mô tả', descriptionPlaceholder: 'Nói ngắn gọn vì sao phản hồi này quan trọng…', openForm: 'Mở biểu mẫu',
  closeForm: 'Đóng biểu mẫu', structure: 'CẤU TRÚC', formQuestions: 'Câu hỏi trong biểu mẫu',
  questionNumber: 'Câu hỏi số {{number}}', deleteQuestion: 'Xóa câu hỏi', question: 'Câu hỏi',
  questionPlaceholder: 'Nhập câu hỏi…', answerType: 'Kiểu trả lời', ratingType: 'Chấm điểm 1–5', textType: 'Đoạn văn',
  singleType: 'Một lựa chọn', multipleType: 'Nhiều lựa chọn', required: 'Bắt buộc trả lời', answerOptions: 'Các phương án trả lời',
  onePerLine: '(mỗi phương án viết trên một dòng)', optionsPlaceholder: 'Ví dụ:\nRất hài lòng\nBình thường\nCần cải thiện',
  addAfterQuestion: 'Thêm câu hỏi sau câu {{number}}', timeNotSet: 'Chưa đặt thời gian mở biểu mẫu', saving: 'Đang lưu…',
  saveForm: 'Lưu biểu mẫu', afterSubmit: 'SAU KHI GỬI', insightsTitle: 'Những gì đang được nói.', responses: 'lượt phản hồi',
  averageScore: 'ĐIỂM TRUNG BÌNH', choiceDistribution: 'PHÂN BỐ LỰA CHỌN', anonymous: 'Ẩn danh',
  responseList: 'DANH SÁCH PHẢN HỒI', submissions: '{{count}} lượt gửi', closeResponses: 'Đóng danh sách phản hồi',
  loadingResponses: 'Đang tải phản hồi…', emptyResponses: 'Chưa có phản hồi nào cho biểu mẫu này.', sender: 'Người gửi {{number}}',
  editForm: 'Chỉnh sửa biểu mẫu',
};
resources.en.translation.management.feedback = {
  loading: 'Loading feedback archive…', loadError: 'Unable to open the feedback archive', kicker: 'FEEDBACK DESK',
  title: 'The voice of the festival.', intro: 'Create separate forms for attendees and the operations team, then read the signals after every submission.',
  createAttendeeFirst: 'Create an attendee feedback form first', hideFeedback: 'Hide feedback button',
  showFeedback: 'Show feedback button', newForm: 'New form', forms: 'Forms', staffAudience: 'Operations team',
  attendeeAudience: 'Attendees', staffShort: 'Organizers', statusdraft: 'Draft', statuspublished: 'Open', statusclosed: 'Closed',
  responseCount: '{{count}} responses', opens: 'Opens: {{time}}', closes: 'Closes: {{time}}',
  emptyForms: 'No forms yet. Start with a new form.', editingLabel: 'EDITING',
  newDraftLabel: 'NEW DRAFT', editFormTitle: 'Edit feedback form', newFormTitle: 'Open a new form',
  deleteForm: 'Delete form', formTitle: 'Title', titlePlaceholder: 'Example: Post-event staff debrief', audience: 'Audience',
  description: 'Description', descriptionPlaceholder: 'Briefly explain why this feedback matters…', openForm: 'Open form',
  closeForm: 'Close form', structure: 'STRUCTURE', formQuestions: 'Questions in this form',
  questionNumber: 'Question {{number}}', deleteQuestion: 'Delete question', question: 'Question',
  questionPlaceholder: 'Enter a question…', answerType: 'Answer type', ratingType: 'Rating 1–5', textType: 'Paragraph',
  singleType: 'Single choice', multipleType: 'Multiple choice', required: 'Required answer', answerOptions: 'Answer options',
  onePerLine: '(one option per line)', optionsPlaceholder: 'Example:\nVery satisfied\nNeutral\nNeeds improvement',
  addAfterQuestion: 'Add a question after question {{number}}', timeNotSet: 'Form opening time is not set', saving: 'Saving…',
  saveForm: 'Save form', afterSubmit: 'AFTER SUBMISSION', insightsTitle: 'What people are saying.', responses: 'responses',
  averageScore: 'AVERAGE SCORE', choiceDistribution: 'CHOICE DISTRIBUTION', anonymous: 'Anonymous',
  responseList: 'RESPONSE LIST', submissions: '{{count}} submissions', closeResponses: 'Close response list',
  loadingResponses: 'Loading responses…', emptyResponses: 'No responses for this form yet.', sender: 'Respondent {{number}}',
  editForm: 'Edit form',
};

resources.vi.translation.management.voteAdmin = {
  statusDraft: 'Bản nháp', statusOpen: 'Đang mở', statusClosed: 'Đã đóng', expired: 'Đã hết thời gian',
  days: '{{count}} ngày', hours: '{{count}} giờ', minutes: '{{count}} phút', seconds: '{{count}} giây',
  validationInformation: 'Vui lòng nhập đầy đủ thông tin Phiên Vote: tiêu đề, mô tả, thời gian bắt đầu và thời gian đóng.',
  validationCategories: 'Vui lòng thêm ít nhất một hạng mục bình chọn và hai đáp án.',
  validationCategory: 'Vui lòng nhập tên hạng mục {{number}} và ít nhất hai đáp án.',
  popupBlocked: 'Trình duyệt đã chặn tab mới. Vui lòng cho phép cửa sổ bật lên để mở màn hình công bố.',
  confirmCloseTitle: 'Xác nhận đóng bình chọn', confirmCloseTimeTitle: 'Xác nhận đổi thời điểm đóng',
  confirmReopenTitle: 'Xác nhận mở lại bình chọn', confirmOpenTitle: 'Xác nhận mở bình chọn',
  kicker: 'Điều hành bình chọn D-Day', title: 'Quản lý bình chọn', intro: 'Một Phiên Vote duy nhất cho ngày sự kiện.',
  deleting: 'Đang xóa…', deleteAll: 'Xóa tất cả dữ liệu', editCampaign: 'Chỉnh sửa Phiên Vote',
  cancelEditing: 'Hủy chỉnh sửa', loadingConfig: 'Đang tải cấu hình…', totalVotes: 'Tổng lượt bình chọn',
  closingTime: 'Thời điểm đóng', setupKicker: 'Thiết lập Phiên Vote · D-Day', information: 'Thông tin bình chọn',
  campaignTitle: 'Tiêu đề', titlePlaceholder: 'Bình chọn D-Day', description: 'Mô tả hướng dẫn người tham gia',
  descriptionPlaceholder: 'Ví dụ: Hãy chọn một tiết mục bạn yêu thích ở mỗi hạng mục.',
  plannedOpening: 'Thời điểm bắt đầu dự kiến', automaticClosing: 'Thời điểm tự động đóng', categories: 'Các hạng mục bình chọn',
  categoriesHelp: 'Mỗi hạng mục cần ít nhất hai lựa chọn. Mã nội bộ có thể giữ nguyên nếu không cần thay đổi.',
  addCategory: 'Thêm hạng mục', categoryNumber: 'Hạng mục {{number}}', deleteCategory: 'Xóa hạng mục', categoryName: 'Tên hạng mục',
  categoryPlaceholder: 'Ví dụ: Tiết mục yêu thích', optionNumber: 'Lựa chọn {{number}}', optionCodePlaceholder: 'Ví dụ: MĐ',
  optionNamePlaceholder: 'Ví dụ: Tên lựa chọn', deleteOption: 'Xóa lựa chọn', addOption: 'Thêm lựa chọn', openVoting: 'Mở bình chọn',
  saving: 'Đang lưu…', saveChanges: 'Lưu thay đổi', saveCampaign: 'Lưu Phiên Vote', editCloseTime: 'Chỉnh thời điểm đóng',
  viewCountdown: 'Xem màn hình đếm ngược', closeNow: 'Đóng bình chọn ngay',
  reopenNote: 'Bình chọn đã đóng. Bạn có thể mở lại và chọn thời điểm đóng mới để mở thêm thời gian.',
  reopenVoting: 'Mở lại bình chọn', viewVoters: 'Xem danh sách người vote', publishResults: 'Công bố kết quả',
  summaryResults: 'Kết quả tổng hợp', validVotes: '{{count}} lượt bình chọn hợp lệ',
  closeWarning: 'Bạn có chắc muốn đóng bình chọn ngay không? Người tham gia sẽ không thể gửi lượt bình chọn mới sau thao tác này.',
  reopenWarning: 'Bình chọn sẽ được mở lại để có thêm thời gian. Hãy chọn thời điểm đóng mới.',
  openWarning: 'Bình chọn sẽ bắt đầu nhận lượt bình chọn ngay sau khi xác nhận.',
  closeTimeWarning: 'Thời điểm đóng hiện tại sẽ được thay bằng thời điểm mới. Người tham gia vẫn có thể bình chọn trong thời gian bình chọn đang mở.',
  processing: 'Đang xử lý…', closeVoting: 'Đóng bình chọn', saveNewTime: 'Lưu thời điểm mới',
  reopenAndExtend: 'Mở lại và thêm thời gian', remainingTime: 'Thời gian bình chọn còn lại', closesAt: 'Thời điểm đóng: {{time}}',
  scanToVote: 'Quét mã để tham gia bình chọn', voteQrAria: 'Mã QR đến trang bình chọn D-Day', contestantImage: 'Ảnh thí sinh',
  contestantPlaceholderAria: 'Vị trí ảnh thí sinh', contestantImageLabel: 'ẢNH THÍ SINH', contestantPlaceholder: 'Vị trí hình ảnh trình chiếu',
  voterList: 'Danh sách người đã bình chọn', voterSummary: 'Hiển thị {{count}} tài khoản đã gửi bình chọn.',
  loadingVoters: 'Đang tải danh sách người vote…', emptyVoters: 'Chưa có tài khoản nào gửi bình chọn.',
  noName: 'Không có tên', noEmail: 'Không có email', category: 'Hạng mục', option: 'Lựa chọn', pageOf: 'Trang {{page}} / {{total}}',
  deleteTitleOne: 'Xác nhận xóa Phiên Vote (1/2)',
  deleteDescriptionOne: 'Bạn sắp xóa cổng bình chọn hiện tại cùng toàn bộ dữ liệu bình chọn.<br />Bạn có chắc muốn tiếp tục?',
  continue: 'Tiếp tục', deleteTitleTwo: 'Xác nhận xóa Phiên Vote (2/2)',
  deleteDescriptionTwo: 'Đây là thao tác không thể hoàn tác. Cổng và toàn bộ lượt vote sẽ bị xóa khỏi hệ thống.<br />Bạn có chắc chắn muốn xóa không?',
  deleteConfirm: 'Xóa cổng và lượt vote', saveChangesTitle: 'Xác nhận lưu thay đổi', saveCampaignTitle: 'Xác nhận lưu Phiên Vote',
  saveChangesDescription: 'Các thay đổi sẽ cập nhật nội dung Phiên Vote D-Day đang ở bản nháp.<br />Bạn có chắc muốn lưu không?',
  saveCampaignDescription: 'Thông tin Phiên Vote D-Day sẽ được lưu ở trạng thái bản nháp.<br />Bạn có chắc muốn tiếp tục không?',
  publishTitle: 'Xác nhận công bố kết quả',
  publishDescription: 'Màn hình công bố sẽ mở ở tab mới để bạn đưa lên màn LED.<br />Bạn có chắc muốn tiếp tục?',
  openPublishScreen: 'Mở màn hình công bố',
};
resources.en.translation.management.voteAdmin = {
  statusDraft: 'Draft', statusOpen: 'Open', statusClosed: 'Closed', expired: 'Time expired',
  days: '{{count}} days', hours: '{{count}} hours', minutes: '{{count}} minutes', seconds: '{{count}} seconds',
  validationInformation: 'Enter all campaign information: title, description, opening time and closing time.',
  validationCategories: 'Add at least one voting category with two options.',
  validationCategory: 'Enter a name for category {{number}} and at least two options.',
  popupBlocked: 'The browser blocked the new tab. Allow popups to open the results screen.',
  confirmCloseTitle: 'Confirm closing voting', confirmCloseTimeTitle: 'Confirm closing-time change',
  confirmReopenTitle: 'Confirm reopening voting', confirmOpenTitle: 'Confirm opening voting',
  kicker: 'D-Day voting operations', title: 'Voting management', intro: 'One voting campaign for event day.',
  deleting: 'Deleting…', deleteAll: 'Delete all data', editCampaign: 'Edit campaign', cancelEditing: 'Cancel editing',
  loadingConfig: 'Loading configuration…', totalVotes: 'Total votes', closingTime: 'Closing time',
  setupKicker: 'Campaign setup · D-Day', information: 'Voting information', campaignTitle: 'Title', titlePlaceholder: 'D-Day Voting',
  description: 'Instructions for participants', descriptionPlaceholder: 'Example: Choose your favorite performance in each category.',
  plannedOpening: 'Planned opening time', automaticClosing: 'Automatic closing time', categories: 'Voting categories',
  categoriesHelp: 'Each category needs at least two options. Keep internal codes unchanged unless necessary.',
  addCategory: 'Add category', categoryNumber: 'Category {{number}}', deleteCategory: 'Delete category', categoryName: 'Category name',
  categoryPlaceholder: 'Example: Favorite performance', optionNumber: 'Option {{number}}', optionCodePlaceholder: 'Example: MD',
  optionNamePlaceholder: 'Example: Option name', deleteOption: 'Delete option', addOption: 'Add option', openVoting: 'Open voting',
  saving: 'Saving…', saveChanges: 'Save changes', saveCampaign: 'Save campaign', editCloseTime: 'Edit closing time',
  viewCountdown: 'View countdown screen', closeNow: 'Close voting now',
  reopenNote: 'Voting is closed. You can reopen it and choose a new closing time to provide more time.',
  reopenVoting: 'Reopen voting', viewVoters: 'View voter list', publishResults: 'Publish results',
  summaryResults: 'Results summary', validVotes: '{{count}} valid votes',
  closeWarning: 'Are you sure you want to close voting now? Participants will not be able to submit new votes afterward.',
  reopenWarning: 'Voting will reopen for additional time. Choose a new closing time.',
  openWarning: 'Voting will begin accepting votes immediately after confirmation.',
  closeTimeWarning: 'The current closing time will be replaced. Participants can continue voting while the campaign remains open.',
  processing: 'Processing…', closeVoting: 'Close voting', saveNewTime: 'Save new time', reopenAndExtend: 'Reopen and extend',
  remainingTime: 'Voting time remaining', closesAt: 'Closes at: {{time}}', scanToVote: 'Scan to vote',
  voteQrAria: 'QR code for the D-Day voting page', contestantImage: 'Contestant image', contestantPlaceholderAria: 'Contestant image placeholder',
  contestantImageLabel: 'CONTESTANT IMAGE', contestantPlaceholder: 'Presentation image placeholder', voterList: 'Voter list',
  voterSummary: 'Showing {{count}} accounts that submitted votes.', loadingVoters: 'Loading voters…',
  emptyVoters: 'No accounts have submitted a vote.', noName: 'No name', noEmail: 'No email', category: 'Category', option: 'Option',
  pageOf: 'Page {{page}} / {{total}}', deleteTitleOne: 'Confirm campaign deletion (1/2)',
  deleteDescriptionOne: 'You are about to delete the current voting campaign and all voting data.<br />Do you want to continue?',
  continue: 'Continue', deleteTitleTwo: 'Confirm campaign deletion (2/2)',
  deleteDescriptionTwo: 'This action cannot be undone. The campaign and all votes will be removed from the system.<br />Are you sure?',
  deleteConfirm: 'Delete campaign and votes', saveChangesTitle: 'Confirm saving changes', saveCampaignTitle: 'Confirm saving campaign',
  saveChangesDescription: 'These changes will update the draft D-Day campaign.<br />Are you sure you want to save?',
  saveCampaignDescription: 'The D-Day campaign will be saved as a draft.<br />Do you want to continue?',
  publishTitle: 'Confirm publishing results',
  publishDescription: 'The publishing screen will open in a new tab for display on the LED screen.<br />Do you want to continue?',
  openPublishScreen: 'Open publishing screen',
};

resources.vi.translation.management.publish = {
  votes: '{{count}} phiếu', preparing: 'Đang chuẩn bị màn hình công bố…', errorTitle: 'Chưa thể công bố kết quả',
  loadingResults: 'Đang tải kết quả…', publishResults: 'Công bố kết quả', liveResults: 'KẾT QUẢ BÌNH CHỌN TRỰC TIẾP',
  resultsTitle: 'Kết quả bình chọn', totalVotes: 'Tổng số lượt bình chọn', voteCountLabel: 'lượt bình chọn',
  category: 'HẠNG MỤC {{number}}', chartAria: 'Biểu đồ kết quả {{category}}', voteNumber: 'Số phiếu',
};
resources.en.translation.management.publish = {
  votes: '{{count}} votes', preparing: 'Preparing the publishing screen…', errorTitle: 'Results cannot be published yet',
  loadingResults: 'Loading results…', publishResults: 'Publish results', liveResults: 'LIVE VOTING RESULTS',
  resultsTitle: 'Voting results', totalVotes: 'Total votes', voteCountLabel: 'votes',
  category: 'CATEGORY {{number}}', chartAria: 'Results chart for {{category}}', voteNumber: 'Votes',
};

resources.vi.translation.vote = {
  statusOpen: 'Đang mở', statusClosed: 'Đã đóng', statusDraft: 'Chưa mở',
  googleNotReady: 'Google chưa sẵn sàng. Vui lòng thử lại sau ít giây.',
  googleAuthError: 'Không thể xác thực tài khoản Google.', googleAuthSuccess: 'Xác thực Google thành công.',
  verifyBeforeSubmit: 'Vui lòng xác thực Google trước khi gửi bình chọn.', loading: 'Đang tải thông tin bình chọn…',
  loadError: 'Không thể tải bình chọn', retry: 'Thử lại', kicker: 'FPTU Halloween · Bình chọn D-Day',
  title: 'Bình chọn D-Day', description: 'Chọn một phương án ở mỗi hạng mục. Bạn chỉ có thể gửi bình chọn một lần.',
  closingTime: 'Thời gian kết thúc: {{time}}', checkingStatus: 'Đang kiểm tra trạng thái bình chọn',
  checkingStatusText: 'Vui lòng chờ một chút, chúng tôi đang kiểm tra bạn đã bình chọn chưa.',
  stepOne: 'Bước 1 · Xác minh tài khoản', googleTitle: 'Đăng nhập Google để bắt đầu',
  googleDescription: 'Bạn cần đăng nhập bằng tài khoản Google để tham gia. Mỗi tài khoản chỉ được gửi một bình chọn.',
  verifying: 'Đang xác minh…', signInGoogle: 'Đăng nhập với Google',
  googlePrivacy: 'Tài khoản Google chỉ được dùng để xác minh và ghi nhận bình chọn của bạn.',
  stepTwo: 'Bước 2 · Gửi bình chọn', chooseTitle: 'Chọn một phương án ở mỗi hạng mục',
  chooseDescription: 'Hãy chọn phương án bạn yêu thích, sau đó kiểm tra lại trước khi gửi.',
  googleVerified: 'Đã xác minh bằng Google', submitting: 'Đang ghi nhận…', submit: 'Gửi bình chọn',
  submitNote: 'Sau khi gửi, bình chọn sẽ được ghi nhận và không thể thay đổi. Nếu mạng chập chờn, bạn có thể thử lại an toàn.',
  successLabel: 'BÌNH CHỌN THÀNH CÔNG', successTitle: 'Cảm ơn bạn đã tham gia!',
  successText: 'Bình chọn của bạn đã được ghi nhận và không thể thay đổi.', submittedAt: 'Thời gian gửi: {{time}}',
  relatedPages: 'Tham khảo thêm về sự kiện', relatedPagesAria: 'Các trang liên quan', organizers: 'Ban tổ chức',
  eventIntroduction: 'Giới thiệu sự kiện', home: 'Trang chủ', contact: 'Liên hệ',
  closedLabel: 'BÌNH CHỌN ĐÃ ĐÓNG', notOpenLabel: 'BÌNH CHỌN CHƯA MỞ',
  closedTitle: 'Thời gian bình chọn đã kết thúc.', notOpenTitle: 'Bình chọn chưa bắt đầu.',
  closedText: 'Ban tổ chức sẽ công bố kết quả sau khi hoàn tất kiểm tra.',
  notOpenText: 'Vui lòng quay lại sau khi ban tổ chức mở bình chọn.', resultsLabel: 'KẾT QUẢ BÌNH CHỌN',
  totalVotes: '{{count}} phiếu đã gửi', closedAt: 'Kết thúc lúc {{time}}',
};

resources.en.translation.vote = {
  statusOpen: 'Open', statusClosed: 'Closed', statusDraft: 'Not open',
  googleNotReady: 'Google is not ready. Please try again in a few seconds.',
  googleAuthError: 'Unable to authenticate your Google account.', googleAuthSuccess: 'Google authentication successful.',
  verifyBeforeSubmit: 'Please verify with Google before submitting your vote.', loading: 'Loading voting information…',
  loadError: 'Unable to load voting', retry: 'Try again', kicker: 'FPTU Halloween · D-Day Voting',
  title: 'D-Day Voting', description: 'Choose one option in each category. You can submit your vote only once.',
  closingTime: 'Closes at: {{time}}', checkingStatus: 'Checking your voting status',
  checkingStatusText: 'Please wait while we check whether you have already voted.',
  stepOne: 'Step 1 · Verify your account', googleTitle: 'Sign in with Google to begin',
  googleDescription: 'Sign in with a Google account to participate. Each account can submit only one vote.',
  verifying: 'Verifying…', signInGoogle: 'Sign in with Google',
  googlePrivacy: 'Your Google account is used only to verify and record your vote.',
  stepTwo: 'Step 2 · Submit your vote', chooseTitle: 'Choose one option in each category',
  chooseDescription: 'Choose your favorite options, then review them before submitting.',
  googleVerified: 'Verified with Google', submitting: 'Recording…', submit: 'Submit vote',
  submitNote: 'Once submitted, your vote is recorded and cannot be changed. You can safely retry if your connection is unstable.',
  successLabel: 'VOTE SUBMITTED', successTitle: 'Thank you for participating!',
  successText: 'Your vote has been recorded and cannot be changed.', submittedAt: 'Submitted at: {{time}}',
  relatedPages: 'Learn more about the event', relatedPagesAria: 'Related pages', organizers: 'Organizers',
  eventIntroduction: 'Event introduction', home: 'Home', contact: 'Contact',
  closedLabel: 'VOTING CLOSED', notOpenLabel: 'VOTING NOT OPEN',
  closedTitle: 'The voting period has ended.', notOpenTitle: 'Voting has not started.',
  closedText: 'The organizers will publish the results after verification is complete.',
  notOpenText: 'Please return after the organizers open voting.', resultsLabel: 'VOTING RESULTS',
  totalVotes: '{{count}} votes submitted', closedAt: 'Closed at {{time}}',
};

resources.vi.translation.eventPages.club = {
  eyebrow: 'HỒ SƠ CLB · FPTU BOARD GAME CLUB · NEVER LET YOU ALONE',
  heroTitle: 'CÂU LẠC BỘ', heroTitleAfter: 'BOARD GAME',
  heroLede: 'Một cộng đồng yêu board game, nơi mỗi ván chơi mở ra một cuộc gặp mới.',
  brandKicker: 'FPTU · HÀ NỘI', clubName: 'FPTU Board Game Club', location: 'Sân Băng – Đại học FPT Hà Nội',
  tabsAria: 'Nội dung về câu lạc bộ', tabs: { about: 'Giới thiệu', weekly: 'Sinh hoạt', events: 'Sự kiện', achievements: 'Thành tích' },
  description: 'FPTU Board Game Club là nơi quy tụ những bạn trẻ yêu thích board game và tổ chức sự kiện. Sau 6 năm hoạt động, CLB đã ghi dấu ấn với nhiều sự kiện lớn nhỏ như FPTU Halloween (2020–2022–2023) hay Board Game Tournament mùa 1–2. Với tinh thần sáng tạo và gắn kết, CLB đang trở thành điểm hẹn quen thuộc của sinh viên FPTU để cùng thư giãn và kết nối.',
  aboutBody: 'Là CLB tổ chức sự kiện FPTU Halloween thường niên của Đại học FPT Hà Nội, Board Game Club đưa tinh thần sáng tạo và gắn kết vào từng hoạt động. Năm 2026, sự kiện được nhuộm màu “Wishbound” – những giấc mơ và ước mơ đầy hứa hẹn.',
  statsAria: 'Thông tin câu lạc bộ', members: 'thành viên', established: 'năm thành lập', excellentClub: 'CLB PHONG TRÀO XUẤT SẮC',
  weeklyTitle: 'Sinh hoạt hàng tuần', weeklyBody: 'Đại gia đình Bê Gờ mở cửa chào đón tất cả mọi người đến sinh hoạt vào thứ Năm hàng tuần, từ 19:30 đến 21:30 tại Nhà võ 3.',
  weeklyAlt1: 'Sinh hoạt hàng tuần của FPTU Board Game Club', weeklyCaption1: 'Buổi sinh hoạt 01',
  weeklyAlt2: 'Thành viên FPTU Board Game Club sinh hoạt', weeklyCaption2: 'Buổi sinh hoạt 02',
  weeklyAlt3: 'Hoạt động board game của câu lạc bộ', weeklyCaption3: 'Buổi sinh hoạt 03',
  eventsTitle: 'Sự kiện đang được cập nhật', eventsBody: 'Thông tin các sự kiện sắp tới của câu lạc bộ sẽ được công bố tại đây.',
  achievementsTitle: 'Thành tích', achievementsBody: 'Câu lạc bộ phong trào xuất sắc kỳ FA24.',
  achievementAlt1: 'FPTU Board Game Club nhận bằng khen phong trào', achievementCaption1: 'Thành tích phong trào',
  achievementAlt2: 'FPTU Board Game Club tại sự kiện', achievementCaption2: 'Dấu ấn hoạt động của CLB',
  contactMark: 'Người giữ nhịp', contactTitle: 'Liên hệ CLB', presidentLabel: 'Chủ nhiệm', president: 'Nguyễn Cảnh Hưng',
  facebook: 'Facebook', facebookHandle: 'fb.me/fuboardgameclub', email: 'Email', phone: 'Điện thoại', locationLabel: 'Địa điểm',
};
resources.en.translation.eventPages.club = {
  eyebrow: 'CLUB PROFILE · FPTU BOARD GAME CLUB · NEVER LET YOU ALONE',
  heroTitle: 'BOARD GAME', heroTitleAfter: 'CLUB',
  heroLede: 'A board game community where every match opens the door to a new connection.',
  brandKicker: 'FPTU · HANOI', clubName: 'FPTU Board Game Club', location: 'Ice Rink – FPT University Hanoi',
  tabsAria: 'Club information', tabs: { about: 'About', weekly: 'Weekly meetups', events: 'Events', achievements: 'Achievements' },
  description: 'FPTU Board Game Club brings together young people who love board games and event organizing. Over six years, the club has made its mark through events such as FPTU Halloween and Board Game Tournament. Its creative, welcoming spirit makes it a familiar place for FPTU students to relax and connect.',
  aboutBody: 'As the organizer of the annual FPTU Halloween event at FPT University Hanoi, the club brings creativity and connection to every activity. In 2026, the event took on the colors of “Wishbound” – a world of promising dreams and wishes.',
  statsAria: 'Club statistics', members: 'members', established: 'year established', excellentClub: 'OUTSTANDING STUDENT CLUB',
  weeklyTitle: 'Weekly meetups', weeklyBody: 'The Bê Gờ family welcomes everyone every Thursday from 7:30 PM to 9:30 PM at Martial Arts Hall 3.',
  weeklyAlt1: 'Weekly meetup of FPTU Board Game Club', weeklyCaption1: 'Weekly meetup 01',
  weeklyAlt2: 'FPTU Board Game Club members at a meetup', weeklyCaption2: 'Weekly meetup 02',
  weeklyAlt3: 'Board game activity at the club', weeklyCaption3: 'Weekly meetup 03',
  eventsTitle: 'Events are being updated', eventsBody: 'Information about the club’s upcoming events will be published here.',
  achievementsTitle: 'Achievements', achievementsBody: 'Outstanding student club of the FA24 semester.',
  achievementAlt1: 'FPTU Board Game Club receiving an achievement certificate', achievementCaption1: 'Club achievement',
  achievementAlt2: 'FPTU Board Game Club at an event', achievementCaption2: 'The club in action',
  contactMark: 'Club lead', contactTitle: 'Contact the club', presidentLabel: 'President', president: 'Nguyễn Cảnh Hưng',
  facebook: 'Facebook', facebookHandle: 'fb.me/fuboardgameclub', email: 'Email', phone: 'Phone', locationLabel: 'Location',
};

resources.vi.translation.eventPages.pdp = {
  eyebrow: 'HỒ SƠ CHƯƠNG TRÌNH · PDP FPTU HÀ NỘI · PHÁT TRIỂN CÁ NHÂN', heroTitle: 'PDP', heroTitleAfter: 'FPTU HÀ NỘI',
  description: 'Chương trình Phát triển Cá nhân (PDP - Personal Development Program) kiến tạo môi trường trải nghiệm năng động cho sinh viên Trường Đại học FPT Hà Nội.',
  explore: 'Giới thiệu PDP', logoAlt: 'Logo PDP FPTU Hà Nội', brandKicker: 'FPTU · HÀ NỘI',
  title: 'PDP - Chương trình Phát triển Cá nhân FPTU Hà Nội', locationValue: 'Trường Đại học FPT Hà Nội',
  tabsAria: 'Nội dung về chương trình PDP', tabs: { about: 'Tổng quan', pillars: '3 trụ cột', halloween: 'FPTU Halloween', impact: 'Dấu ấn' },
  support: 'PDP là đơn vị bảo trợ cho sự kiện FPTU Halloween, đồng hành cùng các câu lạc bộ và sinh viên trong những hoạt động trải nghiệm, kết nối và phát triển toàn diện.',
  statsAria: 'Thông tin chương trình PDP', developmentPillars: 'trụ cột phát triển', followers: 'người theo dõi', following: 'đang theo dõi',
  pillarsTitle: 'Ba trụ cột phát triển', pillarsBody: 'PDP kết nối sinh viên với những trải nghiệm thực tế thông qua câu lạc bộ, sự kiện và khóa học.',
  club: 'Câu lạc bộ', events: 'Sự kiện', courses: 'Khóa học', halloweenTitle: 'PDP bảo trợ FPTU Halloween',
  impactTitle: 'Môi trường phát triển toàn diện', impactLead: 'Từ những hoạt động học tập đến trải nghiệm cộng đồng, PDP giúp sinh viên chủ động khám phá năng lực và xây dựng kết nối tại FPTU Hà Nội.',
  impactBody: 'Chương trình hướng đến một hành trình phát triển cân bằng: học hỏi, trải nghiệm, kết nối và tạo ra giá trị cho cộng đồng sinh viên.',
  infoMark: 'PDP · FPTU HÀ NỘI', infoTitle: 'Thông tin chương trình',
  info: {
    unit: { label: 'Đơn vị', value: 'PDP FPTU Hà Nội' }, role: { label: 'Vai trò', value: 'Bảo trợ sự kiện FPTU Halloween' },
    pillars: { label: '3 trụ cột', value: 'Câu lạc bộ · Sự kiện · Khóa học' }, audience: { label: 'Đối tượng', value: 'Sinh viên FPTU Hà Nội' },
    location: { label: 'Địa điểm', value: 'Trường Đại học FPT Hà Nội' },
  },
};
resources.en.translation.eventPages.pdp = {
  eyebrow: 'PROGRAM PROFILE · PDP FPTU HANOI · PERSONAL DEVELOPMENT', heroTitle: 'PDP', heroTitleAfter: 'FPTU HANOI',
  description: 'The Personal Development Program (PDP) creates a dynamic experiential environment for students of FPT University Hanoi.',
  explore: 'Explore PDP', logoAlt: 'PDP FPTU Hanoi logo', brandKicker: 'FPTU · HANOI',
  title: 'PDP - Personal Development Program at FPTU Hanoi', locationValue: 'FPT University Hanoi',
  tabsAria: 'PDP program information', tabs: { about: 'Overview', pillars: '3 pillars', halloween: 'FPTU Halloween', impact: 'Impact' },
  support: 'PDP supports FPTU Halloween and accompanies clubs and students through experiences that foster connection and well-rounded development.',
  statsAria: 'PDP program statistics', developmentPillars: 'development pillars', followers: 'followers', following: 'following',
  pillarsTitle: 'Three development pillars', pillarsBody: 'PDP connects students with hands-on experiences through clubs, events and courses.',
  club: 'Clubs', events: 'Events', courses: 'Courses', halloweenTitle: 'PDP supports FPTU Halloween',
  impactTitle: 'A well-rounded development environment', impactLead: 'From learning activities to community experiences, PDP helps students discover their abilities and build connections at FPTU Hanoi.',
  impactBody: 'The program promotes a balanced journey of learning, experiencing, connecting and creating value for the student community.',
  infoMark: 'PDP · FPTU HANOI', infoTitle: 'Program information',
  info: {
    unit: { label: 'Organization', value: 'PDP FPTU Hanoi' }, role: { label: 'Role', value: 'FPTU Halloween supporting organization' },
    pillars: { label: '3 pillars', value: 'Clubs · Events · Courses' }, audience: { label: 'Audience', value: 'FPTU Hanoi students' },
    location: { label: 'Location', value: 'FPT University Hanoi' },
  },
};

Object.assign(resources.vi.translation.normal.home, {
  heroAria: 'Ảnh bìa FPTU Halloween 2026', brand: 'FPTU HALLOWEEN', university: 'FPT UNIVERSITY', pdp: 'PDP', fbgc: 'FBGC', hlw26: 'HLW26',
  eventMeta: '2026 / FPTU HÀ NỘI', countdownLabel: 'ĐẾM NGƯỢC D-DAY', conceptLabel: '01 · GHI CHÚ CONCEPT',
  highlightsLabel: '02 · BẢN ĐỒ ĐÊM HỘI', timelineLabel: '03 · LỊCH TRÌNH ĐÊM HỘI', mapLabel: '04 · TÌM ĐƯỜNG',
  stage: 'SÂN KHẤU', sponsorsLabel: '05 · ĐƠN VỊ ĐỒNG HÀNH',
  sponsorNames: { pdp: 'PDP', fptu: 'FPTU', fbgc: 'FBGC', hlw26: 'HLW26' },
});
Object.assign(resources.en.translation.normal.home, {
  heroAria: 'FPTU Halloween 2026 hero banner', brand: 'FPTU HALLOWEEN', university: 'FPT UNIVERSITY', pdp: 'PDP', fbgc: 'FBGC', hlw26: 'HLW26',
  eventMeta: '2026 / FPTU HANOI', countdownLabel: 'COUNTDOWN D-DAY', conceptLabel: '01 · CONCEPT NOTE',
  highlightsLabel: '02 · THE NIGHT MAP', timelineLabel: '03 · RUN OF SHOW', mapLabel: '04 · FIND YOUR WAY',
  stage: 'STAGE', sponsorsLabel: '05 · WITH SUPPORT FROM',
  sponsorNames: { pdp: 'PDP', fptu: 'FPTU', fbgc: 'FBGC', hlw26: 'HLW26' },
});

Object.assign(resources.vi.translation.eventPages.hlwIntro, {
  overviewBody: 'Lễ hội Halloween tại Đại học FPT là sự kiện thường niên bùng nổ – một nét văn hóa sinh viên không thể bỏ qua. Được tổ chức bởi FPTU Board Game Club, sự kiện mang một chủ đề kỳ bí riêng mỗi năm và trở thành sân khấu cho những màn hóa trang đầy sáng tạo. Nhà ma, hoạt động sôi động và các cuộc thi gay cấn luôn tạo nên một đêm hội đáng nhớ, gắn kết cộng đồng sinh viên FPT.',
  facts: {
    what: { title: 'Halloween FPTU là gì?', text: 'Halloween FPTU là lễ hội thường niên của sinh viên FPTU — nơi tinh thần sáng tạo, sự kết nối và không khí kỳ bí gặp nhau trong một đêm hội đáng nhớ.' },
    mission: { title: 'Sứ mệnh', text: 'Tạo ra một không gian để sinh viên được trải nghiệm, thể hiện cá tính và cùng nhau xây dựng những kỷ niệm đặc biệt trong đời sống đại học.' },
    values: { title: 'Giá trị', text: 'Sáng tạo · Gắn kết · Dũng cảm · Tôn trọng. Mỗi hoạt động đều khuyến khích tinh thần tham gia và tôn trọng trải nghiệm cộng đồng.' },
    size: { title: 'Quy mô', text: 'Thông tin quy mô chương trình Halloween FPTU 2026 sẽ được Ban tổ chức cập nhật trong thời gian tới.' },
  },
  seasonTitle: 'FPTU Halloween {{year}}', seasonThumbnail: 'Ảnh đại diện FPTU Halloween {{year}}', updating: 'Đang cập nhật',
  concepts: { updating: 'Đang cập nhật', bunnysNightmare: "Bunny's Nightmare", wishbound: 'Wishbound', uLinhKy: 'U Linh Ký', hauntedFest: 'Haunted Fest', fearCorner: 'Fear Corner', hauntedForest: 'The Haunted Forest' },
});
Object.assign(resources.en.translation.eventPages.hlwIntro, {
  overviewBody: 'Halloween at FPT University is an explosive annual tradition and an essential part of student culture. Organized by FPTU Board Game Club, it takes on a mysterious new theme every year and showcases outstanding creativity through costumes, a haunted house, lively activities and exciting contests. Each season creates a memorable night that connects the FPT student community.',
  facts: {
    what: { title: 'What is FPTU Halloween?', text: 'FPTU Halloween is an annual student festival where creativity, connection and a mysterious atmosphere meet in one memorable night.' },
    mission: { title: 'Mission', text: 'Create a space for students to experience, express their personalities and build special memories together during university life.' },
    values: { title: 'Values', text: 'Creativity · Connection · Courage · Respect. Every activity encourages participation and respect for the community experience.' },
    size: { title: 'Scale', text: 'Details about the scale of FPTU Halloween 2026 will be announced by the organizers.' },
  },
  seasonTitle: 'FPTU Halloween {{year}}', seasonThumbnail: 'FPTU Halloween {{year}} thumbnail', updating: 'To be announced',
  concepts: { updating: 'To be announced', bunnysNightmare: "Bunny's Nightmare", wishbound: 'Wishbound', uLinhKy: 'U Linh Ký', hauntedFest: 'Haunted Fest', fearCorner: 'Fear Corner', hauntedForest: 'The Haunted Forest' },
});

Object.assign(resources.vi.translation.eventPages.introduceEvent, {
  name: 'FPTU Halloween', avatarAlt: 'Ảnh đại diện FPTU Halloween', category: 'Sự kiện · Cao đẳng & Đại học',
  aboutText: 'Lễ hội Halloween tại Đại học FPT là sự kiện thường niên bùng nổ – một nét văn hóa sinh viên không thể bỏ qua.',
  organizerName: 'FPTU Board Game Club', seasonTitle: 'FPTU Halloween {{year}}',
});
Object.assign(resources.en.translation.eventPages.introduceEvent, {
  name: 'FPTU Halloween', avatarAlt: 'FPTU Halloween profile picture', category: 'Event · College & University',
  aboutText: 'Halloween at FPT University is an exciting annual event and an essential part of student culture.',
  organizerName: 'FPTU Board Game Club', seasonTitle: 'FPTU Halloween {{year}}',
});

Object.assign(resources.vi.translation.normal.contact, {
  mapTitle: 'Vị trí Đại học FPT', fanpage: 'Fanpage', halloweenPage: 'FPTU Halloween', clubPage: 'FPTU Board Game Club',
  university: 'Đại học FPT', emailLabel: 'Email', emailValue: 'fptuhalloween@gmail.com',
  organizerContact: 'Nguyễn Thảo Vy - 0338263886', communicationsContact: 'Lê Thị Thuỳ - 0947319889',
});
Object.assign(resources.en.translation.normal.contact, {
  mapTitle: 'FPT University location', fanpage: 'Fanpage', halloweenPage: 'FPTU Halloween', clubPage: 'FPTU Board Game Club',
  university: 'FPT University', emailLabel: 'Email', emailValue: 'fptuhalloween@gmail.com',
  organizerContact: 'Nguyễn Thảo Vy - 0338263886', communicationsContact: 'Lê Thị Thuỳ - 0947319889',
});

Object.assign(resources.vi.translation.archive, {
  eventTitle: 'FPTU Halloween {{year}}', thumbnailAlt: 'Ảnh đại diện {{title}}',
  event1Date: '28/10 - 31/10/2026', event2Date: '29/10 - 31/10/2024', event3Date: '30/10 - 31/10/2023',
  event4Date: '31/10/2022', event5Date: '30/10 - 31/10/2020',
  event6Description: "Bunny's Nightmare",
  event1Description: `[𝐇𝐀𝐋𝐋𝐎𝐖𝐄𝐄𝐍 𝟐𝟎𝟐𝟓]: 𝐖𝐈𝐒𝐇𝐁𝐎𝐔𝐍𝐃

😈 Mỗi đêm, vào ngày 31/10 hằng năm, giữa màn sương dày đặc, thị trấn ma quái 𝐖𝐢𝐬𝐡𝐛𝐨𝐮𝐧𝐝 xuất hiện rồi biến mất như chưa từng tồn tại…. Nhưng năm nay, sau hàng thế kỷ ẩn mình, cái tên bao năm ám ảnh thị trấn hóa ra chỉ là một mặt nạ khác của Joker - thực thể tàn nhẫn chỉ sống để đánh tráo điều ước, nuốt chửng linh hồn và biến hy vọng thành lời nguyền. Lúc ấy, ở nơi trung tâm thị trấn mới rõ hình Quán rượu cổ, nơi mọi điều ước đều có giá, mọi “quy tắc trò chơi” chỉ để dẫn dắt những ván đấu chết chóc do hắn bày ra.

👻 Người bước chân vào vùng đất này sẽ phải đặt cược chính linh hồn của mình: thắng sẽ chạm tới điều ước sâu thẳm nhất, còn thua sẽ bị phong ấn vĩnh viễn giữa bốn vùng đất tội lỗi: Cơ, Rô, Bích, Tép - nơi phản chiếu mặt tối của mỗi người.

🎃 Liệu bạn là người chiến thắng… hay là kẻ bị phong ấn?`,
  event2Description: `[𝐇𝐀𝐋𝐋𝐎𝐖𝐄𝐄𝐍 𝟐𝟎𝟐𝟒]: U LINH KÝ - ÂM DƯƠNG TỬ KHÍ

👻 Vào ngày lễ 𝐇𝐚𝐥𝐥𝐨𝐰𝐞𝐞𝐧 tại ngôi làng Hola, một quyển sách cổ tên “U linh Ký” vô tình được phát hiện dẫn đến các linh hồn của dân làng bị hút vào một thế giới huyền bí chứa đầy ma quỷ Việt Nam. Trong cõi linh hồn này, dân làng phải đối mặt với hình ảnh thảm thiết của Ma Da, tiếng khóc lóc ỉ ôi của Ma Đói, hồn Ma Lai lang thang dưới bóng đêm, những tiếng cười rùng rợn của Ông Ba Bị và tiếng Ma Trơi văng vẳng bên tai. Những con ma luôn tìm cách đánh cắp ký ức của họ, khiến dân làng dần mất nhận thức và trở thành con mồi cho những ma quỷ âm dương.

💀 Nhưng hồn ma không để ý rằng trong số người dân đã bị cuốn vào, có một người tên Kiến Văn, mang trong mình một tấm bùa hộ mệnh được tổ tiên truyền lại. Nhờ vào tấm bùa đó, Kiến Văn đã thoát khỏi sự mê hoặc của quỷ dữ trước khi ký ức cuối cùng bị đánh mất. Cùng lúc ấy, Kiến Văn nhận ra rằng các loài ma luôn cố gắng đánh cắp đi ký ức của dân làng, và đây chính là chìa khóa để thoát khỏi cõi U Linh man rợ, Kiến Văn quyết định nói cho dân làng phát hiện của mình và tìm cách để lấy lại những mảnh ký ức đã mất.

👿 Nhưng không phải ai cũng đủ tỉnh táo, can đảm và mạnh mẽ để thoát khỏi cõi U linh huyền bí này, liệu rằng những con người vô tội kia có thể vượt qua thử thách gian nan để quay trở về với trần gian?`,
  event3Description: `[𝐇𝐀𝐋𝐋𝐎𝐖𝐄𝐄𝐍 𝟐𝟎𝟐𝟑]: 𝐇𝐀𝐔𝐍𝐓𝐄𝐃 𝐅𝐄𝐒𝐓

😈 Vào ngày 31/10 hằng năm, phố Fear chứng kiến sự trỗi dậy của rất nhiều thế lực tà ác vượt ra từ cánh cửa địa ngục, gây náo loạn cuộc sống của người dân nơi đây. Sau sự ra đi của con quỷ Kurbis, chúa tể địa ngục là Lucifear lên ngôi và bắt đầu tuyên bố sự thống trị của mình.

👹 Để gia tăng sức mạnh của mình, Lucifear đã cử hắc miêu (Phasma) - cánh tay phải đắc lực của hắn ta xuống nhân gian và đánh cắp rất nhiều linh hồn của con người. Những linh hồn đó không chỉ gia tăng thêm sức mạnh cho Lucifear mà còn là phần thưởng cho rất nhiều con quỷ đang khao khát thống trị loài người.

👻 Để cứu được những linh hồn vô tội kia, tương truyền rằng có một cây cầu vàng (Spirit Bridge) là cây cầu kết nối giữa hai thế giới tâm linh này. Ngày mà thế giới âm dương hòa vào làm một, người thân của họ phải cải trang thành những ác linh và vượt qua ranh giới của loài người, thông qua con đường vàng và đi giải cứu những linh hồn kia. Họ bắt buộc phải tham gia vào buổi tiệc “Đám cưới ma” - một đám cưới quỷ dị của chúa tể tàn ác Lucifear, nơi hội tụ rất nhiều thế lực hắc ám và các hồn ma đen tối. Muốn vượt qua bữa tiệc kì bí này, con người không những ăn uống, nhảy múa, ca hát mà còn phải tham gia vào các trò chơi rùng rợn nơi đây. Mang trong mình linh hồn thuần khiết và dũng cảm, liệu con người có vượt qua được nỗi sợ hãi, cứu sống những linh hồn oan uổng hay trở thành món ăn tráng miệng dành cho chúa tể quỷ dữ Lucifear?`,
  event4Description: `[𝐇𝐀𝐋𝐋𝐎𝐖𝐄𝐄𝐍 𝟐𝟎𝟐𝟐]: 𝐅𝐄𝐀𝐑 𝐂𝐎𝐑𝐍𝐄𝐑

👻 KHÁM PHÁ VÙNG ĐẤT KỲ BÍ - PHỐ FEAR NGAY GIỮA LÒNG FPTU👻

🧙‍♀️ Không còn là những đồn đoán, sự kiện Halloween duy nhất trong năm 2022 - 𝐅𝐞𝐚𝐫 𝐂𝐨𝐫𝐧𝐞𝐫 sẽ chính thức “lên nòng” vào ngày 31/10 - thứ 2 tới đây tại sân trước toà nhà Delta.

Trong buổi tối 31/10 tới đây, BTC sẽ đưa bạn đến với Fear Corner - Khu phố Halloween: Một khu phố đặc biệt, nơi những “linh hồn” có thể trở về trần gian và sống như những người bình thường. Tuy nhiên, đây sẽ là nơi giao giữa âm dương, nên không khí tràn ngập sự ghê rợn, với những cây quỷ, những bóng ma và bộ xương khô đến rợn người.

👻 Đây sẽ là cơ hội để các con dân FPTU thỏa sức bước vào 1 vùng đất vô cùng xa lạ, và khám phá vô vàn những bí ẩn tại đây với các hoạt động:

🎃 Cùng hóa trang để không bị những người âm đánh cắp mất linh hồn.
🎃 Ghé thăm những ngóc ngách, trải nghiệm các gian hàng tại Phố Fear.
🎃 Lần đầu trà trộn và check in ngay giữa lòng thế giới cõi âm.
🎃 Tham gia hoạt động Trick or Treat.
🎃 Thưởng thức các tiết mục văn nghệ sôi động trong 1 bầu không gian vô cùng đặc biệt… và vân vân những đặc quyền khác.

👻 Sự góp mặt của các bạn tại Phố Fear chắc chắn sẽ đem tới một mùa Halloween vô cùng đáng nhớ tại trường Ép! Còn không mau chuẩn bị một bộ trang phục ấn tượng và sẵn sàng “lên dây cót” cùng BTC để nhận lấy tấm vé đến Vùng đất huyền bí nào các bạn ơi! 🤩`,
  event5Description: `[𝐇𝐀𝐋𝐋𝐎𝐖𝐄𝐄𝐍 𝟐𝟎𝟐𝟎]: 𝐓𝐇𝐄 𝐇𝐀𝐔𝐍𝐓𝐄𝐃 𝐅𝐎𝐑𝐄𝐒𝐓

💥🎃 ̼B̼O̼M̼ ̼T̼Ấ̼N̼ ̼H̼A̼L̼L̼O̼W̼E̼E̼N̼ ̼2̼0̼2̼0̼ 🎃💥

🕸️ 𝐺𝑢̛𝑜̛𝑛𝑔 𝑘𝑖𝑎 𝑛𝑔𝑢̛̣ 𝑜̛̉ 𝑡𝑟𝑒̂𝑛 𝑡𝑢̛𝑜̛̀𝑛𝑔
𝑁𝑔ℎ𝑒 𝑛𝑜́𝑖 𝑡𝑟𝑢̛𝑜̛̀𝑛𝑔 𝐹 𝑐𝑜́ 𝑔𝑖̀ ℎ𝑎𝑦 ℎ𝑜
🕸️ 𝐾𝑖̀ 𝑏𝑖́, 𝑚𝑎 𝑚𝑖̣, 𝑛ℎ𝑖𝑒̂̀𝑢 𝑡𝑟𝑜̀
𝐿𝑎̂̀𝑛 đ𝑎̂̀𝑢 𝑥𝑢𝑎̂́𝑡 ℎ𝑖𝑒̣̂𝑛, 𝑛𝑔𝑢̛𝑜̛̀𝑖 𝑛𝑔𝑢̛𝑜̛̀𝑖 đ𝑒̂̀𝑢 𝑚𝑜𝑛𝑔

Nghe nói từ xưa đến nay, mảnh đất xa xôi nội thành này vẫn luôn chứa đựng nhiều bí ẩn, với những câu chuyện kinh dị có thật, các hiện tượng lạ được lan truyền gieo rắc nỗi sợ hãi cho thần dân nơi đây 😰. Nhưng giờ bạn sẽ không chỉ được nghe, mà còn được trải nghiệm nỗi sợ hãi một cách chân thật nhất và thử thách lòng can đảm với sự kiện kinh dị đậm chất FPTU lần này.

🦇 Lễ hội “𝐇▲𝐋𝐋𝐎𝐖𝐄𝐄𝐍 𝟐𝟎𝟐𝟎” lần đầu tiên xuất hiện tại trường F với chủ đề “The Haunted Forest” hứa hẹn sẽ mang tới những trải nghiệm cực kì thú vị. Đây là dịp để các bạn được tham gia rất nhiều trò chơi đa dạng, thoả sức cosplay, hoá trang, khám phá bí ẩn ngôi nhà ma và giải mã những câu chuyện kinh hoàng!!!

👻 Còn rất nhiều bí mật đang chờ được khám phá, hãy chuẩn bị cho mình một bộ đồ hóa trang thật lộng lẫy và nhanh tay đặt vé để tham gia ngay nào!.`,
});
Object.assign(resources.en.translation.archive, {
  eventTitle: 'FPTU Halloween {{year}}', thumbnailAlt: '{{title}} thumbnail',
  event1Date: 'October 28–31, 2026', event2Date: 'October 29–31, 2024', event3Date: 'October 30–31, 2023',
  event4Date: 'October 31, 2022', event5Date: 'October 30–31, 2020',
});

Object.assign(resources.vi.translation.normal.btc, {
  heroLabel: 'FPTU HALLOWEEN 2026 · ĐỘI NGŨ CỐT LÕI', titleEnd: 'sự kiện.', coreTeam: 'Đội ngũ HLW26',
  location: 'Đại học FPT · Hà Nội', coreTeamLabel: 'ĐỘI NGŨ CỐT LÕI', cardKicker: 'ĐỘI NGŨ', cardSeason: 'HLW26',
  brand: 'FPTU HALLOWEEN', departmentTeam: 'BTC HLW2026',
  hierarchyNotes: { chair: '01 · TRƯỞNG BAN TỔ CHỨC', hr: '02 · NHÂN SỰ', lead: '03 · TRƯỞNG BAN', sublead: '04 · PHÓ BAN' },
});
Object.assign(resources.en.translation.normal.btc, {
  heroLabel: 'FPTU HALLOWEEN 2026 · CORE TEAM', titleEnd: 'the event.', coreTeam: 'Core Team HLW26',
  location: 'FPT University · Hanoi', coreTeamLabel: 'CORE TEAM', cardKicker: 'CORE TEAM', cardSeason: 'HLW26',
  brand: 'FPTU HALLOWEEN', departmentTeam: 'BTC HLW2026',
  hierarchyNotes: { chair: '01 · HEAD OF ORGANIZATION', hr: '02 · HR', lead: '03 · LEAD', sublead: '04 · SUB-LEAD' },
});

resources.vi.translation.easterEgg = {
  kicker: 'FPTU HALLOWEEN / HỒ SƠ MẬT CẤP TỔNG TÀI', title: 'Biết Chủ tịch này nhé.',
  intro: 'Hồ sơ mật của vị tổng tài đã biến deadline, ngân sách và một ít keo nến thành đế chế Halloween lấp lánh.',
  teamKicker: 'BAN LÃNH ĐẠO KHÔNG AI BỔ NHIỆM', teamTitle: 'Đội ngũ dưới trướng Chủ tịch.',
  closingAria: 'Lời nhắn của Chủ tịch', closing: 'Đằng sau mỗi cú hù là một đế chế đang vận hành. Và Chủ tịch thì vẫn chưa duyệt đơn xin nghỉ.',
  people: {
    president: { eyebrow: 'CHỦ TỊCH TỔNG TÀI', name: 'Ngài Chủ tịch vũ trụ', note: 'Bận ký giấy tờ, duyệt ngân sách và nhìn deadline bằng ánh mắt khiến deadline tự biến mất.' },
    rightHand: { name: 'Cánh tay phải', role: 'Gọi chủ tịch dậy họp' }, deputy: { name: 'Phó tổng', role: 'Duyệt meme cấp tốc' },
    assistant: { name: 'Trợ lý riêng', role: 'Giữ bình tĩnh hộ sếp' }, drama: { name: 'Giám đốc drama', role: 'Tạo plot twist mỗi ngày' },
    wax: { name: 'Trưởng ban keo nến', role: 'Dính là không gỡ' }, scare: { name: 'CEO hù dọa', role: 'Chốt đơn cú giật mình' },
    joy: { name: 'Giám đốc niềm vui', role: 'Cười trước, tính sau' }, heir: { name: 'Tổng tài dự bị', role: 'Ký duyệt bằng ánh mắt' },
  },
};
resources.en.translation.easterEgg = {
  kicker: 'FPTU HALLOWEEN / TOP-SECRET PRESIDENTIAL FILE', title: 'Meet this President.',
  intro: 'The secret file of the executive who turned deadlines, budgets and a little candle wax into a sparkling Halloween empire.',
  teamKicker: 'THE LEADERSHIP TEAM NOBODY APPOINTED', teamTitle: 'The President’s inner circle.',
  closingAria: 'A note from the President', closing: 'Behind every scare is an empire at work. And the President still has not approved anyone’s leave request.',
  people: {
    president: { eyebrow: 'EXECUTIVE PRESIDENT', name: 'President of the Universe', note: 'Busy signing papers, approving budgets and staring at deadlines until they disappear.' },
    rightHand: { name: 'Right-hand person', role: 'Wakes the President for meetings' }, deputy: { name: 'Deputy executive', role: 'Approves memes at speed' },
    assistant: { name: 'Personal assistant', role: 'Keeps calm for the boss' }, drama: { name: 'Director of drama', role: 'Creates a plot twist every day' },
    wax: { name: 'Head of candle wax', role: 'Once it sticks, it stays' }, scare: { name: 'Chief scare officer', role: 'Closes every jump-scare deal' },
    joy: { name: 'Director of joy', role: 'Laugh first, plan later' }, heir: { name: 'Executive in waiting', role: 'Approves with a single look' },
  },
};

Object.assign(resources.vi.translation.auth.login, { email: 'Email', clubLogoAlt: 'Logo FPTU Board Game Club', home: 'Quay về trang chủ' });
Object.assign(resources.en.translation.auth.login, { email: 'Email', clubLogoAlt: 'FPTU Board Game Club logo', home: 'Back to homepage' });
Object.assign(resources.vi.translation.auth.register, { email: 'Email' });
Object.assign(resources.en.translation.auth.register, { email: 'Email' });
Object.assign(resources.vi.translation.auth.forgot, { brandAlt: 'FPTU Halloween', email: 'Email', otp: 'Mã OTP' });
Object.assign(resources.en.translation.auth.forgot, { brandAlt: 'FPTU Halloween', email: 'Email', otp: 'OTP code' });
Object.assign(resources.vi.translation.auth.changePassword, { brandAlt: 'FPTU Halloween' });
Object.assign(resources.en.translation.auth.changePassword, { brandAlt: 'FPTU Halloween' });
Object.assign(resources.vi.translation.auth.complete, { brandAlt: 'FPTU Halloween', emailLabel: 'Email' });
Object.assign(resources.en.translation.auth.complete, { brandAlt: 'FPTU Halloween', emailLabel: 'Email' });
Object.assign(resources.vi.translation.auth.confirm, { brandAlt: 'FPTU Halloween' });
Object.assign(resources.en.translation.auth.confirm, { brandAlt: 'FPTU Halloween' });
Object.assign(resources.vi.translation.auth.fbgc, { brandAlt: 'Logo FPTU Board Game Club' });
Object.assign(resources.en.translation.auth.fbgc, { brandAlt: 'FPTU Board Game Club logo' });

Object.assign(resources.vi.translation.ticket, {
  eventBrand2026: 'FPTU Halloween 2026', email: 'Email', emailPlaceholder: 'ban@example.com', brandShort: 'HLW',
  entryPass: 'VÉ VÀO CỬA', entry: 'VÀO CỬA', priceVnd: '{{value}} VND', date: 'Ngày', dateLabel: 'Ngày',
  dateFormat: 'Ngày {{date}} tháng 10, 2026', dayLabel: 'Ngày',
});
Object.assign(resources.en.translation.ticket, {
  eventBrand2026: 'FPTU Halloween 2026', email: 'Email', emailPlaceholder: 'you@example.com', brandShort: 'HLW',
  entryPass: 'ENTRY PASS', entry: 'ENTRY', priceVnd: 'VND {{value}}',
});
Object.assign(resources.vi.translation.pages.payment, { brand: 'FPTU Halloween' });
Object.assign(resources.en.translation.pages.payment, { brand: 'FPTU Halloween' });
Object.assign(resources.vi.translation.eventPages.haunted, { brandShort: 'HLW', currency: 'VND' });
Object.assign(resources.en.translation.eventPages.haunted, { brandShort: 'HLW', currency: 'VND' });
Object.assign(resources.vi.translation.profilePage, { currency: 'VND' });
Object.assign(resources.en.translation.profilePage, { currency: 'VND' });

Object.assign(resources.vi.translation.footer, {
  logoAlt: 'FPTU Halloween', email: 'fptuhalloween@gmail.com', halloweenFacebook: 'Facebook FPTU Halloween',
  clubFacebook: 'Facebook FPTU Board Game Club', halloweenTiktok: 'TikTok FPTU Halloween',
});
Object.assign(resources.en.translation.footer, {
  logoAlt: 'FPTU Halloween', email: 'fptuhalloween@gmail.com', halloweenFacebook: 'FPTU Halloween on Facebook',
  clubFacebook: 'FPTU Board Game Club on Facebook', halloweenTiktok: 'FPTU Halloween on TikTok',
});
Object.assign(resources.vi.translation.pages.errors, {
  brand: 'FPTU / HALLOWEEN', status: 'TRẠNG THÁI', visualAria: 'Minh hoạ lỗi {{code}}', accessCheck: 'KIỂM TRA QUYỀN TRUY CẬP',
});
Object.assign(resources.en.translation.pages.errors, {
  brand: 'FPTU / HALLOWEEN', status: 'STATUS', visualAria: '{{code}} error illustration', accessCheck: 'ACCESS CHECK',
});
Object.assign(resources.vi.translation.eventPages.agenda, { brandShort: 'HLW26' });
Object.assign(resources.en.translation.eventPages.agenda, { brandShort: 'HLW26' });
Object.assign(resources.vi.translation.normal.overall, { organizerName: 'FPTU Board Game Club (FBGC)' });
Object.assign(resources.en.translation.normal.overall, { organizerName: 'FPTU Board Game Club (FBGC)' });
resources.vi.translation.normal.aboutPage = { title: 'Giới thiệu' };
resources.en.translation.normal.aboutPage = { title: 'About us' };
resources.vi.translation.normal.adminHomePage = { title: 'Trang quản trị' };
resources.en.translation.normal.adminHomePage = { title: 'Administration' };

Object.assign(resources.vi.translation.components, { facebookNews: 'Tin từ Facebook' });
Object.assign(resources.en.translation.components, { facebookNews: 'Facebook News' });

resources.vi.translation.eventPages.facebookNews = {
  eyebrow: 'FANPAGE FPTU HALLOWEEN', title: 'Tin mới từ FPTU Halloween.',
  sourceName: 'FPTU Halloween',
  intro: 'Các thông báo, câu chuyện và cập nhật mới nhất từ Fanpage FPTU Halloween.',
  searchPlaceholder: 'Tìm theo nội dung bài viết…', searchLabel: 'Tìm kiếm tin Facebook', search: 'Tìm kiếm',
  latest: 'Bản tin mới nhất', officialUpdates: 'Cập nhật từ Fanpage', searchResults: 'Kết quả cho “{{query}}”',
  resultCount: '{{count}} bài viết', errorTitle: 'Chưa thể mở bản tin', retry: 'Thử lại',
  featuredCarouselLabel: 'Bài viết đáng chú ý', featuredEyebrow: 'Đáng chú ý', featuredTitle: 'Bài viết được ghim',
  featuredIntro: 'Những nội dung quan trọng Sự kiện FPTU Halloween.',
  featuredEmptyTitle: 'Chưa có bài viết đáng chú ý', featuredEmptyText: 'Các bài viết được chọn sẽ xuất hiện tại đây.',
  pinnedBadge: 'Được ghim', featuredPrevious: 'Bài trước', featuredNext: 'Bài sau',
  featuredViewNavigation: 'Chọn vị trí bài đáng chú ý', goToFeaturedView: 'Đến bài ở vị trí {{view}}',
  featuredSlideLabel: 'Bài đáng chú ý {{current}} trên {{total}}', openFeaturedPost: 'Mở bài {{title}} trên Facebook',
  emptyTitle: 'Chưa có bài viết', emptyText: 'Bản tin sẽ xuất hiện sau lần đồng bộ đầu tiên từ Facebook.',
  emptySearch: 'Không có bài viết phù hợp với từ khóa này.', notUpdated: 'Chưa cập nhật',
  emptyFiltered: 'Không có bài viết phù hợp với nội dung hoặc thời gian đã chọn.',
  reactions: '{{count}} lượt tương tác', viewOnFacebook: 'Xem bài nổi bật trên Facebook', readPost: 'Đọc bài gốc',
  filterLabel: 'Lọc theo thời gian', yearLabel: 'Năm', monthLabel: 'Tháng', dayLabel: 'Ngày',
  allYears: 'Tất cả năm', allMonths: 'Tất cả tháng', allDays: 'Tất cả ngày', clearFilters: 'Xóa bộ lọc',
  paginationLabel: 'Phân trang tin Facebook', firstPage: 'Trang đầu', previous: 'Trang trước', next: 'Trang sau',
  lastPage: 'Trang cuối', goToPage: 'Đến trang {{page}}', pageOf: 'Trang {{page}} / {{total}}',
};
resources.en.translation.eventPages.facebookNews = {
  eyebrow: 'FANPAGE FPTU HALLOWEEN', title: 'Latest from FPTU Halloween.',
  sourceName: 'FPTU Halloween',
  intro: 'Announcements, stories and updates from the official FPTU Halloween Facebook Page.',
  searchPlaceholder: 'Search post content…', searchLabel: 'Search Facebook News', search: 'Search',
  latest: 'Latest feed', officialUpdates: 'Updates from Facebook', searchResults: 'Results for “{{query}}”',
  resultCount: '{{count}} posts', errorTitle: 'The feed is unavailable', retry: 'Try again',
  featuredCarouselLabel: 'Featured posts', featuredEyebrow: 'Featured', featuredTitle: 'Pinned posts',
  featuredIntro: 'Important updates FPTU Halloween.',
  featuredEmptyTitle: 'No featured posts yet', featuredEmptyText: 'Selected posts will appear here.',
  pinnedBadge: 'Pinned', featuredPrevious: 'Previous post', featuredNext: 'Next post',
  featuredViewNavigation: 'Choose a featured post position', goToFeaturedView: 'Go to post position {{view}}',
  featuredSlideLabel: 'Featured post {{current}} of {{total}}', openFeaturedPost: 'Open {{title}} on Facebook',
  emptyTitle: 'No posts yet', emptyText: 'Posts will appear after the first Facebook synchronization.',
  emptySearch: 'No posts match this search.', notUpdated: 'Not updated',
  emptyFiltered: 'No posts match the selected content or date.',
  reactions: '{{count}} interactions', viewOnFacebook: 'View featured post on Facebook', readPost: 'Read original post',
  filterLabel: 'Filter by date', yearLabel: 'Year', monthLabel: 'Month', dayLabel: 'Day',
  allYears: 'All years', allMonths: 'All months', allDays: 'All days', clearFilters: 'Clear filters',
  paginationLabel: 'Facebook News pagination', firstPage: 'First page', previous: 'Previous', next: 'Next',
  lastPage: 'Last page', goToPage: 'Go to page {{page}}', pageOf: 'Page {{page}} / {{total}}',
};

resources.vi.translation.management.facebookNews = {
  eyebrow: 'Bản tin Facebook', title: 'Cập nhật bài viết từ Fanpage.',
  intro: 'Theo dõi lần cập nhật gần nhất và đưa các bài mới từ Fanpage lên website.',
  refresh: 'Làm mới', syncNow: 'Cập nhật bài viết', syncing: 'Đang cập nhật bài viết…', syncingShort: 'Đang cập nhật',
  updateSuccess: 'Bài viết Facebook đã được cập nhật.',
  statusSection: 'Tình trạng cập nhật bài viết', syncStatus: 'Kết nối Fanpage', lastSuccess: 'Lần cập nhật gần nhất',
  lastResult: 'Bài viết vừa cập nhật', syncStats: '{{inserted}} bài mới · {{updated}} bài được làm mới', notYet: 'Chưa có',
  setupTitle: 'Fanpage chưa được kết nối', setupText: 'Hệ thống chưa thể lấy bài viết. Vui lòng liên hệ người phụ trách để hoàn tất kết nối.',
  lastError: 'Điều cần kiểm tra', feedEyebrow: 'Nội dung trên website', feedTitle: 'Các bài Facebook gần nhất',
  featuredCarouselLabel: 'Quản lý bài viết đáng chú ý', featuredEyebrow: 'Đáng chú ý', featuredTitle: 'Bài viết được ghim',
  featuredIntro: 'Desktop hiển thị 3 bài và mỗi lần chuyển 1 bài. Có thể bỏ ghim tại đây hoặc thay đổi trạng thái trong danh sách bên dưới.',
  featuredEmptyTitle: 'Chưa chọn bài đáng chú ý', featuredEmptyText: 'Chọn biểu tượng ghim tại một bài viết trong danh sách bên dưới.',
  pinnedBadge: 'Được ghim', featuredPrevious: 'Bài trước', featuredNext: 'Bài sau',
  featuredViewNavigation: 'Chọn vị trí bài đáng chú ý', goToFeaturedView: 'Đến bài ở vị trí {{view}}',
  featuredSlideLabel: 'Bài đáng chú ý {{current}} trên {{total}}', openFeaturedPost: 'Mở bài {{title}} trên Facebook',
  addFeatured: 'Đưa vào Đáng chú ý', removeFeatured: 'Bỏ khỏi Đáng chú ý',
  addFeaturedPost: 'Đưa bài {{title}} vào Đáng chú ý', removeFeaturedPost: 'Bỏ bài {{title}} khỏi Đáng chú ý',
  featuredAddSuccess: 'Đã đưa bài viết vào mục Đáng chú ý.', featuredRemoveSuccess: 'Đã bỏ bài viết khỏi mục Đáng chú ý.',
  featuredUpdateError: 'Chưa thể thay đổi bài viết Đáng chú ý. Vui lòng thử lại.',
  featuredPosition: 'Vị trí {{current}}/{{total}}',
  moveFeaturedEarlier: 'Đưa lên trước', moveFeaturedLater: 'Đưa xuống sau',
  moveFeaturedEarlierPost: 'Đưa bài {{title}} lên trước', moveFeaturedLaterPost: 'Đưa bài {{title}} xuống sau',
  featuredReordering: 'Đang cập nhật thứ tự bài ghim…',
  featuredReorderSuccess: 'Đã cập nhật thứ tự bài viết được ghim.',
  featuredReorderError: 'Chưa thể cập nhật thứ tự bài ghim. Vui lòng thử lại.',
  showingCount: '{{count}} bài viết phù hợp', emptyTitle: 'Kho tin đang trống',
  emptyText: 'Sau khi kết nối Fanpage, hãy chọn “Cập nhật bài viết” để lấy các bài mới nhất.',
  emptyFiltered: 'Không có bài viết trong khoảng thời gian đã chọn.',
  loadError: 'Chưa thể tải thông tin lúc này. Vui lòng thử lại.',
  reactions: '{{count}} tương tác', openPostAria: 'Mở bài {{title}} trên Facebook',
  filterLabel: 'Lọc theo thời gian', yearLabel: 'Năm', monthLabel: 'Tháng', dayLabel: 'Ngày',
  allYears: 'Tất cả năm', allMonths: 'Tất cả tháng', allDays: 'Tất cả ngày', clearFilters: 'Xóa bộ lọc',
  paginationLabel: 'Phân trang bài Facebook', firstPage: 'Trang đầu', previous: 'Trang trước', next: 'Trang sau',
  lastPage: 'Trang cuối', goToPage: 'Đến trang {{page}}',
  status: { idle: 'Sẵn sàng', running: 'Đang cập nhật', success: 'Hoạt động ổn định', error: 'Cần kiểm tra', unconfigured: 'Chưa kết nối' },
  issues: {
    fanpageAccess: 'Kết nối với Fanpage chưa sẵn sàng hoặc quyền truy cập đã thay đổi. Vui lòng liên hệ người phụ trách.',
    connection: 'Facebook đang phản hồi chậm hoặc mất kết nối. Vui lòng thử lại sau.',
    interrupted: 'Lần cập nhật trước chưa hoàn tất. Vui lòng thử cập nhật lại.',
    inProgress: 'Hệ thống đang cập nhật bài viết. Vui lòng chờ trong giây lát.',
    tooManyRequests: 'Bạn đã yêu cầu cập nhật nhiều lần. Vui lòng chờ vài phút rồi thử lại.',
    unknown: 'Chưa thể cập nhật bài viết. Vui lòng thử lại hoặc liên hệ người phụ trách.',
  },
};
resources.en.translation.management.facebookNews = {
  eyebrow: 'Facebook News', title: 'Update posts from the Facebook Page.',
  intro: 'See the latest update and bring new Facebook Page posts onto the website.',
  refresh: 'Refresh', syncNow: 'Update posts', syncing: 'Updating Facebook posts…', syncingShort: 'Updating',
  updateSuccess: 'Facebook posts have been updated.',
  statusSection: 'Post update status', syncStatus: 'Facebook Page connection', lastSuccess: 'Last update',
  lastResult: 'Posts from the latest update', syncStats: '{{inserted}} new · {{updated}} refreshed', notYet: 'Not yet',
  setupTitle: 'The Facebook Page is not connected', setupText: 'Posts cannot be retrieved yet. Please contact the person responsible for completing the connection.',
  lastError: 'What needs attention', feedEyebrow: 'Content on the website', feedTitle: 'Latest Facebook posts',
  featuredCarouselLabel: 'Manage featured posts', featuredEyebrow: 'Featured', featuredTitle: 'Pinned posts',
  featuredIntro: 'Desktop shows 3 posts and advances one post at a time. Remove them here or change their status in the list below.',
  featuredEmptyTitle: 'No featured posts selected', featuredEmptyText: 'Select the pin icon on a post in the list below.',
  pinnedBadge: 'Pinned', featuredPrevious: 'Previous post', featuredNext: 'Next post',
  featuredViewNavigation: 'Choose a featured post position', goToFeaturedView: 'Go to post position {{view}}',
  featuredSlideLabel: 'Featured post {{current}} of {{total}}', openFeaturedPost: 'Open {{title}} on Facebook',
  addFeatured: 'Add to Featured', removeFeatured: 'Remove from Featured',
  addFeaturedPost: 'Add {{title}} to Featured', removeFeaturedPost: 'Remove {{title}} from Featured',
  featuredAddSuccess: 'The post was added to Featured.', featuredRemoveSuccess: 'The post was removed from Featured.',
  featuredUpdateError: 'The featured post could not be updated. Please try again.',
  featuredPosition: 'Position {{current}}/{{total}}',
  moveFeaturedEarlier: 'Move earlier', moveFeaturedLater: 'Move later',
  moveFeaturedEarlierPost: 'Move {{title}} earlier', moveFeaturedLaterPost: 'Move {{title}} later',
  featuredReordering: 'Updating pinned post order…',
  featuredReorderSuccess: 'Pinned post order has been updated.',
  featuredReorderError: 'Pinned post order could not be updated. Please try again.',
  showingCount: '{{count}} matching posts', emptyTitle: 'The feed is empty',
  emptyText: 'Once the Facebook Page is connected, select “Update posts” to retrieve the latest posts.',
  emptyFiltered: 'No posts were published during the selected date.',
  loadError: 'Information is unavailable right now. Please try again.',
  reactions: '{{count}} interactions', openPostAria: 'Open {{title}} on Facebook',
  filterLabel: 'Filter by date', yearLabel: 'Year', monthLabel: 'Month', dayLabel: 'Day',
  allYears: 'All years', allMonths: 'All months', allDays: 'All days', clearFilters: 'Clear filters',
  paginationLabel: 'Facebook posts pagination', firstPage: 'First page', previous: 'Previous', next: 'Next',
  lastPage: 'Last page', goToPage: 'Go to page {{page}}',
  status: { idle: 'Ready', running: 'Updating', success: 'Working normally', error: 'Needs attention', unconfigured: 'Not connected' },
  issues: {
    fanpageAccess: 'The Facebook Page connection is not ready or its access has changed. Please contact the person responsible.',
    connection: 'Facebook is responding slowly or cannot be reached. Please try again later.',
    interrupted: 'The previous update did not finish. Please try updating again.',
    inProgress: 'Posts are being updated. Please wait a moment.',
    tooManyRequests: 'Updates were requested several times. Please wait a few minutes and try again.',
    unknown: 'Posts could not be updated. Please try again or contact the person responsible.',
  },
};

Object.assign(resources.vi.translation.management.facebookNews, {
  search: 'Tìm kiếm',
  searchPlaceholder: 'Tìm theo nội dung bài viết…',
  searchLabel: 'Tìm kiếm bài Facebook',
  emptySearch: 'Không có bài viết nào khớp với “{{query}}”.',
});
Object.assign(resources.en.translation.management.facebookNews, {
  search: 'Search',
  searchPlaceholder: 'Search post content…',
  searchLabel: 'Search Facebook posts',
  emptySearch: 'No posts match “{{query}}”.',
});
Object.assign(resources.vi.translation.eventPages.facebookNews, {
  featuredIntro: 'Những thông tin quan trọng của sự kiện FPTU Halloween.',
});
Object.assign(resources.en.translation.eventPages.facebookNews, {
  featuredIntro: 'Important updates FPTU Halloween.',
});
Object.assign(resources.vi.translation.management.facebookNews, {
  featuredIntro: 'Những thông tin quan trọng của sự kiện FPTU Halloween.',
});
Object.assign(resources.en.translation.management.facebookNews, {
  featuredIntro: 'Important updates FPTU Halloween.',
});

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem('language') || 'vi',
  fallbackLng: 'vi',
  interpolation: { escapeValue: false },
});

i18n.on('languageChanged', (language) => localStorage.setItem('language', language));

export default i18n;
