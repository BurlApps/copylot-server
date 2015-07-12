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
    iosVersion: {
      type: "INTEGER",
      required: true,
      defaultsTo: 1
    },
    androidVersion: {
      type: "INTEGER",
      required: true,
      defaultsTo: 1
    },
    iosPayload: {
      type: 'JSON',
      defaultsTo: {}
    },
    androidPayload: {
      type: 'JSON',
      defaultsTo: {}
    },
    iosDeployedAt: "DATETIME",
    androidDeployedAt: "DATETIME",
    users: {
      collection: 'user',
      via: 'projects'
    },
    installations: {
      collection: 'installation',
      via: 'project'
    },
    blocks: {
      collection: 'block',
      via: 'project'
    },
    variables: {
      type: 'JSON',
      defaultsTo: {}
    },
    sendToWorker: function(platform) {
      var project = this

      sails.config.queue.producer("project", function(queue) {
        queue.publish("project", {
          id: project.id,
          platform: platform
        })
      })
    }
  }

};
