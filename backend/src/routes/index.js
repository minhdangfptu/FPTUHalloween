const express = require('express')
const router = express.Router()
const halloweenCtrl = require('../controllers/halloween')
const authCtrl = require('../controllers/auth')
const userCtrl = require('../controllers/user')
const adminCtrl = require('../controllers/admin')
const newsCtrl = require('../controllers/news')
const feedbackCtrl = require('../controllers/feedback')
const { requireAuth, requireRole } = require('../middlewares/auth')

// Health (optional)
router.get('/_health', (req, res) => res.json({ ok: true }))

// HALLOWEENS
router.get('/halloweens',       halloweenCtrl.list)
router.get('/halloweens/:id',   halloweenCtrl.get)
router.post('/halloweens',      requireAuth, requireRole('Staff'), halloweenCtrl.create)
router.patch('/halloweens/:id', requireAuth, requireRole('Staff'), halloweenCtrl.update)
router.delete('/halloweens/:id',requireAuth, requireRole('Staff'), halloweenCtrl.remove)
router.get('/halloweens/:id/feedbacks', feedbackCtrl.listByEvent)

// AUTH
router.post('/auth/register', authCtrl.register)
router.post('/auth/login',    authCtrl.login)
router.post('/auth/refresh',  authCtrl.refresh)
router.post('/auth/logout',   authCtrl.logout)

// USERS
router.get('/users/me', requireAuth, userCtrl.me)
router.patch('/users/me', requireAuth, userCtrl.updateMe)
router.patch('/users/me/password', requireAuth, userCtrl.changePassword)
router.patch('/users/:id/promote-to-staff', requireAuth, requireRole('Admin'), adminCtrl.promoteToStaff)

// NEWS
router.get('/news',       newsCtrl.list)
router.get('/news/:id',   newsCtrl.get)
router.post('/news',      requireAuth, requireRole('Staff'), newsCtrl.create)
router.patch('/news/:id', requireAuth, requireRole('Staff'), newsCtrl.update)
router.delete('/news/:id',requireAuth, requireRole('Staff'), newsCtrl.remove)

// FEEDBACKS
router.get('/feedbacks',       feedbackCtrl.list)
router.get('/feedbacks/:id',   feedbackCtrl.get)
router.post('/feedbacks',      feedbackCtrl.create)
router.patch('/feedbacks/:id', feedbackCtrl.update)
router.delete('/feedbacks/:id',feedbackCtrl.remove)

// Các nhóm khác (roles/users/feedback/news) bạn có thể thêm sau
module.exports = router
