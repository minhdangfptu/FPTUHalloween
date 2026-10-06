const cartSvc = require('../services/cart')

const wrap = (fn, successStatus = 200) => (req, res, next) =>
  Promise.resolve(fn(req, res)).then(data => res.status(successStatus).json({ success: true, data })).catch(next)

const get = wrap(req => cartSvc.getCart(req.user.id))
const getSummary = wrap(req => cartSvc.getCartSummary(req.user.id))
const addItem = wrap((req) => cartSvc.addCartItem(req.user.id, req.body?.ticketTypeId, req.body?.quantity), 201)
const updateItem = wrap(req => cartSvc.updateCartItem(req.user.id, req.params.ticketTypeId, req.body?.quantity))
const removeItem = wrap(req => cartSvc.removeCartItem(req.user.id, req.params.ticketTypeId))

module.exports = { get, getSummary, addItem, updateItem, removeItem }
