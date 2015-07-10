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
    }).sort('title ASC').then(function(blocks) {
      res.success("projects/blocks", {
        layout: 'layouts/projects',
        project: req.project,
        pane: req.platform,
        blocks: blocks,
        siteTitle: req.project.name
      })
    }).catch(res.badRequest)
  },

  new: function(req, res) {
    res.success("projects/block", {
      layout: 'layouts/projects',
      project: req.project,
      pane: req.platform,
      block: null,
      siteTitle: "Create Block"
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
        block: block,
        siteTitle: block.title
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
      html: req.param("html"),
      project: req.project.id
    }).then(function(block) {
      if(!block) throw Error("Block not created")

      block.sendToWorker()

      res.success({
        block: block.id,
        url: "/projects/" + req.project.id + "/" + req.platform +
             "/blocks/" + block.id
      })
    }).catch(function(err) {
      var message = "Something went wrong"

      if("slug" in err.invalidAttributes) {
        message = 'The title "' + req.param("title") +
                  '" has already been used in this platform :('
      }

      res.error(message, err)
    })
  },

  update: function(req, res) {
    Block.findOne({
      id: req.param("block")
    }).then(function(block) {
      if(!block) throw Error("Block not found")

      block.dirty = true
      block.title = req.param("title")
      block.html = req.param("html")

      block.sendToWorker()
      return block.save()
    }).then(function(block) {
      res.success({
        block: block.id,
        url: req.url
      })
    }).catch(function(err) {
      var message = "Something went wrong"

      if(err.invalidAttributes) {
        if("slug" in err.invalidAttributes) {
          message = 'The title "' + req.param("title") +
                    '" has already been used in this platform :('
        }
      }

      res.error(message, err)
    })
  },

  delete: function(req, res) {
    Block.findOne({
      id: req.param("block")
    }).then(function(block) {
      if(!block) throw Error("Block not found")

      return block.destroy()
    }).then(function(block) {
      res.success({
        url: "/projects/" + req.project.id + "/" + req.platform
      })
    }).catch(function(err) {
      res.error("Something went wrong :(", err)
    })
  },

};
