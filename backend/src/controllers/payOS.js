const payOSService = require('../services/payOS')

const wrap = fn => (req, res, next) => Promise.resolve(fn(req)).then(data => res.json({ success: true, data })).catch(next)

const createPayment = wrap(req => payOSService.createPayment(req.user.id, req.body))
const getPaymentStatus = wrap(req => payOSService.getPaymentStatus(req.user.id, req.params.orderCode))
const cancelPayment = wrap(req => payOSService.cancelPayment(req.user.id, req.params.orderCode))

module.exports = { createPayment, getPaymentStatus, cancelPayment }
