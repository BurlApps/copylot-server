module.exports = function(req, res, next) {
  var installationID = req.param("userID")

  Promise.resolve().then(function() {
    if(installationID) {
      return Installation.findOne({
        id: installationID
      }).then(function(installation) {
        if(!installation)
          throw Error("User not found")

        return installation
      })
    } else {
      return Installation.create({
        project: req.project.id,
        platform: req.platform.id,
        deviceType: req.platform.name
      })
    }
  }).then(function(installation) {
    req.installation = installation
    next()
  }).catch(function(err) {
    res.error(err.message, err)
  })
}
