const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 400;

// Game constants
const CHARACTER = { LRRH: 0, MOTHER: 1, GRANDMOTHER: 2 }
const MODE = { TITLE: 0, GAME: 1, OVER: 2 };
const TEXT = {
    TITLE: "little red riding hood",
    TITLE_SUB: "'x' to start",
    OVER: "red ran home",
    OVER_SUB: "'x' to replay",
    GOOD: "all is well",
    BAD: "grandma's sad",
}

// Player constants
const SPEED = 10;
const PLAYER_WIDTH = 10;
const STATES = { GAME: 0, TALKING: 1 };

// Input constants
const INPUT = { UP: 'w', DOWN: 's', LEFT: 'a', RIGHT: 'd', ADVANCE: 'x' }

// Game variables
let iterator, mode, player, subText, superText, timer, trees;
let characters = [];

// Sound variables
let wind, volume;

// Path variables
let paths = [];
let pathLength = 10;
var darkness = 0;

function preload() {
    volume = 0;
    wind = loadSound("Sounds/wind background noise 2.wav");
}

function setup() {
    createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    rectMode(CENTER);
    textAlign(LEFT);

    //Create the Path
    thePath = new Path()
    thePath.addLight(4, 40, 60);
    thePath.addLight(94, 68, 20);
    thePath.addLight(133, 32, 15, 255);
    thePath.addLight(153, 77, 20);
    thePath.addLight(211, 44, 25);
    thePath.addLight(244, 94, 15);
    thePath.addLight(219, 142, 20);
    thePath.addLight(260, 130, 15);
    thePath.addLight(209, 186, 12);
    thePath.addLight(146, 191, 20);
    thePath.addLight(66, 233, 35);
    thePath.addLight(80, 301, 20);
    thePath.addLight(131, 305, 14);
    thePath.addLight(156, 357, 25);
    thePath.addLight(211, 322, 15);
    thePath.addLight(255, 285, 20);
    thePath.addLight(286, 330, 14);
    thePath.addLight(306, 372, 12);
    thePath.addLight(385, 386, 55);

    // Create Mother NPC
    characters.push(new Mother(
        25,
        58,
        color(184, 169, 220)
    ));

    // Create Grandmother NPC
    characters.push(new Grandmother(
        374,
        365,
        color(222, 140, 190)
    ));

    // Create Player
    // Color selected using color picker on Molly Bang image
    player = new Player(12, 78, color(218, 34, 47));

    // Initialize our Game Mode to title screen
    mode = MODE.TITLE;

    // Initialize our global iterator to 0
    iterator = 0;

    // Initialize our ending timer
    timer = 0;

    // Initialize trees
    trees = new Trees();

    wind.setVolume(volume);

    superText = new Text(TEXT.TITLE,
        CANVAS_WIDTH / 2,
        CANVAS_HEIGHT / 2,
        4
    );

    subText = new Text(TEXT.TITLE_SUB,
        CANVAS_WIDTH / 2,
        CANVAS_HEIGHT * 3 / 4,
        4
    );

    // Initialize inputs array to parse held keys
    inputs = [];
    for (var key in INPUT) {
        inputs.push(INPUT[key]);
    }
    // Initialize held keys object
    keys = Object.create(null);
    inputs.forEach(value => keys[value] = false);
}

function reset() {
    player.reset();

    for(let character of characters) {
        character.reset();
    }
}

function update() {
    // Ambient sound
    volume = (volume < 1) ? volume + 0.02 : 1;
    wind.setVolume(volume);

    // Update timer for good/bad ending; reset from Mother
    timer += deltaTime;

    // Update darkness value from Path
    let light = thePath.isInLight(player.Position.x, player.Position.y);
    if (!light) {
        darkness++;
    } else if (light && darkness > 0) {
        darkness--;
    }

    // Pass player darkness value from Path to adjust lighting
    player.update(darkness);

    for(let character of characters) {
        character.update(player.Advance);
    }

    trees.update(player.Position);
}

function draw() {
    //console.log("x: "+ mouseX +  " y: " + mouseY)
    iterator++;

    switch (mode) {
        case MODE.TITLE:
            background(0);
            
            fill(218, 34, 47);
            textSize(20);
            superText.draw(iterator);
            if (superText.Done) {
                textSize(12);
                subText.draw(iterator);
            }

            // Change mode condition
            if (subText.Done && keys[INPUT.ADVANCE]) {
                mode = MODE.GAME;
                wind.loop();
            }
        break;
        case MODE.GAME:
            update();

            // Color selected using color picker on Molly Bang image
            background(184, 169, 220);

            // Draw the Path
            thePath.show();

            // Draw Characters behind the Player
            let front = [];
            for (let character of characters) {
                if (character.Position.y <= player.Position.y) {
                    character.draw();
                } else {
                    front.push(character);
                }
            }

            trees.drawRear(player.Position);

            // Draw the Player
            player.draw();

            // Draw Characters in front of the Player
            for (let character of front) {
                character.draw();
            }

            trees.drawFront();

            // Draw the Player's Light
            player.drawLight();

            // Separated say into a second loop so it always draws after chars/light
            for (let character of characters) {
                character.say();
            }

            // Change mode condition(s)
            if (player.Light === 0) {
                superText.setText(TEXT.OVER);
                subText.setText(TEXT.OVER_SUB);
                mode = MODE.OVER;
            }
        break;
        case MODE.OVER:
            background(0);

            fill(218, 34, 47);
            textSize(20);
            superText.draw(iterator);
            if (superText.Done) {
                textSize(12);
                subText.draw(iterator);
            }

            // Change mode condition
            if (subText.Done && keys[INPUT.ADVANCE]) {
                reset();
                mode = MODE.GAME;
            }
        break;
    }
}

function keyPressed() {
    if (keys[key] !== undefined) { keys[key] = true; }
}

function keyReleased() {
    if (keys[key] !== undefined) { keys[key] = false; }
}
