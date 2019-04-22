const bcrypt = require('bcryptjs')
const _ = require('lodash')
const jwt = require('jsonwebtoken')

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
  },
  login: async args => {
    try {
      const user = await User.findOne({ email: args.email })
      if (!user) {
        throw new Error('User doens\'t exists.')
      }
      const passCheck = await bcrypt.compare(args.password, user.password)
      if (passCheck) {
        const tokenExpiration = Math.floor(Date.now() / 1000) + (60 * 60)

        const token = jwt.sign({
          exp: tokenExpiration,
          userEmail: user.email },
        'secret')

        return {
          userId: user._id,
          token: token,
          tokenExpiration: tokenExpiration }
      } else {
        throw new Error('Invalid password')
      }
    } catch (e) {
      throw e
    }
  }
}
