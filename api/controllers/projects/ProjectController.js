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
        pane: "management",
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

  update: function(req, res) {
    req.project.name = req.param("name")
    req.project.itunesID = req.param("itunesID") || null
    req.project.androidID = req.param("androidID") || null
    req.project.website = req.param("website") || null
    req.project.save().then(function() {
      res.redirect(req.url)
    }).catch(function(err) {
      res.error("Something went wrong :(", err)
    })
  },

  delete: function(req, res) {
    req.project.destroy().then(function() {
      res.redirect("/projects")
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
