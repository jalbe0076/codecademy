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

  before('Mock DB setup', async () => {
    // create temporary tables and data
    await queryDatabase('CREATE TEMPORARY TABLE users (LIKE users INCLUDING ALL)');
    await queryDatabase('ALTER SEQUENCE users_id_seq RESTART WITH 1');
    await queryDatabase("INSERT INTO users (first_name, last_name) VALUES('Mark', 'Lane'), ('Jane', 'Doe')");

    await queryDatabase('CREATE TEMPORARY TABLE total_budget (LIKE total_budget INCLUDING ALL)');
    await queryDatabase("INSERT INTO total_budget (user_id, budget_limit) VALUES(1, 550), (2, 100)");

    await queryDatabase('CREATE TEMPORARY TABLE personal_budget (LIKE personal_budget INCLUDING ALL)');
    await queryDatabase('ALTER SEQUENCE personal_budget_id_seq RESTART WITH 1');
    await queryDatabase("INSERT INTO personal_budget (title, budget, spent, user_id) VALUES('Groceries', 200, 100, 1), ('Entertainment', 100, 0, 1), ('Education', 50, 0, 2)");

    // create temporary triggers
    await queryDatabase(`CREATE TRIGGER trigger_check_budget_limit_insert_test BEFORE INSERT ON personal_budget FOR EACH ROW EXECUTE FUNCTION check_budget_limit_test()`)
    await queryDatabase(` CREATE TRIGGER trigger_check_budget_limit_update_test BEFORE UPDATE ON personal_budget FOR EACH ROW WHEN ((new.budget IS DISTINCT FROM COALESCE(old.budget, new.budget))) EXECUTE FUNCTION check_budget_limit_test()`)
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
      assert.deepEqual(responseBody, expectedValuesUser1);
    });

    it('User 2 should get a list of different envelopes', async () => {
      const response = await request(app).get('/api/envelopes?user_id=2');
      assert.equal(response.status, 200);
      assert.match(response.headers['content-type'], /json/);

      const responseBody = response.body;
      assert.lengthOf(responseBody, 1);
      assert.isNotEmpty(responseBody);
      assert.containsAllDeepKeys(responseBody[0], expectedPersonalBudgetKeys);
      assert.deepEqual(responseBody, expectedValuesUser2);
    });

    it('If user ID does not exist, should receive an error object with a value of Invalid user ID', async () => {
      const response = await request(app).get('/api/envelopes?user_id=3');
      assert.equal(response.status, 400);
      assert.match(response.headers['content-type'], /json/);

      const responseBody = response.body;
      assert.isNotEmpty(responseBody);
      assert.deepEqual(responseBody, { error: 'Invalid user ID' });
    });
  });

  describe('GET /api/envelopes/:envId', () => {
    it('Validates that a proper id is passed in', async () => {
      const response = await request(app).get('/api/envelopes/e1')
      assert.equal(response.status, 400);
      assert.match(response.headers['content-type'], /json/);

      const responseBody = response.body;
      assert.isNotEmpty(responseBody);
      assert.deepEqual(responseBody, { error: 'Invalid envelope ID' });
    });

    it('User should get an envelope with a specific id', async () => {
      const response = await request(app).get('/api/envelopes/1')
      assert.equal(response.status, 200);
      assert.match(response.headers['content-type'], /json/);

      const responseBody = response.body;
      assert.isNotEmpty(responseBody);
      assert.containsAllDeepKeys(responseBody, expectedPersonalBudgetKeys);
      assert.deepEqual(responseBody, expectedValuesUser1[0]);
    });

    it('User should be informed if there is no envelope with that id', async () => {
      const response = await request(app).get('/api/envelopes/21')
      assert.equal(response.status, 404);
      assert.match(response.headers['content-type'], /json/);

      const responseBody = response.body;
      assert.isNotEmpty(responseBody);
      assert.deepEqual(responseBody, { error: 'Envelope with ID 21 not found' });
    });

    it('User should be informed if there is no envelope with that id for that user if it belongs to another user', async () => {
      const response = await request(app).get('/api/envelopes/3')
      assert.equal(response.status, 404);
      assert.match(response.headers['content-type'], /json/);

      const responseBody = response.body;
      assert.isNotEmpty(responseBody);
      assert.deepEqual(responseBody, { error: 'Envelope with ID 3 not found' });
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
      assert.deepEqual(responseBody, createdEnvelope);
    });

    it('Users should be able to create a new envelope without indicating a spent amount', async () => {
      const newEnvelope = { "title": "Education", "budget": 50 };
      const createdEnvelope = { "id": 5, "title": "Education", "budget": 50, "spent": 0, "balance": 50 };

      const response = await request(app)
        .post('/api/envelopes')
        .send(newEnvelope);

      assert.equal(response.status, 201);
      assert.match(response.headers['content-type'], /json/);

      const responseBody = response.body;
      assert.isNotEmpty(responseBody);
      assert.containsAllDeepKeys(responseBody, expectedPersonalBudgetKeys);
      assert.deepEqual(responseBody, createdEnvelope);
    });

    it('Users should be able to create a new envelope without proper data', async () => {
      const newEnvelope = { "name": "Education", "budget": 50 };

      const response = await request(app)
        .post('/api/envelopes')
        .send(newEnvelope);
      assert.equal(response.status, 400);
      assert.match(response.headers['content-type'], /json/);

      const responseBody = response.body;
      assert.isNotEmpty(responseBody);
      assert.containsAllDeepKeys(responseBody, 'error');
      assert.deepEqual(responseBody, { error: 'Invalid request' });
    });

    it('User 1 should get a different list of envelopes after some have been added and deleted', async () => {
      const newExpectedValuesUser1 = [
        { id: 1, title: 'Groceries', budget: 200, spent: 100, balance: 100 },
        { id: 2, title: 'Entertainment', budget: 100, spent: 0, balance: 100 },
        { id: 4, title: 'Gas', budget: 50, spent: 20, balance: 30 },
        { id: 5, title: 'Education', budget: 50, spent: 0, balance: 50 }
      ];
      const response = await request(app).get('/api/envelopes')
      assert.equal(response.status, 200);
      assert.match(response.headers['content-type'], /json/);

      const responseBody = response.body;
      assert.lengthOf(responseBody, 4)
      assert.isNotEmpty(responseBody);
      assert.containsAllDeepKeys(responseBody[0], expectedPersonalBudgetKeys);
      assert.deepEqual(responseBody, newExpectedValuesUser1);
    });

    // it('Users should not be able to create an envelope if it exceeds their budget limit', async () => {
    //   const newEnvelope = { "title": "Utilities", "budget": 2000 };
    //   const response = await request(app)
    //     .post('/api/envelopes')
    //     .send(newEnvelope);

    //   assert.equal(response.status, 400);
    //   assert.match(response.headers['content-type'], /json/);

    //   const responseBody = response.body;
    //   assert.isNotEmpty(responseBody);
    //   assert.deepEqual(responseBody, { error: 'Exceeded budget limit' });
    // });
  });

  describe('PUT /api/envelopes/:envId', () => {
    it('User should be able to update envelope by id', async () => {
      const updateEnvelope = { 'id': 1, 'title': 'Groceries', 'spend': 20 };
      const response = await request(app)
        .put('/api/envelopes/1')
        .send(updateEnvelope);

      assert.equal(response.status, 201);
      assert.match(response.headers['content-type'], /json/);

      const responseBody = response.body;
      assert.isNotEmpty(responseBody);
      assert.deepEqual(responseBody, { id: 1, title: 'Groceries', budget: 200, spent: 120, balance: 80 });
    });

    it('Inform user if the sent body ID does not match the params ID', async () => {
      const updateEnvelope = { 'id': 1, 'title': 'Groceries', 'spend': 20 };
      const response = await request(app)
        .put('/api/envelopes/2')
        .send(updateEnvelope);

      assert.equal(response.status, 400);
      assert.match(response.headers['content-type'], /json/);

      const responseBody = response.body;
      assert.isNotEmpty(responseBody);
      assert.deepEqual(responseBody, { error: 'URL ID does not match the envelope ID.' });
    });

    it('Expects the spend amount to by type number', async () => {
      const updateEnvelope = { 'id': 1, 'title': 'Groceries', 'spend': 'twenty' };
      const response = await request(app)
        .put('/api/envelopes/1')
        .send(updateEnvelope);

      assert.equal(response.status, 400);
      assert.match(response.headers['content-type'], /json/);

      const responseBody = response.body;
      assert.isNotEmpty(responseBody);
      assert.deepEqual(responseBody, { error: 'Please enter a number.' });
    });

    it('Informs if there is an unsufficient balance', async () => {
      const updateEnvelope = { 'id': 1, 'title': 'Groceries', 'spend': 81 };
      const response = await request(app)
        .put('/api/envelopes/1')
        .send(updateEnvelope);

      assert.equal(response.status, 400);
      assert.match(response.headers['content-type'], /json/);

      const responseBody = response.body;
      assert.isNotEmpty(responseBody);
      assert.deepEqual(responseBody, { error: 'Insufficient balance.' });
    });
  });

  describe('PUT /api/envelopes/:envId/budget', () => {
    it('User should be able to update envelope budget by id', async () => {
      const updateEnvelope = { 'id': 1, 'title': 'Groceries', 'newBudget': 220 };
      const response = await request(app)
        .put('/api/envelopes/1/budget')
        .send(updateEnvelope);

      assert.equal(response.status, 201);
      assert.match(response.headers['content-type'], /json/);

      const responseBody = response.body;
      assert.isNotEmpty(responseBody);
      assert.deepEqual(responseBody, { id: 1, title: 'Groceries', budget: 220, spent: 120, balance: 100 });
    });
  });

  describe('DELETE /api/envelopes/:envId', () => {
    it('User should be able to delete an envelope by id', async () => {
      const response = await request(app)
        .delete('/api/envelopes/1')

      assert.equal(response.status, 204);

      const responseBody = response.body;
      assert.isEmpty(responseBody);
    });

    it('A message is sent if an envelope is not found', async () => {
      const response = await request(app)
        .delete('/api/envelopes/1')

      assert.equal(response.status, 404);
      assert.match(response.headers['content-type'], /json/);

      const responseBody = response.body;
      assert.isNotEmpty(responseBody);
      assert.deepEqual(responseBody, { error: `Envelope with ID 1 not found` });
    });
  });

  describe('POST /api/envelopes/transfer/:from/:to', () => {
    it('A user should be able to transfer from one envelope to another', async () => {
      const transferBody = { 'fromEnvId': 2, 'toEnvId': 4, 'amount': 25 }
      const updatedEnvelopes = [
        { id: 2, title: 'Entertainment', budget: 75, spent: 0, balance: 75 },
        { id: 4, title: 'Gas', budget: 75, spent: 20, balance: 55 }
      ];

      const response = await request(app)
        .post('/api/envelopes/transfer/2/4')
        .send(transferBody);

      assert.equal(response.status, 201);
      assert.match(response.headers['content-type'], /json/);

      const responseBody = response.body;
      assert.isNotEmpty(responseBody);
      assert.containsAllDeepKeys(responseBody[0], expectedPersonalBudgetKeys);
      assert.deepEqual(responseBody, updatedEnvelopes);
    });

    it('URL ID must match the envelope ID and send an error message if it does not', async () => {
      const transferBody = { 'fromEnvId': 5, 'toEnvId': 4, 'amount': 25 }

      const response = await request(app)
        .post('/api/envelopes/transfer/2/4')
        .send(transferBody);

      assert.equal(response.status, 400);
      assert.match(response.headers['content-type'], /json/);

      const responseBody = response.body;
      assert.isNotEmpty(responseBody);
      assert.deepEqual(responseBody, { error: 'URL ID does not match the envelope ID.' });
    });

    it('Should check that a destination envelope exists and send message if it does not', async () => {
      const transferBody = { 'fromEnvId': 2, 'toEnvId': 44, 'amount': 25 }

      const response = await request(app)
        .post('/api/envelopes/transfer/2/44')
        .send(transferBody);

      assert.equal(response.status, 404);
      assert.match(response.headers['content-type'], /json/);

      const responseBody = response.body;
      assert.isNotEmpty(responseBody);
      assert.deepEqual(responseBody, { error: 'Destination envelope not found.' });
    });
  });

  describe('Database error handling ', () => {
    it('Users should not be able to create an envelope if it exceeds their budget limit', async () => {
      const newEnvelope = { "title": "Utilities", "budget": 2000 };
      const response = await request(app)
        .post('/api/envelopes')
        .send(newEnvelope);

      assert.equal(response.status, 400);
      assert.match(response.headers['content-type'], /json/);

      const responseBody = response.body;
      assert.isNotEmpty(responseBody);
      assert.deepEqual(responseBody, { error: 'Exceeded budget limit' });
    });



    it('Users should not be able to update an envelope budget if it exceeds their budget limit', async () => {
      const updateEnvelope = { 'id': 1, 'title': 'Groceries', 'newBudget': 2220 };
      const response = await request(app)
        .put('/api/envelopes/1/budget')
        .send(updateEnvelope);

      assert.equal(response.status, 400);
      assert.match(response.headers['content-type'], /json/);

      const responseBody = response.body;
      assert.isNotEmpty(responseBody);
      assert.deepEqual(responseBody, { error: 'Exceeded budget limit' });
    });
  });

  after('Clean up', async () => {
    await queryDatabase('DROP TRIGGER IF EXISTS trigger_check_budget_limit_insert_test ON personal_budget');
    await queryDatabase('DROP TRIGGER IF EXISTS trigger_check_budget_limit_update_test ON personal_budget');
  });
});
