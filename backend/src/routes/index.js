const express = require('express')
const router = express.Router()
const authCtrl = require('../controllers/auth')
const userCtrl = require('../controllers/user')
// const adminCtrl = require('../controllers/admin')

const { requireAuth } = require('../middlewares/auth')

// Health (optional)
router.get('/_health', (req, res) => res.json({ ok: true }))


// AUTH
router.post('/auth/register', authCtrl.register)
router.post('/auth/login', authCtrl.login)
router.post('/auth/refresh', authCtrl.refresh)
router.post('/auth/logout', authCtrl.logout)

// USERS
router.get('/users/me', requireAuth, userCtrl.me)
router.patch('/users/me', requireAuth, userCtrl.updateMe)
router.patch('/users/me/password', requireAuth, userCtrl.changePassword)


// Các nhóm khác (roles/users/feedback/news) bạn có thể thêm sau
module.exports = router
