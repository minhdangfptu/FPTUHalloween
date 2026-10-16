const luckyDrawSvc = require('../services/luckyDraw')

const send = (res, result, statusCode = 200) => res.status(statusCode).json({
  success: true,
  statusCode,
  message: statusCode === 201 ? 'Lucky draw entry created successfully' : 'Operation successful',
  data: result,
  meta: null,
  errors: null
})

const create = (req, res, next) => Promise.resolve(luckyDrawSvc.createLuckyDraw(req.body)).then(result => send(res, result, 201)).catch(next)
const getList = (req, res, next) => Promise.resolve(luckyDrawSvc.getLuckyDraws(req.query)).then(result => send(res, result)).catch(next)
const updatePrize = (req, res, next) => Promise.resolve(luckyDrawSvc.updatePrize(req.params.id, req.body.prize)).then(result => send(res, result)).catch(next)

module.exports = { create, getList, updatePrize }
