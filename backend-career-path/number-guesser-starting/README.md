# Challenge Project: Number Guesser

## Project Goals
In this project, you’ll write JavaScript functions to power a small guessing game. Your code will run in the browser instead of the terminal, and you can use your browser’s console to help you test your functions and view any syntax errors.

## Project Requirements
In this project, you’ll write four functions in script.js. We’ve provided some additional JavaScript code in game.js that will call your functions based on user interactions, but you don’t need to look at game.js and shouldn’t edit it if you want your project to work as intended. As you complete this project, make sure that all of your functions are named exactly as specified within these tasks so that they can be called correctly when the game is played. In this project, your JavaScript functions are incorporated into a website that also uses HTML/CSS. 

## Tasks

- [x] 1. Create a generateTarget() function. This function should return a random integer between 0 and 9.

  The purpose of this function is to be called at the start of each new round in order to generate the new secret target number.

- [x] 2. Create a compareGuesses() function. This function:
  - Has three parameters representing the user (human) guess, a computer guess, and the secret target number to be guessed.
  - Determines which player (human or computer) wins based on which guess is closest to the target. If both players are tied, the human user should win.
  - Return true if the human player wins, and false if the computer player wins.

  The purpose of this function is to be called each round to determine which guess is closest to the target number.


- [x] 3. Create an updateScore() function. This function:
  - Has a single parameter. This parameter will be a string value representing the winner.
  - Increases the score variable (humanScore or computerScore) by 1 depending on the winner passed in to updateScore. The string passed in will be either 'human' or 'computer'.
  - Does not need to return any value.

  The purpose of this function is to be used to correctly increase the winner’s score after each round.

- [x] 4. Create an advanceRound() function. This function should increase the value of currentRoundNumber by 1.

  The purpose of this function is to be used to update the round number after each round.

  After completing advanceRound(), your Number Guesser game should be fully operational. You should be able to make guesses, see your or the computer score increase correctly, move to the next round, and see the correct round displayed.

- [x] 5. Test that your code is working properly by invoking your newly written functions within script.js with sample inputs. You can delete this code once you’re convinced that everything is working as it should.

- [x] 6. Great work! If you’d like to see the solution, move to the next task. If you’d like to extend your project on your own, you could consider the following:
  - You probably calculated the distance from the computer guess to the target and from the human guess to the target. Move this into a separate getAbsoluteDistance() function that takes two numbers and returns the distance, and then use that inside your compareGuesses() function.
  - Add functionality to check whether the user guess is between 0 and 9 and alert() the user that their number is out of range. It’s not possible to set a number outside this range with the + and - buttons, but users can do so by typing directly in the input field.
