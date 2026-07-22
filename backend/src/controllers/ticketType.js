const svc = require('../services/ticketType')

const wrap = (fn, successStatus = 200) => (req, res, next) => Promise.resolve(fn(req, res)).then(data => res.status(successStatus).json({ success: true, data })).catch(next)

const create = (req, res, next) => Promise.resolve(svc.createTicketType(req.body)).then(data => res.status(201).json({ success: true, message: 'Ticket type created successfully', data })).catch(next)
const getList = wrap(req => svc.getTicketTypes(req.query))
const getDetail = wrap(req => svc.getTicketTypeById(req.params.id))
const update = (req, res, next) => Promise.resolve(svc.updateTicketType(req.params.id, req.body)).then(data => res.status(200).json({ success: true, message: 'Ticket type updated successfully', data })).catch(next)
const remove = wrap(req => svc.deleteTicketType(req.params.id))
const changeStatus = (req, res, next) => Promise.resolve(svc.changeTicketTypeStatus(req.params.id, req.body.ticketTypeStatus)).then(result => res.status(200).json({ success: true, message: result.message, data: result.ticketType })).catch(next)

module.exports = { create, getList, getDetail, update, remove, changeStatus }
