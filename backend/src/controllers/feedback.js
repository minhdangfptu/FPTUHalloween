const feedbackSvc = require('../services/feedback')

const createForm = (req, res, next) => Promise.resolve(
  feedbackSvc.createForm(req.body, req.user.id)
).then(data => res.status(201).json({ success: true, message: 'Feedback form created successfully', data })).catch(next)

const getForms = (req, res, next) => Promise.resolve(
  feedbackSvc.getForms({ targetType: req.query.targetType, status: req.query.status, roleName: req.user.roleName })
).then(data => res.status(200).json({ success: true, data })).catch(next)

const getFormById = (req, res, next) => Promise.resolve(
  feedbackSvc.getFormById(req.params.id, req.user.roleName)
).then(data => res.status(200).json({ success: true, data })).catch(next)

const updateForm = (req, res, next) => Promise.resolve(
  feedbackSvc.updateForm(req.params.id, req.body, req.user.id)
).then(data => res.status(200).json({ success: true, message: 'Feedback form updated successfully', data })).catch(next)

const deleteForm = (req, res, next) => Promise.resolve(
  feedbackSvc.deleteForm(req.params.id)
).then(() => res.status(200).json({ success: true, message: 'Feedback form deleted successfully' })).catch(next)

const submitResponse = (req, res, next) => Promise.resolve(
  feedbackSvc.submitResponse(req.params.formId, req.body.answers, req.user.id, req.user.roleName)
).then(data => res.status(201).json({ success: true, message: 'Feedback submitted successfully', data })).catch(next)

const getResponses = (req, res, next) => Promise.resolve(
  feedbackSvc.getResponses(req.params.formId, req.query)
).then(data => res.status(200).json({ success: true, ...data })).catch(next)

const getStatistics = (req, res, next) => Promise.resolve(
  feedbackSvc.getStatistics(req.params.formId)
).then(data => res.status(200).json({ success: true, data })).catch(next)

module.exports = { createForm, getForms, getFormById, updateForm, deleteForm, submitResponse, getResponses, getStatistics }
