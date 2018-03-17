const Controller = require('./src/controller');

//define table size
const table = { x: 4, y: 4 };
const controller = new Controller(table);

const fileName = process.argv[2];

//load file if instruction are issued in a file else display prompt to user to issue command 

if (fileName) {
    controller.loadInstructionFile(fileName);
} else {
    controller.loadCommondPrompt();
}