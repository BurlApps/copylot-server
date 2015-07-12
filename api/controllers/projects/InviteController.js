/**
 * InviteController
 *
 * @description :: Server-side logic for managing invites
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  /* GET Requests */
  index: function(req, res) {
    var project = null

    Invite.findOne({
      secret: req.param("invite")
    }).populate("project").then(function(invite) {
      if(!invite) throw Error("Invite not found")

      project = invite.project
      project.users.add(req.user.id)

      return project.save().then(function() {
        return invite.destroy()
      })
    }).then(function() {
      res.redirect("/projects/" + project.id)
    }).catch(function(err) {
      res.success("auth/expired", {
        layout: 'layouts/modal',
        siteTitle: "Expired Link"
      })
    })
  },

  delete: function(req, res) {
  	Invite.findOne({
      id: req.param("invite")
    }).then(function(invite) {
      if(!invite) throw Error("Invite not found")

      return invite.destroy()
    }).then(function() {
      res.redirect("/projects/" + req.project.id + "/settings/management")
    }).catch(function(err) {
      res.error(err.message, err)
    })
  },

  /* POST Requests */
	invite: function(req, res) {
  	var email = req.param("email")

  	Project.findOne({
      id: req.project.id
    }).populate("users").populate("invites").then(function(project) {
      if(!project) throw Error("Project not found")

      var users = project.users.filter(function(user) {
        if(user.email == email) return user
      })

      var invites = project.invites.filter(function(invite) {
        if(invite.email == email) return invite
      })

      if(users.length > 0)
        throw Error(users[0].name + " is already a member!")

      if(invites.length > 0)
        throw Error(invites[0].email + " has already been invited!")

      return project.sendInvite(req.user, email)
    }).then(function() {
      res.success()
    }).catch(function(err) {
      return res.error(err.message, err)
    })
	}
};
