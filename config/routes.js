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
  'get /': "/login",
  'get /terms': "https://docs.google.com/document/d/19THqSGaSekwWTMZMRAhft-EJINhvi5pw5bbl_OoGylw/pub?embedded=true",
  'get /privacy': "https://docs.google.com/document/d/1mVRnyq16bCq1tr1qAqDr-VLonBk67XNmtB0f4Mh6jA4/pub?embedded=true",


  // Authentication
  'get /login': "auth/LoginController.index",
  'get /register': "auth/RegisterController.index",
  'get /logout': "auth/LogoutController.index",
  'get /reset': "auth/ResetController.index",
  'get /reset/success': "auth/ResetController.success",
  'get /reset/:token/password': "auth/ResetController.password",
  'get /email/:token/verify': "auth/EmailController.index",

  'post /login': "auth/LoginController.login",
  'post /register': "auth/RegisterController.register",
  'post /reset': "auth/ResetController.sendEmail",
  'post /reset/:token/password': "auth/ResetController.setPassword",


  // Projects
  'get /projects': "projects/ProjectController.index",
  'get /projects/new': "projects/ProjectController.new",
  'get /projects/:project': "projects/ProjectController.index",
  'get /projects/:project/settings/:pane': "projects/ProjectController.index",
  'get /projects/:project/:platform': "projects/BlockController.index",
  'get /projects/:project/:platform/blocks/create': "projects/BlockController.new",
  'get /projects/:project/:platform/blocks/:block': "projects/BlockController.block",

  'post /projects/new': "projects/ProjectController.create",
  'post /projects/:project/:platform/blocks/create': "projects/BlockController.create",
  'post /projects/:project/:platform/blocks/:block': "projects/BlockController.update",
  'post /projects/:project/:platform/blocks/:block/delete': "projects/BlockController.delete",
};
