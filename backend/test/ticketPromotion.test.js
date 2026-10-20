const test = require('node:test')
const assert = require('node:assert/strict')
const { isPromotionActive, getDiscountedPrice } = require('../src/utils/ticketPromotion')

test('TTOFF21 respects every Vietnam-time boundary', () => {
  const cases = [
    ['2026-10-20T13:29:59+07:00', false],
    ['2026-10-20T13:30:00+07:00', true],
    ['2026-10-20T14:14:59+07:00', true],
    ['2026-10-20T14:15:00+07:00', false],
    ['2026-10-21T11:00:00+07:00', true],
    ['2026-10-21T13:30:00+07:00', false],
    ['2026-10-21T14:00:00+07:00', true],
    ['2026-10-21T16:30:00+07:00', false]
  ]
  for (const [time, expected] of cases) {
    assert.equal(isPromotionActive(Date.parse(time)), expected, time)
  }
})

test('49,000 VND tickets become 36,000 VND each and payment totals remain additive', () => {
  assert.equal(getDiscountedPrice(49000), 36000)
  assert.equal(getDiscountedPrice(49000) * 2, 72000)
})

test('checkout preview and payment service use the same time windows and prices', async () => {
  const frontend = await import('../../frontend/src/utils/ticketPromotion.js')
  for (const date of ['2026-10-20T13:30:00+07:00', '2026-10-20T14:15:00+07:00', '2026-10-21T14:00:00+07:00']) {
    assert.equal(frontend.isPromotionActive(Date.parse(date)), isPromotionActive(Date.parse(date)))
  }
  for (const price of [49000, 50000, 100000]) {
    assert.equal(frontend.getDiscountedPrice(price), getDiscountedPrice(price))
  }
})
