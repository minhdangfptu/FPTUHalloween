export const PROMO_CODE = "TTOFF21";
export const FUN_PROMO_CODE = "GIANGDAMLOUISANTONIE";
const DISCOUNT_RATE = 0.265;
const FUN_DISCOUNT_RATE = 0.000001;
const ROUNDING_UNIT = 1000;

export const PROMO_WINDOWS = [
  { start: "2026-10-20T13:30:00+07:00", end: "2026-10-20T14:15:00+07:00" },
  { start: "2026-10-21T11:00:00+07:00", end: "2026-10-21T13:30:00+07:00" },
  { start: "2026-10-21T14:00:00+07:00", end: "2026-10-21T16:30:00+07:00" },
];

export const isSupportedPromotion = (code) => [PROMO_CODE, FUN_PROMO_CODE].includes(code);

export const isPromotionActive = (now = Date.now(), code = PROMO_CODE) =>
  code === FUN_PROMO_CODE ||
  (code === PROMO_CODE && PROMO_WINDOWS.some(({ start, end }) => now >= Date.parse(start) && now < Date.parse(end)));

export const getDiscountedPrice = (price, code = PROMO_CODE) => {
  const amount = Number(price);
  const discount = code === FUN_PROMO_CODE
    ? Math.round(amount * FUN_DISCOUNT_RATE)
    : Math.round((amount * DISCOUNT_RATE) / ROUNDING_UNIT) * ROUNDING_UNIT;
  return Math.max(0, amount - discount);
};
