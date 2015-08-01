/**
* Project.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    name: {
      type: 'STRING',
      required: true
    },
    androidID: 'STRING',
    itunesID: 'STRING',
    website: 'STRING',
    secret: {
      type: 'STRING',
      required: true,
      defaultsTo: Random.random(36)
    },
    invites: {
      collection: 'invite',
      via: 'project'
    },
    users: {
      collection: 'user',
      via: 'projects'
    },
    installations: {
      collection: 'installation',
      via: 'project'
    },
    android: {
      model: 'platform'
    },
    ios: {
      model: 'platform'
    },
    installations: {
      collection: 'installation',
      via: 'project'
    },
    sendInvite: function(user, email) {
      var project = this

      return Invite.create({
        email: email,
        inviter: user.id,
        project: this.id
      }).then(function(invite) {
        return Mailgun.messages().send({
          from: 'CoPylot <bot@copylot.io>',
          to: email,
          subject: user.name + " invited you to " + project.name,
          text: ("Your friend " + user.name + " invited you to join " +
                project.name + " on CoPylot. CoPylot is the fastest way to " +
                "manage and change the text in your apps.\n\nClick this link to accept:\n" +
                 process.env.HOST + '/invites/' + invite.secret)
        })
      })
    }
  },
  afterCreate: function(project, cb) {
    Promise.resolve().then(function() {
      return Platform.create({
        name: "ios",
        project: project.id
      }).then(function(platform) {
        project.ios = platform.id
      })
    }).then(function() {
      return Platform.create({
        name: "android",
        project: project.id
      }).then(function(platform) {
        project.android = platform.id
      })
    }).then(cb).catch(cb)
  }
};
