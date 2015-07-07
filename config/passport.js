var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  bcrypt = require('bcrypt')

passport.serializeUser(function(user, done) {
  done(null, user.id)
})

passport.deserializeUser(function(id, done) {
  User.findOne({ id: id }).populate("projects").exec(done)
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

    bcrypt.compare(password, user.password, function (err, res) {
      if (!res) return done(null, false, {
        message: 'Invalid Credentials :('
      })

      var returnUser = {
        email: user.email,
        createdAt: user.createdAt,
        id: user.id
      }

      return done(null, returnUser, {
        message: 'Awesome :('
      })
    })
  })
}))
