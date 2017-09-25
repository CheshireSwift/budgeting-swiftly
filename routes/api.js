const router = require('express').Router()
const axios = require('axios')
const querystring = require('querystring')

const monzoClient = axios.create({
  baseURL: 'https://api.monzo.com/',
  headers: {
    Authorization: `Bearer ${process.env.MONZO_TOKEN}`
  }
})

router.get('/test', (req, res) => {
  res.json({a: 1})
})

router.get('/test/send', (req, res) => {
  monzoClient.post('/feed', querystring.stringify({
    account_id: 'acc_00009HsvVnjdvfgCOHkKnp',
    type: 'basic',
    url: 'http://www.nyan.cat/',
    'params[title]': 'Hullo from the Express API',
    'params[body]': 'Is this real life?',
    'params[image_url]': 'http://www.nyan.cat/cats/original.gif'
  })).then(mres => {
    console.log('Posted to feed')
    res.send('ok')
  }).catch(err => {
    console.log('Error:', err.response.data)
    console.log('Request was', err.config.data, err.config.method, err.config.url)
    res.status(400).json(err.response.data)
  })
})

module.exports = router
