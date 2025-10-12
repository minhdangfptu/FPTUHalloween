const express = require('express')
const router = express.Router()
const halloweenCtrl = require('../controllers/halloween')

// Health (optional)
router.get('/_health', (req, res) => res.json({ ok: true }))

// HALLOWEENS
router.get('/halloweens',       halloweenCtrl.list)
router.get('/halloweens/:id',   halloweenCtrl.get)
router.post('/halloweens',      halloweenCtrl.create)
router.patch('/halloweens/:id', halloweenCtrl.update)
router.delete('/halloweens/:id',halloweenCtrl.remove)

// Các nhóm khác (roles/users/feedback/news) bạn có thể thêm sau
module.exports = router
