var passport = require('passport')

module.exports = {

  /* GET Requests */
  index: function(req, res) {
    res.success("auth/login", {
      layout: 'layouts/modal',
      remember: req.cookies.remember || "",
      next: req.param("next"),
      siteTitle: "Sign In"
    })
  },

  /* POST Requests */
  login: function(req, res) {
    passport.authenticate('local', function(err, user, info) {
      if (err || !user) {
        return res.error(info.message)
      }

      req.logIn(user, function(err) {
        if (err) res.error("Something went wrong :(", err)

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
  }

}
