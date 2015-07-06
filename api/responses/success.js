module.exports = function success(data, options) {

  // Get access to `req`, `res`, & `sails`
  var req = this.req;
  var res = this.res;
  var sails = req._sails;

  if(typeof data == "string") {
    options = options || {}
    options.template = data
    res.view(data, options)

  } else {
    data = data || {}
    data.success = true
    res.jsonx(data)
  }
};
