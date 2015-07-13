module.exports = function(req, res, next) {
  Platform.findOne({
    name: req.param("platform"),
    project: req.project.id
  }).then(function(platform) {
    if(!platform) throw Error("Platform not found")

    req.platform = platform
    next()
  }).catch(function(err) {
    res.redirect("/projects/" + req.project.id + "/ios")
  })
}
