const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
  constructor(field = [[]]) {
    this.field = field;
    this.locationX = 0;
    this.locationY = 0;
    this.pastLocationX = 0;
    this.pastLocationY = 0;
    this.hardMode = false;
  }

  runGame() {
    let playing = true;
    this.gameRules();
    this.waitForKeypress();

    while(playing) {
      this.print();
      this.inputDirection();

      if(this.outOfBounds()) {
        console.log(`GAME OVER... \nYou're out of bounds!`);
        playing = false;
        break;
      } else if(this.isHole()) {
        console.log('GAME OVER... \nYou fell in a hole!');
        playing = false;
      } else if(this.findHat()) {
        console.log('CONGRATULATIONS!!! You found your hat!');
        playing = false;
      }

      this.field[this.pastLocationY][this.pastLocationX] = fieldCharacter;
      this.field[this.locationY][this.locationX] = pathCharacter;
    }
    process.exit();
  }

  activateHardMode(input) {
    if(input.trim().toLowerCase() === 'hard') this.hardMode = true;
  }

  findHat() {
    return this.field[this.locationY][this.locationX] === hat;
  }

  gameRules() {
    process.stdout.write("You(*) need to find your hat(^)!!! \nMake sure not to fall in a hole(O) and to stay on the field(░). \n'r' moves right  \n'u' moves up  \n'd' moves down  \n'l' moves left\n");
  }

  inputDirection() {
    this.pastLocationX = this.locationX;
    this.pastLocationY = this.locationY;
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

  outOfBounds() {
    return this.locationY < 0 || this.locationY >= this.field.length || this.locationX < 0 || this.locationX >= this.field[0].length;
  }

  print() {
    // clear the terminal using ANSI escape code
    process.stdout.write('\x1Bc')
    this.hardMode ? console.log('HARD mode activated! \nGAME FIELD:\n') : console.log('GAME FIELD:\n')

    const printField = this.field.map(row => {
      return row.join('');
    }).join('\n');
    console.log(printField);
  }

  waitForKeypress() {
    console.log(`Press any key to start game... Type 'hard' to activate hard mode.`);
    const input = prompt();
    this.activateHardMode(input)
    // return new Promise((res) => {
    //   process.stdin.once('data', () => {
    //     res()
    //   })
    // });
  }

  static generateField(height, width, holes = 0.1) {
    const field = [];

    for(let y = 0; y < height; y++) {
      field.push([]);
      for(let x = 0; x < width; x++) {
        const tileProbability = Math.random();
        field[y][x] = tileProbability > holes ? fieldCharacter : hole;
      }
    }

    field[0][0] = pathCharacter;
    const hatLocation = {
      x: Math.floor(Math.random() * width),
      y: Math.floor(Math.random() * height)
    }

    while(hatLocation.y === 0 && hatLocation.x === 0) {
      hatLocation.x = Math.floor(Math.random() * width)
      hatLocation.y = Math.floor(Math.random() * height)
    }
    field[hatLocation.y][hatLocation.x] = hat;

    return field;    
  }
}

const myField = new Field(Field.generateField(10, 10));


myField.runGame();