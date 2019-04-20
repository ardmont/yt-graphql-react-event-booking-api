const { dateToString } = require('../../helpers/date.js')
const { transformEvent } = require('./merge')

const Event = require('../../models/event')
const User = require('../../models/user')

module.exports = {
  events: async () => {
    try {
      const events = await Event.find()
      return events.map(event => {
        return transformEvent(event)
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
      date: dateToString(args.eventInput.date),
      creator: '5cb359ef9b3e2750baa94353'
    })
    let createdEvent
    try {
      const result = await event.save()
      createdEvent = transformEvent(result)
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
  }
}
