if(process.env.NEW_RELIC_LICENSE_KEY) {
  require("newrelic")
}

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
    views: false,
  }
}, function(err, app) {
  if(!err && app) {
    require("./workers/block")(app)
    require("./workers/platform")(app)

    //return require("./workers/" + process.argv[2])(app)
  } else {
    return console.error(err)
  }
})
