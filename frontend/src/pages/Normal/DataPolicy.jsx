import React from "react";
import { Database, ShieldCheck } from "lucide-react";
import "./Rules.scss";

export default function DataPolicy() {
  return <PolicyPage icon={<Database />} eyebrow="Thông tin minh bạch" title="Chính sách bảo mật dữ liệu" intro="Chúng tôi tôn trọng quyền riêng tư và chỉ sử dụng thông tin cần thiết để vận hành trải nghiệm FPTU Halloween." sections={[
    ["1. Thông tin chúng tôi thu thập", "Khi bạn đăng ký, mua vé hoặc liên hệ, chúng tôi có thể tiếp nhận họ tên, email, số điện thoại và thông tin giao dịch cần thiết.", "Mã vé và dữ liệu check-in được dùng để xác thực quyền tham dự sự kiện."],
    ["2. Mục đích sử dụng", "Thông tin được dùng để xử lý đơn hàng, phát hành vé, hỗ trợ người tham gia, gửi thông báo cần thiết và bảo đảm an toàn tại sự kiện."],
    ["3. Bảo vệ và lưu trữ", "Dữ liệu được giới hạn quyền truy cập theo vai trò và được lưu trữ trong thời gian phù hợp với mục đích vận hành, đối soát và nghĩa vụ liên quan."],
    ["4. Quyền của bạn", "Bạn có thể yêu cầu xem, cập nhật hoặc giải đáp về dữ liệu của mình bằng cách liên hệ Ban tổ chức qua kênh Liên hệ."],
  ]} />;
}

function PolicyPage({ icon, eyebrow, title, intro, sections }) { return <main className="rules-page"><div className="rules-shell"><header className="rules-hero"><span className="rules-icon">{icon}</span><p>{eyebrow}</p><h1>{title}</h1><div className="rules-intro">{intro}</div></header><div className="rules-content">{sections.map(([heading, ...paragraphs]) => <section key={heading}><h2>{heading}</h2>{paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>)}<aside className="rules-note"><ShieldCheck size={19} /><span>Thông tin trên trang này giúp bạn hiểu cách chúng tôi vận hành dữ liệu. Nếu cần làm rõ, hãy liên hệ Ban tổ chức.</span></aside></div></div></main>; }
