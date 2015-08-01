module.exports = function(app) {
  Queue.consumer("platform", function(queue) {
    sails.log.info("Platform Worker Started")

    queue.handle("platform", function(job, done) {
      sails.log.info('Platform ID: ' + job.id);

      Platform.findOne({
        id: job.id
      }).then(function(platform) {
        if(!platform) throw Error("Platform not found!")

        return platform.createPayload()
      }).then(function() {
        return done()
      }).catch(function(err) {
        sails.log.error(err)
      })
    })
  })
}
