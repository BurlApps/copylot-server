/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  // Home
  // TODO: Build home pages
  'get /': "/projects",


  // Authentication
  'get /login': "AuthController.login",
  'get /register': "AuthController.register",
  'get /logout': "AuthController.logout",
  'get /reset': "AuthController.reset",
  'get /reset/success': "AuthController.resetSuccess",
  'get /reset/:token/password': "AuthController.resetPassword",
  'get /email/:token/verify': "AuthController.emailVerify",

  'post /login': "AuthController.loginUser",
  'post /register': "AuthController.registerUser",
  'post /reset': "AuthController.resetUser",
  'post /reset/:token/password': "AuthController.resetUserPassword",


  // Projects
  'get /projects': "ProjectController.home",
  'get /projects/new': "ProjectController.new",
  'get /projects/:project': "ProjectController.home",
  'get /projects/:project/:platform': "ProjectController.home",

  'post /projects/new': "ProjectController.create",
};
