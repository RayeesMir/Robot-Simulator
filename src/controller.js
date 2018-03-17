const Robot = require('./robot');
const readline = require('readline');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
});
const chalk = require('chalk');
const log = console.log;
const table = { x: 4, y: 4 };
class Controller {

    /**
     * Creates an instance of Controller.
     * @param {Object} table 
     * @memberof Controller
     */
    constructor(table) {
        this.robot = null;
        this.robotOnline = false;
        this.table = table;
        this.validDirections = ["east", "west", "north", "south"];

        //Valid Instructionset
        this.instructionSet = ["place", "move", "right", "left", "report"];

        //Instruction Queue to store All Valid Instruction Issued
        this.instructionQueue = [];
        this.robot = new Robot(this.table);
    }

    /**
     * Loads instruction file 
     * @param {any} fileName 
     * @memberof Controller
     */
    loadInstructionFile(fileName) {
        this.startRobot();
        this.parseInstructionFile(fileName)
            .then((instructions) => {
                this.parseInstructions(instructions);
            })
            .catch((error) => {
                console.log(error);
            });

    }

    /**
     * Reads and Validates instruction file if instructions are passed in a file. 
     * @param {any} fileName 
     * @returns {Promise} Promise that return file content if resolved and error if rejected
     * @memberof Controller
     */
    validatorAndReadFile(fileName) {
        return new Promise((resolve, reject) => {
            if (fs.existsSync(fileName)) {
                const extension = path.extname(fileName);
                if (extension == ".txt") {
                    readFileAsync(fileName, { encoding: 'utf8' }).then((content) => resolve(content)).catch((error) => reject(error));
                } else {
                    reject(new TypeError("Simulator accepts only Text(.txt) files"));
                }
            } else {
                reject(new Error("File Doesn't Exists"));
            }
        });
    }

    /**
     * Parse Instruction file if instructions are passed in a file 
     * @param {any} fileName 
     * @returns {Promise} Promise that retuns promise Instruction if resolved and Error if rejected
     * @memberof Controller
     */
    parseInstructionFile(fileName) {
        return new Promise((resolve, reject) => {
            this.validatorAndReadFile(fileName)
                .then((content) => {
                    const instructions = content.split('\n');
                    resolve(instructions);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    /**
     * Parse Instructions passed in a file
     * @param {any} instructions 
     * @memberof Controller
     */
    parseInstructions(instructions) {
        instructions.forEach((ins) => {
            const instruction = this.parseInstruction(ins);
            if (instruction) {
                this.instructionQueue.push(instruction);
                this.executeInstructions();
            }
        });
    }

    /**
     * Parse instruction as per instruction
     * @param {any} instruction 
     * @returns 
     * @memberof Controller
     */
    parseInstruction(instruction) {
        const rawInstruction = instruction;
        instruction = instruction.split(" ");
        const command = instruction[0].toLowerCase();
        if (this.instructionSet.indexOf(command) != -1 && instruction.length <= 2) {
            if (command == 'place') {
                if (instruction.length == 2) {
                    return this.parsePlaceInstruction(rawInstruction);
                } else {
                    log(chalk.bgYellow("PLACE NEEDS ARGUMENTS, e.g PLACE X,Y,DIRECTION"));
                }
            } else {
                return {
                    instruction: command
                };
            }
        }
    }

    /**
     * Parse Place instruction as it has arguments
     * @param {any} instruction 
     * @returns {Object}
     * @memberof Controller
     */
    parsePlaceInstruction(instruction) {
        instruction = instruction.split(" ");
        const args = instruction[1].split(',');
        if (args[0] && args[1] && args[2]) {
            const x = parseInt(args[0], 10);
            const y = parseInt(args[1], 10);
            const direction = args[2].toLowerCase();
            if (this.validDirections.indexOf(direction) != -1) {
                if (!isNaN(x) && !isNaN(y)) {
                    return {
                        instruction: 'place',
                        arguments: {
                            x: x,
                            y: y,
                            direction: direction
                        }
                    };
                }
            } else {
                log(chalk.bgYellow("\n INVALID DIRECTION "));
            }
        }
    }

    /**
     * Executes Intruction in InstructionQueue when robot is online
     * @memberof Controller
     */
    executeInstructions() {
        //Ignore if robot is offline
        if (this.robot.online) {
            while (this.instructionQueue.length) {
                const ins = this.instructionQueue.shift();
                this.robot.execute(ins);
            }
        } else {
            log(chalk.bgCyan("\nINSTRUCTION IS CACHED AND WILL BE EXECUTED AFTER ROBOT IS ONLINE"));
        }
    }

    /**
     * Presents Prompt to user and reads instruction from that prompt linewise
     * @memberof Controller
     */
    loadCommondPrompt() {
        this.startRobot();
        rl.prompt(true);
        rl.on('line', (line) => {
            const instruction = this.parseInstruction(line);
            if (instruction) {
                this.instructionQueue.push(instruction);
                this.executeInstructions();
            }
            rl.prompt(true);
        });
    }

    /** 
     * Starts Robot after 5 seconds delay to simulate Robot offline requirement for bonus points
     * @memberof Controller
     */
    startRobot() {
        //start robot after 5 seconds delay
        log(chalk.bgYellowBright("\nROBOT IS OFFLINE FOR 5 SECONDS"));
        setTimeout(() => {
            log(chalk.bgYellowBright("\nROBOT IS ONLINE NOW"));
            if (this.instructionQueue.length) {
                log(chalk.bgYellow("\nEXECUTING CACHED INSTRUCTION..."));
            }
            this.robot.start();
            this.executeInstructions();
        }, 5000);
    }
}
module.exports = Controller;