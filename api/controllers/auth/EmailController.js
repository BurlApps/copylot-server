module.exports = {

  /* GET Requests */
  index: function(req, res) {
    User.findOne({
      emailVerify: req.param("token")
    }).then(function(user) {
      if(!user) throw Error("User not found!")

      user.emailVerify = null
      user.save()

      res.success("auth/email/success", {
        layout: 'layouts/modal'
      })
    }).catch(function(err) {
      res.success("auth/expired", {
        layout: 'layouts/modal'
      })
    })
  }

}
