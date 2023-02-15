import { randomUUID } from 'node:crypto';
import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { knex } from '../database/connection';
import { createTransactionBody } from '../models/schema/createTransactionBody.schema';

export async function transactionsRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const { title, amount, type } = createTransactionBody.parse(request.body);

    await knex('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
      type,
    });

    return reply.status(201).send();
  });
}
