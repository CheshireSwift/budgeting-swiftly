const express = require('express')
const path = require('path')

const app = express()

app.use(express.static(path.join(__dirname, 'client/build')))

app.get('/api/test', (req, res) => {
  res.json({a: 1})
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'))
})

app.listen(process.env.PORT || 3001, () => console.log('Serving React app and API'))
