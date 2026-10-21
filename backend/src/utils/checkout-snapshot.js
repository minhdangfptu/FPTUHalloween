const conflict = () => Object.assign(new Error('Cart or ticket price changed; please review checkout'), { statusCode: 409 })

const getItemKey = item => String(item.ticketTypeId)

const validateCheckoutSnapshot = (snapshot, items, expectedAmount) => {
  if (!Array.isArray(snapshot) || snapshot.length !== items.length) throw conflict()
  if (!Number.isSafeInteger(expectedAmount) || expectedAmount < 0) throw conflict()

  const expectedItems = new Map()
  for (const item of snapshot) {
    const key = getItemKey(item)
    if (expectedItems.has(key) || !Number.isSafeInteger(item.quantity) || item.quantity < 1 ||
      !Number.isSafeInteger(item.originalPrice) || item.originalPrice < 0) throw conflict()
    expectedItems.set(key, item)
  }

  for (const item of items) {
    const expected = expectedItems.get(getItemKey(item))
    if (!expected || expected.quantity !== item.quantity || expected.originalPrice !== item.originalPrice) throw conflict()
  }

  const actualAmount = items.reduce((sum, item) => sum + item.subtotal, 0)
  if (actualAmount !== expectedAmount) throw conflict()
}

module.exports = { validateCheckoutSnapshot }
