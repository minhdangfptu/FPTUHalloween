import React from "react";
import { CircleHelp, Ticket } from "lucide-react";
import "./Rules.scss";

export default function TicketPolicy() {
  return <PolicyPage icon={<Ticket />} eyebrow="Mua vé rõ ràng" title="Chính sách vé" intro="Một vài điều quan trọng giúp bạn mua, nhận và sử dụng vé thuận lợi trong ngày diễn ra sự kiện." sections={[
    ["1. Mua và thanh toán", "Vé được ghi nhận sau khi đơn hàng thanh toán thành công. Vui lòng kiểm tra thông tin người mua và loại vé trước khi hoàn tất giao dịch."],
    ["2. Nhận và sử dụng vé", "Mã QR được phát hành cho vé hợp lệ. Mỗi mã chỉ được sử dụng một lần và cần được xuất trình tại cổng check-in theo hướng dẫn của Ban tổ chức."],
    ["3. Đổi, huỷ và hoàn tiền", "Việc đổi hoặc hoàn tiền được thực hiện theo thông báo của chương trình và tình trạng của từng đơn hàng. Vé đã check-in hoặc đã hết hạn không thể sử dụng lại."],
    ["4. Hỗ trợ", "Nếu thông tin vé có sai lệch hoặc bạn gặp vấn đề khi thanh toán, hãy lưu lại mã đơn hàng và liên hệ Ban tổ chức để được kiểm tra."],
  ]} />;
}

function PolicyPage({ icon, eyebrow, title, intro, sections }) { return <main className="rules-page"><div className="rules-shell"><header className="rules-hero"><span className="rules-icon">{icon}</span><p>{eyebrow}</p><h1>{title}</h1><div className="rules-intro">{intro}</div></header><div className="rules-content">{sections.map(([heading, ...paragraphs]) => <section key={heading}><h2>{heading}</h2>{paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>)}<aside className="rules-note"><CircleHelp size={19} /><span>Nếu chưa tìm thấy câu trả lời, hãy gửi yêu cầu qua trang Liên hệ.</span></aside></div></div></main>; }
