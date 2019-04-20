const bcrypt = require('bcryptjs')
const _ = require('lodash')

const User = require('../../models/user')

module.exports = {
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
