/**
 * ProjectController
 *
 * @description :: Server-side logic for managing projects
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  /* GET Requests */
  new: function(req, res) {
    res.success("projects/new", {
      layout: 'layouts/modal',
      siteTitle: "New Project"
    })
  },

  management: function(req, res) {
    Project.findOne({
      id: req.project.id
    }).populate("users").then(function(project) {
      if(!project) throw Error("Project was not found")

      res.success("projects/management", {
        layout: 'layouts/projects',
        project: project,
        pane: req.param("pane"),
        siteTitle: req.project.name
      })
    }).catch(function(err) {
      res.error("Something went wrong :(", err)
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
        next: "/projects/" + project.id + "/ios"
      })
    }).catch(function(err) {
      res.error("Something went wrong :(", err)
    })
  },

  deploy: function(req, res) {
    Block.find({
      project: req.project.id,
      platform: req.platform.id,
      dirty: true
    }).then(function(blocks) {
      var date = new Date()

      return Promise.each(blocks, function(block) {
        block.dirty = false
        block.deployedAt = date
        return block.save()
      })
    }).then(function() {
      req.platform.sendToWorker()
      res.success()
    }).catch(function(err) {
      res.error("Something went wrong :(", err)
    })
  }
};
