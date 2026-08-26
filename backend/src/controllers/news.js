const newsService = require('../services/news')
const facebookNewsSyncService = require('../services/facebookNewsSync')

const getList = (req, res, next) => Promise.resolve(
  newsService.getNews(req.query)
).then(result => res.status(200).json({
  success: true,
  data: result.items,
  pagination: result.pagination,
  filters: result.filters,
  featured: result.featured
})).catch(next)

const getDetail = (req, res, next) => Promise.resolve(
  newsService.getNewsById(req.params.id)
).then(data => res.status(200).json({ success: true, data })).catch(next)

const getFacebookSyncStatus = (req, res, next) => Promise.resolve(
  facebookNewsSyncService.getSyncStatus()
).then(data => res.status(200).json({ success: true, data })).catch(next)

const syncFacebookNews = (req, res, next) => Promise.resolve(
  facebookNewsSyncService.syncFacebookNews()
).then(data => res.status(200).json({
  success: true,
  message: 'Facebook News synchronized successfully',
  data
})).catch(next)

const setFeatured = (req, res, next) => Promise.resolve(
  newsService.setNewsFeatured(req.params.id, req.body?.isFeatured)
).then(data => res.status(200).json({
  success: true,
  message: data.isFeatured ? 'News added to featured posts' : 'News removed from featured posts',
  data
})).catch(next)

module.exports = { getList, getDetail, getFacebookSyncStatus, syncFacebookNews, setFeatured }
