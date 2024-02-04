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
    }
  };
};

const findInstanceById = (id) => {
  const instanceById = envelopes.find(instance => instance.id === id);
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
  const instanceIndex = findInstanceById(id);
  if (instanceIndex !== null) {
    envelopes.splice(instanceIndex, 1);
    return true;
  }
  return false;
};

envelopes.push(createEnvelope('groceries', 500));
envelopes.push(createEnvelope('dinning out', 300));

module.exports = {
  envelopes,
  createEnvelope,
  findInstanceById,
  deleteInstanceById
};