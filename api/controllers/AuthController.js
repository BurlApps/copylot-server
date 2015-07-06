var passport = require('passport')

module.exports = {

  /* GET Requests */
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

  logout: function(req, res) {
    req.logout()
    res.redirect('/')
  },

  reset: function(req, res) {
    res.success("auth/reset/index", {
      layout: 'layouts/modal'
    })
  },

  resetPassword: function(req, res) {
    User.findOne({
      emailVerify: req.param("token")
    }).then(function(user) {
      if(!user) throw Error("User not found!");

      res.success("auth/reset/password", {
        layout: 'layouts/modal',
        token: req.param("token")
      })
    }).fail(function(error) {
      res.success("auth/expired", {
        layout: 'layouts/modal'
      })
    })
  },

  resetSuccess: function(req, res) {
    res.success("auth/reset/success", {
      layout: 'layouts/modal'
    })
  },

  emailVerify: function(req, res) {
    User.findOne({
      emailVerify: req.param("token")
    }).then(function(user) {
      if(!user) throw Error("User not found!")

      user.emailVerify = null
      user.save()

      res.success("auth/email/success", {
        layout: 'layouts/modal'
      })
    }).fail(function(error) {
      res.success("auth/expired", {
        layout: 'layouts/modal'
      })
    })
  },

  /* POST Requests */
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

  registerUser: function(req, res) {
    User.create({
      name: req.param("name"),
      email: req.param("email"),
      password: req.param("password")
    }).exec(function(error, user) {
      if (error || !user) {
        console.log(error, user)
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

  resetUser: function(req, res) {
    User.findOne({
      email: req.param("email")
    }).then(function(user) {
      if(!user) throw Error("User not found!")

      user.resetPassword()
      res.success({ message: "Sent!" })
    }).fail(function(error) {
      console.log(error)
      res.error("Email Not Found :(")
    })
  },

  resetUserPassword: function(req, res) {
    User.findOne({
      emailVerify: req.param("token")
    }).then(function(user) {
      if(!user) throw Error("User not found!");

      User.hash(req.param("password"), function(err, hash) {
        if(err) throw Error("Hash failed");

        user.emailVerify = null
        user.password = hash
        user.save()

        res.success({
          next: "/reset/success"
        })
      })
    }).fail(function(error) {
      res.failed("Something went wrong :(")
    })
  }
}
