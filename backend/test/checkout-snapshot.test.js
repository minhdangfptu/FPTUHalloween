const test = require('node:test')
const assert = require('node:assert/strict')
const { validateCheckoutSnapshot } = require('../src/utils/checkout-snapshot')

const items = [{ ticketTypeId: 'ticket-a', quantity: 2, originalPrice: 49000, price: 36000, subtotal: 72000 }]
const snapshot = [{ ticketTypeId: 'ticket-a', quantity: 2, originalPrice: 49000 }]

test('accepts the exact ticket selection and PayOS amount', () => {
  assert.doesNotThrow(() => validateCheckoutSnapshot(snapshot, items, 72000))
})

test('rejects changed quantity, original price and total before payment creation', () => {
  for (const selected of [
    [{ ...snapshot[0], quantity: 1 }],
    [{ ...snapshot[0], originalPrice: 50000 }],
    [...snapshot, snapshot[0]]
  ]) {
    assert.throws(() => validateCheckoutSnapshot(selected, items, 72000), /Cart or ticket price changed/)
  }
  assert.throws(() => validateCheckoutSnapshot(snapshot, items, 98000), /Cart or ticket price changed/)
  assert.throws(() => validateCheckoutSnapshot(snapshot, [], 72000), /Cart or ticket price changed/)
})
