var passport = require('passport')

module.exports = {

  /* GET Requests */
  index: function(req, res) {
    res.success("auth/register", {
      layout: 'layouts/modal',
      siteTitle: "Register",
      ph: req.param("ph") || "",
      next: req.param("next") || "",
      name: req.param("name") || "",
      email: req.param("email") || ""
    })
  },

  /* POST Requests */
  register: function(req, res) {
    User.create({
      name: req.param("name"),
      email: req.param("email"),
      password: req.param("password"),
      productHunt: (req.param("ph") === true)
    }).then(function(user) {
      if(!user) throw Error("User not created")

      req.logIn(user, function(err) {
        if(err) throw Error("User not created")

        return res.success({
          user: user.id,
          next: req.param("next") || "/projects"
        })
      })
    }).catch(function(err) {
      if("email" in err.invalidAttributes) {
        res.error("Email Already Taken :(", err, false)
      } else {
        res.error("Something went wrong", err)
      }
    })
  }

}
