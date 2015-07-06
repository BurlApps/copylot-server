/**
 * Mailgun API
 */


module.exports.mailgun = require("mailgun-js")({
  apiKey: process.env.MAILGUN,
  domain: process.env.MAILGUN_DOMAIN
})
