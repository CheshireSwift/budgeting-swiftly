const router = require('express').Router()
const passport = require('passport')

router.get('/', passport.authenticate('monzo'))
router.get('/callback', passport.authenticate('monzo', {
  successRedirect: '/',
  failureRedirect: '/auth'
}))

module.exports = router
