const mongoose = require('mongoose')
const { FeedbackForm, FeedbackResponse } = require('../models')

const buildError = (statusCode, message) => Object.assign(new Error(message), { statusCode })

const ensureId = (id, fieldName) => {
  if (!mongoose.isValidObjectId(id)) throw buildError(400, `Invalid ${fieldName}`)
}

const normalizeQuestions = questions => {
  if (!Array.isArray(questions) || questions.length === 0) {
    throw buildError(400, 'At least one question is required')
  }

  return questions.map((item, index) => {
    const question = String(item?.question || '').trim()
    const type = String(item?.type || '')
    const options = Array.isArray(item?.options)
      ? item.options.map(option => String(option).trim()).filter(Boolean)
      : []

    if (!question) throw buildError(400, `Question ${index + 1} is required`)
    if (!['rating', 'text', 'single_choice', 'multiple_choice'].includes(type)) {
      throw buildError(400, `Invalid question type at position ${index + 1}`)
    }
    if (['single_choice', 'multiple_choice'].includes(type) && options.length < 2) {
      throw buildError(400, `Question ${index + 1} must have at least two options`)
    }

    return {
      question,
      type,
      options,
      required: Boolean(item?.required),
      order: index + 1
    }
  })
}

const normalizeDate = (value, fieldName) => {
  const date = new Date(value)
  if (!value || Number.isNaN(date.getTime())) throw buildError(400, `${fieldName} must be a valid date`)
  return date
}

const normalizeFormPayload = (payload = {}, { partial = false } = {}) => {
  const data = {}

  if (!partial || payload.title !== undefined) {
    data.title = String(payload.title || '').trim()
    if (!data.title) throw buildError(400, 'Feedback form title is required')
  }
  if (payload.description !== undefined) data.description = String(payload.description || '').trim()
  if (!partial || payload.targetType !== undefined) {
    data.targetType = String(payload.targetType || '')
    if (!['attendee', 'staff'].includes(data.targetType)) throw buildError(400, 'Invalid feedback target type')
  }
  if (!partial || payload.questions !== undefined) data.questions = normalizeQuestions(payload.questions)
  if (!partial || payload.openAt !== undefined) data.openAt = normalizeDate(payload.openAt, 'Open time')
  if (!partial || payload.closeAt !== undefined) data.closeAt = normalizeDate(payload.closeAt, 'Close time')
  if (payload.status !== undefined) {
    data.status = String(payload.status)
    if (!['draft', 'published', 'closed'].includes(data.status)) throw buildError(400, 'Invalid feedback form status')
  }

  if (data.openAt && data.closeAt && data.openAt >= data.closeAt) {
    throw buildError(400, 'Close time must be later than open time')
  }
  if (!Object.keys(data).length) throw buildError(400, 'At least one feedback form field is required')
  return data
}

const createForm = async (payload, userId) => {
  ensureId(userId, 'user ID')
  const data = normalizeFormPayload(payload)
  return FeedbackForm.create({ ...data, createdBy: userId, updatedBy: userId })
}

const getTargetType = roleName => ['staff', 'admin'].includes(String(roleName).toLowerCase()) ? 'staff' : 'attendee'

const getForms = async ({ targetType, status, roleName } = {}) => {
  const filter = {}
  if (String(roleName).toLowerCase() !== 'admin') {
    filter.targetType = getTargetType(roleName)
    filter.status = 'published'
    filter.openAt = { $lte: new Date() }
    filter.closeAt = { $gte: new Date() }
  } else {
    if (targetType) filter.targetType = targetType
    if (status) filter.status = status
  }
  const forms = await FeedbackForm.find(filter).sort({ createdAt: -1 }).lean()
  return Promise.all(forms.map(async form => ({
    ...form,
    responseCount: await FeedbackResponse.countDocuments({ formId: form._id })
  })))
}

const getFormById = async (id, roleName) => {
  ensureId(id, 'feedback form ID')
  const filter = { _id: id }
  if (String(roleName).toLowerCase() !== 'admin') {
    filter.targetType = getTargetType(roleName)
    filter.status = 'published'
    filter.openAt = { $lte: new Date() }
    filter.closeAt = { $gte: new Date() }
  }
  const form = await FeedbackForm.findOne(filter).lean()
  if (!form) throw buildError(404, 'Feedback form not found')
  return form
}

