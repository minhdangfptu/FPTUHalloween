const svc = require('../services/halloween')

const wrap = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch((err) =>
    res.status(400).json({ message: err?.message || 'Bad Request' })
  )

const list = wrap(async (req, res) => res.json(await svc.listHalloweens(req.query)))
const get = wrap(async (req, res) => res.json(await svc.getHalloweenById(req.params.id)))
const create = wrap(async (req, res) => res.status(201).json(await svc.createHalloween(req.body)))
const update = wrap(async (req, res) => res.json(await svc.updateHalloween(req.params.id, req.body)))
const remove = wrap(async (req, res) => res.json(await svc.deleteHalloween(req.params.id)))

module.exports = { list, get, create, update, remove }
