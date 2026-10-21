const test = require('node:test')
const assert = require('node:assert/strict')
const { FUN_PROMO_CODE, isSupportedPromotion, isPromotionActive, getDiscountedPrice } = require('../src/utils/ticketPromotion')

test('TTOFF21 stays active until the end of 23/10/2026 in Vietnam time', () => {
  const cases = [
    ['2026-10-21T00:00:00+07:00', true],
    ['2026-10-22T18:00:00+07:00', true],
    ['2026-10-23T23:59:59.999+07:00', true],
    ['2026-10-24T00:00:00+07:00', false]
  ]
  for (const [time, expected] of cases) {
    assert.equal(isPromotionActive(Date.parse(time)), expected, time)
  }
})

test('49,000 VND tickets become 36,000 VND each and payment totals remain additive', () => {
  assert.equal(getDiscountedPrice(49000), 36000)
  assert.equal(getDiscountedPrice(49000) * 2, 72000)
})

test('GIANGDAMLOUISANTONIE is valid without an expiry and rounds to whole VND', () => {
  assert.equal(isSupportedPromotion(FUN_PROMO_CODE), true)
  assert.equal(isSupportedPromotion('HALLOWEEN'), false)
  for (const time of ['2020-01-01T00:00:00Z', '2026-10-22T00:00:00Z', '2035-01-01T00:00:00Z']) {
    assert.equal(isPromotionActive(Date.parse(time), FUN_PROMO_CODE), true)
  }
  assert.equal(getDiscountedPrice(49000, FUN_PROMO_CODE), 49000)
  assert.equal(getDiscountedPrice(500000, FUN_PROMO_CODE), 499999)
})

test('checkout preview and payment service use the same time windows and prices', async () => {
  const frontend = await import('../../frontend/src/utils/ticketPromotion.js')
  for (const date of ['2026-10-20T13:30:00+07:00', '2026-10-20T14:15:00+07:00', '2026-10-21T14:00:00+07:00']) {
    assert.equal(frontend.isPromotionActive(Date.parse(date)), isPromotionActive(Date.parse(date)))
  }
  for (const price of [49000, 50000, 100000]) {
    assert.equal(frontend.getDiscountedPrice(price), getDiscountedPrice(price))
  }
  assert.equal(frontend.FUN_PROMO_CODE, FUN_PROMO_CODE)
  for (const price of [49000, 500000, 1000000]) {
    assert.equal(frontend.getDiscountedPrice(price, FUN_PROMO_CODE), getDiscountedPrice(price, FUN_PROMO_CODE))
  }
  assert.equal(frontend.isPromotionActive(Date.parse('2035-01-01T00:00:00Z'), FUN_PROMO_CODE), true)
})
