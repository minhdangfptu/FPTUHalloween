const getOrderPricing = order => {
  const totalAmount = Number(order.totalAmount) || 0
  const originalAmount = (order.items || []).reduce((sum, item) => {
    const quantity = Number(item.quantity) || 0
    const unitPrice = Number(item.originalPrice ?? item.price ?? item.unitPrice ?? item.ticketTypePrice ??
      (quantity ? Number(item.subtotal) / quantity : 0)) || 0
    return sum + unitPrice * quantity
  }, 0)
  const subtotal = Math.max(originalAmount, totalAmount)
  return { subtotal, discountAmount: subtotal - totalAmount }
}

module.exports = { getOrderPricing }
