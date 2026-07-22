export const CART_UPDATED_EVENT = "cart:updated";

export const getCartItemCount = (cart) =>
  (cart?.items || []).reduce(
    (total, item) => total + Number(item.quantity || 0),
    0,
  );

export const notifyCartUpdated = (cart) => {
  window.dispatchEvent(
    new CustomEvent(CART_UPDATED_EVENT, {
      detail: { cart },
    }),
  );
};

export const flyToCart = (sourceElement) => {
  const targetElement = document.querySelector("[data-cart-target]");
  const sourceIcon = sourceElement?.querySelector("svg");

  if (!targetElement || !sourceIcon) return;

  const sourceRect = sourceIcon.getBoundingClientRect();
  const targetRect = targetElement.getBoundingClientRect();
  const flyingIcon = sourceIcon.cloneNode(true);

  flyingIcon.classList.add("flying-cart-icon");
  flyingIcon.style.left = `${sourceRect.left}px`;
  flyingIcon.style.top = `${sourceRect.top}px`;
  document.body.appendChild(flyingIcon);

  requestAnimationFrame(() => {
    const deltaX = targetRect.left + targetRect.width / 2 - (sourceRect.left + sourceRect.width / 2);
    const deltaY = targetRect.top + targetRect.height / 2 - (sourceRect.top + sourceRect.height / 2);
    flyingIcon.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.35)`;
    flyingIcon.style.opacity = "0.2";
  });

  window.setTimeout(() => flyingIcon.remove(), 650);
};
