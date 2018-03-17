const chalk = require("chalk");
const log = console.log;
class Robot {
    constructor(table) {
        this.direction = null;
        this.placed = false;
        this.online = null;
        this.position = {
            x: null,
            y: null
        };
        //Direction Map of Robot
        this.directionMap = {
            east: {
                left: "north",
                right: "south"
            },
            west: {
                left: "south",
                right: "north"
            },
            north: {
                left: "west",
                right: "east"
            },
            south: {
                left: "east",
                right: "west"
            }
        };
        //Operating Table Area
        this.table = {
            x: table.x,
            y: table.y
        };
    }

    /**
     *  Logs Message for User to Understand how robot is behaving 
     * @param {any} instruction 
     * @param {any} executed 
     * @param {any} outside 
     * @param {any} falling 
     * @memberof Robot
     */

    logger(instruction, notplaced, placedOutside, executed, falling) {
        let message;
        if (notplaced) {
            message = "\nINSRUCTION IGNORED ROBOT NOT PLACED YET";
        } else if (placedOutside) {
            message = "\nINSRUCTION IGNORED, PLACING OUTSIDE TABLE AREA";
        } else if (executed) {
            message = "\nEXECUTED INSRUCTION " + instruction;
        } else if (falling) {
            message = "\n" + instruction + " INSRUCTION IGNORED  ROBOT WILL FALL ";
        }
        log(chalk.bgYellow(message));
    }

    /**
     * Places the robot on table 
     * @param {Number} x 
     * @param {Number} y 
     * @param {String} direction 
     * @returns {Robot}
     * @memberof Robot
     */

    place(x, y, direction) {
        if (x > this.table.x || x < 0 || y > this.table.y || y < 0) {
            //instruction, notplaced, placedOutside, executed, falling 
            this.logger("PLACE", false, true);
            return this;
        }
        this.placed = true;
        this.position.x = x;
        this.position.y = y;
        this.direction = direction;
        log(chalk.bgYellow("\nEXECUTED INSRUCTION PLACE", x, y, direction.toUpperCase()));
        return this;
    }

    /**
     *  Changes the Facing direction of Robot to left
     * @returns {Robot}
     * @memberof Robot
     */

    left() {

        //Ignore if Robot is not placed
        if (!this.placed) {

            //instruction, notplaced, placedOutside, executed, falling 
            this.logger("LEFT", true);
            return this;
        }
        const currentDirection = this.direction;

        //Change Direction of Robot to the left of current direction
        this.direction = this.directionMap[currentDirection].left;

        //instruction, notplaced, placedOutside, executed, falling 
        this.logger("LEFT", false, false, true);
        return this;
    }

    /**
     * Changes the Facing direction of Robot to Right
     * @returns 
     * @memberof Robot
     */
    right() {

        //Ignore if Robot is not placed
        if (!this.placed) {
            this.logger("RIGHT", true);
            return this;
        }
        const currentDirection = this.direction;

        //Change Direction of Robot to the right of current direction            
        this.direction = this.directionMap[currentDirection].right;
        this.logger("RIGHT", false, false, true);
        return this;
    }

    /**
     * Moves Robot one unit in the facing direction
     * @returns 
     * @memberof Robot
     */
    move() {
        //Ignore if Robot is not placed
        if (!this.placed) {
            this.logger("MOVE", true);
            return this;
        }
        let x = this.position.x;
        let y = this.position.y;
        let falling;
        switch (this.direction) {
            case "north":
                y++;
                falling = (y > this.table.y);
                if (!falling) {
                    this.position = { x: x, y: y };
                    this.logger("MOVE", false, false, true);
                    return this;
                } else {
                    //for logging purpose
                    //instruction, notplaced, placedOutside, executed, falling 
                    this.logger("MOVE", false, false, false, true);
                }
                break;
            case "east":
                x++;
                falling = (x > this.table.x);
                if (!falling) {
                    this.position = { x: x, y: y };
                    //for logging purpose

                    this.logger("MOVE", false, false, true);
                    return this;
                } else {
                    //for logging purpose
                    //instruction, notplaced, placedOutside, executed, falling 
                    this.logger("MOVE", false, false, false, true);
                }
                break;
            case "south":
                y--;
                falling = y >= 0;
                if (falling) {
                    this.position = { x: x, y: y };
                    this.logger("MOVE", false, false, true);
                    return this;
                } else {
                    //for logging purpose
                    //instruction, notplaced, placedOutside, executed, falling 
                    this.logger("MOVE", false, false, false, true);
                }
                break;
            case "west":
                x--;
                falling = x >= 0;
                if (falling) {
                    this.position = { x: x, y: y };
                    this.logger("MOVE", false, false, true);
                    return this;
                } else {
                    //for logging purpose
                    //instruction, notplaced, placedOutside, executed, falling 
                    this.logger("MOVE", false, false, false, true);
                }
                break;
            default:
                break;
        }
        return this;
    }

    /**
     *  Reports Current Position and Facing Direction of the Robot.
     * @returns 
     * @memberof Robot
     */
    report() {
        if (!this.placed) {
            this.logger("RIGHT", true);
            return this;
        }
        //for logging purpose
        this.logger("REPORT", false, false, true);
        log(chalk.bgGreen("\n POSITION OF ROBOT ", [this.position.x, this.position.y, this.direction.toUpperCase()].join(",")));
        return this;
    }

    /**
     * Changes the status of Robot to online
     * @memberof Robot
     */
    start() {
        this.online = true;
    }

    /**
     * Changes status of Robot to offline
     * @memberof Robot
     */
    stop() {
        this.online = false;
        this.direction = null;
        this.position = {
            x: null,
            y: null
        };
    }

    /**
     * This executes instruction against robot
     * @param {Object} instruction
     * @memberof Robot
     */
    execute(instruction) {
        switch (instruction.instruction) {
            case "place":
                const { x, y, direction } = instruction.arguments;
                this.place(x, y, direction);
                break;
            case "left":
                this.left();
                break;
            case "right":
                this.right();
                break;
            case "move":
                this.move();
                break;
            case "report":
                this.report();
                break;
            default:
        }
    }
}
module.exports = Robot;