import { randomUUID } from 'node:crypto';
import { FastifyInstance } from 'fastify';
import { knex } from '../database/connection';
import {
  createTransactionBody,
  getTransactionsParamsSchema,
} from '../models/schema/transactions.schema';

export async function transactionsRoutes(app: FastifyInstance) {
  app.get('/', async (request, reply) => {
    const transactions = await knex('transactions').select();

    return reply.status(200).send({ transactions });
  });

  app.get('/summary', async (_, reply) => {
    const summary = await knex('transactions')
      .sum('amount', { as: 'amount' })
      .first();
    return reply.status(200).send(summary);
  });

  app.get('/:id', async (request, reply) => {
    const { id } = getTransactionsParamsSchema.parse(request.params);
    const transaction = await knex('transactions').where('id', id).first();

    return reply.status(200).send({ transaction });
  });

  app.post('/', async (request, reply) => {
    const { title, amount, type } = createTransactionBody.parse(request.body);

    let sessionId = request.cookies.sessionId;

    if (!sessionId) {
      sessionId = randomUUID();

      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // cookie is valid for 7 days
      });
    }

    await knex('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
      session_id: sessionId,
    });

    return reply.status(201).send();
  });
}
