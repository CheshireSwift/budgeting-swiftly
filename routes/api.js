const router = require('express').Router()
const axios = require('axios')
const querystring = require('querystring')
const passport = require('passport')

function monzoClient(token) {
  return axios.create({
    baseURL: 'https://api.monzo.com/',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

function monzoCall(req, res, endpoint, query) {
  console.log('calling', endpoint, 'with', req.user)
  return monzoClient(req.user.accessToken)
    .get(endpoint, querystring.stringify(query))
    .then(mres => { console.log('mres', endpoint, mres.data); return mres })
    .then(mres => res.send(mres.data))
}

function ensureAuthenticated(req, res, next) {
  console.log('requser', req.user)
  if (req.isAuthenticated()) {
    return next()
  }

  res.status(400).send({ error: 'not authed' })
}

router.use(ensureAuthenticated)

router.get('/accounts', (req, res) => {
  monzoCall(req, res, '/accounts')
    .then(responseForwarder(res))
})

router.get('/transactions/:account_id', (req, res) => {
  const dateParam = moment(req.query.date) || moment()
  const start = dateParam.clone().startOf('month')
  const end = start.clone().add(1, 'month')
  console.log(
    'transactions_for_account',
    dateParam.format(),
    start.format(),
    end.format()
  )
  monzoCall(req, res, '/transactions', {
    account_id: req.account_id,
    since: start.format(),
    before: end.format()
  }).then(responseForwarder(res))
})

module.exports = router
