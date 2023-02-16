import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { execSync } from 'node:child_process';
import { app } from '../../src/app';

describe('Transactions tests', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    execSync('pnpm knex migrate:rollback --all');
    execSync('pnpm knex migrate:latest');
  });

  it('should be able to create a new transaction', async () => {
    const response = await request(app.server).post('/transactions').send({
      title: 'new test transaction',
      amount: 5000,
      type: 'credit',
    });

    expect(response.statusCode).toBe(201);
  });

  it('should be able to list all transactions', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'new test transaction',
        amount: 5000,
        type: 'credit',
      });

    const cookies = createTransactionResponse.get('Set-Cookie');

    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies);

    expect(listTransactionsResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: 'new test transaction',
        amount: 5000,
      }),
    ]);
  });

  it('should be able to get a specific transaction', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'new test transaction',
        amount: 5000,
        type: 'credit',
      });
    const cookies = createTransactionResponse.get('Set-Cookie');
    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200);

    const transactionId = listTransactionsResponse.body.transactions[0].id;

    const getTransactionsResponse = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set('Cookie', cookies)
      .expect(200);
    expect(getTransactionsResponse.body.transaction).toEqual(
      expect.objectContaining({
        title: 'new test transaction',
        amount: 5000,
      }),
    );
  });

  it('should be able to get the summary', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'new test transaction',
        amount: 5000,
        type: 'credit',
      });
    const cookies = createTransactionResponse.get('Set-Cookie');

    await request(app.server).post('/transactions').send({
      title: 'debit transaction',
      amount: 2000,
      type: 'debit',
    });

    const summaryResponse = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies)
      .expect(200);

    console.log('summaryBody', summaryResponse.body);

    expect(summaryResponse.body.summary).toEqual({
      amount: 5000,
    });
  });
});
