const DataLoader = require('dataloader')

const { dateToString } = require('../../helpers/date.js')

const Event = require('../../models/event')
const User = require('../../models/user')

const eventLoader = new DataLoader((eventIds) => {
  return events(eventIds)
})

const userLoader = new DataLoader(userIds => {
  console.log(userIds)
  return User.find({ _id: { $in: userIds } })
})

const events = async eventIds => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } })
    return events.map(event => {
      return transformEvent(event)
    })
  } catch (e) {
    throw e
  }
}

const singleEvent = async eventId => {
  try {
    const event = await eventLoader.load(eventId.toString())
    // const event = await Event.findById(eventId)
    return event
  } catch (e) {
    throw e
  }
}

const user = async userId => {
  try {
    const user = await userLoader.load(userId.toString())
    // const user = await User.findById(userId)
    return {
      ...user.toObject(),
      createdEvents: () => eventLoader.loadMany(user.createdEvents)
      // createdEvents: events.bind(this, user.createdEvents)
    }
  } catch (e) {
    throw e
  }
}

const transformEvent = event => {
  return {
    ...event.toObject(),
    date: dateToString(event.date),
    creator: user.bind(this, event.creator)
  }
}

const transformBooking = booking => {
  return {
    ...booking.toObject(),
    event: singleEvent.bind(this, booking.event),
    user: user.bind(this, booking.user),
    createdAt: dateToString(booking.createdAt),
    updatedAt: dateToString(booking.updatedAt)
  }
}

module.exports = {
  transformEvent: transformEvent,
  transformBooking: transformBooking
}
