module.exports = function(app) {
  sails.config.queue.consumer("block", function(queue) {
    queue.handle("block", function(job, ack) {
      console.log('Block ID: ' + job.id);
      console.log('Block HTML: ' + job.html);
      ack();
    })
  })
}
