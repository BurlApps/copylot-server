var raven = require('raven')

module.exports = new raven.Client(process.env.SENTRY);
