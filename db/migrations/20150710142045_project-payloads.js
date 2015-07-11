'use strict';

exports.up = function(knex, Promise) {
  knex.schema.table('project', function (table) {
    table.renameColumn("ios_payload", "iosPayload")
    table.renameColumn("android_payload", "androidPayload")
  }).catch(function(err) {
    console.error(err)
  })
};

exports.down = function(knex, Promise) {
  knex.schema.table('project', function (table) {
    table.renameColumn("iosPayload", "ios_payload")
    table.renameColumn("androidPayload", "android_payload")
  }).catch(function(err) {
    console.error(err)
  })
};
