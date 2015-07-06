var bcrypt = require('bcrypt')

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
      type: 'string',
      unique: true
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
    },
    verifyEmail: function(cb) {
      sails.config.mailgun.messages().send({
        from: 'CoPylot <bot@copylot.io>',
        to: this.email,
        subject: "Verify your email for CoPylot",
        text: ('Welcome to Copylot!\n\nPlease confirm your email address ' +
              'by clicking this link:\n' + process.env.HOST + '/email/' +
              this.emailVerify + '/verify')
      }, function(error, body) {
        if(cb) cb(error, body)
      })
    },
    resetPassword: function(cb) {
      this.emailVerify = Math.random().toString(36).slice(2)
      this.save()

      sails.config.mailgun.messages().send({
        from: 'CoPylot <bot@copylot.io>',
        to: this.email,
        subject: "Reset password for CoPylot",
        text: ('You requested a password reset for Copylot.\n\n' +
              'Click this link to reset it:\n' + process.env.HOST + '/reset/' +
              this.emailVerify + '/password')
      }, function(error, body) {
        if(cb) cb(error, body)
      })
    }
  },
  hash: function(data, cb) {
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(data, salt, cb)
    })
  },
  beforeCreate: function(user, cb) {
    User.hash(user.password, function(err, hash) {
      if (err) {
        console.log(err)
        cb(err)
      } else {
        user.password = hash
        user.emailVerify = Math.random().toString(36).slice(2)
        cb()
      }
    })
  },
  afterCreate: function(user, cb) {
    user.verifyEmail(cb)
  }
}
