'use strict';

exports.up = function(knex, Promise) {
  knex('project')
    .whereNull('variables')
    .update({
      'variables': {}
    })
    .catch(function(err) {
      console.error(err)
    })
};

exports.down = function(knex, Promise) {

};
