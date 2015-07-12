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

  "auth/LoginController": {
    "*": "loggedInRedirect",
    "login": "wantsJSON",
    "logout": true
  },

  "auth/RegisterController": "loggedInRedirect",
  "auth/ResetController": "loggedInRedirect",

	"projects/ProjectController": {
  	"*": ["isLoggedIn", "hasProjects", "hasPlatform"],
  	"management": ["isLoggedIn", "hasProjects"],
  	"new": "isLoggedIn",
  	"create": ["isLoggedIn", "wantsJSON"],
  	"deploy": ["isLoggedIn", "hasProjects", "hasPlatform", "wantsJSON"]
  },

  "projects/BlockController": {
  	"*": ["isLoggedIn", "hasProjects", "hasPlatform"],
  	"create": ["isLoggedIn", "hasProjects", "hasPlatform", "wantsJSON"],
  	"update": ["isLoggedIn", "hasProjects", "hasPlatform", "wantsJSON"]
  }
};
