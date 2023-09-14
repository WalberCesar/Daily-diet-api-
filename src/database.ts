import { knex as setupKnex, Knex } from 'knex'
import 'dotenv/config'
import { error } from 'console'
import { ERROR } from 'sqlite3'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL not found.')
}

export const configDataBase: Knex.Config = {
  client: 'sqlite',
  connection: {
    filename: process.env.DATABASE_URL,
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  },
}

export const knex = setupKnex(configDataBase)
