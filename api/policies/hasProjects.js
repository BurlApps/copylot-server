module.exports = function(req, res, next) {
  var platforms = ["ios", "android"]

  if(req.user.projects.length == 0) {
    return res.redirect("/projects/new")
  }

  if(req.param("project") == null) {
    var projectID = req.user.projects[0].id

    return res.redirect("/projects/" + projectID + "/ios")
  } else {
    var projectID = req.param("project")
    req.project = req.user.selectProject(projectID)
    req.platform = req.param("platform")
    req.pane = req.param("pane")

    if(!req.project)
      return res.redirect("/projects")

    else if(platforms.indexOf(req.platform) == -1 && !req.pane)
      return res.redirect("/projects/" + projectID + "/ios")
  }

  next()
};
