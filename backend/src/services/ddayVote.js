const crypto = require('crypto')
const { DdayVoteConfig, DdayVote } = require('../models')
const { verifyGoogleCredential } = require('../providers/googleProvider')
const { hashGoogleSubject, createVoteSessionToken, VOTE_SESSION_TTL_SECONDS } = require('../utils/voteToken')

const CONFIG_KEY = 'dday'
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const buildError = (statusCode, message) => Object.assign(new Error(message), { statusCode })

const normalizeDate = (value, fieldName) => {
  if (value === null || value === undefined || value === '') return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) throw buildError(400, `${fieldName} must be a valid date`)
  return date
}

const normalizeCategories = categories => {
  if (!Array.isArray(categories) || categories.length === 0) {
    throw buildError(400, 'At least one vote category is required')
  }

  const categoryIds = new Set()
  return categories.map((category, categoryIndex) => {
    const categoryId = String(category?.categoryId || '').trim()
    const label = String(category?.label || '').trim()
    if (!categoryId || !label) throw buildError(400, `Vote category ${categoryIndex + 1} is invalid`)
    if (categoryIds.has(categoryId)) throw buildError(400, `Duplicate vote category: ${categoryId}`)
    categoryIds.add(categoryId)

    if (!Array.isArray(category.options) || category.options.length < 2) {
      throw buildError(400, `Vote category ${categoryIndex + 1} must have at least two options`)
    }

    const optionIds = new Set()
    const options = category.options.map((option, optionIndex) => {
      const optionId = String(option?.optionId || '').trim()
      const optionLabel = String(option?.label || '').trim()
      if (!optionId || !optionLabel) throw buildError(400, `Vote option ${optionIndex + 1} is invalid`)
      if (optionIds.has(optionId)) throw buildError(400, `Duplicate vote option: ${optionId}`)
      optionIds.add(optionId)
      return { optionId, label: optionLabel }
    })

    return { categoryId, label, options }
  })
}

const normalizeConfigPayload = (payload = {}, current = null) => {
  payload = payload || {}
  const title = payload.title === undefined ? current?.title : String(payload.title || '').trim()
  if (!title) throw buildError(400, 'Vote campaign title is required')

  const categories = payload.categories === undefined
    ? current?.categories
    : normalizeCategories(payload.categories)
  if (!categories?.length) throw buildError(400, 'At least one vote category is required')

  const openAt = payload.openAt === undefined ? current?.openAt || null : normalizeDate(payload.openAt, 'Open time')
  const closeAt = payload.closeAt === undefined ? current?.closeAt || null : normalizeDate(payload.closeAt, 'Close time')
  if (openAt && closeAt && openAt >= closeAt) throw buildError(400, 'Close time must be later than open time')

  return {
    title,
    description: payload.description === undefined ? current?.description || '' : String(payload.description || '').trim(),
    categories,
    openAt,
    closeAt
  }
}

const sanitizeConfig = config => {
  if (!config) return null
  const publicConfig = { ...config }
  delete publicConfig.createdBy
  delete publicConfig.updatedBy
  delete publicConfig.openedBy
  delete publicConfig.closedBy
  delete publicConfig._id
  delete publicConfig.__v
  return publicConfig
}

const closeExpiredConfig = async config => {
  if (!config || config.status !== 'open' || !config.closeAt || config.closeAt > new Date()) return config
  const closed = await DdayVoteConfig.findOneAndUpdate(
    { configKey: CONFIG_KEY, status: 'open', closeAt: { $lte: new Date() } },
    { $set: { status: 'closed', closedAt: new Date() } },
    { new: true }
  ).lean()
  return closed || DdayVoteConfig.findOne({ configKey: CONFIG_KEY }).lean()
}

const getConfig = async () => closeExpiredConfig(await DdayVoteConfig.findOne({ configKey: CONFIG_KEY }).lean())

const closeExpired = async () => getConfig()

const getPublicConfig = async () => {
  const config = await getConfig()
  if (!config) throw buildError(404, 'D-Day vote configuration not found')
  return sanitizeConfig(config)
}

const getAdminConfig = async () => {
  const [config, totalVotes] = await Promise.all([
    getConfig(),
    DdayVote.countDocuments({})
  ])
  return config ? { ...sanitizeConfig(config), totalVotes } : null
}

