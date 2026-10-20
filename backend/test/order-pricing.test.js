const test = require('node:test')
const assert = require('node:assert/strict')
const { getOrderPricing } = require('../src/utils/order-pricing')

test('admin order pricing shows the original total and saved amount for TTOFF21', () => {
  assert.deepEqual(getOrderPricing({
    items: [{ quantity: 2, originalPrice: 49000, price: 36000, subtotal: 72000 }],
    totalAmount: 72000
  }), { subtotal: 98000, discountAmount: 26000 })
})

test('legacy and manual orders without discounts keep their paid amount', () => {
  assert.deepEqual(getOrderPricing({ items: [{ quantity: 1, price: 49000 }], totalAmount: 49000 }),
    { subtotal: 49000, discountAmount: 0 })
  assert.deepEqual(getOrderPricing({ items: [{ quantity: 1, unitPrice: 49000 }], totalAmount: 49000 }),
    { subtotal: 49000, discountAmount: 0 })
})
