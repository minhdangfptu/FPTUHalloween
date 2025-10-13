const express = require('express')
const router = express.Router()
const halloweenCtrl = require('../controllers/halloween')
const authCtrl = require('../controllers/auth')
const userCtrl = require('../controllers/user')
const { requireAuth } = require('../middlewares/auth')

// Health (optional)
router.get('/_health', (req, res) => res.json({ ok: true }))

// HALLOWEENS
router.get('/halloweens',       halloweenCtrl.list)
router.get('/halloweens/:id',   halloweenCtrl.get)
router.post('/halloweens',      halloweenCtrl.create)
router.patch('/halloweens/:id', halloweenCtrl.update)
router.delete('/halloweens/:id',halloweenCtrl.remove)

// AUTH
router.post('/auth/register', authCtrl.register)
router.post('/auth/login',    authCtrl.login)
router.post('/auth/refresh',  authCtrl.refresh)
router.post('/auth/logout',   authCtrl.logout)

// USERS
router.get('/users/me', requireAuth, userCtrl.me)

// Các nhóm khác (roles/users/feedback/news) bạn có thể thêm sau
module.exports = router
