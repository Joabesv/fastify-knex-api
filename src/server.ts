import fastify from 'fastify';
import { config } from './models/schema/env.schema';
import { transactionsRoutes } from './routes/transactionRoutes';

const app = fastify();

app.register(transactionsRoutes, {
  prefix: 'transactions',
});

app.listen({ port: config.PORT }).then(() => {
  console.log('pai ta de pé');
});
