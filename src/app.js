require('dotenv').config()
const compression = require('compression')
const express = require('express')
const {default: helmet} = require('helmet')
const morgan = require('morgan')
const app = express()

// init middleware

// Morgan options (dev, combined, common, short, tiny)
app.use(morgan("dev"))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded(
{
    extended: true
}
))
// init db
require("./db/init.mongodb")
// const {checkOverload} = require('./helpers/check.connect')
// checkOverload()

// init routes (routes/index.js)
app.use('/', require('./routes'))

// handling error

module.exports = app