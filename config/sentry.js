var raven = require('raven')

module.exports.sentry = new raven.Client(process.env.SENTRY);
