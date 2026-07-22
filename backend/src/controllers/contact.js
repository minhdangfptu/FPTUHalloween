const contactSvc = require('../services/contact')

const send = (res, result, statusCode = 200) => {
  const { message: serviceMessage, ...data } = result || {}
  return res.status(statusCode).json({ success: true, statusCode, message: serviceMessage || 'Operation successful', data: Object.keys(data).length ? data : null, meta: null, errors: null })
}

const create = (req, res, next) => Promise.resolve(contactSvc.createContact(req.body, req.user?.id)).then(result => send(res, result, 201)).catch(next)
const getList = (req, res, next) => Promise.resolve(contactSvc.getContacts(req.query)).then(result => send(res, result)).catch(next)
const getDetail = (req, res, next) => Promise.resolve(contactSvc.getContactById(req.params.id)).then(result => send(res, { contact: result })).catch(next)
const remove = (req, res, next) => Promise.resolve(contactSvc.deleteContact(req.params.id)).then(result => send(res, result)).catch(next)
const updateStatus = (req, res, next) => Promise.resolve(contactSvc.updateContactStatus(req.params.id, req.body.isContactted)).then(result => send(res, result)).catch(next)

module.exports = { create, getList, getDetail, remove, updateStatus }
