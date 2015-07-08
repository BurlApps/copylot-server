/**
 * BlockController
 *
 * @description :: Server-side logic for managing blocks
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  /* GET Requests */
	index: function(req, res) {
  	var platforms = ["global", "ios", "android"]

  	if(platforms.indexOf(req.platform) == -1)
  	  return res.redirect("/projects")

  	Block.find({
      project: req.project.id,
      platform: req.platform
    }).then(function(blocks) {
      res.success("projects/blocks", {
        layout: 'layouts/projects',
        project: req.project,
        pane: req.platform,
        blocks: blocks
      })
    }).catch(res.badRequest)
  },

  new: function(req, res) {
    res.success("projects/block", {
      layout: 'layouts/projects',
      project: req.project,
      pane: req.platform,
      block: null
    })
  },

  block: function(req, res) {
    Block.findOne({
      id: req.param("block")
    }).then(function(block) {
      if(!block) throw Error("Block not found")

      res.success("projects/block", {
        layout: 'layouts/projects',
        project: req.project,
        pane: req.platform,
        block: block
      })
    }).catch(function(err) {
      console.log(err)
      res.redirect("/projects/" + req.project.id + "/" + req.platform)
    })
  },

  /* POST Requests */
  create: function(req, res) {
    Block.create({
      title: req.param("title"),
      platform: req.platform,
      html: req.param("html")
    }).then(function(block) {
      if(!block) throw Error("Block not created")

      req.project.blocks.add(block)
      req.project.save()

      res.success({
        block: block.id,
        url: "/projects/" + req.project.id + "/" + req.platform +
             "/blocks/" + block.id
      })
    }).catch(function(err) {
      res.error("Something went wrong :(", err)
    })
  },

  update: function(req, res) {
    Block.findOne({
      id: req.param("block")
    }).then(function(block) {
      if(!block) throw Error("Block not found")

      block.title = req.param("title")
      block.html = req.param("html")
      block.dirty = true
      block.save()

      res.success({
        block: block.id,
        url: req.url
      })
    }).catch(function(err) {
      res.error("Something went wrong :(", err)
    })
  },

  delete: function(req, res) {
    Block.findOne({
      id: req.param("block")
    }).then(function(block) {
      if(!block) throw Error("Block not found")

      block.destroy()

      res.success({
        url: "/projects/" + req.project.id + "/" + req.platform
      })
    }).catch(function(err) {
      res.error("Something went wrong :(", err)
    })
  },

};