const updateConfig = async (payload, userId) => {
  const current = await DdayVoteConfig.findOne({ configKey: CONFIG_KEY }).lean()
  if (current && current.status !== 'draft') throw buildError(409, 'Vote campaign can only be edited while it is in draft')

  const data = normalizeConfigPayload(payload, current)
  if (!current) {
    const created = await DdayVoteConfig.create({ ...data, configKey: CONFIG_KEY, createdBy: userId, updatedBy: userId })
    return sanitizeConfig(created.toObject())
  }

  const updated = await DdayVoteConfig.findOneAndUpdate(
    { configKey: CONFIG_KEY, status: 'draft' },
    { $set: { ...data, updatedBy: userId } },
    { new: true, runValidators: true }
  ).lean()
  if (!updated) throw buildError(409, 'Vote campaign can only be edited while it is in draft')
  return sanitizeConfig(updated)
}

const openConfig = async (userId, payload = {}) => {
  payload = payload || {}
  const config = await DdayVoteConfig.findOne({ configKey: CONFIG_KEY }).lean()
  if (!config) throw buildError(404, 'D-Day vote configuration not found')
  if (config.status === 'open') throw buildError(409, 'Vote campaign is already open')
  const closeAt = payload.closeAt === undefined ? config.closeAt : normalizeDate(payload.closeAt, 'Close time')
  if (!closeAt) throw buildError(400, 'Close time is required before opening the vote')
  if (closeAt <= new Date()) throw buildError(400, 'Close time must be later than the current time')

  const opened = await DdayVoteConfig.findOneAndUpdate(
    { configKey: CONFIG_KEY, status: config.status },
    { $set: { status: 'open', openAt: new Date(), closeAt, openedBy: userId, updatedBy: userId }, $unset: { closedAt: 1, closedBy: 1 } },
    { new: true, runValidators: true }
  ).lean()
  if (!opened) throw buildError(409, 'Vote campaign status has changed; please refresh and try again')
  return sanitizeConfig(opened)
}

const updateCloseTime = async (closeAtValue, userId) => {
  const closeAt = normalizeDate(closeAtValue, 'Close time')
  if (!closeAt) throw buildError(400, 'Close time is required')
  if (closeAt <= new Date()) throw buildError(400, 'Close time must be later than the current time')
  const config = await getConfig()
  if (!config) throw buildError(404, 'D-Day vote configuration not found')
  if (config.status !== 'open') throw buildError(409, 'Close time can only be changed while the vote is open')

  const updated = await DdayVoteConfig.findOneAndUpdate(
    { configKey: CONFIG_KEY, status: 'open' },
    { $set: { closeAt, updatedBy: userId } },
    { new: true, runValidators: true }
  ).lean()
  if (!updated) throw buildError(409, 'Close time can only be changed while the vote is open')
  return sanitizeConfig(updated)
}

const closeConfig = async userId => {
  const config = await getConfig()
  if (!config) throw buildError(404, 'D-Day vote configuration not found')
  if (config.status === 'closed') return sanitizeConfig(config)

  const closed = await DdayVoteConfig.findOneAndUpdate(
    { configKey: CONFIG_KEY, status: 'open' },
    { $set: { status: 'closed', closedAt: new Date(), closedBy: userId, updatedBy: userId } },
    { new: true }
  ).lean()
  if (!closed) throw buildError(409, 'Vote campaign must be open before it can be closed')
  return sanitizeConfig(closed)
}

const createSession = async payload => {
  const googleUser = await verifyGoogleCredential(payload || {})
  const googleSubHash = hashGoogleSubject(googleUser.sub)
  const voteToken = createVoteSessionToken({ googleSubHash, email: googleUser.email, name: googleUser.name })
  return {
    voteToken,
    expiresAt: new Date(Date.now() + VOTE_SESSION_TTL_SECONDS * 1000).toISOString()
  }
}

const validateChoices = (config, choices) => {
  if (!Array.isArray(choices) || choices.length !== config.categories.length) {
    throw buildError(400, 'Exactly one option is required for each vote category')
  }

  const received = new Map()
  choices.forEach(choice => {
    const categoryId = String(choice?.categoryId || '').trim()
    const optionId = String(choice?.optionId || '').trim()
    if (!categoryId || !optionId || received.has(categoryId)) throw buildError(400, 'Vote choices contain a missing or duplicate category')
    received.set(categoryId, optionId)
  })

  const normalized = config.categories.map(category => {
    if (!received.has(category.categoryId)) throw buildError(400, `Missing vote choice for category: ${category.label}`)
    const optionId = received.get(category.categoryId)
    if (!category.options.some(option => option.optionId === optionId)) {
      throw buildError(400, `Invalid option for category: ${category.label}`)
    }
    return { categoryId: category.categoryId, optionId }
  })

  return normalized.sort((left, right) => left.categoryId.localeCompare(right.categoryId))
}

const getRequestHash = choices => crypto.createHash('sha256').update(JSON.stringify(choices)).digest('hex')

const getReceipt = vote => ({
  receiptId: vote._id,
  submissionId: vote.submissionId,
  submittedAt: vote.submittedAt,
  status: 'recorded'
})

