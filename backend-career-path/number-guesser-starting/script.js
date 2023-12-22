let humanScore = 0;
let computerScore = 0;
let currentRoundNumber = 1;

const generateTarget = () => {
  return Math.floor(Math.random() * 10);
}

const getAbsoluteDistance = (num1, num2) => {
  return Math.abs(num1 - num2);
}

const compareGuesses = (playerGuess, compGuess, targetNum) => {
  const playerDiff = getAbsoluteDistance(targetNum, playerGuess);
  const compDiff = getAbsoluteDistance(targetNum, compGuess);

  if (playerGuess === compGuess || playerDiff < compDiff) {
    return true;
  } else {
    return false;
  }
}

const updateScore = (winner) => {
  if (winner === 'human') {
    humanScore += 1;
  } else {
    computerScore += 1;
  }
}

const advanceRound = () => {
  return currentRoundNumber += 1;
}