/**
* Platform.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    name: {
      type: "STRING",
      required: true,
      enum: ["ios", "android"]
    },
    project: {
      required: true,
      model: 'project'
    },
    version: {
      type: "INTEGER",
      required: true,
      defaultsTo: 1
    },
    version: {
      type: "INTEGER",
      required: true,
      defaultsTo: 1
    },
    payload: {
      type: 'JSON',
      defaultsTo: {}
    },
    variables: {
      type: 'JSON',
      defaultsTo: {}
    },
    deployedAt: "DATETIME",
    installations: {
      collection: 'installation',
      via: 'platform'
    },
    blocks: {
      collection: 'block',
      via: 'platform'
    },
    createPayload: function() {
      var platform = this

      return Block.find({
        project: platform.project,
        platform: platform.id
      }).then(function(blocks) {
        return PlatformPayload(platform, blocks)
      }).then(function(payload) {
        sails.log.info(payload)

        platform.version = payload.version
        platform.deployedAt = payload.deployAt
        platform.payload = payload
        return platform.save()
      })
    },
    sendToWorker: function() {
      var platform = this

      sails.config.queue.producer("platform", function(queue) {
        queue.publish("platform", {
          id: platform.id
        })
      })
    }
  }
};