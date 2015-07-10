module.exports = function(app) {
  sails.config.queue.consumer("project", function(queue) {
    sails.log.info("Project Worker Started")

    queue.handle("project", function(job, ack) {
      sails.log.info('Project ID: ' + job.id);
      ack();
    })
  })
}
