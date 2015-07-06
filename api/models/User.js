var bcrypt = require('bcrypt')
var mailgun = require('mailgun')

module.exports = {
  attributes: {
    name: {
      type: 'string',
      required: true
    },
    email: {
      type: 'email',
      required: true,
      unique: true
    },
    emailVerify: {
      type: 'string'
    },
    password: {
      type: 'string',
      minLength: 6,
      required: true
    },
    toJSON: function() {
      var obj = this.toObject()
      delete obj.password
      return obj
    }
  },
  beforeCreate: function(user, cb) {
    user.emailVerify = Math.random().toString(36).slice(2)

    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) {
          console.log(err)
          cb(err)
        } else {
          user.password = hash
          cb()
        }
      })
    })
  }
}
