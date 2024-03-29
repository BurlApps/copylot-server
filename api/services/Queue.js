var jackrabbit = require("jackrabbit")

module.exports = {

  producer: function(key, callback) {
    var queue = jackrabbit(process.env.RABBITMQ_BIGWIG_TX_URL)

    queue.on('connected', function() {
      queue.create(key, { prefetch: 0 }, function() {
        callback(queue)
      })
    }).on('error', function(error) {
      sails.log.error(error)
      module.exports.producer(key, callback)
    })
  },

  consumer: function(key, callback) {
    var queue = jackrabbit(process.env.RABBITMQ_BIGWIG_RX_URL)

    queue.on('connected', function() {
      queue.create(key, { prefetch: 5 }, function() {
        callback(queue)
      })
    }).on('error', function(error) {
      sails.log.error(error)
      module.exports.consumer(key, callback)
    })
  }

}
