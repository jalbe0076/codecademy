let humanScore = 0;
let computerScore = 0;
let currentRoundNumber = 1;

const generateTarget = () => {
  return Math.floor(Math.random() * 10);
}

const compareGuesses = (playerGuess, compGuess, targetNum) => {
  const playerDiff = Math.abs(targetNum - playerGuess);
  const compDiff = Math.abs(targetNum - compGuess);

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