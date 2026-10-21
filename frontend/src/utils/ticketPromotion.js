export const PROMO_CODE = "TTOFF21";
export const FUN_PROMO_CODE = "GIANGDAMLOUISANTONIE";
const DISCOUNT_RATE = 0.265;
const FUN_DISCOUNT_RATE = 0.000001;
const ROUNDING_UNIT = 1000;
export const PROMO_END_AT = "2026-10-24T00:00:00+07:00";

export const isSupportedPromotion = (code) => [PROMO_CODE, FUN_PROMO_CODE].includes(code);

export const isPromotionActive = (now = Date.now(), code = PROMO_CODE) =>
  code === FUN_PROMO_CODE ||
  (code === PROMO_CODE && now < Date.parse(PROMO_END_AT));

export const getDiscountedPrice = (price, code = PROMO_CODE) => {
  const amount = Number(price);
  const discount = code === FUN_PROMO_CODE
    ? Math.round(amount * FUN_DISCOUNT_RATE)
    : Math.round((amount * DISCOUNT_RATE) / ROUNDING_UNIT) * ROUNDING_UNIT;
  return Math.max(0, amount - discount);
};
