const { transformEvent } = require('./merge')
const { transformBooking } = require('./merge')

const Event = require('../../models/event')
const Booking = require('../../models/booking')

module.exports = {
  bookings: async () => {
    try {
      const bookings = await Booking.find()
      return bookings.map(booking => {
        return transformBooking(booking)
      })
    } catch (e) {
      throw e
    }
  },
  bookEvent: async args => {
    try {
      const event = await Event.findById(args.eventId)
      if (!event) {
        throw new Error('Event doesn\'t exists.')
      }
      const booking = new Booking({
        event: event,
        user: '5cb359ef9b3e2750baa94353'
      })
      const result = await booking.save()
      return transformBooking(result)
    } catch (e) {
      throw e
    }
  },
  cancelBooking: async args => {
    try {
      const booking = await Booking.findById(args.bookingId).populate('event')
      if (!booking) {
        throw new Error('Booking doesn\'t exists.')
      }
      const event = transformEvent(booking.event)
      await booking.remove()
      return event
    } catch (e) {
      throw e
    }
  }
}
