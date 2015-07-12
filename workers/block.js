var htmlparser = require("htmlparser2")

module.exports = function(app) {
  sails.config.queue.consumer("block", function(queue) {
    sails.log.info("Block Worker Started")

    queue.handle("block", function(job, done) {
      sails.log.info('Block ID: ' + job.id);

      Block.findOne({
        id: job.id
      }).then(function(block) {
        if(!block) throw Error("Block not found")

        return block.createPayload(job.html)
      }).then(function() {
        return done()
      }).catch(function(err) {
        sails.log.error(err)
      })
    })
  })
}
