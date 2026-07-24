export const DEFAULT_DASHBOARD_DATES = ["27", "28", "29"]
export const DEFAULT_TIME_SLOTS = ["08:00", "10:00", "12:00", "14:00", "16:00"]

export const getTicketDay = (ticket) => String(ticket.ticketTypeId?.ticketTypeDate || "")

export const getDashboardDates = (tickets) => {
  const dates = [...new Set(tickets.map(getTicketDay).filter(Boolean))]
  return [...new Set([...DEFAULT_DASHBOARD_DATES, ...dates])].sort((a, b) => Number(a) - Number(b))
}

export const getTimeSlots = (tickets) => {
  const slots = [...new Set(tickets.map((ticket) => ticket.ticketTypeId?.ticketTypeTime).filter(Boolean))]
  return (slots.length ? slots : DEFAULT_TIME_SLOTS).sort()
}

export const filterTicketsByDay = (tickets, selectedDay) => (
  selectedDay === "all" ? tickets : tickets.filter((ticket) => getTicketDay(ticket) === selectedDay)
)

export const buildLineGeometry = (values, width = 600, height = 150, padding = 24) => {
  const maxValue = Math.max(...values, 0)
  const minValue = Math.min(...values, 0)
  const range = maxValue - minValue || 1
  const usableWidth = width - padding * 2
  const usableHeight = height - padding * 2
  const points = values.map((value, index) => ({
    x: values.length === 1 ? width / 2 : padding + (usableWidth * index) / (values.length - 1),
    y: padding + usableHeight - ((value - minValue) / range) * usableHeight,
  }))

  return {
    points,
    path: points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`).join(" "),
  }
}
