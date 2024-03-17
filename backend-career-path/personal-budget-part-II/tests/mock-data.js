const envelopesMockData = [
  { id: 1, title: 'Groceries-test', budget: 200, spent: 0, total_budget_id: 1, user_id: 1 },
  { id: 2, title: 'Utilities-test', budget: 150, spent: 0, total_budget_id: 1, user_id: 1 },
  { id: 3, title: 'Entertainment-test', budget: 100, spent: 50, total_budget_id: 1, user_id: 1 },
  { id: 4, title: 'Transportation-test', budget: 100, spent: 20, total_budget_id: 2, user_id: 2 },
  { id: 5, title: 'Education-test', budget: 150, spent: 75, total_budget_id: 2, user_id: 2 }
];

const totalBudgetMockData = [
  { id: 1, user_id: 1, budget_limit: 500 },
  { id: 2, user_id: 2, budget_limit: 1500 }
];

const usersMockData = [
  { id: 1, first_name: 'John', last_name: 'Doe' },
  { id: 2, first_name: 'Jane', last_name: 'Smith' }
];

module.exports = {
  envelopesMockData,
  totalBudgetMockData,
  usersMockData
};