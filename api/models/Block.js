/**
* Block.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  attributes: {
    title: "STRING",
    dirty: {
      type: "BOOLEAN",
      defaultsTo: true
    },
    payload: {
      type: 'JSON',
      defaultsTo: []
    },
    variables: {
      type: 'JSON',
      defaultsTo: {}
    },
    project: {
      model: 'project'
    }
  }
};
