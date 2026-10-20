export const PROMO_CODE = "TTOFF21";
const DISCOUNT_RATE = 0.265;
const ROUNDING_UNIT = 1000;

export const PROMO_WINDOWS = [
  { start: "2026-10-20T13:30:00+07:00", end: "2026-10-20T14:15:00+07:00" },
  { start: "2026-10-21T11:00:00+07:00", end: "2026-10-21T13:30:00+07:00" },
  { start: "2026-10-21T14:00:00+07:00", end: "2026-10-21T16:30:00+07:00" },
];

export const isPromotionActive = (now = Date.now()) =>
  PROMO_WINDOWS.some(({ start, end }) => now >= Date.parse(start) && now < Date.parse(end));

export const getDiscountedPrice = (price) =>
  Math.max(0, Number(price) - Math.round((Number(price) * DISCOUNT_RATE) / ROUNDING_UNIT) * ROUNDING_UNIT);
