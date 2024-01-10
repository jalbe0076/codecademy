require('fs')

const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
  constructor(field) {
    this.field = field;
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

process.stdout.write(`You(*) need to find your hat(^)!!!
Make sure not to fall in a hole(O). 
'r' moves right
'u' moves up
'd' moves down
'l' moves left
Where do you want to move?\n`)
myField.print();