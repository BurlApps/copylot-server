'use strict';

exports.up = function(knex, Promise) {
  Promise.resolve().then(function() {
    return knex.raw(
      "ALTER TABLE public.block DROP COLUMN IF EXISTS deployedAt;"
    ).then(function() {
      return knex.schema.table('block', function(table) {
        return table.dateTime("deployedAt")
      })
    })
  }).then(function() {
    return knex.raw(
      "ALTER TABLE public.project DROP COLUMN IF EXISTS deployedAt;"
    ).then(function() {
      return knex.schema.table('project', function(table) {
        table.dateTime("iosDeployedAt")
        return table.dateTime("androidDeployedAt")
      })
    })
  }).catch(function(err) {
    console.error(err)
  })
};

exports.down = function(knex, Promise) {

};
