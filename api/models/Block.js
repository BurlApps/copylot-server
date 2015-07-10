/**
* Block.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  attributes: {
    title: {
      type: "STRING",
      required: true
    },
    slug: {
      type: "STRING",
      required: true,
      equals: function(cb) {
        var block = this
        var query = {
          slug: this.slug,
          platform: this.platform,
          project: this.project
        }

        if(this.id) {
          query.id = {
            '!': this.id
          }
        }

        Block.count(query).then(function(count) {
          cb((count == 0) ? block.slug : null)
        })
      }
    },
    html: "STRING",
    platform: {
      type: "STRING",
      defaultsTo: "global",
      enum: ["ios", "android"]
    },
    dirty: {
      type: "BOOLEAN",
      defaultsTo: true
    },
    payload: {
      type: 'JSON',
      defaultsTo: []
    },
    variables: {
      type: 'JSON',
      defaultsTo: {}
    },
    project: {
      model: 'project'
    },
    deployedAt: "DATE",
    sendToWorker: function() {
      var block = this

      sails.config.queue.producer("block", function(queue) {
        queue.publish("block", {
          id: block.id,
          html: block.html
        })
      })
    }
  },
  beforeValidate: function(values, cb) {
    values.slug = values.title.toLowerCase()
    cb()
  }
};
