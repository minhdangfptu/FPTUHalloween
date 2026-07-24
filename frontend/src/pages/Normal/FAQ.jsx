/* Hallmark · macrostructure: Conversational FAQ · tone: event operations · anchor hue: FPT red */
import React from "react";
import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  CreditCard,
  HelpCircle,
  Mail,
  MapPin,
  QrCode,
  ShieldCheck,
  ShoppingBag,
  Ticket,
  UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import "./FAQ.scss";

const faqGroups = [
  {
    id: "buying",
    label: "Vé & mua hàng",
    icon: <Ticket size={18} />,
    questions: [
      {
        question: "Mua vé bắt đầu từ đâu?",
        answer: (
          <>
            Mở <Link to="/tickets">Danh sách vé</Link>, chọn loại vé còn bán, số
            lượng rồi thêm vào giỏ. Bạn cần đăng nhập để sử dụng giỏ hàng và
            tiếp tục thanh toán.
          </>
        ),
        icon: <ShoppingBag size={17} />,
      },
      {
        question: "Tôi có thể mua mấy vé?",
        answer:
          "Bạn có thể chọn số lượng là số nguyên dương, tối đa theo số vé còn lại của từng loại. Hệ thống sẽ báo lỗi nếu số lượng vượt quá tồn vé.",
        icon: <Ticket size={17} />,
      },
      {
        question: "Có thể đổi ngày vé không?",
        answer:
          "Mỗi loại vé gắn với một ngày và mốc giờ cụ thể. Hãy kiểm tra thông tin trước khi thanh toán; việc đổi hoặc hoàn tiền được xử lý theo chính sách vé và tình trạng đơn hàng.",
        icon: <CalendarDays size={17} />,
      },
      //   { question: "Mã HALLOWEEN dùng thế nào?", answer: "Nhập mã HALLOWEEN tại bước xác nhận đơn hàng rồi bấm Áp dụng. Nếu mã hợp lệ, hệ thống giảm 10% trên phần tạm tính.", icon: <CheckCircle2 size={17} /> },
    ],
  },
  {
    id: "payment",
    label: "Thanh toán & đơn hàng",
    icon: <CreditCard size={18} />,
    questions: [
      {
        question: "Thanh toán bằng cách nào?",
        answer:
          "Sau khi xác nhận thông tin người mua, hệ thống tạo mã QR VietQR qua PayOS. Bạn chuyển khoản đúng số tiền và nội dung hiển thị trên màn hình thanh toán.",
        icon: <QrCode size={17} />,
      },
      {
        question: "Mã QR thanh toán có hạn bao lâu?",
        answer:
          "Mã QR có thời hạn 15 phút. Khi hết hạn, đơn chưa thanh toán sẽ được đóng và bạn cần tạo lại phiên thanh toán từ giỏ hàng.",
        icon: <Clock3 size={17} />,
      },
      {
        question: "Thanh toán xong nhưng chưa thấy vé?",
        answer:
          "Hệ thống tự kiểm tra trạng thái PayOS và webhook sẽ xác nhận giao dịch. Nếu màn hình chưa cập nhật, hãy kiểm tra lại trong Tài khoản của bạn sau ít phút và giữ lại mã đơn hàng.",
        icon: <ShieldCheck size={17} />,
      },
      {
        question: "Đơn chưa thanh toán có hủy được không?",
        answer:
          "Bạn có thể hủy đơn đang chờ thanh toán trên màn hình QR. Đơn đã thanh toán không thể hủy trực tiếp bằng thao tác này; hãy liên hệ ban tổ chức để được kiểm tra.",
        icon: <HelpCircle size={17} />,
      },
    ],
  },
  {
    id: "event-day",
    label: "Nhận vé & check-in",
    icon: <QrCode size={18} />,
    questions: [
      {
        question: "Vé điện tử nằm ở đâu?",
        answer: (
          <>
            Sau khi đơn được thanh toán, mở{" "}
            <Link to="/my-ticket">Vé của bạn</Link> để xem từng vé và mã QR. Hãy
            đăng nhập đúng tài khoản đã dùng khi mua.
          </>
        ),
        icon: <UserRound size={17} />,
      },
      {
        question: "Mã QR có dùng lại được không?",
        answer:
          "Không. Mỗi mã QR chỉ được check-in một lần. Sau khi sử dụng, vé chuyển sang trạng thái đã check-in và không thể xác nhận lại.",
        icon: <ShieldCheck size={17} />,
      },
      {
        question: "Tôi check-in vào ngày nào?",
        answer:
          "Bạn chỉ có thể check-in vào đúng ngày ghi trên loại vé. Nhân sự tại cổng sẽ quét mã QR và đối chiếu thông tin vé trước khi xác nhận.",
        icon: <CalendarDays size={17} />,
      },
      {
        question: "Điểm tổ chức ở đâu?",
        answer:
          "Sự kiện diễn ra tại Trường Đại học FPT Hà Nội, khu CNC Hòa Lạc. Vui lòng xem thông báo chính thức và thông tin trên vé trước ngày tham dự.",
        icon: <MapPin size={17} />,
      },
    ],
  },
  {
    id: "account-support",
    label: "Tài khoản & hỗ trợ",
    icon: <UserRound size={18} />,
    questions: [
      {
        question: "Vì sao tôi cần xác nhận email?",
        answer:
          "Tài khoản mới cần xác nhận OTP qua email trước khi đăng nhập. Email cũng được dùng để nhận thông tin người mua và hỗ trợ đối soát đơn hàng.",
        icon: <Mail size={17} />,
      },
      {
        question: "Quên mật khẩu thì làm gì?",
        answer:
          "Chọn Quên mật khẩu tại màn hình đăng nhập, nhập email và hoàn tất bước OTP để đặt mật khẩu mới.",
        icon: <UserRound size={17} />,
      },
      {
        question: "Thanh toán lỗi cần làm gì?",
        answer:
          "Không tạo nhiều giao dịch liên tiếp. Hãy kiểm tra số tiền, nội dung chuyển khoản và trạng thái đơn; nếu vẫn lỗi, lưu mã đơn hàng rồi liên hệ ban tổ chức.",
        icon: <CreditCard size={17} />,
      },
      {
        question: "Liên hệ ban tổ chức ở đâu?",
        answer: (
          <>
            Gửi yêu cầu qua <Link to="/contact-us">trang Liên hệ</Link> hoặc
            email{" "}
            <a href="mailto:fptuhalloween@gmail.com">fptuhalloween@gmail.com</a>
            . Khi cần hỗ trợ đơn, hãy gửi kèm email tài khoản và mã đơn hàng.
          </>
        ),
        icon: <Mail size={17} />,
      },
    ],
  },
];

