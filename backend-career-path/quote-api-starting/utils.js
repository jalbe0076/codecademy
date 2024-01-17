const getRandomElement = arr => {
  if (!Array.isArray(arr)) throw new Error('Expected an array');
  return arr[Math.floor(Math.random() * arr.length)];
}

const isObjectEmpty = (objectToCheck) => {
  return JSON.stringify(objectToCheck) === "{}";
};

module.exports = {
  getRandomElement,
  isObjectEmpty
};
