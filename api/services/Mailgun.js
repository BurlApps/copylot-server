module.exports = require("mailgun-js")({
  apiKey: process.env.MAILGUN,
  domain: process.env.MAILGUN_DOMAIN
})
