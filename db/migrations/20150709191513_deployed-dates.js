'use strict';

exports.up = function(knex, Promise) {
  Promise.resolve().then(function() {
    return knex.schema.table('block', function (table) {
      return table.date("deployedAt")
    })
  }).then(function() {
    return knex.schema.table('project', function (table) {
      return table.date("deployedAt")
    })
  }).catch(function(err) {
    console.error(err)
  })
};

exports.down = function(knex, Promise) {
  Promise.resolve().then(function() {
    return knex.schema.table('block', function (table) {
      return table.dropColumn("deployedAt")
    })
  }).then(function() {
    return knex.schema.table('project', function (table) {
      return table.dropColumn("deployedAt")
    })
  }).catch(function(err) {
    console.error(err)
  })
};
