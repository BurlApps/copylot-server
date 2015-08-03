/**
 * HTTP Server Settings
 * (sails.config.http)
 *
 * Configuration for the underlying HTTP server in Sails.
 * Only applies to HTTP requests (not WebSockets)
 *
 * For more information on configuration, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.http.html
 */

var moment = require("moment")
var raven = require("raven")

module.exports.http = {

  /****************************************************************************
  *                                                                           *
  * Express middleware to use for every Sails request. To add custom          *
  * middleware to the mix, add a function to the middleware config object and *
  * add its key to the "order" array. The $custom key is reserved for         *
  * backwards-compatibility with Sails v0.9.x apps that use the               *
  * `customMiddleware` config option.                                         *
  *                                                                           *
  ****************************************************************************/

  middleware: {

  /***************************************************************************
  *                                                                          *
  * The order in which middleware should be run for HTTP request. (the Sails *
  * router is invoked by the "router" middleware below.)                     *
  *                                                                          *
  ***************************************************************************/

    order: [
      'startRequestTimer',
      'registerSentry',
      'hostChecker',
      'cookieParser',
      'session',
      'passportInit',
      'passportSession',
      'csrfChecker',
      'setLocals',
      'bodyParser',
      'handleBodyParserError',
      'compress',
      'methodOverride',
      'poweredBy',
      '$custom',
      'router',
      'www',
      'favicon',
      '404',
      '500'
    ],

  /****************************************************************************
  *                                                                           *
  * Example custom middleware; logs each request to the console.              *
  *                                                                           *
  ****************************************************************************/

    passportInit    : require('passport').initialize(),
    passportSession : require('passport').session(),

    registerSentry: raven.middleware.express(process.env.SENTRY),

    hostChecker: function(req, res, next) {
      console.log(sails.getBaseurl())
      if(process.env.HOST !== sails.getBaseurl())
        return res.redirect(process.env.HOST)

      next()
    },

    csrfChecker: function(req, res, next) {
      var routesDisabled = sails.config.csrf.routesDisabled

      if(req.path.indexOf("/api") > -1 && routesDisabled.indexOf(req.path) == -1) {
        if(routesDisabled == "-")
          routesDisabled = req.path
        else
          routesDisabled += ("," + req.path)

        sails.config.csrf.routesDisabled = routesDisabled
      }

      next()
    },

    setLocals: function(req, res, next) {
      // Show Traffic
      sails.log.info("Request -", req.method, req.url)

      // Set Locals
      res.locals._csrf = res.locals._csrf || ""
      res.locals.sentry = process.env.SENTRY_WEB
      res.locals.production = sails.config.isProduction
      res.locals.user = req.user
      res.locals.host = process.env.HOST || sails.getBaseurl()
      res.locals.hostname = req.host
      res.locals.url = res.locals.host + req.url
      res.locals.path = req.url
      res.locals.mixpanelToken = process.env.MIXPANEL
      res.locals.heapToken = process.env.HEAP
      res.locals.config = {}
      res.locals.siteTitle = null
      res.locals.siteName = "CoPylot"
      res.locals.titleOG = null
      res.locals.visible = true
      res.locals.description = "Store, Manage, and Deploy text to your apps on the fly. " +
                               "Why spend development time editing text?"
      res.locals.random = Random.system
      return next();
    },

    filters: {
      isActive: function(paneA, paneB) {
        return (paneA == paneB) ? "active" : ""
      },
      humanize: function(date) {
        if(!date) return ""

        var now = Date.now()
        return moment.duration(date - now).humanize(true)
      },
      platformFormat: function(platform) {
        switch(platform) {
          case "ios": return "iOS"
          case "android": return "Android"
          default: return "Global"
        }
      }
    }

  /***************************************************************************
  *                                                                          *
  * The body parser that will handle incoming multipart HTTP requests. By    *
  * default as of v0.10, Sails uses                                          *
  * [skipper](http://github.com/balderdashy/skipper). See                    *
  * http://www.senchalabs.org/connect/multipart.html for other options.      *
  *                                                                          *
  ***************************************************************************/

    // bodyParser: require('skipper')

  },

  /***************************************************************************
  *                                                                          *
  * The number of seconds to cache flat files on disk being served by        *
  * Express static middleware (by default, these files are in `.tmp/public`) *
  *                                                                          *
  * The HTTP static cache is only active in a 'production' environment,      *
  * since that's the only time Express will cache flat-files.                *
  *                                                                          *
  ***************************************************************************/

  cache: 31557600000
};
