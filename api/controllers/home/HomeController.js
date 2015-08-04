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
  }

}
