/**
 * BlockController
 *
 * @description :: Server-side logic for managing blocks
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  /* GET Requests */
	index: function(req, res) {
  	Block.find({
      project: req.project.id,
      platform: req.platform.id
    }).sort({
      slug: 'asc'
    }).then(function(blocks) {
      res.success("projects/blocks", {
        layout: 'layouts/projects',
        project: req.project,
        pane: req.platform.name,
        blocks: blocks,
        dirtyBlocks: blocks.filter(function(block) {
          if(block.dirty) return true
        }).length,
        siteTitle: req.project.name
      })
    }).catch(res.badRequest)
  },

  new: function(req, res) {
    res.success("projects/block", {
      layout: 'layouts/projects',
      project: req.project,
      platform: req.platform,
      pane: req.platform.name,
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
        pane: req.platform.name,
        platform: req.platform,
        block: block,
        siteTitle: block.title
      })
    }).catch(function(err) {
      console.log(err)
      res.redirect("/projects/" + req.project.id + "/" + req.platform.name)
    })
  },

  /* POST Requests */
  create: function(req, res) {
    Block.create({
      title: req.param("title"),
      platform: req.platform.id,
      html: req.param("html"),
      project: req.project.id,
      savedAt: new Date()
    }).then(function(block) {
      if(!block) throw Error("Block not created")

      block.sendToWorker()

      res.success({
        block: block.id,
        url: "/projects/" + req.project.id + "/" + req.platform.name +
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
      block.savedAt = new Date()

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

      req.platform.sendToWorker()

      return block.destroy()
    }).then(function(block) {
      res.success({
        url: "/projects/" + req.project.id + "/" + req.platform.name
      })
    }).catch(function(err) {
      res.error("Something went wrong :(", err)
    })
  },

};
