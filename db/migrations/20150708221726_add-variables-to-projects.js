'use strict';

exports.up = function(knex, Promise) {
  knex.schema.table('project', function (table) {
    return table.json("variables")
  }).catch(function(err) {
    console.error(err)
  })
};

exports.down = function(knex, Promise) {
  knex.schema.table('project', function (table) {
    return table.dropColumn("variables")
  }).catch(function(err) {
    console.error(err)
  })
};
