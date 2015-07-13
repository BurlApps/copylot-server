module.exports = {

  payload: function(req, res) {
    res.success({
      user: req.installation.id,
      platform: req.platform.payload
    })
  }

}
