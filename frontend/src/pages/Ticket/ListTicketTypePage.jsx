import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  ShoppingBag,
  Ticket,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ticketTypeAPI from "../../apis/ticketTypeAPI";
import { translateError } from "../../utils/translateResponse";
import "./ListTicketTypePage.scss";

const FEATURES = [
  "Trải nghiệm Nhà Ma",
  "Vé điện tử cá nhân",
  "Dùng trong ngày sự kiện",
];

const ListTicketTypePage = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [ticketTypes, setTicketTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loadTicketTypes = useCallback(async () => {
    const loadingToast = toast.loading("Đang tải danh sách vé...");
    setIsLoading(true);
    setError(null);
    try {
      const data = await ticketTypeAPI.getList({ page: 1, pageSize: 100 });
      setTicketTypes(data.ticketTypes || []);
    } catch (requestError) {
      const message = translateError(requestError);
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
      toast.dismiss(loadingToast);
    }
  }, []);

  useEffect(() => {
    loadTicketTypes();
  }, [loadTicketTypes]);

  const visibleTickets = useMemo(
    () =>
      activeFilter === "all"
        ? ticketTypes.filter(({ ticketTypeStatus, availableQuantity }) => ticketTypeStatus === "active" && Number(availableQuantity) >= 0)
        : ticketTypes.filter(
            ({ ticketTypeDate, ticketTypeStatus, availableQuantity }) => ticketTypeStatus === "active" && Number(availableQuantity) >= 0 && String(ticketTypeDate) === activeFilter,
          ),
    [activeFilter, ticketTypes],
  );

  const formatPrice = (price) =>
    `${new Intl.NumberFormat("vi-VN").format(price)} VND`;

  return (
    <main className="ticket-list-page">
      <section className="ticket-list-hero">
        <div className="ticket-list-hero__copy">
          <p className="ticket-list-kicker">
            <Ticket size={15} /> FPTU Halloween 2026
          </p>
          <h1>
            Mua vé nhà ma
            <br />
            <span style={{ color: "red" }}>ngay hôm nay.</span>
          </h1>
          <p className="ticket-list-hero__intro">
            Một trải nghiệm kinh dị. Ba ngày để lựa chọn. Chọn ngày bạn muốn
            bước vào Nhà Ma.
          </p>
          <div className="ticket-list-hero__note">
            <span className="ticket-list-hero__dot" /> Vé điện tử được lưu sau
            khi mua thành công
          </div>
        </div>
        <div className="ticket-list-hero__mark" aria-hidden="true">
          <span style={{ color: "red" }}>HLW</span>
          <span>2026</span>
        </div>
      </section>
      <section
        className="ticket-list-content"
        aria-labelledby="ticket-list-heading"
      >
        <div className="ticket-list-heading-row">
          <div>
            <p className="ticket-list-section-label">Cửa hàng vé</p>
            <h2 id="ticket-list-heading">Chọn ngày tham gia</h2>
          </div>
          <div
            className="ticket-list-filter"
            role="tablist"
            aria-label="Lọc theo ngày"
          >
            <button
              className={activeFilter === "all" ? "is-active" : ""}
              onClick={() => setActiveFilter("all")}
              role="tab"
              aria-selected={activeFilter === "all"}
            >
              Tất cả
            </button>
            {[27, 28, 29].map((day) => (
              <button
                key={day}
                className={activeFilter === String(day) ? "is-active" : ""}
                onClick={() => setActiveFilter(String(day))}
                role="tab"
                aria-selected={activeFilter === String(day)}
              >
                {day}/10
              </button>
            ))}
          </div>
        </div>
        {isLoading ? (
          <div className="ticket-list-state" aria-busy="true" />
        ) : error ? (
          <div className="ticket-list-state">
            <p>{error}</p>
            <button type="button" onClick={loadTicketTypes}>
              Thử lại
            </button>
          </div>
        ) : visibleTickets.length === 0 ? (
          <div className="ticket-list-state">Chưa có loại vé nào.</div>
        ) : (
          <div className="ticket-list-grid">
            {visibleTickets.map((ticketType, index) => (
              <article
                className="ticket-card ticket-card--red"
                key={ticketType._id}
              >
                <div className="ticket-card__topline">
                  <span className="ticket-card__eyebrow">
                    Nhà Ma Âm Dương Tử Khí
                  </span>
                  <span className="ticket-card__status">
                    <span />{" "}
                    {ticketType.ticketTypeStatus === "active"
                      ? "Đang mở bán"
                      : "Tạm ngưng"}
                  </span>
                </div>
                <div className="ticket-card__visual" aria-hidden="true">
                  <div className="ticket-card__visual-orbit" />
                  <span className="ticket-card__visual-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="ticket-card__visual-word">ENTRY</span>
                </div>
                <div className="ticket-card__body">
                  <div className="ticket-card__title-row">
                    <h3>{ticketType.ticketTypeName}</h3>
                    <strong className="ticket-card__price">
                      {formatPrice(ticketType.ticketTypePrice)}
                    </strong>
                  </div>
                  <div className="ticket-card__meta">
                    <span>
                      <Clock3 size={16} />
                      {ticketType.ticketTypeTime}
                    </span>
                    <span>
                      <CalendarDays size={16} />
                      Ngày {ticketType.ticketTypeDate} tháng 10, 2026
                    </span>
                    <span>
                      <Ticket size={16} />
                      {ticketType.availableQuantity} vé còn lại
                    </span>
                  </div>
                  <ul>
                    {FEATURES.map((feature) => (
                      <li key={feature}>
                        <Check size={16} /> {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    className="ticket-card__action"
                    onClick={() =>
                      navigate(`/tickets/detail/${ticketType._id}`)
                    }
                  >
                    <span>Xem trải nghiệm</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      <section className="ticket-list-trust" aria-label="Thông tin mua vé">
        <div>
          <ShoppingBag size={20} />
          <span>
            <strong>Mua vé đơn giản</strong>Chọn ngày bạn muốn tham gia
          </span>
        </div>
        <div>
          <Clock3 size={20} />
          <span>
            <strong>Vé điện tử</strong>Nhận vé sau khi thanh toán thành công
          </span>
        </div>
        <div>
          <Ticket size={20} />
          <span>
            <strong>Một vé, một kỷ niệm</strong>Lưu vé để sử dụng trong ngày sự
            kiện
          </span>
        </div>
      </section>
    </main>
  );
};

export default ListTicketTypePage;
