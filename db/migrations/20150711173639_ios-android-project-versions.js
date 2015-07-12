'use strict';

exports.up = function(knex, Promise) {
  knex.schema.table('project', function (table) {
    table.integer("iosVersion")
    table.integer("androidVersion")
  }).catch(function(err) {
    console.error(err)
  })
};

exports.down = function(knex, Promise) {
  knex.schema.table('project', function (table) {
    table.dropColumn("iosVersion")
    table.dropColumn("androidVersion")
  }).catch(function(err) {
    console.error(err)
  })
};
