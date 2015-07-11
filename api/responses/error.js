module.exports = function error(message, error) {

  // Get access to `req`, `res`, & `sails`
  var req = this.req;
  var res = this.res;
  var sails = req._sails;

  if(typeof message != "string") {
    message = message.description || message.message || "Something went wrong :("
  }

  sails.log.verbose(error || message)

  res.jsonx({
    success: false,
    message: message
  })
};
