import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Clock3,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Ticket,
  Users,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import cartAPI from "../../apis/cartAPI";
import ticketTypeAPI from "../../apis/ticketTypeAPI";
import { translateError, translateSuccess } from "../../utils/translateResponse";
import { flyToCart, notifyCartUpdated } from "../../utils/flyingToCart";
import "./TicketDetail.scss";

const formatPrice = (price) =>
  `${new Intl.NumberFormat("vi-VN").format(price || 0)} VND`;

const TicketDetail = () => {
  const navigate = useNavigate();
  const { ticketTypeId } = useParams();
  const [ticketType, setTicketType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const loadTicketType = useCallback(async () => {
    const loadingToast = toast.loading("Đang tải chi tiết vé...");
    setIsLoading(true);
    setError(null);

    try {
      const data = await ticketTypeAPI.getById(ticketTypeId);
      setTicketType(data);
    } catch (requestError) {
      const message = translateError(requestError);
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
      toast.dismiss(loadingToast);
    }
  }, [ticketTypeId]);

  useEffect(() => {
    loadTicketType();
  }, [loadTicketType]);

  const isActive = ticketType?.ticketTypeStatus === "active";
  const availableQuantity = Number(ticketType?.availableQuantity);
  const totalPrice = useMemo(
    () => (ticketType?.ticketTypePrice || 0) * quantity,
    [quantity, ticketType],
  );

  const addToCart = async (event) => {
    const sourceElement = event.currentTarget;
    setIsAddingToCart(true);
    try {
      const result = await cartAPI.addItem(ticketType._id, quantity);
      notifyCartUpdated(result?.cart);
      flyToCart(sourceElement);
      toast.success(translateSuccess(result?.message || "Item added to cart successfully"));
      navigate("/cart");
    } catch (requestError) {
      toast.error(translateError(requestError));
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (isLoading) {
    return (
      <main className="ticket-detail-page">
        <div className="ticket-detail-state" aria-busy="true" />
      </main>
    );
  }

  if (error || !ticketType) {
    return (
      <main className="ticket-detail-page">
        <div className="ticket-detail-state">
          <p>{error || "Không tìm thấy loại vé."}</p>
          <button type="button" onClick={loadTicketType}>
            Thử lại
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="ticket-detail-page">
      <div className="ticket-detail-shell">
        <button
          className="ticket-detail-back"
          type="button"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={17} /> Quay lại cửa hàng vé
        </button>

        <div className="ticket-detail-layout">
          <section className="ticket-detail-main">
            <div className="ticket-detail-heading">
              <p className="ticket-detail-kicker">
                <Ticket size={15} /> Chi tiết vé
              </p>
              <h1>{ticketType.ticketTypeName}</h1>
            </div>

            <div
              className="ticket-detail-model"
              aria-label={ticketType.ticketType3dModel}
            >
              <div className="ticket-detail-model__orbit" />
              <div className="ticket-detail-model__ticket">
                <span className="ticket-detail-model__number">
                  {String(ticketType.ticketTypeDate).padStart(2, "0")}
                </span>
                <span className="ticket-detail-model__word">ENTRY PASS</span>
                <span className="ticket-detail-model__tear" />
              </div>
              <span className="ticket-detail-model__caption">
                {ticketType.ticketType3dModel}
              </span>
            </div>

            <div className="ticket-detail-info-grid">
              <div>
                <CalendarDays size={19} />
                <span>
                  <small>Ngày tham gia</small>
                  <strong>
                    Ngày {ticketType.ticketTypeDate} tháng 10, 2025
                  </strong>
                </span>
              </div>
              <div>
                <Clock3 size={19} />
                <span>
                  <small>Thời gian</small>
                  <strong>
                    {ticketType.ticketTypeTime || "Đang cập nhật"}
                  </strong>
                </span>
              </div>
              <div>
                <Users size={19} />
                <span>
                  <small>Số lượng còn lại</small>
                  <strong>
                    {ticketType.availableQuantity || "Đang cập nhật"} vé
                  </strong>
                </span>
              </div>
              <div>
                <ShieldCheck size={19} />
                <span>
                  <small>Trạng thái</small>
                  <strong>{isActive ? "Đang mở bán" : "Tạm ngưng"}</strong>
                </span>
              </div>
            </div>

            <div className="ticket-detail-includes">
              <h2>Vé của bạn bao gồm</h2>
              <ul>
                <li>
                  <Check size={17} /> Quyền tham gia trải nghiệm Nhà Ma
                </li>
                <li>
                  <Check size={17} /> Vé điện tử cá nhân
                </li>
                <li>
                  <Check size={17} /> Sử dụng trong đúng ngày đã chọn
                </li>
              </ul>
            </div>
          </section>

          <aside className="ticket-detail-purchase">
            <div className="ticket-detail-purchase__status">
              <span /> {isActive ? "Đang mở bán" : "Tạm ngưng"}
            </div>
            <p className="ticket-detail-purchase__label">Giá vé</p>
            <strong className="ticket-detail-purchase__price">
              {formatPrice(ticketType.ticketTypePrice)}
            </strong>
            <div className="ticket-detail-purchase__rule" />
            <div className="ticket-detail-availability">
              <span>Còn lại</span>
              <strong>{ticketType.availableQuantity}</strong>
            </div>
            <label
              className="ticket-detail-quantity-label"
              htmlFor="ticket-quantity"
            >
              Số lượng vé
            </label>
            <div className="ticket-detail-quantity">
              <button
                type="button"
                aria-label="Giảm số lượng"
                disabled={quantity <= 1}
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
              >
                <Minus size={17} />
              </button>
              <output id="ticket-quantity" aria-live="polite">
                {quantity}
              </output>
              <button
                type="button"
                aria-label="Tăng số lượng"
                disabled={
                  !isActive ||
                  (Number.isInteger(availableQuantity) &&
                    quantity >= availableQuantity)
                }
                onClick={() => setQuantity((value) => value + 1)}
              >
                <Plus size={17} />
              </button>
            </div>
            <div className="ticket-detail-total">
              <span>Tạm tính</span>
              <strong>{formatPrice(totalPrice)}</strong>
            </div>
            <button
              className="ticket-detail-buy"
              type="button"
              disabled={!isActive || isAddingToCart}
              onClick={addToCart}
            >
              <ShoppingBag size={18} /> {isAddingToCart ? "Đang thêm..." : "Thêm vào giỏ hàng"}
            </button>
            <p className="ticket-detail-note">
              Bạn sẽ được chuyển đến bước xác nhận đơn hàng sau khi chọn mua.
            </p>
            {/* <span className="ticket-detail-id">Mã vé: {ticketType._id}</span> */}
          </aside>
        </div>
      </div>
    </main>
  );
};

export default TicketDetail;
