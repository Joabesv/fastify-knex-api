import fastify from 'fastify';
import { knex } from './database/connection';
import { config } from './models/schema/envSchema';

const app = fastify();

app.get('/hello', async () => {
  const transaction = await knex('transactions').select('*');
  return transaction;
});

app.get('/giveMeTables', async () => {
  return knex('sqlite_schema').select('*');
});

app.listen({ port: config.PORT }).then(() => {
  console.log('pai ta de pé');
});
