const svc = require('../services/adminOrder')

const wrap = fn => (req, res, next) => Promise.resolve(fn(req)).then(data => res.json({ success: true, data })).catch(next)

const getList = wrap(req => svc.getOrders(req.query))
const getDetail = wrap(req => svc.getOrderById(req.params.id))
const getTicketStatistics = wrap(req => svc.getTicketSalesStatistics(req.query))

module.exports = { getList, getDetail, getTicketStatistics }
