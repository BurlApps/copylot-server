/**
 * ProjectController
 *
 * @description :: Server-side logic for managing projects
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  /* GET Requests */
	index: function(req, res) {
    res.success("projects/index", {
      layout: 'layouts/projects',
      project: req.project,
      pane: req.pane,
      siteTitle: req.project.name
    })
  },

  new: function(req, res) {
    res.success("projects/new", {
      layout: 'layouts/modal',
      siteTitle: "New Project"
    })
  },

  /* POST Requests */
  create: function(req, res) {
    Project.create({
      name: req.param("name"),
    }).then(function(project) {
      if(!project) throw Error("Project not created")

      project.users.add(req.user.id)
      return project.save()
    }).then(function(project) {
      res.success({
        next: "/projects/" + project.id + "/global"
      })
    }).catch(function(err) {
      res.error("Something went wrong :(", err)
    })
  }
};
