var Mixpanel = require('mixpanel')

module.exports = {

  /* GET Requests */
  home: function(req, res) {
    res.success("home/index", {
      ph: req.param("ref") == "producthunt"
    })
  },

  ph: function(req, res) {
    res.success("home/index", {
      ph: true
    })
  },

  joined: function(req, res) {
    res.success("home/joined", {
      layout: "layouts/error"
    })
  },


  /* POST Requests */
  beta: function(req, res) {
    var mixpanel = Mixpanel.init(process.env.MIXPANEL)

    mixpanel.people.set(req.param("email"), {
      "$name": req.param("name"),
      "$email": req.param("email"),
      "Beta Tester": true,
      "Product Hunt": (req.param("ph") === "true")
    })

    res.success({
      next: "/beta/joined"
    })
  }

}
