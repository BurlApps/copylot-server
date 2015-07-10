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
    version: {
      type: "INTEGER",
      required: true,
      defaultsTo: 1
    },
    secret: {
      type: 'STRING',
      required: true,
      defaultsTo: sails.config.random(36)
    },
    iosPayload: {
      type: 'JSON',
      defaultsTo: {}
    },
    androidPayload: {
      type: 'JSON',
      defaultsTo: {}
    },
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
    deployedAt: "DATETIME",
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
