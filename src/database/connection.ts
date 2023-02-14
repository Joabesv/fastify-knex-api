import { knex as setupKnex, Knex } from 'knex';
import { config } from '../models/schema/envSchema';

export const knexConfig: Knex.Config = {
  client: 'sqlite3',
  connection: {
    filename: config.DATABASE_URL,
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './src/database/migrations',
  },
};

export const knex = setupKnex(knexConfig);
