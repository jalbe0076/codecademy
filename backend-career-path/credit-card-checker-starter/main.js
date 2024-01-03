// All valid credit card numbers
const valid1 = [4, 5, 3, 9, 6, 7, 7, 9, 0, 8, 0, 1, 6, 8, 0, 8]
const valid2 = [5, 5, 3, 5, 7, 6, 6, 7, 6, 8, 7, 5, 1, 4, 3, 9]
const valid3 = [3, 7, 1, 6, 1, 2, 0, 1, 9, 9, 8, 5, 2, 3, 6]
const valid4 = [6, 0, 1, 1, 1, 4, 4, 3, 4, 0, 6, 8, 2, 9, 0, 5]
const valid5 = [4, 5, 3, 9, 4, 0, 4, 9, 6, 7, 8, 6, 9, 6, 6, 6]
const generated1 = [3, 7, 1, 4, 4, 9, 6, 3, 5, 3, 9, 8, 4, 3, 1]
const generated2 = [3, 7, 6, 6, 8, 0, 8, 1, 6, 3, 7, 6, 9, 6, 1]
const generated3 = [3, 6, 2, 5, 9, 6, 0, 0, 0, 0, 0, 0, 0, 4] 
const generated4 = [6, 3, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
const generated5 = [5, 0, 6, 3, 5, 1, 6, 9, 4, 5, 0, 0, 5, 0, 4, 7]

// All invalid credit card numbers
const invalid1 = [4, 5, 3, 2, 7, 7, 8, 7, 7, 1, 0, 9, 1, 7, 9, 5]
const invalid2 = [5, 7, 9, 5, 5, 9, 3, 3, 9, 2, 1, 3, 4, 6, 4, 3]
const invalid3 = [3, 7, 5, 7, 9, 6, 0, 8, 4, 4, 5, 9, 9, 1, 4]
const invalid4 = [6, 0, 1, 1, 1, 2, 7, 9, 6, 1, 7, 7, 7, 9, 3, 5]
const invalid5 = [5, 3, 8, 2, 0, 1, 9, 7, 7, 2, 8, 8, 3, 8, 5, 4]

// Can be either valid or invalid
const mystery1 = [3, 4, 4, 8, 0, 1, 9, 6, 8, 3, 0, 5, 4, 1, 4]
const mystery2 = [5, 4, 6, 6, 1, 0, 0, 8, 6, 1, 6, 2, 0, 2, 3, 9]
const mystery3 = [6, 0, 1, 1, 3, 7, 7, 0, 2, 0, 9, 6, 2, 6, 5, 6, 2, 0, 3]
const mystery4 = [4, 9, 2, 9, 8, 7, 7, 1, 6, 9, 2, 1, 7, 0, 9, 3]
const mystery5 = [4, 9, 1, 3, 5, 4, 0, 4, 6, 3, 0, 7, 2, 5, 2, 3]

// An array of all the arrays above
const batch = [valid1, valid2, valid3, valid4, valid5, invalid1, invalid2, invalid3, invalid4, invalid5, mystery1, mystery2, mystery3, mystery4, mystery5]
const batch2 = [generated1, generated2, generated3, generated4, generated5]


// Add your functions below:

const validateCred = (cardNums) => {
  let count = 0;
  let confirmMultiplier = 0;

  for (let i = cardNums.length - 1; i >= 0; i--) {

    if (confirmMultiplier) {
      let sumDigit = cardNums[i] * 2;
      sumDigit > 9 ? count += (sumDigit - 9) : count += sumDigit
      confirmMultiplier = 0;
    } else {
      count += cardNums[i];
      confirmMultiplier = 1;
    }
  }

  return count%10 === 0 ? true : false;
}

const findInvalidCards = (cards) => {
  return cards.reduce((acc, card) => {
    const validatedCard = validateCred(card);
    !validatedCard && acc.push(card);

    return acc;
  }, []);
}

const idInvalidCardCompanies = (invalidCards) => {
  const companies = [];
  const memo = {};

  invalidCards.forEach(card => {
    let cardCompany = '';

    switch(card[0]) {
      case 3:
        cardCompany = 'Amex';
        break;
      case 4:
        cardCompany = 'Visa';
        break;
      case 5:
        cardCompany = 'Mastercard';
        break;
      case 6:
        cardCompany = 'Discover';
        break;
      default:
        cardCompany = 'Company not found'
        break;
    }

    if (cardCompany in memo === false) {
      companies.push(cardCompany)
      memo[cardCompany] = card[0];
    }
  });

  return companies;
}

const convertString = (string) => {
  const cardNum = [];

  for (let i = 0; i < string.length; i++) {
    cardNum.push(parseInt(string[i]))
  }

  return cardNum;
}

console.log('convert string to num: ', convertString('5063516945005047'))
console.log('find invalid cards: ', idInvalidCardCompanies(findInvalidCards(batch)))
console.log('find invalid cards from generated numbers: ', idInvalidCardCompanies(findInvalidCards(batch2)))
console.log('check generated number 1: ', validateCred(generated1))
console.log('check generated number 2: ', validateCred(generated2))
console.log('check generated number 3: ', validateCred(generated3))
console.log('check generated number 4: ', validateCred(generated4))
console.log('check generated number 5: ', validateCred(generated5))
console.log('check valid number 1: ', validateCred(valid1))
console.log('check valid number 2: ', validateCred(valid2))
console.log('check valid number 3: ', validateCred(valid3))
console.log('check valid number 4: ', validateCred(valid4))
console.log('check valid number 5: ', validateCred(valid5))
console.log('check invalid number 1: ', validateCred(invalid1))
console.log('check invalid number 2: ', validateCred(invalid2))
console.log('check invalid number 3: ', validateCred(invalid3))
console.log('check invalid number 4: ', validateCred(invalid4))
console.log('check invalid number 5: ', validateCred(invalid5))
console.log('check mystery number 1: ', validateCred(mystery1))
console.log('check mystery number 2: ', validateCred(mystery2))
console.log('check mystery number 3: ', validateCred(mystery3))
console.log('check mystery number 4: ', validateCred(mystery4))
console.log('check mystery number 5: ', validateCred(mystery5))







