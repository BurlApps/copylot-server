/**
 * AccountController
 *
 * @description :: Server-side logic for managing accounts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	/* GET Requests */
	index: function(req, res) {
    res.success("account/index", {
      layout: 'layouts/modal',
      user: req.user,
      siteTitle: "Account"
    })
	},

	password: function(req, res) {
    res.success("account/password", {
      layout: 'layouts/modal',
      siteTitle: "Account Password"
    })
	},


	/* POST Requests */
	update: function(req, res) {
    req.user.name = req.param("name")
    req.user.email = req.param("email")

    req.user.save().then(function() {
      res.success({
        next: "/account"
      })
    }).catch(function(err) {
      res.error("Something went wrong :(", err)
    })
	},

	update_password: function(req, res) {
  	Promise.resolve().then(function() {
    	return req.user.compare(req.param("old_password")).catch(function() {
      	throw Error("Invalid old password!")
    	})
  	}).then(function() {
      return User.hash(req.param("new_password"))
  	}).then(function(hash) {
      req.user.password = hash
      return req.user.save()
    }).then(function() {
      res.success({
        next: "/account"
      })
    }).catch(function(err) {
      res.error(err.message, err)
    })
	}

};
