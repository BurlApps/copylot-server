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
    //orm: leave default hook
    policies: false,
    pubsub: false,
    request: false,
    responses: false,
    //services: leave default hook,
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
