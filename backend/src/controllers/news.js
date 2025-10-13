const svc = require('../services/news')

const wrap = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch((err) =>
    res.status(400).json({ message: err?.message || 'Bad Request' })
  )

const list = wrap(async (req, res) => res.json(await svc.listNews(req.query)))
const get = wrap(async (req, res) => res.json(await svc.getNewsById(req.params.id)))
const create = wrap(async (req, res) => res.status(201).json(await svc.createNews(req.body)))
const update = wrap(async (req, res) => res.json(await svc.updateNews(req.params.id, req.body)))
const remove = wrap(async (req, res) => res.json(await svc.deleteNews(req.params.id)))

module.exports = { list, get, create, update, remove }


