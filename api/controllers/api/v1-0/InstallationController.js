module.exports = {

  payload: function(req, res) {
    res.success({
      installation: req.installation.id,
      platform: req.platform.payload
    })
  }

}
