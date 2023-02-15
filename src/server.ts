import fastify from 'fastify';
import cookie from '@fastify/cookie';
import { config } from './models/schema/env.schema';
import { transactionsRoutes } from './routes/transaction.routes';

const app = fastify();

app.register(cookie);

app.register(transactionsRoutes, {
  prefix: 'transactions',
});

app.listen({ port: config.PORT }).then(() => {
  console.log('pai ta de pé');
});
