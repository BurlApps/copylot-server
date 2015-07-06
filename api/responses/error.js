module.exports = function error(error) {

  // Get access to `req`, `res`, & `sails`
  var req = this.req;
  var res = this.res;
  var sails = req._sails;

  if(typeof error != "string") {
    error = error.description || error.message || "An error occurred"
  }

  sails.log.verbose(error)

  res.jsonx({
    success: false,
    message: error
  })
};
