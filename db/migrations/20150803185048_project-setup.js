'use strict';

exports.up = function(knex, Promise) {
  knex.schema.table('project', function (table) {
    table.boolean('setup')
  }).catch(function(err) {
    console.error(err)
  })
}

exports.down = function(knex, Promise) {
  knex.schema.table('project', function (table) {
    table.dropColumn('setup')
  }).catch(function(err) {
    console.error(err)
  })
}
