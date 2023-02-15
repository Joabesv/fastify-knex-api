import { z } from 'zod';

export const createTransactionBody = z.object({
  title: z.string(),
  amount: z.number(),
  type: z.enum(['credit', 'debit']),
});
