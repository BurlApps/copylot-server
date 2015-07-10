'use strict';

exports.up = function(knex, Promise) {
  knex.schema.table('block', function (table) {
    return table.text("slug")
  }).then(function() {
    return knex.raw(
      "UPDATE block SET slug=LOWER(title) WHERE slug IS NULL " +
      "AND title IS NOT NULL"
    )
  }).catch(function(err) {
    console.error(err)
  })
};

exports.down = function(knex, Promise) {
  knex.schema.table('block', function (table) {
    return table.dropColumn("slug")
  }).catch(function(err) {
    console.error(err)
  })
};
