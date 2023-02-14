import fastify from 'fastify';
import { knex } from './database/connection';
import { config } from './models/schema/envSchema';
import { transactionsRoutes } from './routes/transactionRoutes';

const app = fastify();

app.register(transactionsRoutes);

app.listen({ port: config.PORT }).then(() => {
  console.log('pai ta de pé');
});
