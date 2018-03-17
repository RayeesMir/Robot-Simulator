const expect = require('chai').expect;
const Robot = require('../src/robot');
const Controller = require('../src/controller');
const table = { x: 4, y: 4 };

describe('Testing Robot', function() {

    let robot;
    let stub;
    let controller;
    beforeEach(function() {
        robot = new Robot(table);
        controller = new Controller(table);
    });

    it('should place a robot correctly on cordinates on the table', function() {
        robot = robot.place(0, 1, 'north');
        expect(robot.placed).to.be.true;
        expect(robot.position).to.deep.equal({ x: 0, y: 1 });
        expect(robot.direction).to.equal('north');
    });

    it('should change direction to the right when right command is issued', function() {
        robot = robot.place(0, 1, 'north');
        robot = robot.right();
        expect(robot.position).to.deep.equal({ x: 0, y: 1 });
        expect(robot.direction).to.equal('east');
    });

    it("should change direction to the left when left command is issued", function() {
        robot = robot.place(0, 1, 'east');
        robot = robot.left();
        expect(robot.position).to.deep.equal({ x: 0, y: 1 });
        expect(robot.direction).to.equal('north');
    });

    it('should move specfied number of steps when move command is issued', function() {
        robot = robot.place(0, 1, 'east');
        robot = robot.move();
        robot = robot.move();
        expect(robot.position).to.deep.equal({ x: 2, y: 1 });
        expect(robot.direction).to.equal('east');
    });

    it('should ignore any place command that is outside table', function() {
        robot = robot.place(5, 5, 'east');
        expect(robot.placed).to.be.false;
        expect(robot.position).to.deep.equal({ x: null, y: null });
        expect(robot.direction).to.equal(null);
    });

    it('should ignore all instructions before the first place command', function() {
        robot = robot.left();
        robot = robot.move();
        robot = robot.place(0, 0, 'south');
        expect(robot.position).to.deep.equal({ x: 0, y: 0 });
        expect(robot.direction).to.equal('south');
    });

    it('should ignore all instructions that leads robot fall off the table', function() {
        robot = robot.place(4, 4, 'north');
        robot = robot.move();
        robot = robot.right();
        robot = robot.move();
        expect(robot.position).to.deep.equal({ x: 4, y: 4 });
        expect(robot.direction).to.equal('east');

    });

    it('should parse place instruction correctly', function() {
        const instruction = controller.parsePlaceInstruction("place 1,1,east");
        expect(instruction.arguments).to.deep.equal({ x: 1, y: 1, direction: 'east' });
        expect(instruction.instruction).equal('place');
    });

});