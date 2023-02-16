import { knex as setupKnex, Knex } from 'knex';
import { config } from '../models/schema/env.schema';

const isSqliteOrPostgres =
  config.DATABASE_CLIENT === 'sqlite'
    ? {
        filename: config.DATABASE_URL,
      }
    : config.DATABASE_URL;

export const knexConfig: Knex.Config = {
  client: config.DATABASE_CLIENT,
  connection: isSqliteOrPostgres,
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './src/database/migrations',
  },
};

export const knex = setupKnex(knexConfig);
