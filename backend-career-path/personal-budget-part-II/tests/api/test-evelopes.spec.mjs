import { queryDatabase } from '../../db/queries.js';

describe(`Envelope tests`, () => {
  before('Mock DB setup', async () => {
    await queryDatabase('CREATE TEMPORARY TABLE users (LIKE users INCLUDING ALL)');
    await queryDatabase("INSERT INTO users (first_name, last_name) VALUES('Mark', 'Lane'), ('Jane', 'Doe')");
    await queryDatabase('CREATE TEMPORARY TABLE total_budget (LIKE total_budget INCLUDING ALL)');
    await queryDatabase("INSERT INTO total_budget (user_id, budget_limit) VALUES(1, 300), (2, 100)");
    await queryDatabase('CREATE TEMPORARY TABLE personal_budget (LIKE personal_budget INCLUDING ALL)');
    await queryDatabase("INSERT INTO personal_budget (title, budget, spent, user_id) VALUES('Groceries', 200, 100, 1), ('Entertainment', 100, 0, 1), ('Education', 50, 0, 2)");
  });
});
