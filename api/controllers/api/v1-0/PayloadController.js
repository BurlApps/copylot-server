module.exports = {

  payload: function(req, res) {
    var data = {
      newPayload: false,
      installation: req.installation.id,
      platform: null
    }

    Promise.resolve().then(function() {
      if(req.platform.payload.version) return

      PlatformPayload(req.platform, []).then(function(payload) {
        req.platform.payload = payload
        return req.platform.save()
      })
    }).then(function() {
      if(req.param("version") != req.platform.version) {
        data.newPayload = true
        data.platform = req.platform.payload
      }
    }).then(function() {
      return res.success(data)
    }).then(function() {
      if(req.project.setup) return

      req.project.setup = true
      return req.project.save()
    })
  },

  block: function(req, res) {
    Block.create({
      title: req.param("title"),
      platform: req.platform.id,
      html: req.param("text"),
      project: req.project.id,
      variables: req.param("variables") || {},
      savedAt: new Date()
    }).then(function(block) {
      if(!block) throw Error("Block not created")

      block.sendToWorker()

      res.success()
    }).catch(function(err) {
      if("slug" in err.invalidAttributes) {
        res.error(
          'The title "' + req.param("title") +
          '" has already been used in this platform :('
        )
      } else {
        res.error("Something went wrong", err)
      }
    })
  },

  global_variables: function(req, res) {
    var variables = req.param("variables")

    Promise.each(Object.keys(variables), function(key) {
      return req.platform.variables[key] = variables[key]
    }).then(function() {
      return req.platform.save()
    }).then(function() {
      res.success()
    }).catch(function(err) {
      res.error(err.message, err)
    })
  },

  block_variables: function(req, res) {
    var variables = req.param("variables")

    Block.findOne({
      id: req.param("block")
    }).then(function(block) {
      if(!block) throw Error("Block not found")

      return Promise.each(Object.keys(variables), function(key) {
        return block.variables[key] = variables[key]
      }).then(function() {
        return block.save()
      })
    }).then(function() {
      res.success()
    }).catch(function(err) {
      res.error(err.message, err)
    })
  }

}
