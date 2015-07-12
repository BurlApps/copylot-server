var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  bcrypt = require('bcrypt')

passport.serializeUser(function(user, done) {
  done(null, user.id)
})

passport.deserializeUser(function(id, done) {
  User.findOne({ id: id }).populate("projects").exec(function(err, user) {
    done(err, user || false)
  })
})

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, function(email, password, done) {
  User.findOne({ email: email }, function (err, user) {
    if (err) return done(err)

    if (!user) {
      return done(null, false, {
        message: 'Invalid Credentials :('
      })
    }

    user.compare(password).then(function (err, res) {
      return done(null, {
        email: user.email,
        createdAt: user.createdAt,
        id: user.id
      }, {
        message: 'Awesome :('
      })
    }).catch(function() {
      return done(null, false, {
        message: 'Invalid Credentials :('
      })
    })
  })
}))
