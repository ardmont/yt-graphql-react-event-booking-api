const { dateToString } = require('../../helpers/date.js')
const { transformEvent } = require('./merge')

const Event = require('../../models/event')
const User = require('../../models/user')

module.exports = {
  events: async () => {
    try {
      const events = await Event.find()
      /* const mapedEvents = await events.map(event => {
        return transformEvent(event)
      })
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(mapedEvents)
        }, 1000)
      }) */
      return events.map(event => {
        return transformEvent(event)
      })
    } catch (e) {
      throw e
    }
  },
  createEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!')
    }
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: dateToString(args.eventInput.date),
      creator: req.userId
    })
    let createdEvent
    try {
      const result = await event.save()
      createdEvent = transformEvent(result)
      const creator = await User.findById(req.userId)
      if (!creator) {
        throw new Error('User doesn\'t exists.')
      }
      creator.createdEvents.push(event)
      await creator.save()
      return createdEvent
    } catch (e) {
      throw e
    }
  }
}
