require('dotenv').config()

const _ = require('lodash')
const express = require('express')
const session = require('express-session')
const path = require('path')
const morgan = require('morgan')
const passport = require('passport')
const MonzoStrategy = require('passport-monzo').Strategy
const Redis = require('ioredis')
const RedisStore = require('connect-redis')(session)

const redis = new Redis()

//passport.use(new MonzoStrategy(
//  {
//    clientID: process.env.CLIENT_ID,
//    clientSecret: process.env.CLIENT_SECRET,
//    callbackURL: `${process.env.PUBLIC_URL}/auth/callback`
//  },
//
passport.use(new MonzoStrategy(
  {
    authorizationURL: 'https://auth.getmondo.co.uk',
    tokenURL: 'https://api.monzo.com/oauth2/token',
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: `${process.env.PUBLIC_URL}/auth/callback`,
    state: true
  },
  (accessToken, refreshToken, profile, cb) => {
    console.log('got deets', {accessToken, profile})
    redis.hmset(profile.id, { id: profile.id, accessToken, refreshToken, displayName: profile.displayName })
      .then(() => redis.hgetall(profile.id))
      .then(x => {console.log({x}); return x})
      .then(val => cb(null, val), err => cb(err, null))
  })
)

passport.serializeUser((user, cb) => { cb(null, user.id) })
passport.deserializeUser((userId, cb) => {
  redis.hgetall(userId)
    .then(
      val => { cb(null, val) },
      err => { cb(err, null) }
    )
})

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/auth')
}

const app = express()

// logging
app.use(morgan('dev'))

// session + login
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60000 },
  //store: new RedisStore({client: redis})
}))
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize())
app.use(passport.session())

app.get('/', ensureAuthenticated, (req, res) => { res.redirect('/app') })
app.use('/app',
  ensureAuthenticated,
  express.static(path.join(__dirname, 'client/build'))
  //require('./routes/client')
)

app.use('/api', require('./routes/api'))
app.use('/auth', require('./routes/auth'))

app.get('/logout', (req, res) => {
  console.log('logging out')
  req.logout()
  res.redirect('/')
})

app.listen(process.env.PORT || 3001, () => console.log('Serving React app and API'))
