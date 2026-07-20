const contactSvc = require('../services/contact')

const send = (res, result, statusCode = 200) => {
  const { message: serviceMessage, ...data } = result || {}
  return res.status(statusCode).json({ success: true, statusCode, message: serviceMessage || 'Operation successful', data: Object.keys(data).length ? data : null, meta: null, errors: null })
}

const create = (req, res, next) => Promise.resolve(contactSvc.createContact(req.body, req.user?.id)).then(result => send(res, result, 201)).catch(next)

module.exports = { create }
