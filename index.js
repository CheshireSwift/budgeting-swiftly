require('dotenv').config()

const express = require('express')
const path = require('path')
const morgan = require('morgan')

const api = require('./routes/api')
const client = require('./routes/client')

const app = express()

app.use(morgan('dev'))
app.use(express.static(path.join(__dirname, 'client/build')))
app.use('/api', api)
app.use('/client', client)

app.listen(process.env.PORT || 3001, () => console.log('Serving React app and API'))
