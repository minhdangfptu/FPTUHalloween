import React, { useCallback, useEffect, useState } from "react";
import { ArrowRight, CalendarDays, Clock3, MapPin, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ticketTypeAPI from "../../apis/ticketTypeAPI";
import { translateError } from "../../utils/translateResponse";
import coverImage from "../../assets/cover-01.png";
import "./HauntedGhost.scss";

const STORY_PLACEHOLDER =
  "Đây là phần placeholder cho câu chuyện Nhà Ma. Nội dung chính thức sẽ được cập nhật sau, kể về hành trình bước qua những căn phòng tối, các dấu vết kỳ lạ và những lựa chọn không thể quay đầu của người tham gia. Hãy để trí tưởng tượng dẫn lối, nhưng đừng quên rằng mỗi âm thanh trong đêm Halloween đều có thể là một lời cảnh báo.";

const HOUSE_RULES = [
  "Xếp hàng và làm theo hướng dẫn của Ban tổ chức trước khi vào Nhà Ma.",
  "Không chạm vào đạo cụ, diễn viên hoặc tự ý mở cửa trong khu vực trải nghiệm.",
  "Không sử dụng đèn flash, quay phim hoặc livestream khi chưa được cho phép.",
  "Không chạy và không tách khỏi nhóm trong suốt hành trình.",
  "Ban tổ chức có quyền từ chối phục vụ nếu người tham gia không tuân thủ nội quy.",
];

const HauntedGhost = () => {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadTickets = useCallback(async () => {
    const loadingToast = toast.loading("Đang tải thông tin vé...");
    setIsLoading(true);
    setError("");
    try {
      const data = await ticketTypeAPI.getList({ page: 1, pageSize: 100 });
      const activeTickets = (data.ticketTypes || []).filter(
        (ticket) => ticket.ticketTypeStatus === "active",
      );
      setTickets(activeTickets);
      toast.success("Đã tải thông tin vé thành công", { id: loadingToast });
    } catch (requestError) {
      const message = translateError(requestError);
      setError(message);
      toast.error(message, { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  return (
    <main className="haunted-ghost-page">
      <section
        className="haunted-ghost-hero"
        style={{ backgroundImage: `url(${coverImage})` }}
      >
        <div className="haunted-ghost-hero__copy">
          <p className="haunted-ghost-kicker">
            FPTU HALLOWEEN 2026 · TRANG GIỚI THIỆU
          </p>
          <h1>
            Nhà Ma
            <br />
            <span>mở cửa.</span>
          </h1>
          <p className="haunted-ghost-hero__intro">
            Một đêm, một lối vào và những điều không ai kể lại giống nhau.
          </p>
        </div>
        <div className="haunted-ghost-hero__stamp" aria-hidden="true">
          <strong>HLW</strong>
          <span>2026</span>
        </div>
      </section>

      <section
        className="haunted-ghost-story"
        aria-labelledby="haunted-story-title"
      >
        <div className="haunted-ghost-section-label">01 · Bối cảnh</div>
        <div>
          <h2 id="haunted-story-title">Story Nhà Ma</h2>
          <p>{STORY_PLACEHOLDER}</p>
        </div>
      </section>

      <section
        className="haunted-ghost-trailer"
        aria-labelledby="haunted-trailer-title"
      >
        <div
          className="haunted-ghost-trailer__visual"
          role="img"
          aria-label="Placeholder trailer Nhà Ma"
        >
          <Play size={34} fill="currentColor" />
          <span>Trailer placeholder · video sẽ được cập nhật</span>
        </div>
        <div className="haunted-ghost-trailer__copy">
          <div className="haunted-ghost-section-label">02 · Không khí</div>
          <h2 id="haunted-trailer-title">Trailer</h2>
          <p>Khung này đã sẵn sàng để thay bằng trailer video chính thức.</p>
        </div>
      </section>

      <section
        className="haunted-ghost-rules"
        aria-labelledby="haunted-rules-title"
      >
        <div className="haunted-ghost-rules__image">
          <img src={coverImage} alt="Không gian Nhà Ma Halloween" />
        </div>
        <div className="haunted-ghost-rules__copy">
          <div className="haunted-ghost-section-label">
            03 · Trước khi bước vào
          </div>
          <h2 id="haunted-rules-title">Nội quy Nhà Ma</h2>
          <ul>
            {HOUSE_RULES.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </div>
      </section>

      <section
        className="haunted-ghost-tickets"
        aria-labelledby="haunted-ticket-title"
      >
        <header className="haunted-ghost-heading">
          <div>
            <div className="haunted-ghost-section-label">04 · Chọn lối vào</div>
            <h2 id="haunted-ticket-title">Bảng giá vé Nhà Ma</h2>
          </div>
          <p>Thông tin ngày, giờ, giá vé và số lượng còn lại.</p>
        </header>
        {isLoading ? (
          <div className="haunted-ghost-state" aria-busy="true">
            Đang tải vé...
          </div>
        ) : error ? (
          <div className="haunted-ghost-state haunted-ghost-state--error">
            <p>{error}</p>
            <button type="button" onClick={loadTickets}>
              Thử lại
            </button>
          </div>
        ) : tickets.length === 0 ? (
          <div className="haunted-ghost-state">
            Hiện chưa có vé đang mở bán.
          </div>
        ) : (
          <div className="haunted-ghost-table-wrap">
            <table className="haunted-ghost-table">
              {/* <caption className="haunted-ghost-table__caption">
                Bảng giá vé Nhà Ma Halloween 2026
              </caption> */}
              <thead>
                <tr>
                  <th>Ngày</th>
                  <th>Giờ</th>
                  <th>Giá vé</th>
                  <th>Địa điểm</th>
                  <th>Còn lại</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket._id}>
                    <td data-label="Ngày">{ticket.ticketTypeDate}/10/2026</td>
                    <td data-label="Giờ">{ticket.ticketTypeTime}</td>
                    <td
                      data-label="Giá vé"
                      className="haunted-ghost-table__price"
                    >
                      {new Intl.NumberFormat("vi-VN").format(
                        ticket.ticketTypePrice,
                      )}{" "}
                      VND
                    </td>
                    <td data-label="Địa điểm">
                      Sảnh Tòa nhà Delta (trước thư viện)
                    </td>
                    <td data-label="Còn lại">{ticket.availableQuantity} vé</td>
                    <td className="haunted-ghost-table__action">
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/tickets/detail/${ticket._id}`)
                        }
                      >
                        Mua ngay <ArrowRight size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
};

export default HauntedGhost;
