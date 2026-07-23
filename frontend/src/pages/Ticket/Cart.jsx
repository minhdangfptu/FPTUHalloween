import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Minus,
  Plus,
  ShoppingBag,
  Ticket,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import cartAPI from "../../apis/cartAPI";
import {
  translateError,
  translateSuccess,
} from "../../utils/translateResponse";
import { notifyCartUpdated } from "../../utils/flyingToCart";
import "./Cart.scss";

const formatPrice = (price) =>
  `${new Intl.NumberFormat("vi-VN").format(price || 0)} VND`;

const getTicketType = (item) => item.ticketType || {};
const SELECTED_ITEMS_KEY = "fptu-halloween-selected-cart-items";

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);
  const [selectedTicketTypeIds, setSelectedTicketTypeIds] = useState([]);

  const loadCart = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const nextCart = await cartAPI.get();
      setCart(nextCart);
      const storedIds = JSON.parse(localStorage.getItem(SELECTED_ITEMS_KEY) || "null");
      const availableIds = (nextCart.items || []).map((item) => String(item.ticketTypeId));
      setSelectedTicketTypeIds(
        Array.isArray(storedIds)
          ? storedIds.filter((id) => availableIds.includes(String(id)))
          : availableIds,
      );
    } catch (requestError) {
      setError(translateError(requestError));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const cartItems = cart.items || [];
  const totalQuantity = useMemo(
    () =>
      cartItems.reduce((total, item) => total + Number(item.quantity || 0), 0),
    [cartItems],
  );
  const selectedItems = useMemo(
    () => cartItems.filter((item) => selectedTicketTypeIds.includes(String(item.ticketTypeId))),
    [cartItems, selectedTicketTypeIds],
  );
  const selectedTotal = useMemo(
    () => selectedItems.reduce((total, item) => total + Number(item.subtotal || 0), 0),
    [selectedItems],
  );
  const hasSelectedUnavailableItems = selectedItems.some(
    (item) => getTicketType(item).ticketTypeStatus !== "active" || Number(getTicketType(item).availableQuantity) < 0,
  );
  const allItemsSelected = cartItems.length > 0 && selectedItems.length === cartItems.length;

  const toggleItemSelection = (ticketTypeId) => {
    const normalizedId = String(ticketTypeId);
    setSelectedTicketTypeIds((currentIds) => {
      const nextIds = currentIds.includes(normalizedId)
        ? currentIds.filter((id) => id !== normalizedId)
        : [...currentIds, normalizedId];
      localStorage.setItem(SELECTED_ITEMS_KEY, JSON.stringify(nextIds));
      return nextIds;
    });
  };

  const toggleAllItems = () => {
    const nextIds = allItemsSelected ? [] : cartItems.map((item) => String(item.ticketTypeId));
    setSelectedTicketTypeIds(nextIds);
    localStorage.setItem(SELECTED_ITEMS_KEY, JSON.stringify(nextIds));
  };

  const runMutation = async (actionKey, request, successMessage) => {
    setPendingAction(actionKey);
    try {
      const result = await request();
      if (result?.cart) {
        setCart(result.cart);
        const remainingIds = selectedTicketTypeIds.filter((id) =>
          result.cart.items.some((item) => String(item.ticketTypeId) === id),
        );
        setSelectedTicketTypeIds(remainingIds);
        localStorage.setItem(SELECTED_ITEMS_KEY, JSON.stringify(remainingIds));
        notifyCartUpdated(result.cart);
      }
      toast.success(translateSuccess(result?.message || successMessage));
    } catch (requestError) {
      toast.error(translateError(requestError));
    } finally {
      setPendingAction(null);
    }
  };

  const updateQuantity = (item, nextQuantity) => {
    const ticketTypeId = item.ticketTypeId;
    return runMutation(
      `update-${ticketTypeId}`,
      () => cartAPI.updateItem(ticketTypeId, Math.max(1, nextQuantity)),
      "Cart item updated successfully",
    );
  };

  const removeItem = (ticketTypeId) =>
    runMutation(
      `remove-${ticketTypeId}`,
      () => cartAPI.removeItem(ticketTypeId),
      "Item removed from cart successfully",
    );

  const removeAllItems = async () => {
    setPendingAction("remove-all");
    try {
      for (const item of cartItems) {
        await cartAPI.removeItem(item.ticketTypeId);
      }
      setCart({ ...cart, items: [], totalAmount: 0 });
      setSelectedTicketTypeIds([]);
      localStorage.removeItem(SELECTED_ITEMS_KEY);
      notifyCartUpdated({ items: [], totalAmount: 0 });
      toast.success("Đã xóa tất cả vé khỏi giỏ hàng.");
    } catch (requestError) {
      toast.error(translateError(requestError));
      await loadCart();
    } finally {
      setPendingAction(null);
    }
  };

  if (isLoading) {
    return (
      <main className="ticket-cart-page">
        <div className="ticket-cart-state" aria-busy="true" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="ticket-cart-page">
        <div className="ticket-cart-state">
          <p>{error}</p>
          <button type="button" onClick={loadCart}>
            Thử lại
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="ticket-cart-page">
      <div className="ticket-cart-shell">
        <button
          className="ticket-cart-back"
          type="button"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={17} /> Tiếp tục chọn vé
        </button>

        <header className="ticket-cart-heading">
          <div>
            <h1>Giỏ vé của bạn</h1>
          </div>
          {cartItems.length > 0 && (
            <span className="ticket-cart-count">{totalQuantity} vé</span>
          )}
        </header>

        {cartItems.length === 0 ? (
          <section className="ticket-cart-empty">
            <div className="ticket-cart-empty__icon">
              <ShoppingBag size={30} />
            </div>
            <h2>Giỏ vé đang trống</h2>
            <p>Chọn một trải nghiệm Halloween để bắt đầu hành trình của bạn.</p>
            <button
              className="ticket-cart-primary"
              type="button"
              onClick={() => navigate("/tickets")}
            >
              Xem danh sách vé
            </button>
          </section>
        ) : (
          <div className="ticket-cart-layout">
            <section
              className="ticket-cart-items"
              aria-label="Các vé trong giỏ hàng"
            >
              <div className="ticket-cart-items__top">
                <label className="ticket-cart-select-all">
                  <input type="checkbox" checked={allItemsSelected} onChange={toggleAllItems} />
                  <span>Chọn tất cả ({selectedItems.length}/{cartItems.length})</span>
                </label>
                <button
                  type="button"
                  disabled={pendingAction !== null}
                  onClick={removeAllItems}
                >
                  Xóa tất cả
                </button>
              </div>
              {cartItems.map((item) => {
                const ticketType = getTicketType(item);
                const ticketTypeId = item.ticketTypeId;
                const isSoldOut = Number(ticketType.availableQuantity) < 0;
                const isUnavailable = ticketType.ticketTypeStatus !== "active" || isSoldOut;
                const isPending = pendingAction !== null;
                return (
                  <article className={`ticket-cart-item${isUnavailable ? " ticket-cart-item--unavailable" : ""}`} key={ticketTypeId}>
                    <label className="ticket-cart-item__checkbox">
                      <input
                        type="checkbox"
                        checked={selectedTicketTypeIds.includes(String(ticketTypeId))}
                        onChange={() => toggleItemSelection(ticketTypeId)}
                        aria-label={`Chọn ${ticketType.ticketTypeName} để thanh toán`}
                      />
                    </label>
                    <div
                      className="ticket-cart-item__visual"
                      aria-hidden="true"
                    >
                      <Ticket size={25} />
                      <strong>
                        {String(ticketType.ticketTypeDate || "01").padStart(
                          2,
                          "0",
                        )}
                      </strong>
                    </div>
                    <div className="ticket-cart-item__content">
                      <div className="ticket-cart-item__heading">
                        <div>
                          <p>Trải nghiệm Halloween</p>
                          <h2>{ticketType.ticketTypeName}</h2>
                        </div>
                        <button
                          className="ticket-cart-item__remove"
                          type="button"
                          aria-label={`Xóa ${ticketType.ticketTypeName}`}
                          disabled={isPending}
                          onClick={() => removeItem(ticketTypeId)}
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                      {isSoldOut ? <p className="ticket-cart-item__unavailable">Hết vé</p> : isUnavailable && <p className="ticket-cart-item__unavailable">Vé không còn được bán</p>}
                      <div className="ticket-cart-item__meta">
                        <span>
                          <CalendarDays size={15} /> Ngày{" "}
                          {ticketType.ticketTypeDate} tháng 10, 2025
                        </span>
                        <span>
                          <Clock3 size={15} />{" "}
                          {ticketType.ticketTypeTime ||
                            "Thời gian sẽ được cập nhật"}
                        </span>
                      </div>
                      <div className="ticket-cart-item__footer">
                        <div className="ticket-cart-quantity">
                          <button
                            type="button"
                            aria-label="Giảm số lượng"
                            disabled={isPending || isUnavailable || item.quantity <= 1}
                            onClick={() =>
                              updateQuantity(item, item.quantity - 1)
                            }
                          >
                            <Minus size={15} />
                          </button>
                          <output aria-live="polite">{item.quantity}</output>
                          <button
                            type="button"
                            aria-label="Tăng số lượng"
                            disabled={isPending || isUnavailable}
                            onClick={() =>
                              updateQuantity(item, item.quantity + 1)
                            }
                          >
                            <Plus size={15} />
                          </button>
                        </div>
                        <strong>{formatPrice(item.subtotal)}</strong>
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>

            <aside className="ticket-cart-summary">
              <p className="ticket-cart-summary__label">Tóm tắt đơn hàng</p>
              <div>
                <span>Tạm tính ({selectedItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0)} vé)</span>
                <strong>{formatPrice(selectedTotal)}</strong>
              </div>
              <div>
                <span>Phí dịch vụ</span>
                <strong>Đang cập nhật</strong>
              </div>
              <div className="ticket-cart-summary__total">
                <span>Tổng cộng</span>
                <strong>{formatPrice(selectedTotal)}</strong>
              </div>
              <button
                className="ticket-cart-primary"
                type="button"
                disabled={hasSelectedUnavailableItems || selectedItems.length === 0}
                onClick={() => {
                  localStorage.setItem(SELECTED_ITEMS_KEY, JSON.stringify(selectedTicketTypeIds));
                  navigate("/checkout");
                }}
              >
                Tiếp tục thanh toán
              </button>
              {hasSelectedUnavailableItems && <p className="ticket-cart-summary__warning">Hãy bỏ chọn hoặc xóa vé không còn được bán trước khi thanh toán.</p>}
              {selectedItems.length === 0 && <p className="ticket-cart-summary__warning">Hãy chọn ít nhất một loại vé để thanh toán.</p>}
              <p className="ticket-cart-summary__note">
                Bạn sẽ được chuyển đến trang xác nhận thanh toán.
              </p>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
};

export default Cart;
