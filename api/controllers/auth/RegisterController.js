var passport = require('passport')

module.exports = {

  /* GET Requests */
  index: function(req, res) {
    res.success("auth/register", {
      layout: 'layouts/modal'
    })
  },

  /* POST Requests */
  register: function(req, res) {
    User.create({
      name: req.param("name"),
      email: req.param("email"),
      password: req.param("password")
    }).then(function(user) {
      if(!user) throw Error("User not created")

      req.logIn(user, function(err) {
        if(err) throw Error("User not created")

        return res.success({
          user: user.id,
          next: req.param("next") || "projects"
        })
      })
    }).catch(function(err) {
      return res.error("Email Already Taken :(", err)
    })
  }

}
