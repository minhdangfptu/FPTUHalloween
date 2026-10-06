const mongoose = require('mongoose')
const { Cart, TicketType, UserTicket, Order } = require('../models')
const MAX_TICKETS_PER_ACCOUNT = 5

const TICKET_TYPE_FIELDS = 'ticketTypeName ticketTypePrice availableQuantity totalQuantity ticketTypeDate ticketTypeTime ticketTypeStatus ticketType3dModel'

const validateId = (id, fieldName) => {
  if (!mongoose.isValidObjectId(id)) throw new Error(`Invalid ${fieldName}`)
}

const normalizeQuantity = quantity => {
  const normalized = Number(quantity)
  if (!Number.isInteger(normalized) || normalized < 1) {
    throw new Error('Quantity must be a positive integer')
  }
  return normalized
}

const getAvailableQuantity = ticketType => {
  const availableQuantity = Number(ticketType.availableQuantity)
  if (!Number.isInteger(availableQuantity) || availableQuantity < 0) {
    throw new Error('Ticket availability is not configured')
  }
  return availableQuantity
}

const ensurePurchasableTicket = async ticketTypeId => {
  validateId(ticketTypeId, 'ticket type ID')
  const ticketType = await TicketType.findById(ticketTypeId).lean()
  if (!ticketType) throw new Error('Ticket type not found')
  if (ticketType.ticketTypeStatus !== 'active') throw new Error('Ticket type is not available')
  getAvailableQuantity(ticketType)
  return ticketType
}

const getCartDocument = async userId => {
  validateId(userId, 'user ID')
  return Cart.findOne({ userId })
}

const formatCart = async cart => {
  if (!cart) return { items: [], totalAmount: 0 }

  const populatedCart = await Cart.findById(cart._id)
    .populate({ path: 'items.ticketTypeId', select: TICKET_TYPE_FIELDS })
    .lean()

  const items = (populatedCart?.items || []).map(item => {
    const ticketType = item.ticketTypeId
    const unitPrice = Number(ticketType?.ticketTypePrice || 0)
    return {
      ticketTypeId: ticketType?._id || item.ticketTypeId,
      quantity: item.quantity,
      unitPrice,
      subtotal: unitPrice * item.quantity,
      ticketType
    }
  })

  return {
    _id: populatedCart._id,
    userId: populatedCart.userId,
    items,
    totalAmount: items.reduce((total, item) => total + item.subtotal, 0),
    createdAt: populatedCart.createdAt,
    updatedAt: populatedCart.updatedAt
  }
}

const getCart = async userId => formatCart(await getCartDocument(userId))

const getPurchasedTicketCount = async userId => {
  const [issuedCount, pendingOrders] = await Promise.all([
    UserTicket.countDocuments({ userId, ticketStatus: { $ne: 'Cancelled' } }),
    Order.find({ userId, orderStatus: { $in: ['Pending', 'Processing'] }, stockReserved: true }).select('items').lean()
  ])
  return issuedCount + pendingOrders.reduce((total, order) => total + (order.items || []).reduce((sum, item) => sum + Number(item.quantity || 0), 0), 0)
}

const getCartSummary = async userId => ({ purchasedTicketCount: await getPurchasedTicketCount(userId), maxTicketCount: MAX_TICKETS_PER_ACCOUNT })

const addCartItem = async (userId, ticketTypeId, quantity) => {
  const normalizedQuantity = normalizeQuantity(quantity)
  const ticketType = await ensurePurchasableTicket(ticketTypeId)
  const availableQuantity = getAvailableQuantity(ticketType)
  if (normalizedQuantity > availableQuantity) throw new Error('Requested quantity exceeds available tickets')
  let cart = await getCartDocument(userId)

  if (!cart) {
    cart = await Cart.create({ userId, items: [{ ticketTypeId, quantity: normalizedQuantity }] })
    return { message: 'Item added to cart successfully', cart: await formatCart(cart) }
  }

  const item = cart.items.find(cartItem => String(cartItem.ticketTypeId) === String(ticketTypeId))
  const nextQuantity = (item?.quantity || 0) + normalizedQuantity
  if (nextQuantity > availableQuantity) throw new Error('Requested quantity exceeds available tickets')

  if (item) item.quantity = nextQuantity
  else cart.items.push({ ticketTypeId, quantity: normalizedQuantity })
  await cart.save()

  return { message: 'Item added to cart successfully', cart: await formatCart(cart) }
}

const updateCartItem = async (userId, ticketTypeId, quantity) => {
  const normalizedQuantity = normalizeQuantity(quantity)
  const ticketType = await ensurePurchasableTicket(ticketTypeId)
  const availableQuantity = getAvailableQuantity(ticketType)
  if (normalizedQuantity > availableQuantity) throw new Error('Requested quantity exceeds available tickets')

  const cart = await getCartDocument(userId)
  if (!cart) throw new Error('Cart not found')
  const item = cart.items.find(cartItem => String(cartItem.ticketTypeId) === String(ticketTypeId))
  if (!item) throw new Error('Cart item not found')

  item.quantity = normalizedQuantity
  await cart.save()
  return { message: 'Cart item updated successfully', cart: await formatCart(cart) }
}

const removeCartItem = async (userId, ticketTypeId) => {
  validateId(ticketTypeId, 'ticket type ID')
  const cart = await getCartDocument(userId)
  if (!cart) throw new Error('Cart not found')
  const initialLength = cart.items.length
  cart.items = cart.items.filter(item => String(item.ticketTypeId) !== String(ticketTypeId))
  if (cart.items.length === initialLength) throw new Error('Cart item not found')

  await cart.save()
  return { message: 'Item removed from cart successfully', cart: await formatCart(cart) }
}

module.exports = { getCart, getCartSummary, addCartItem, updateCartItem, removeCartItem }
