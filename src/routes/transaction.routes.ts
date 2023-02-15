import type { FastifyInstance } from 'fastify';
import { randomUUID } from 'node:crypto';
import { knex } from '../database/connection';
import { checkSessionId } from '../hooks/check-session-id';
import {
  createTransactionBody,
  getTransactionsParamsSchema,
} from '../models/schema/transactions.schema';

export async function transactionsRoutes(app: FastifyInstance) {
  app.get('/', { preHandler: [checkSessionId] }, async (request, reply) => {
    const { sessionId } = request.cookies;
    const transactions = await knex('transactions')
      .where('session_id', sessionId)
      .select();

    return reply.status(200).send({ transactions });
  });

  app.get('/:id', { preHandler: [checkSessionId] }, async (request, reply) => {
    const { id } = getTransactionsParamsSchema.parse(request.params);
    const { sessionId } = request.cookies;

    const transaction = await knex('transactions')
      .where({
        session_id: sessionId,
        id,
      })
      .first();

    return reply.status(200).send({ transaction });
  });

  app.get(
    '/summary',
    { preHandler: [checkSessionId] },
    async (request, reply) => {
      const { sessionId } = request.cookies;

      const summary = await knex('transactions')
        .where('session_id', sessionId)
        .sum('amount', { as: 'amount' })
        .first();
      return reply.status(200).send(summary);
    },
  );

  app.post('/', async (request, reply) => {
    const { title, amount, type } = createTransactionBody.parse(request.body);

    let sessionId = request.cookies.sessionId;

    if (!sessionId) {
      sessionId = randomUUID();

      reply.setCookie('sessionId', sessionId, {
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
