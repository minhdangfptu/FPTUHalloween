const ddayVoteService = require('../services/ddayVote')

const getPublicConfig = (req, res, next) => Promise.resolve(
  ddayVoteService.getPublicConfig()
).then(data => res.status(200).json({ success: true, data })).catch(next)

const createSession = (req, res, next) => Promise.resolve(
  ddayVoteService.createSession(req.body)
).then(data => res.status(200).json({ success: true, message: 'Vote session created successfully', data })).catch(next)

const getStatus = (req, res, next) => Promise.resolve(
  ddayVoteService.getStatus(req.voteUser)
).then(data => res.status(200).json({ success: true, data })).catch(next)

const createBallot = (req, res, next) => Promise.resolve(
  ddayVoteService.createBallot(req.voteUser, req.body)
).then(result => res.status(result.created ? 201 : 200).json({
  success: true,
  message: result.created ? 'Vote recorded successfully' : 'Vote receipt returned successfully',
  data: result.receipt
})).catch(next)

const getResults = (req, res, next) => Promise.resolve(
  ddayVoteService.getResults()
).then(data => res.status(200).json({ success: true, data })).catch(next)

const getAdminConfig = (req, res, next) => Promise.resolve(
  ddayVoteService.getAdminConfig()
).then(data => res.status(200).json({ success: true, data })).catch(next)

const updateConfig = (req, res, next) => Promise.resolve(
  ddayVoteService.updateConfig(req.body, req.user.id)
).then(data => res.status(200).json({ success: true, message: 'Vote campaign updated successfully', data })).catch(next)

const openConfig = (req, res, next) => Promise.resolve(
  ddayVoteService.openConfig(req.user.id, req.body)
).then(data => res.status(200).json({ success: true, message: 'Vote campaign opened successfully', data })).catch(next)

const updateCloseTime = (req, res, next) => Promise.resolve(
  ddayVoteService.updateCloseTime(req.body?.closeAt, req.user.id)
).then(data => res.status(200).json({ success: true, message: 'Vote close time updated successfully', data })).catch(next)

const closeConfig = (req, res, next) => Promise.resolve(
  ddayVoteService.closeConfig(req.user.id)
).then(data => res.status(200).json({ success: true, message: 'Vote campaign closed successfully', data })).catch(next)

const deleteCampaign = (req, res, next) => Promise.resolve(
  ddayVoteService.deleteCampaign(req.user.id)
).then(data => res.status(200).json({ success: true, message: 'Vote campaign deleted successfully', data })).catch(next)

const getAudit = (req, res, next) => Promise.resolve(
  ddayVoteService.getAudit(req.query)
).then(result => res.status(200).json({ success: true, ...result })).catch(next)

module.exports = { getPublicConfig, createSession, getStatus, createBallot, getResults, getAdminConfig, updateConfig, openConfig, updateCloseTime, closeConfig, deleteCampaign, getAudit }
