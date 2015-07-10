'use strict';

exports.up = function(knex, Promise) {
  knex.schema.table('project', function (table) {
    table.renameColumn("payload", "ios_payload")
    return table.json("android_payload")
  }).catch(function(err) {
    console.error(err)
  })
};

exports.down = function(knex, Promise) {
  knex.schema.table('project', function (table) {
    table.renameColumn("ios_payload", "payload")
    return table.dropColumn("android_payload")
  }).catch(function(err) {
    console.error(err)
  })
};
