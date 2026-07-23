const userTicketService = require('../services/userTicket')

const createTestTickets = async (req, res, next) => {
  try {
    const result = await userTicketService.createTestTickets(
      req.user.id,
      req.body?.ticketTypeId,
      req.body?.quantity
    )
    return res.status(201).json({ success: true, data: result })
  } catch (error) {
    return next(error)
  }
}

const getMyTickets = async (req, res, next) => {
  try {
    const tickets = await userTicketService.getMyTickets(req.user.id)
    return res.status(200).json({ success: true, data: tickets })
  } catch (error) {
    return next(error)
  }
}

module.exports = { createTestTickets, getMyTickets }
