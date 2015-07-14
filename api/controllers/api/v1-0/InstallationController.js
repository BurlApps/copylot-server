module.exports = {

  payload: function(req, res) {
    var data = {
      newPayload: false,
      installation: req.installation.id,
      platform: {
        version: req.platform.version
      }
    }

    if(req.param("version") != req.platform.version) {
      data.newPayload = true
      data.platform = req.platform.payload
    }

    res.success(data)
  }

}
