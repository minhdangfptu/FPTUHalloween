const { TicketType } = require('../models')

const TICKET_PRICE = 363636
const TICKET_QUANTITY = 50
const TICKET_MODEL = 'ghost'

const SCHEDULE = {
  27: ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30'],
  28: ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30'],
  29: ['18:00', '18:30', '19:00', '19:30'],
}

const ticketTypes = Object.entries(SCHEDULE).flatMap(([date, times]) =>
  times.map((time) => ({
    ticketTypeName: `Vé Nhà Ma Ngày ${date} - ${time}`,
    ticketTypePrice: TICKET_PRICE,
    availableQuantity: String(TICKET_QUANTITY),
    totalQuantity: TICKET_QUANTITY,
    ticketTypeDate: Number(date),
    ticketTypeTime: time,
    ticketTypeStatus: 'active',
    ticketType3dModel: TICKET_MODEL,
  })),
)

const seedTicketTypes = async () => {
  const seededTicketTypes = []

  for (const ticketType of ticketTypes) {
    const seededTicketType = await TicketType.findOneAndUpdate(
      { ticketTypeName: ticketType.ticketTypeName, ticketTypeDate: ticketType.ticketTypeDate },
      { $set: ticketType },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
    ).lean()

    seededTicketTypes.push(seededTicketType)
  }

  console.log(`Seeded ${seededTicketTypes.length} ticket types.`)
  return seededTicketTypes
}

module.exports = { seedTicketTypes, ticketTypes }
