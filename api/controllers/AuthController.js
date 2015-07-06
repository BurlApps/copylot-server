var passport = require('passport')

module.exports = {

  login: function(req, res) {
    res.success("auth/login", {
      layout: 'layouts/modal',
      remember: req.cookies.remember || "",
      next: req.param("next")
    })
  },

  register: function(req, res) {
    res.success("auth/register", {
      layout: 'layouts/modal'
    })
  },

  reset: function(req, res) {
    res.success("auth/reset/index", {
      layout: 'layouts/modal'
    })
  },

  resetPassword: function(req, res) {
    res.success("auth/reset/password", {
      layout: 'layouts/modal'
    })
  },

  resetSuccess: function(req, res) {
    res.success("auth/reset/success", {
      layout: 'layouts/modal'
    })
  },

  emailSuccess: function(req, res) {
    res.success("auth/email/success", {
      layout: 'layouts/modal'
    })
  },

  registerUser: function(req, res) {
    User.create({
      name: req.param("name"),
      email: req.param("email"),
      password: req.param("password")
    }).exec(function(error, user) {
      if (error || !user) {
        return res.error("Email Already Taken :(")
      }

      req.logIn(user, function(err) {
        if (err) res.error(err)

        return res.success({
          user: user.id,
          next: req.param("next") || "projects"
        })
      })
    })
  },

  loginUser: function(req, res) {
    passport.authenticate('local', function(err, user, info) {
      if (err || !user) {
        return res.error(info.message)
      }

      req.logIn(user, function(err) {
        if (err) res.error("Something went wrong :(")

        if(req.param("remember") == "true") {
          res.cookie('remember', user.email, {
            maxAge: 604800000,
            httpOnly: true
          })
        } else {
          res.clearCookie('remember')
        }

        return res.success({
          user: user.id,
          next: req.param("next") || "projects"
        })
      })
    })(req, res)
  },

  logoutUser: function(req, res) {
    req.logout()
    res.redirect('/')
  }
}
