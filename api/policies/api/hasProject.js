var auth = require('basic-auth')

module.exports = function(req, res, next) {
  var user = auth(req)
  var platform = req.param("platform")

  if(!user)
    return res.error("Project ID & Secret are required!")

  Project.findOne({
    id: user.name,
    secret: user.pass
  }).populate(platform).then(function(project) {
    if(!project)
      throw Error("Project not found")

    if(["ios", "android"].indexOf(platform) == -1)
      throw Error("Platform not ios or android")

    req.project = project
    req.platform = project[platform]
    next()
  }).catch(function(err) {
    res.error(err.message, err)
  })
}
