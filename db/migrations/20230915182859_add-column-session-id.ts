import { table } from 'console'
import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (table) => {
    table.uuid('session_id').after('id').index()
  })
  await knex.schema.alterTable('meals', (table) => {
    table.uuid('session_id').after('id').index()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (table) => {
    table.dropColumn('session_id')
  })
  await knex.schema.alterTable('meals', (table) => {
    table.dropColumn('session_id')
  })
}
