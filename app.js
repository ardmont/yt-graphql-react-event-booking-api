const express = require('express')
const bodyParser = require('body-parser')
const graphqlHttp = require('express-graphql')
const mongoose = require('mongoose')

const graphqlSchema = require('./graphql/schema')
const graphqlResolvers = require('./graphql/resolvers')
const isAuth = require('./middleware/is-auth')

const app = express()

app.use(bodyParser.json())

app.use((req, res, next) => {
  // res.setHeader('Access-Control-Allow-Origin', '*')
  // res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS')
  // res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST,GET,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  })
  if (req.method === 'OPTIONS') {
    res.sendStatus(200)
  }
  next()
})

app.use(isAuth)

app.use('/graphql', graphqlHttp({
  schema: graphqlSchema,
  rootValue: graphqlResolvers,
  graphiql: true
}))

app.get('/', (req, res, next) => {
  res.send('Hello World!')
})

mongoose.connect(process.env.MONGODBURL, { useNewUrlParser: true })
  .then(app.listen(3000))
  .catch((err) => { console.log(err) })