const updateForm = async (id, payload, userId) => {
  ensureId(id, 'feedback form ID')
  ensureId(userId, 'user ID')
  const data = normalizeFormPayload(payload, { partial: true })
  const currentForm = await FeedbackForm.findById(id).select('openAt closeAt').lean()
  if (!currentForm) throw buildError(404, 'Feedback form not found')
  const openAt = data.openAt || currentForm.openAt
  const closeAt = data.closeAt || currentForm.closeAt
  if (openAt >= closeAt) throw buildError(400, 'Close time must be later than open time')
  const form = await FeedbackForm.findByIdAndUpdate(
    id,
    { $set: { ...data, updatedBy: userId } },
    { new: true, runValidators: true }
  ).lean()
  if (!form) throw buildError(404, 'Feedback form not found')
  return form
}

const deleteForm = async id => {
  ensureId(id, 'feedback form ID')
  const form = await FeedbackForm.findByIdAndDelete(id).lean()
  if (!form) throw buildError(404, 'Feedback form not found')
  await FeedbackResponse.deleteMany({ formId: id })
  return form
}

const validateAnswer = (question, value) => {
  if (value === undefined || value === null || value === '') {
    if (question.required) throw buildError(400, `Answer is required for question ${question.order}`)
    return
  }
  if (question.type === 'rating' && (!Number.isInteger(value) || value < 1 || value > 5)) {
    throw buildError(400, `Rating for question ${question.order} must be between 1 and 5`)
  }
  if (question.type === 'text' && typeof value !== 'string') {
    throw buildError(400, `Answer for question ${question.order} must be text`)
  }
  if (question.type === 'single_choice' && (!question.options.includes(value))) {
    throw buildError(400, `Invalid option for question ${question.order}`)
  }
  if (question.type === 'multiple_choice' && (!Array.isArray(value) || value.some(item => !question.options.includes(item)))) {
    throw buildError(400, `Invalid options for question ${question.order}`)
  }
}

const submitResponse = async (formId, answers, userId, roleName) => {
  ensureId(formId, 'feedback form ID')
  ensureId(userId, 'user ID')
  const now = new Date()
  const form = await FeedbackForm.findOne({
    _id: formId,
    status: 'published',
    openAt: { $lte: now },
    closeAt: { $gte: now }
  }).lean()
  if (!form) throw buildError(404, 'Published feedback form not found')
  if (!Array.isArray(answers)) throw buildError(400, 'Answers must be an array')

  const answerMap = new Map(answers.map(answer => [String(answer?.questionId), answer?.value]))
  const normalizedAnswers = form.questions.map(question => {
    const value = answerMap.get(String(question._id))
    validateAnswer(question, value)
    return { questionId: question._id, value }
  }).filter(answer => answer.value !== undefined && answer.value !== null && answer.value !== '')

  const targetType = getTargetType(roleName)
  if (form.targetType !== targetType) throw buildError(403, 'This feedback form is not available for your role')

  const existingResponse = await FeedbackResponse.findOne({ formId, userId }).select('_id').lean()
  if (existingResponse) throw buildError(409, 'You have already submitted this feedback form')

  return FeedbackResponse.create({ formId, userId, targetType, answers: normalizedAnswers })
}

const getResponses = async (formId, { page = 1, pageSize = 20 } = {}) => {
  ensureId(formId, 'feedback form ID')
  const currentPage = Math.max(Number(page) || 1, 1)
  const limit = Math.min(Math.max(Number(pageSize) || 20, 1), 100)
  const filter = { formId }
  const [data, total] = await Promise.all([
    FeedbackResponse.find(filter).populate('userId', 'fullName email roleId').sort({ createdAt: -1 }).skip((currentPage - 1) * limit).limit(limit).lean(),
    FeedbackResponse.countDocuments(filter)
  ])
  return { data, pagination: { page: currentPage, pageSize: limit, total, totalPages: Math.ceil(total / limit) } }
}

const getStatistics = async formId => {
  ensureId(formId, 'feedback form ID')
  const form = await getFormById(formId, 'Admin')
  const responses = await FeedbackResponse.find({ formId }).select('answers').lean()
  const statistics = form.questions.map(question => {
    const values = responses.map(response => response.answers.find(answer => String(answer.questionId) === String(question._id))?.value).filter(value => value !== undefined)
    const result = { questionId: question._id, question: question.question, type: question.type, totalAnswers: values.length }
    if (question.type === 'rating') result.average = values.length ? Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2)) : 0
    if (['single_choice', 'multiple_choice'].includes(question.type)) result.options = question.options.map(option => ({ option, count: values.flatMap(value => Array.isArray(value) ? value : [value]).filter(item => item === option).length }))
    return result
  })
  return { formId, totalResponses: responses.length, statistics }
}

module.exports = { createForm, getForms, getFormById, updateForm, deleteForm, submitResponse, getResponses, getStatistics }
