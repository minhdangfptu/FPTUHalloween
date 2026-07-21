const express = require('express')
const router = express.Router()
const authCtrl = require('../controllers/auth')
const userCtrl = require('../controllers/user')
const contactCtrl = require('../controllers/contact')
// const adminCtrl = require('../controllers/admin')

const { requireAuth } = require('../middlewares/auth')

// Health (optional)
router.get('/_health', (req, res) => res.json({ ok: true }))


// AUTH
router.post('/auth/register', authCtrl.register)
router.post('/auth/confirm-otp', authCtrl.confirmOtp)
router.post('/auth/login', authCtrl.login)
router.post('/auth/google', authCtrl.googleLogin)
router.post('/auth/forgot-password', authCtrl.forgotPassword)
router.post('/auth/reset-password', authCtrl.resetPassword)
router.post('/auth/refresh', authCtrl.refresh)
router.post('/auth/logout', authCtrl.logout)

// CONTACTS
router.post('/contacts', contactCtrl.create)

// USERS
router.get('/users/me', requireAuth, userCtrl.me)
router.patch('/users/me', requireAuth, userCtrl.updateMe)
router.patch('/users/me/password', requireAuth, authCtrl.changePassword)


// Các nhóm khác (roles/users/feedback/news) bạn có thể thêm sau
module.exports = router
