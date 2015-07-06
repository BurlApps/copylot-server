/**
* Project.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    name: {
      type: 'STRING',
      required: true
    },
    androidID: 'STRING',
    itunesID: 'STRING',
    website: 'STRING',
    version: 'STRING',
    payload: {
      type: 'JSON',
      defaultsTo: {}
    },
    users: {
      collection: 'user',
      via: 'projects'
    },
    installations: {
      collection: 'installation',
      via: 'project'
    },
    blocks: {
      collection: 'block',
      via: 'project'
    },
  }

};
