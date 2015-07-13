if(process.env.NEW_RELIC_LICENSE_KEY) {
  require("newrelic")
}

require("throng")(start, {
  workers: process.env.WEB_CONCURRENCY || 1,
  lifetime: Infinity
});

function start() {
  require('sails').load({
    hooks: {
      blueprints: false,
      controllers: false,
      cors: false,
      csrf: false,
      grunt: false,
      http: false,
      i18n: false,
      logger: false,
      policies: false,
      pubsub: false,
      request: false,
      responses: false,
      session: false,
      sockets: false,
      views: false
    }
  }, function(err, app) {
    if(!err && app) {
      return require("./workers/" + process.argv[2])(app)
    } else {
      return console.error(err)
    }
  })
}
