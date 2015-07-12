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
      defaultsTo: sails.config.random(36)
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
      model: 'project'
    },
    ios: {
      model: 'project'
    },
    installations: {
      collection: 'installation',
      via: 'project'
    }
  },
  afterCreate: function(project, cb) {
    Promise.resolve().then(function() {
      return Platform.create({
        name: "ios",
        project: project.id
      }).then(function(platform) {
        project.ios = platform
      })
    }).then(function() {
      return Platform.create({
        name: "android",
        project: project.id
      }).then(function(platform) {
        project.android = platform
      })
    }).then(function() {
      return cb()
    })
  }
};
