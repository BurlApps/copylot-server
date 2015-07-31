'use strict';

exports.up = function(knex, Promise) {
  knex.schema.table('user', function (table) {
    table.boolean('productHunt')
  }).catch(function(err) {
    console.error(err)
  })
}

exports.down = function(knex, Promise) {
  knex.schema.table('user', function (table) {
    table.dropColumn('productHunt')
  }).catch(function(err) {
    console.error(err)
  })
}
