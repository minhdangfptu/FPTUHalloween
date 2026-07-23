import React from "react";
import { FileText, ShieldCheck } from "lucide-react";
import "./Rules.scss";

export default function TermOfUse() {
  return <PolicyPage icon={<FileText />} eyebrow="Thỏa thuận sử dụng" title="Điều khoản sử dụng" intro="Khi truy cập website hoặc sử dụng dịch vụ của FPTU Halloween, bạn đồng ý với các điều khoản dưới đây." sections={[
    ["1. Sử dụng website", "Bạn cam kết cung cấp thông tin chính xác, không sử dụng website cho mục đích gian lận, gây hại hoặc làm gián đoạn hệ thống."],
    ["2. Tài khoản người dùng", "Bạn chịu trách nhiệm bảo mật thông tin đăng nhập và mọi hoạt động phát sinh từ tài khoản của mình. Hãy thông báo ngay cho Ban tổ chức nếu phát hiện truy cập bất thường."],
    ["3. Nội dung và thương hiệu", "Nội dung, hình ảnh và dấu hiệu nhận diện trên website thuộc phạm vi quản lý của đơn vị tổ chức. Việc sao chép hoặc sử dụng lại cần được cho phép."],
    ["4. Thay đổi dịch vụ", "Ban tổ chức có thể cập nhật nội dung, lịch trình hoặc tính năng website khi cần. Các thay đổi quan trọng sẽ được thông báo qua kênh phù hợp."],
  ]} />;
}

function PolicyPage({ icon, eyebrow, title, intro, sections }) { return <main className="rules-page"><div className="rules-shell"><header className="rules-hero"><span className="rules-icon">{icon}</span><p>{eyebrow}</p><h1>{title}</h1><div className="rules-intro">{intro}</div></header><div className="rules-content">{sections.map(([heading, ...paragraphs]) => <section key={heading}><h2>{heading}</h2>{paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>)}<aside className="rules-note"><ShieldCheck size={19} /><span>Việc tiếp tục sử dụng website đồng nghĩa với việc bạn đã đọc và hiểu các nội dung trên.</span></aside></div></div></main>; }
