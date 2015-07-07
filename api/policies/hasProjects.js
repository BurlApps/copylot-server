module.exports = function(req, res, next) {
  var panes = [
    null, "ios", "android",
    "management", "team", "notifications"
  ]

  if(req.user.projects.length == 0) {
    return res.redirect("/projects/new")
  }

  if(req.param("project") == null) {
    var projectID = req.user.projects[0].id

    return res.redirect("/projects/" + projectID)
  } else {
    var projectID = req.param("project")

    req.pane = req.param("pane") || null
    req.project = req.user.selectProject(projectID)

    if(!req.project)
      return res.redirect("/projects")

    if(panes.indexOf(req.pane) == -1)
      return res.redirect("/projects/" + projectID)
  }

  next()
};
