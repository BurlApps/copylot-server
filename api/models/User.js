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
    },
    compare: function(password) {
      return User.compare(password, this.password)
    }
  },
  hash: function(data) {
    return new Promise(function(resolve, reject) {
      bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(data, salt, function(err, hash) {
          if(err)
            reject(err)
          else
            resolve(hash)
        })
      })
    })
  },
  compare: function(password1, password2) {
    return new Promise(function(resolve, reject) {
      bcrypt.compare(password1, password2, function (err, res) {
        if(err || !res)
          reject(err)
        else
          resolve(res)
      })
    })
  },
  beforeCreate: function(user) {
    return User.hash(user.password).then(function(hash) {
      user.password = hash
      user.emailVerify = sails.config.random(20)
    }).catch(function(err) {
      sails.log.error(error)
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
