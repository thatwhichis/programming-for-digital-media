// 1. Create a simple game using processing
// 1 - Created simple game with generative mazes for the player to navigate.
// 2. Game should have multiple rounds and display some measure of progress
// 2 - Game shows player movement in maze in relation to visible target.
// 2 - Game makes progressively larger mazes as rounds progress.
// 3. Game can be as abstract as possible, and may address politic
// 3 - Mazes are an abstraction, I suppose?
// 4. Game should involve either:
//  4.a. Timing
//  4.b. An existing arcade game mechanic (e.g. pong)
//  4.c. Words (e.g. hangman, or a similar guessing game)
//  4.d. Moving an avatar around and receiving text
//  4.d - Maze is navigated by avatar and player receives text between rounds.

// This is a proto-creative project,
// one where you an experiment with some effect in a playful way

// There is no requirement to include a win condition,
// but there should be some involvement in the player

const COLOR = 127;
const CANVAS = 400;
// Only handles odd integers
const GRID = 7;
const MAX = 49;
const DIR = { LEFT: 0, UP: 1, RIGHT: 2, DOWN: 3 }
const INPUT = { UP: 'w', DOWN: 's', LEFT: 'a', RIGHT: 'd', ADVANCE: 'x' }
const MODES = { MAZE: 0, TEXT: 1 }
const STATE = { IDLE: 0, MOVING: 1 }
const TEXT = [
    "maze",
    "if at first you don't succeed",
    "you choose your ending",
    "it's okay to quit",
    "do you find mazes soothing?",
    "take your time",
    "there is no rush",
    "you have all the time in the world",
    "embrace the maze",
    "enjoy the journey"
]

let cell, inputs, keys, maze, mode, player, target, txt;

function setup () {
    createCanvas(CANVAS, CANVAS);
    background(COLOR);
    strokeWeight(0);
    textAlign(CENTER, CENTER);

    // Initialize maze
    maze = new Maze(GRID);

    // Initialize player
    player = {
        grid: createVector(1, 1),
        position: createVector(0, 0),
        target: createVector(1, 1),
        state: STATE.IDLE,
        color: 255
    };

    // Initialize target
    target = {
        grid: createVector(0, 0),
        position: createVector(0, 0),
        color: color(0, 230, 200)
    };

    // Initialize inputs array to parse held keys
    inputs = [];
    for (var key in INPUT) {
        inputs.push(INPUT[key]);
    }

    // Initialize held keys object
    keys = Object.create(null);
    inputs.forEach(value => keys[value] = false);

    // Initialize mode for title text
    mode = MODES.TEXT;

    // Initialize text to title text
    txt = 0;
}

function update() {

    // Check and dispatch input events for held keys
    if (keyIsPressed) {
        inputs.forEach(value => { if (keys[value]) { keyDown(value); }});
    }

    // Has the player reached the target?
    if (mode === MODES.MAZE &&
        player.grid.x === target.grid.x &&
        player.grid.y === target.grid.y) {
            // Set text to display to the player
            // 0 is title text; start random at 1
            txt = Math.floor(random(1, TEXT.length));
            mode = MODES.TEXT;
    }

    // Some kluge in here; probably worth refactor but wanted it done
    if (mode === MODES.MAZE && player.state === STATE.MOVING) {
        if (player.grid.x !== player.target.x ||
            player.grid.y !== player.target.y) {
            let targetX = player.target.x * cell + cell / 2;
            let targetY = player.target.y * cell + cell / 2;
            player.position.x += (targetX - player.position.x) * 0.25;
            player.position.y += (targetY - player.position.y) * 0.25;
            if (dist(targetX, targetY,
                player.position.x, player.position.y) < cell / 16) {
                player.grid = createVector(player.target.x, player.target.y);
                player.position = createVector(targetX, targetY);
                player.state = STATE.IDLE;
            }
        } else {
            player.state = STATE.IDLE;
        }
    }
}

