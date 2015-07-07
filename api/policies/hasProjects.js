module.exports = function(req, res, next) {
  var platforms = [null, "ios", "android"]

  if(req.user.projects.length == 0) {
    return res.redirect("/projects/new")
  }

  if(req.param("project") == null) {
    var projectID = req.user.projects[0].id

    return res.redirect("/projects/" + projectID + "/global")
  } else {
    var projectID = req.param("project")
    var platform = req.param("platform") || null
    req.project = req.user.selectProject(projectID)

    if(!req.project)
      return res.redirect("/projects")

    if(platforms.indexOf(platform) == -1)
      return res.redirect("/projects/" + projectID)
  }

  next()
};
