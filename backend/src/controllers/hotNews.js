const hotNewsSvc = require('../services/hotNews')

const getActiveList = (req, res, next) => Promise.resolve(
  hotNewsSvc.getActiveHotNews()
).then(data => res.status(200).json({
  success: true,
  data
})).catch(next)

const getList = (req, res, next) => Promise.resolve(
  hotNewsSvc.getHotNews()
).then(data => res.status(200).json({
  success: true,
  data
})).catch(next)

const create = (req, res, next) => Promise.resolve(
  hotNewsSvc.createHotNews(req.body, req.user.id)
).then(data => res.status(201).json({
  success: true,
  message: 'Hot news created successfully',
  data
})).catch(next)

const update = (req, res, next) => Promise.resolve(
  hotNewsSvc.updateHotNews(req.params.id, req.body, req.user.id)
).then(data => res.status(200).json({
  success: true,
  message: 'Hot news updated successfully',
  data
})).catch(next)

const changeStatus = (req, res, next) => Promise.resolve(
  hotNewsSvc.changeHotNewsStatus(req.params.id, req.body.isActive, req.user.id)
).then(data => res.status(200).json({
  success: true,
  message: 'Hot news status updated successfully',
  data
})).catch(next)

module.exports = { getActiveList, getList, create, update, changeStatus }