const resolveExistingVote = (existing, googleSubHash, submissionId, requestHash) => {
  if (!existing) return null
  if (existing.submissionId === submissionId && existing.googleSubHash !== googleSubHash) {
    throw buildError(409, 'Submission ID has already been used')
  }
  if (existing.googleSubHash !== googleSubHash) return null
  if (existing.requestHash !== requestHash) throw buildError(409, 'You have already submitted a different ballot')
  return getReceipt(existing)
}

const createBallot = async ({ googleSubHash, email, name }, payload = {}) => {
  payload = payload || {}
  const config = await getConfig()
  if (!config) throw buildError(404, 'D-Day vote configuration not found')
  const submissionId = String(payload.submissionId || '').trim()
  if (!UUID_PATTERN.test(submissionId)) throw buildError(400, 'Submission ID must be a valid UUID')

  const choices = validateChoices(config, payload.choices)
  const requestHash = getRequestHash(choices)
  const existingByUser = await DdayVote.findOne({ googleSubHash }).select('+googleSubHash').lean()
  const existingBySubmission = await DdayVote.findOne({ submissionId }).select('+googleSubHash').lean()
  const existingReceipt = resolveExistingVote(existingByUser, googleSubHash, submissionId, requestHash) || resolveExistingVote(existingBySubmission, googleSubHash, submissionId, requestHash)
  if (existingReceipt) return { receipt: existingReceipt, created: false }

  if (config.status !== 'open') throw buildError(409, 'D-Day vote is not open')
  if (config.openAt && config.openAt > new Date()) throw buildError(409, 'D-Day vote is not open yet')

  try {
    const vote = await DdayVote.create({ googleSubHash, googleEmail: email, googleName: name, choices, submissionId, requestHash })
    return { receipt: getReceipt(vote), created: true }
  } catch (error) {
    if (error?.code !== 11000) throw error
    const concurrentVote = await DdayVote.findOne({ $or: [{ googleSubHash }, { submissionId }] }).select('+googleSubHash').lean()
    const receipt = resolveExistingVote(concurrentVote, googleSubHash, submissionId, requestHash)
    if (receipt) return { receipt, created: false }
    throw buildError(409, 'The vote could not be recorded because it conflicts with another submission')
  }
}

const getStatus = async ({ googleSubHash }) => {
  const vote = await DdayVote.findOne({ googleSubHash }).select('submittedAt submissionId').lean()
  return vote
    ? { hasVoted: true, submittedAt: vote.submittedAt, submissionId: vote.submissionId }
    : { hasVoted: false, submittedAt: null, submissionId: null }
}

const getResults = async () => {
  const config = await getConfig()
  if (!config) throw buildError(404, 'D-Day vote configuration not found')
  if (config.status !== 'closed') throw buildError(409, 'Vote results are not available until the vote is closed')

  const [totalVotes, groupedVotes] = await Promise.all([
    DdayVote.countDocuments({}),
    DdayVote.aggregate([
      { $unwind: '$choices' },
      { $group: { _id: { categoryId: '$choices.categoryId', optionId: '$choices.optionId' }, count: { $sum: 1 } } }
    ])
  ])
  const counts = new Map(groupedVotes.map(item => [`${item._id.categoryId}:${item._id.optionId}`, item.count]))
  return {
    title: config.title,
    closedAt: config.closedAt,
    totalVotes,
    categories: config.categories.map(category => ({
      categoryId: category.categoryId,
      label: category.label,
      options: category.options.map(option => ({
        optionId: option.optionId,
        label: option.label,
        count: counts.get(`${category.categoryId}:${option.optionId}`) || 0
      }))
    }))
  }
}

const getAudit = async ({ page = 1, pageSize = 20 } = {}) => {
  const currentPage = Math.max(Number(page) || 1, 1)
  const limit = Math.min(Math.max(Number(pageSize) || 20, 1), 100)
  const [data, total] = await Promise.all([
    DdayVote.find({}).select('googleEmail googleName choices submissionId requestHash submittedAt createdAt').sort({ submittedAt: -1 }).skip((currentPage - 1) * limit).limit(limit).lean(),
    DdayVote.countDocuments({})
  ])
  return { data, pagination: { page: currentPage, pageSize: limit, total, totalPages: Math.ceil(total / limit) } }
}

const ensureIndexes = async () => Promise.all([
  DdayVoteConfig.createIndexes(),
  DdayVote.createIndexes()
])

module.exports = {
  getPublicConfig,
  getAdminConfig,
  updateConfig,
  openConfig,
  updateCloseTime,
  closeConfig,
  createSession,
  createBallot,
  getStatus,
  getResults,
  getAudit,
  closeExpired,
  ensureIndexes
}
