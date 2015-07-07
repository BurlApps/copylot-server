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
    installationID: "STRING",
    firstName: "STRING",
    lastName: "STRING",
    fullName: "STRING",
    timeZone: "STRING",
    projectVersion: "INTEGER",
    project: {
      model: 'project'
    },
    deviceType: {
      type: "STRING",
      enum: ["iOS", "android"]
    }
  }

};
