'use strict';

exports.up = function(knex, Promise) {
  knex.schema.table('block', function (table) {
    return table.dateTime("savedAt")
  }).catch(function(err) {
    console.error(err)
  })
};

exports.down = function(knex, Promise) {
  knex.schema.table('block', function (table) {
    return table.dropColumn("savedAt")
  }).catch(function(err) {
    console.error(err)
  })
};
