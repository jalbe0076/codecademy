import { assert } from 'chai';
import { queryDatabase } from '../../db/queries.js';
import app from '../../server.js';
import request from 'supertest';

describe(`Envelope tests`, () => {
  const expectedPersonalBudgetKeys = ['id', 'title', 'budget', 'spent', 'balance'];
  const expectedValuesUser1 = [
    { id: 1, title: 'Groceries', budget: 200, spent: 100, balance: 100 },
    { id: 2, title: 'Entertainment', budget: 100, spent: 0, balance: 100 }
  ];
  const expectedValuesUser2 = [{ id: 3, title: 'Education', budget: 50, spent: 0, balance: 50 }];
  const noEnvelopes = [];

  before('Mock DB setup', async () => {
    await queryDatabase('CREATE TEMPORARY TABLE users (LIKE users INCLUDING ALL)');
    await queryDatabase('ALTER SEQUENCE users_id_seq RESTART WITH 1');
    await queryDatabase("INSERT INTO users (first_name, last_name) VALUES('Mark', 'Lane'), ('Jane', 'Doe')");
    await queryDatabase('CREATE TEMPORARY TABLE total_budget (LIKE total_budget INCLUDING ALL)');
    await queryDatabase("INSERT INTO total_budget (user_id, budget_limit) VALUES(1, 400), (2, 100)");
    await queryDatabase('CREATE TEMPORARY TABLE personal_budget (LIKE personal_budget INCLUDING ALL)');
    await queryDatabase('ALTER SEQUENCE personal_budget_id_seq RESTART WITH 1');
    await queryDatabase("INSERT INTO personal_budget (title, budget, spent, user_id) VALUES('Groceries', 200, 100, 1), ('Entertainment', 100, 0, 1), ('Education', 50, 0, 2)");
  });

  describe('GET /api/envelopes', () => {
    it('User 1 should get a list of envelopes belonging to them', async () => {
      const response = await request(app).get('/api/envelopes')
      assert.equal(response.status, 200);
      assert.match(response.headers['content-type'], /json/);
  
      const responseBody = response.body;
      assert.lengthOf(responseBody, 2)
      assert.isNotEmpty(responseBody);
      assert.containsAllDeepKeys(responseBody[0], expectedPersonalBudgetKeys);
      assert.deepEqual(response.body, expectedValuesUser1);
    });
  
    it('User 2 should get a list of different envelopes', async () => {
      const response = await request(app).get('/api/envelopes?user_id=2');
      assert.equal(response.status, 200);
      assert.match(response.headers['content-type'], /json/);
  
      const responseBody = response.body;
      assert.lengthOf(responseBody, 1);
      assert.isNotEmpty(responseBody);
      assert.containsAllDeepKeys(responseBody[0], expectedPersonalBudgetKeys);
      assert.deepEqual(response.body, expectedValuesUser2);
    });
  
    it('If user ID does not exist, should receive an error object with a value of Invalid user ID', async () => {
      const response = await request(app).get('/api/envelopes?user_id=3');
      assert.equal(response.status, 400);
      assert.match(response.headers['content-type'], /json/);
  
      const responseBody = response.body;
      assert.isNotEmpty(responseBody);
      assert.deepEqual(response.body, { error: 'Invalid user ID' });
    });
  });

  describe('POST /api/envelopes', () => {
    it('Users should be able to create a new envelope', async () => {
      const newEnvelope = { "title": "Gas", "budget": 50, "spent": 20 };
      const createdEnvelope = { "id": 4, "title": "Gas", "budget": 50, "spent": 20, "balance": 30 };

      const response = await request(app)
        .post('/api/envelopes')
        .send(newEnvelope);

      assert.equal(response.status, 201);
      assert.match(response.headers['content-type'], /json/);
  
      const responseBody = response.body;
      assert.isNotEmpty(responseBody);
      assert.containsAllDeepKeys(responseBody, expectedPersonalBudgetKeys);
      assert.deepEqual(response.body, createdEnvelope);
    });
  });
});
