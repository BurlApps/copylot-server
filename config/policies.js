/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect
 * its actions individually.
 *
 * Any policy file (e.g. `api/policies/authenticated.js`) can be accessed
 * below by its filename, minus the extension, (e.g. "authenticated")
 *
 * For more information on how policies work, see:
 * http://sailsjs.org/#!/documentation/concepts/Policies
 *
 * For more information on configuring policies, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.policies.html
 */


module.exports.policies = {

  '*': true,

  "home/homeController": {
    "*": "site/loggedInRedirect",
    "beta": ["site/loggedInRedirect", "site/wantsJSON"]
  },

  "auth/LoginController": {
    "*": "site/loggedInRedirect",
    "login": ["site/loggedInRedirect", "site/wantsJSON"],
    "logout": true
  },

  "auth/RegisterController": "site/loggedInRedirect",
  "auth/ResetController": "site/loggedInRedirect",

	"account/AccountController": {
  	"*": "site/isLoggedIn",
  	"update": ["site/wantsJSON", "site/isLoggedIn"]
  },

	"project/ProjectController": {
  	"*": ["site/isLoggedIn", "site/hasProjects", "site/hasPlatform"],
  	"new": "site/isLoggedIn",
  	"create": ["site/wantsJSON", "site/isLoggedIn"],
  	"update": ["site/isLoggedIn", "site/hasProjects"],
    "delete": ["site/isLoggedIn", "site/hasProjects"],
    "management": ["site/isLoggedIn", "site/hasProjects"],
    "remove_user": ["site/isLoggedIn", "site/hasProjects"],
  	"deploy": ["site/wantsJSON", "site/isLoggedIn", "site/hasProjects", "site/hasPlatform"],
  },

  "project/BlockController": {
  	"*": ["site/isLoggedIn", "site/hasProjects", "site/hasPlatform"],
  	"create": ["site/wantsJSON", "site/isLoggedIn", "site/hasProjects", "site/hasPlatform"],
  	"update": [ "site/wantsJSON", "site/isLoggedIn", "site/hasProjects", "site/hasPlatform"]
  },

  "project/InviteController": {
  	"*": "site/isLoggedIn",
  	"invite": ["site/wantsJSON", "site/isLoggedIn", "site/hasProjects"],
  	"delete": ["site/isLoggedIn", "site/hasProjects"]
  },

  "api/v1-0/PayloadController": {
    "*": ["api/wantsJSON", "api/hasProject", "api/hasInstallation"]
  },
};