function draw() {
    update();

    background(COLOR);

    if (mode === MODES.TEXT) {
        fill(0);
        textSize(18);
        text(TEXT[txt], CANVAS / 2, CANVAS / 2);

        textSize(12);
        text("press 'x' to advance", CANVAS / 2, CANVAS / 3 * 2)
    }
    else if (mode === MODES.MAZE) {
        // Draw Maze - have to because background resets for player
        fill(0);
        for (let y = 0; y < maze.Size; y++) {
            for (let x = 0; x < maze.Size; x++) {
                if (maze.Grid[y][x]) {
                    square(x * cell, y * cell, cell);
                }
            }
        }

        // Draw Tutorial in first level (first level is GRID + 2)
        if (maze.Size < GRID + 4) {
            fill(255);
            textSize(18);
            text("'w': up, 'a': left, 's': down, 'd': right", CANVAS / 2, cell / 2);
        }

        // Draw Target
        fill(target.color);
        // Target is drawn from CENTER, Maze from CORNER- set and then reset
        rectMode(CENTER);
        square(target.position.x, target.position.y, target.size);
        rectMode(CORNER);

        // Draw Player
        fill(player.color);
        circle(player.position.x,
            player.position.y,
            player.size
        );
    }
}

// Function to hadle player movement via player.target property
function movePlayer(dir) {
    if (player.state === STATE.IDLE){
        switch(dir) {
            case DIR.LEFT:
                if (!maze.Grid[player.grid.y][player.grid.x - 1]) {
                    player.target.x = player.grid.x - 1;
                    player.state = STATE.MOVING;
                }
                break;
            case DIR.UP:
                if (!maze.Grid[player.grid.y - 1][player.grid.x]) {
                    player.target.y = player.grid.y - 1;
                    player.state = STATE.MOVING;
                }
                break;
            case DIR.RIGHT:
                if (!maze.Grid[player.grid.y][player.grid.x + 1]) {
                    player.target.x = player.grid.x + 1;
                    player.state = STATE.MOVING;
                }
                break;
            case DIR.DOWN:
                if (!maze.Grid[player.grid.y + 1][player.grid.x]) {
                    player.target.y = player.grid.y + 1;
                    player.state = STATE.MOVING;
                }
                break;
            default:
                break;
        }
    }
}

// INPUT MANAGEMENT
// Replaced keyPressed event for held keys
function keyDown(keye) {
    if (mode === MODES.TEXT && keye === INPUT.ADVANCE) {
        mode = MODES.MAZE;
        shuffleMaze(); 
    } else if (mode === MODES.MAZE) {
        switch(keye) {
            case INPUT.UP:
                movePlayer(DIR.UP);
                break;
            case INPUT.DOWN:
                movePlayer(DIR.DOWN);
                break;
            case INPUT.LEFT:
                movePlayer(DIR.LEFT);
                break;
            case INPUT.RIGHT:
                movePlayer(DIR.RIGHT);
                break;
            default:
                break;
        }
    }
}

// keyPressed and keyReleased now just update a pressed keys object
function keyPressed() {
    if (keys[key] !== undefined) {
        keys[key] = true;
    }
}

function keyReleased() {
    if (keys[key] !== undefined) {
        keys[key] = false;
    }
}

// MAZE MANAGEMENT
function shuffleMaze() {
    // Increase the maze grid size and shuffle based on player grid position
    // (This could change but currently Size returns a vector/sets a number)
    // Maze maxes out at MAX to keep scale reasonable
    if (maze.Size < MAX) {
        maze.Size += 2;
    }
    maze.shuffle(player.grid.x, player.grid.y);

    // Reset the cell size based on maze size
    cell = CANVAS / maze.Size;

    // Set player size appropriate to the cell size and reposition
    player.size = cell * 0.66;
    player.position = createVector(
        player.grid.x * cell + cell / 2,
        player.grid.y * cell + cell / 2
    );

    // Kluge - part of solution to bug with player movement after reset
    player.target = createVector(player.grid.x, player.grid.y);

    // Calculate the maze end furthest from player as the crow flies
    let maxDistance = 0;
    for (let i = 0; i < maze.Ends.length; i++) {
        let end = maze.Ends[i];
        let targetDistance = dist(player.grid.x, player.grid.y, end.x, end.y);
        if ( targetDistance > maxDistance) {
            target.grid = end;
            target.position = createVector(end.x, end.y);
            // Hm, add takes an array but not a single value applied to all?
            target.position.mult(cell).add([cell / 2, cell / 2]);
            maxDistance = targetDistance;
        }
    }

    // Set target size appropriate to the cell size
    target.size = player.size;
}
