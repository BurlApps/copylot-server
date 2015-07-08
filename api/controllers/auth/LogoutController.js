module.exports = {

  /* GET Requests */
  index: function(req, res) {
    req.logout()
    res.redirect('/')
  }

}
