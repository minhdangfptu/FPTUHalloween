const adminSvc = require('../services/admin')

const promoteUserToStaff = (req, res, next) =>
  Promise.resolve(adminSvc.promoteUserToStaff(req.params.id))
    .then(user => res.json({ success: true, data: user }))
    .catch(next)

module.exports = { promoteUserToStaff }
