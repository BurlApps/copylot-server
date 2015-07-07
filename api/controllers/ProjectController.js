/**
 * ProjectController
 *
 * @description :: Server-side logic for managing projects
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  /* GET Requests */
	home: function(req, res) {
    res.success("projects/index", {
      layout: 'layouts/projects',
      project: req.project,
      platform: req.param("platform")
    })
  },

  new: function(req, res) {
    res.success("projects/new", {
      layout: 'layouts/modal'
    })
  },

  /* POST Requests */
  create: function(req, res) {
    Project.create({
      name: req.param("name")
    }).then(function(project) {
      project.users.add(req.user.id)
      project.save()

      res.success({ next: "/projects" })
    }).fail(function(err) {
      res.failed("Something went wrong :(", err)
    })
  }
};
