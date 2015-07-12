module.exports = function(req, res, next) {
  if(req.user.projects.length == 0) {
    return res.redirect("/projects/new")
  }

  if(req.param("project") == null) {
    var projectID = req.user.projects[0].id

    return res.redirect("/projects/" + projectID + "/ios")
  } else {
    req.project = req.user.selectProject(req.param("project"))

    if(!req.project)
      return res.redirect("/projects")

    next()
  }
};
