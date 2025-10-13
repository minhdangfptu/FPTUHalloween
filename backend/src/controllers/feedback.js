const svc = require('../services/feedback')

const wrap = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch((err) =>
    res.status(400).json({ message: err?.message || 'Bad Request' })
  )

const list = wrap(async (req, res) => res.json(await svc.listFeedbacks(req.query)))
const listByEvent = wrap(async (req, res) => res.json(await svc.listFeedbacksByHalloween(req.params.id, req.query)))
const get = wrap(async (req, res) => res.json(await svc.getFeedbackById(req.params.id)))
const create = wrap(async (req, res) => res.status(201).json(await svc.createFeedback(req.body)))
const update = wrap(async (req, res) => res.json(await svc.updateFeedback(req.params.id, req.body)))
const remove = wrap(async (req, res) => res.json(await svc.deleteFeedback(req.params.id)))

module.exports = { list, listByEvent, get, create, update, remove }


