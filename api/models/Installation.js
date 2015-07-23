/**
* Installation.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    GCMSenderID: "STRING",
    deviceToken: "STRING",
    timeZone: "STRING",
    version: "INTEGER",
    project: {
      required: true,
      model: "project"
    },
    platform: {
      required: true,
      model: "platform"
    },
    deviceType: {
      type: "STRING",
      enum: ["ios", "android"]
    }
  }

};
