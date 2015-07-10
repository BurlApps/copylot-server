module.exports = function(app) {
  sails.config.queue.consumer("project", function(queue) {
    queue.handle("project", function(job, ack) {
      console.log('Project ID: ' + job.id);
      ack();
    })
  })
}
