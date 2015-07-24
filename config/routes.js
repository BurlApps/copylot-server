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
  'get /': { "view": "home/index" },
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


  // Account
  'get /account': "account/AccountController.index",
  'get /account/password': "account/AccountController.password",

  'post /account': "account/AccountController.update",
  'post /account/password': "account/AccountController.update_password",


  // Invites
  'get /invites/:invite': "project/InviteController.index",


  // Projects
  'get /projects': "project/BlockController.index",
  'get /projects/new': "project/ProjectController.new",
  'get /projects/:project': "project/BlockController.index",
  'get /projects/:project/settings/management': "project/ProjectController.management",
  'get /projects/:project/settings/management/team/invite/:invite/remove': "project/InviteController.delete",
  'get /projects/:project/settings/management/team/user/:user/remove': "project/ProjectController.remove_user",
  'get /projects/:project/:platform': "project/BlockController.index",
  'get /projects/:project/:platform/blocks/create': "project/BlockController.new",
  'get /projects/:project/:platform/blocks/:block': "project/BlockController.block",

  'post /projects/new': "project/ProjectController.create",
  'post /projects/:project/settings/management': "project/ProjectController.update",
  'post /projects/:project/settings/management/delete': "project/ProjectController.delete",
  'post /projects/:project/settings/management/team/invite': "project/InviteController.invite",
  'post /projects/:project/:platform/deploy': "project/ProjectController.deploy",
  'post /projects/:project/:platform/blocks/create': "project/BlockController.create",
  'post /projects/:project/:platform/blocks/:block': "project/BlockController.update",
  'post /projects/:project/:platform/blocks/:block/delete': "project/BlockController.delete",

  // API
  'get /api/v1.0/:platform/payload': "api/v1-0/PayloadController.payload",

  'post /api/v1.0/:platform/variables': "api/v1-0/PayloadController.global_variables",
  'post /api/v1.0/:platform/blocks/new': "api/v1-0/PayloadController.block",
  'post /api/v1.0/:platform/blocks/:block/variables': "api/v1-0/PayloadController.block_variables"
};
