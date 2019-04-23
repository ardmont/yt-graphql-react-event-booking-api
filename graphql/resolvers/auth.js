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
  login: async ({ email, password }) => {
    try {
      const user = await User.findOne({ email: email })
      if (!user) {
        throw new Error('User doens\'t exists.')
      }
      const passCheck = await bcrypt.compare(password, user.password)
      if (!passCheck) {
        throw new Error('Invalid password')
      } else {
        const token = jwt.sign({
          userId: user.id,
          userEmail: user.email },
        'secret', {
          expiresIn: '1h'
        })

        return {
          userId: user.id,
          token: token,
          tokenExpiration: 1 }
      }
    } catch (e) {
      throw e
    }
  }
}
