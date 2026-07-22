const express = require('express')
const router = express.Router()
const authCtrl = require('../controllers/auth')
const userCtrl = require('../controllers/user')
const contactCtrl = require('../controllers/contact')
const ticketTypeCtrl = require('../controllers/ticketType')
const cartCtrl = require('../controllers/cart')
const adminOrderCtrl = require('../controllers/adminOrder')
const adminCtrl = require('../controllers/admin')
// const adminCtrl = require('../controllers/admin')

const { requireAuth, requireRole } = require('../middlewares/auth')

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
router.get('/contacts', requireAuth, requireRole('Admin'), contactCtrl.getList)
router.get('/contacts/:id', requireAuth, requireRole('Admin'), contactCtrl.getDetail)
router.delete('/contacts/:id', requireAuth, requireRole('Admin'), contactCtrl.remove)
router.patch('/contacts/:id/status', requireAuth, requireRole('Admin'), contactCtrl.updateStatus)

// USERS
router.get('/users/me', requireAuth, userCtrl.me)
router.patch('/users/me', requireAuth, userCtrl.updateMe)
router.patch('/users/me/password', requireAuth, authCtrl.changePassword)
router.get('/users', requireAuth, requireRole('Admin'), userCtrl.getList)
router.get('/users/:id', requireAuth, requireRole('Admin'), userCtrl.getDetail)
router.patch('/users/:id/disable', requireAuth, requireRole('Admin'), userCtrl.disable)
router.patch('/users/:id/enable', requireAuth, requireRole('Admin'), userCtrl.enable)

// TICKET TYPES
router.get('/ticket-types', requireAuth, ticketTypeCtrl.getList)
router.get('/ticket-types/:id', requireAuth, ticketTypeCtrl.getDetail)
router.post('/ticket-types', requireAuth, requireRole('Admin'), ticketTypeCtrl.create)
router.put('/ticket-types/:id', requireAuth, requireRole('Admin'), ticketTypeCtrl.update)
router.patch('/ticket-types/:id', requireAuth, requireRole('Admin'), ticketTypeCtrl.update)
router.delete('/ticket-types/:id', requireAuth, requireRole('Admin'), ticketTypeCtrl.remove)
router.patch('/ticket-types/:id/status', requireAuth, requireRole('Admin'), ticketTypeCtrl.changeStatus)

// CART
router.get('/cart', requireAuth, cartCtrl.get)
router.post('/cart/items', requireAuth, cartCtrl.addItem)
router.patch('/cart/items/:ticketTypeId', requireAuth, cartCtrl.updateItem)
router.delete('/cart/items/:ticketTypeId', requireAuth, cartCtrl.removeItem)

// ADMIN ORDER REPORTS
router.get('/orders', requireAuth, requireRole('Admin'), adminOrderCtrl.getList)
router.get('/orders/:id', requireAuth, requireRole('Admin'), adminOrderCtrl.getDetail)
router.get('/statistics/tickets', requireAuth, requireRole('Admin'), adminOrderCtrl.getTicketStatistics)
router.patch('/admin/users/:id/promote-staff', requireAuth, requireRole('Admin'), adminCtrl.promoteUserToStaff)


// Các nhóm khác (roles/users/feedback/news) bạn có thể thêm sau
module.exports = router
