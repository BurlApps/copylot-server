'use strict'

exports.up = function(knex, Promise) {
  knex.schema.table('installation', function (table) {
    table.dropColumn('fullName')
    table.dropColumn('installationID')
    table.renameColumn('projectVersion', "version")
  }).catch(function(err) {
    console.error(err)
  })
}

exports.down = function(knex, Promise) {
  knex.schema.table('installation', function (table) {
    table.text('fullName')
    table.text('installationID')
    table.renameColumn('version', "projectVersion")
  }).catch(function(err) {
    console.error(err)
  })
}
