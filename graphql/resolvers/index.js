const bcrypt = require('bcryptjs')
const _ = require('lodash')
const Event = require('../../models/event')
const User = require('../../models/user')
const Booking = require('../../models/booking')

const events = async eventIds => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } })
    return events.map(event => {
      return {
        ...event.toObject(),
        date: new Date(event.date).toISOString(),
        creator: user.bind(this, event.creator)
      }
    })
  } catch (e) {
    throw e
  }
}

const singleEvent = async eventId => {
  try {
    const event = await Event.findById(eventId)
    return {
      ...event.toObject(),
      creator: user.bind(this, event.creator)
    }
  } catch (e) {
    throw e
  }
}

const user = async userId => {
  try {
    const user = await User.findById(userId)
    return {
      ...user.toObject(),
      createdEvents: events.bind(this, user.createdEvents)
    }
  } catch (e) {
    throw e
  }
}

module.exports = {
  events: async () => {
    try {
      const events = await Event.find()
      return events.map(event => {
        return {
          ...event.toObject(),
          date: new Date(event.date).toISOString(),
          creator: user.bind(this, event.creator)
        }
      })
    } catch (e) {
      throw e
    }
  },
  bookings: async () => {
    try {
      const bookings = await Booking.find()
      return bookings.map(booking => {
        return {
          ...booking.toObject(),
          event: singleEvent.bind(this, booking.event),
          user: user.bind(this, booking.user),
          createdAt: new Date(booking.createdAt).toISOString(),
          updatedAt: new Date(booking.createdAt).toISOString()
        }
      })
    } catch (e) {
      throw e
    }
  },
  createEvent: async args => {
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: '5cb359ef9b3e2750baa94353'
    })
    let createdEvent
    try {
      const result = await event.save()
      createdEvent = {
        ...result.toObject(),
        date: new Date(event.date).toISOString(),
        creator: user.bind(this, result.creator)
      }
      const creator = await User.findById('5cb359ef9b3e2750baa94353')
      if (!creator) {
        throw new Error('User doesn\'t exists.')
      }
      creator.createdEvents.push(event)
      await creator.save()
      return createdEvent
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
      await booking.save()
      return {
        ...booking.toObject(),
        event: singleEvent.bind(this, booking.event),
        user: user.bind(this, booking.user),
        createdAt: new Date(booking.createdAt).toISOString(),
        updatedAt: new Date(booking.createdAt).toISOString()
      }
    } catch (e) {
      throw e
    }
  },
  createUser: async args => {
    try {
      const result = await User.findOne({ email: args.userInput.email })
      if (result) {
        throw new Error('User exists already.')
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12)
      const user = new User({
        email: args.userInput.email,
        password: hashedPassword
      })
      const savedUser = await user.save()
      return _.omit(savedUser.toObject(), ['password'])
    } catch (e) {
      throw e
    }
  }
}
