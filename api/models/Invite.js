/**
* Invite.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    email: {
      type: "STRING",
      required: true
    },
    inviter: {
      required: true,
      model: 'user'
    },
    project: {
      required: true,
      model: 'project'
    },
    secret: {
      type: 'STRING',
      required: true,
      unique: true,
      defaultsTo: Random.random(36)
    }
  }
};
