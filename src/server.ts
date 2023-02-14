import fastify from 'fastify';
import { randomUUID } from 'node:crypto';
import { knex } from './database/connection';

const app = fastify();

app.get('/hello', async () => {
  const transaction = await knex('transactions').select('*');
  return transaction;
});

app.get('/giveMeTables', async () => {
  return knex('sqlite_schema').select('*');
});

app.listen({ port: 5000 }).then(() => {
  console.log('pai ta de pé');
});
