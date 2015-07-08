module.exports = {

  /* GET Requests */
  index: function(req, res) {
    res.success("auth/reset/index", {
      layout: 'layouts/modal',
      siteTitle: "Reset Password"
    })
  },

  password: function(req, res) {
    User.findOne({
      emailVerify: req.param("token")
    }).then(function(user) {
      if(!user) throw Error("User not found!");

      res.success("auth/reset/password", {
        layout: 'layouts/modal',
        token: req.param("token"),
        siteTitle: "Reset Password"
      })
    }).fail(function(err) {
      res.success("auth/expired", {
        layout: 'layouts/modal',
        siteTitle: "Expired Link"
      })
    })
  },

  success: function(req, res) {
    res.success("auth/reset/success", {
      layout: 'layouts/modal',
      siteTitle: "Reset Successful"
    })
  },

  /* POST Requests */
  sendEmail: function(req, res) {
    User.findOne({
      email: req.param("email")
    }).then(function(user) {
      if(!user) throw Error("User not found!")

      user.resetPassword()
      res.success({ message: "Sent!" })
    }).fail(function(err) {
      res.error("Email Not Found :(", err)
    })
  },

  setPassword: function(req, res) {
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
    }).fail(function(err) {
      res.error("Something went wrong :(", err)
    })
  }

}