const FAQ = () => (
  <main className="faq-page">
    <div className="faq-shell">
      <header className="faq-hero">
        <div className="faq-hero__copy">
          <p className="faq-eyebrow">
            <HelpCircle size={15} /> FPTU Halloween · Hỏi đáp
          </p>
          <h1>Giải đáp trước giờ vào cổng</h1>
          <p className="faq-hero__intro">
            Từ lúc chọn vé, thanh toán bằng QR đến lúc check-in — mọi điều cần
            biết đều ở đây.
          </p>
          <div className="faq-hero__actions">
            <Link className="faq-button faq-button--primary" to="/tickets">
              Xem loại vé <ArrowUpRight size={16} />
            </Link>
            <Link className="faq-button faq-button--quiet" to="/contact-us">
              Cần hỗ trợ?
            </Link>
          </div>
        </div>
        <aside className="faq-hero__note">
          <span className="faq-hero__note-mark">
            <CheckCircle2 size={18} />
          </span>
          <div>
            <strong>Thông tin quan trọng</strong>
            <p>Vé chỉ hợp lệ khi đơn đã thanh toán và mã QR được phát hành.</p>
          </div>
        </aside>
      </header>
      <div className="faq-layout">
        <aside className="faq-rail" aria-label="Thông tin nhanh">
          <p className="faq-rail__label">Trước khi bạn hỏi</p>
          <h2>Đêm hội, rõ ràng từ đầu.</h2>
          <p className="faq-rail__intro">
            Lưu lại ba điều này để hành trình mua vé và vào cổng diễn ra gọn
            gàng.
          </p>
          <div className="faq-rail__facts">
            <div>
              <CalendarDays size={17} />
              <span>
                <b>Ngày trên vé</b>
                <small>Check-in đúng ngày đã chọn</small>
              </span>
            </div>
            <div>
              <Clock3 size={17} />
              <span>
                <b>15 phút</b>
                <small>Thời hạn của mã QR thanh toán</small>
              </span>
            </div>
            <div>
              <MapPin size={17} />
              <span>
                <b>Đại học FPT Hà Nội</b>
                <small>Khu CNC Hòa Lạc</small>
              </span>
            </div>
          </div>
          <div className="faq-rail__links">
            <Link to="/ticket-policy">
              Đọc chính sách vé <ArrowUpRight size={14} />
            </Link>
            <Link to="/data-policy">
              Chính sách dữ liệu <ArrowUpRight size={14} />
            </Link>
          </div>
        </aside>
        <div className="faq-groups">
          {faqGroups.map((group) => (
            <section
              className="faq-group"
              key={group.id}
              aria-labelledby={`faq-${group.id}`}
            >
              <header className="faq-group__header">
                <span>{group.icon}</span>
                <div>
                  <p>Giải đáp</p>
                  <h2 id={`faq-${group.id}`}>{group.label}</h2>
                </div>
              </header>
              <div className="faq-question-list">
                {group.questions.map((item, index) => (
                  <details
                    className="faq-item"
                    key={item.question}
                    open={index === 0}
                  >
                    <summary>
                      <span className="faq-item__icon">{item.icon}</span>
                      <span className="faq-item__question">
                        {item.question}
                      </span>
                      <ChevronDown className="faq-item__chevron" size={17} />
                    </summary>
                    <div className="faq-item__answer">
                      <p>{item.answer}</p>
                    </div>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
      <footer className="faq-contact-strip">
        <div>
          <span className="faq-contact-strip__icon">
            <Mail size={18} />
          </span>
          <div>
            <strong>Không thấy câu trả lời?</strong>
            <p>Ban tổ chức sẵn sàng kiểm tra cùng bạn.</p>
          </div>
        </div>
        <Link to="/contact-us">
          Liên hệ ban tổ chức <ArrowUpRight size={16} />
        </Link>
      </footer>
    </div>
  </main>
);

export default FAQ;
