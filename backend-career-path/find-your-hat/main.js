require('fs')

const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
  constructor(field) {
    this.field = field;
    this.locationX = 0;
    this.locationY = 0;
  }

  runGame() {
    let playing = true;
    this.gameRules();
    while(playing) {
      this.print();
      this.inputDirection();
      if(this.isHole()) {
        console.log('You fell in a hole!')
        playing = false;
      }
      this.field[this.locationY][this.locationX] = pathCharacter;
    }
  }

  inputDirection() {
    const direction = prompt('Which way? ');

    switch(direction) {
      case 'r': 
        this.locationX += 1;
        break;
      case 'l':
        this.locationX -= 1;
        break;
      case 'u': 
        this.locationY -= 1;
        break;
      case 'd':
        this.locationY += 1;
        break;
      default:
        console.log('Please enter r, l, d or u.');
        this.inputDirection();
        break;
    }
  }

  isHole() {
    return this.field[this.locationY][this.locationX] === hole;
  }

  gameRules() {
    process.stdout.write("You(*) need to find your hat(^)!!! \nMake sure not to fall in a hole(O) and to stay on the field(░). \n'r' moves right  \n'u' moves up  \n'd' moves down  \n'l' moves left \n\nGAME FIELD:\n")
  }

  print() {
    const printField = this.field.map(row => {
      return row.join('');
    }).join('\n');
    console.log(printField);
  }
}

const myField = new Field([
  ['*', '░', 'O'],
  ['░', 'O', '░'],
  ['░', '^', '░'],
]);


myField.runGame();