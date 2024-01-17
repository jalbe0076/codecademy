let idCounter = 13;

const getRandomElement = arr => {
  if (!Array.isArray(arr)) throw new Error('Expected an array');
  return arr[Math.floor(Math.random() * arr.length)];
}

const isObjectEmpty = (objectToCheck) => {
  return JSON.stringify(objectToCheck) === "{}";
};

const generateNewId = () => {
  return idCounter += 1;
}

module.exports = {
  getRandomElement,
  isObjectEmpty,
  generateNewId
};
