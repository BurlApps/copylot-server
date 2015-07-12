var bcrypt = require('bcrypt')

module.exports = {
  attributes: {
    name: {
      type: 'STRING',
      required: true
    },
    email: {
      type: 'EMAIL',
      required: true,
      unique: true
    },
    emailVerify: {
      type: 'STRING',
      unique: true
    },
    password: {
      type: 'STRING',
      minLength: 6,
      required: true
    },
    projects: {
      collection: 'project',
      via: 'users'
    },
    toJSON: function() {
      var obj = this.toObject()
      delete obj.password
      return obj
    },
    selectProject: function(id) {
      var index = this.projects.map(function(project) {
        return project.id
      }).indexOf(Number(id))
      return this.projects[index]
    },
    resetPassword: function(cb) {
      this.emailVerify = sails.config.random(20)
      this.save()

      sails.config.mailgun.messages().send({
        from: 'CoPylot <bot@copylot.io>',
        to: this.email,
        subject: "Reset password for CoPylot",
        text: ('You requested a password reset for CoPylot.\n\n' +
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
        user.emailVerify = sails.config.random(20)
        cb()
      }
    })
  },
  afterCreate: function(user, cb) {
    sails.config.mailgun.messages().send({
      from: 'CoPylot <bot@copylot.io>',
      to: user.email,
      subject: "Verify your email for CoPylot",
      text: ('Welcome to CoPylot!\n\nPlease confirm your email address ' +
        'by clicking this link:\n' + process.env.HOST + '/email/' +
        user.emailVerify + '/verify')
    }, cb)
  }
}
