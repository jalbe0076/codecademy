let idCounter = 1;
const envelopes = [];

const createEnvelope = (title, budget, spent = 0) => {
  return {
    id: idCounter++,
    title,
    budget,
    spent,
    balance: budget - spent,

    updateSpend: function (amt) {
      if (amt <= this.balance) {
        this.spent += amt;
        this.updateBalance();
        return this;
      }
      return null;
    },

    updateBalance: function () {
      this.balance = this.budget - this.spent;
      return this;
    },

    updateBudget: function (amt) {
      this.budget += amt;
      this.updateBalance();
      return this;
    }
  };
};

const findInstanceById = (id) => {
  const instanceById = envelopes.find(instance => instance.id === parseInt(id));
  if (instanceById !== undefined) {
    return instanceById;
  }

  return null;
};

const findInstanceIndex = (id) => {
  const index = envelopes.findIndex(instance => instance.id === id);
  if (index !== -1) {
    return index;
  }

  return null;
}; 

const deleteInstanceById = (id) => {
  const instanceIndex = findInstanceIndex(id);
  if (instanceIndex !== null) {
    envelopes.splice(instanceIndex, 1);
    return true;
  }

  return false;
};

const transferBudget = (fromInstance, toInstance, transBalanceAmt) => {
  if(!transBalanceAmt) return false;

  if (transBalanceAmt <= fromInstance.balance) {
    fromInstance.budget = fromInstance.budget - transBalanceAmt;
    fromInstance.updateBalance();
    toInstance.budget = toInstance.budget + transBalanceAmt;
    toInstance.updateBalance();
    return {
      fromInstance,
      toInstance
    };
  }

  return false;
};

envelopes.push(createEnvelope('groceries', 500));
envelopes.push(createEnvelope('dinning out', 300));

// console.log(envelopes)
// transferBudget(1, 2, 100)
// console.log(envelopes)
module.exports = {
  envelopes,
  createEnvelope,
  findInstanceById,
  deleteInstanceById,
  transferBudget
};