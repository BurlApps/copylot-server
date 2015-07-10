module.exports = function(app) {
  sails.config.queue.consumer("block", function(queue) {
    sails.log.info("Block Worker Started")

    queue.handle("block", function(job, ack) {
      sails.log.info('Block ID: ' + job.id);
      sails.log.info('Block HTML: ' + job.html);
      ack();
    })
  })
}
