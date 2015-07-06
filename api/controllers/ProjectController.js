/**
 * ProjectController
 *
 * @description :: Server-side logic for managing projects
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	home: function(req, res) {
    res.success("projects/index", {
      layout: 'layouts/projects'
    })
  },

};
