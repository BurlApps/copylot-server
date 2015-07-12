'use strict';

exports.up = function(knex, Promise) {
  knex.schema.createTable('invite', function (table) {
    table.increments("id")
    table.integer("inviter")
    table.integer("project")
    table.text("email")
    table.text("secret")
    table.timestamp("createdAt")
    table.timestamp("updatedAt")
  }).catch(function(err) {
    console.error(err)
  })
};

exports.down = function(knex, Promise) {
  knex.schema.dropTable('invite').catch(function(err) {
    console.error(err)
  })
};
