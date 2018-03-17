# Robot Simulator 

Simulation of a robot moving on a square tabletop of dimensions 5 units x 5 units. The robot is free to roam around the surface of the table without any obstructions. Any instruction that would result in the robot falling from the table must be ignored, Simulator is written in Node.js. 

## Instructions Descriptions 

Simulattor can accepts instruction via command prompt with one command per line or we can pass instruction file. Valid instruction details are as.

-  **PLACE X, Y, DIRECTION:**  Place the robot on the table on position (x,y) with facing direction f.The origin (0,0) is considered to be the SOUTH WEST most corner.First valid instruction to the robot is PLACE, All instrucion to robot will be ignored untill a valid PLACE instruction is issued. After issuing valid place instruction any sequence of instruction can be issued including another PLACE instruction.

- **MOVE:** Move the robot one unit in the facing direction.

- **LEFT:** rotates the robot by 90 degrees in the specified direction without changing the position of the robot.

- **RIGHT:** Turn the robot right, changes direction of robot by 90 degrees from it current facing direction.

- **REPORT:** Report announces the current position and direction of the robot.

Example 1

Input:

 ```
    PLACE 0,0,NORTH 
    MOVE 
    REPORT
```
Output: `0,1,NORTH`

Example 2

Input:
```
    PLACE 0,0,NORTH 
    LEFT
    REPORT
```

Output: `0,0,WEST`

Example 3

Input:
```
    PLACE 1,2,EAST
    MOVE
    MOVE
    LEFT
    MOVE
    REPORT
``` 

Output: `3,3,NORTH`

  Node LTS version

## Installation & Usage

1. Clone repoistory.
2. CD into the directory.
3. run `npm install`
4. run `npm start` or `node index.js`

Simulator accepts instruction via  command prompt or via .txt file. 

```npm start or node index.js```

```npm start instructions.txt or node index.js instructions.txt```

## Technology

* Node LTS version(8.10.0)
* Mocha and Chai for Testing

## Tests
    
```npm test```

Test data is provided inside files under data directory.you can directly pass files as parameter to simulator. `node index.js filename`

