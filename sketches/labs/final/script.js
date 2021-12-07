// Enumeration of buttons for ease of reference
const BUTTONS = { NEW_CONFLICT: 0, CONTINUE: 1 }
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 400;
// Energy constants used for win/lose conditions
const ENERGY_MIN = 0;
const ENERGY_MAX = 5;
// States in the battle
const MODES = { 
    SELECTION: 0,
    ANTAGONIST: 1,
    ANTAGONIST_REACTION: 2,
    PLAYER: 3,
    PROTAGONIST: 4,
    PROTAGONIST_REACTION: 5,
    RESOLUTION_LOSE: 6,
    RESOLUTION_WIN: 7,
}
// Must correspond to the number of enumerated character files in Characters
const NUM_CHARS = 3;
// Arbitrary, but instantiates maximum number of potential choices
const NUM_CHOICES_MAX = 3;

const TEXT_LOSE = "[noun1:#name1#]You lose. #noun1# is out of energy.";
const TEXT_WIN = "[noun1:#name1#]You win! #noun1# has maximum energy!";

// Character management variables
let actor, actee, antagonist, chars, charsSelectable, protagonist;
// Button management variables
let buttons, choices;
// Game/Aesthetic management variables
let mode, palette;
// Text management variables
let textCurrent, textOut, texts;

// Called before setup; holds until End Of Load
function preload() {
    // Initialize characters array
    chars = [];

    // Preload character attribute JSON files
    // 1, 1 type of for loop, ah-ah-ha
    for (let i = 0; i < NUM_CHARS; i++) {
        // Using callback, was having issue with passing undefined
        loadJSON('Characters/char' + (i + 1) + '.json', preloadCharacter);
    }

    // Preload sample JSON encounter text data
    texts = loadJSON('sampleTextData.json');
}

function preloadCharacter(json) {
    // Push each new character into the character array
    chars.push(new Character(json, ENERGY_MIN, ENERGY_MAX));
}

// Called once
function setup() {
    createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    rectMode(CENTER);
    textAlign(CENTER, CENTER);

    // Initialize buttons and choices arrays
    buttons = [];
    choices = [];

    // Initialize color palette (done here so p5.js color function is available)
    palette = [
        color(170, 170, 170),
        color(155, 188, 15),
        color(139, 172, 15),
        color(48, 98, 48),
        color(15, 56, 15),
    ]

    // Set button/choice defaults
    let defaults = {
        width: 150,
        height: 20,
        color: palette[1],
        strokeColor: palette[2],
        strokeColorHover: palette[3],
        strokeColorPressed: palette[4],
        text: "text",
        textColor: palette[4]
    };

    // Create New Conflict button
    buttons.push(new Button(Rect, 50, 25, reset,
        {
            ...defaults,
            width: 75,
            text: "New Conflict"
        }
    ));

    // Create Continue button and disable initially
    buttons.push(new Button(Rect, CANVAS_WIDTH - 50, CANVAS_HEIGHT - 25, cont,
        {
            ...defaults,
            width: 75,
            text: "Continue"
        }
    ));
    buttons[BUTTONS.CONTINUE].Visible = false;

    // Create maximum number of choice buttons
    for (let i = 0; i < NUM_CHOICES_MAX; i++) {
        choices.push(new Button(Rect,
            90,
            CANVAS_HEIGHT * 3 / 4 + (i * 30),
            choice,
            {
                ...defaults,
                text: (i + 1).toString(),
                args: i
            }
        ));
    }

    // Set initial state
    reset();
}


// Called at the beginning of every draw frame
function update() {
    // 2, 2 types of for loop, ah-ah-ha
    for (let button of buttons) {
        button.update();
    }

    for (let choice of choices) {
        choice.update();
    }
}

// Called every frame
function draw() {
    update();

    // Redraw the background
    background(palette[0])

    // Draw primary game text output
    fill(palette[4]);
    if (textOut !== undefined) {
        text(textOut, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2,
            CANVAS_WIDTH, CANVAS_HEIGHT / 2);
    }

    // Draw antagonist/protagonist properties if roles are defined
    if (antagonist !== undefined) antagonist.draw();
    if (protagonist !== undefined) protagonist.draw();

    // Draw buttons and choices
    for (let button of buttons) {
        button.draw();
    }

    for (let choice of choices) {
        choice.draw();
    }
}

// Callback Choice
// Sets properties based on user input and resolves text accordingly
function choice(choice) {
    switch(mode) {
        case MODES.PLAYER:
            // Set new current text based on player input
            textCurrent = texts[textCurrent].choices[choice].clickTo;

            // Set the appropriate actor/actee for text resolution
            actor = protagonist;
            actee = antagonist;

            // Move into protagonist mode
            mode = MODES.PROTAGONIST;
        break;
        case MODES.SELECTION:
        default:
            // Set protagonist based on player choice
            protagonist = charsSelectable[choice];
            protagonist.Role = Character.ROLES.PROTAGONIST;

            // actor already set in reset function
            actee = protagonist;

            // Hand control off to player
            mode = MODES.PLAYER;
        break;
    }

    resolveText();
}

// Callback Continue
// Advances mode and resolves text accordingly
function cont() {
    switch(mode) {
        case MODES.ANTAGONIST:
            resolveCharacterEffects();

            mode = MODES.PROTAGONIST_REACTION;
        break;
        case MODES.ANTAGONIST_REACTION:
            if (checkEndConditions()) break;

            // TODO- work on this algorithm; make chance based on properties
            // Basically antagonist is choosing their action and moving through
            // execution in a manner similar to player
            let choice = Math.floor(random(texts[textCurrent].choices.length));
            textCurrent = texts[textCurrent].choices[choice].clickTo;

            actor = antagonist;
            actee = protagonist;

            mode = MODES.ANTAGONIST;
        break;
        case MODES.PROTAGONIST:
            resolveCharacterEffects();

            mode = MODES.ANTAGONIST_REACTION;
        break;
        case MODES.PROTAGONIST_REACTION:
            if (checkEndConditions()) break;

            mode = MODES.PLAYER;
        break;
    }

    resolveText();
}

// Negative helps extroverts, positive helps introverts
function calculateDelta(introversion, current) {
    // Zeroize introversion characteristic- 0 - 2 maps to -1 - 1
    introversion--;

    // Return value modified IAW introversion
    return (introversion === 0) ? current : current * introversion;
}

// Checks end conditions on pro/antagonist; returns true if met, false otherwise
// Prefers winning to losing and protagonist to antagonist
function checkEndConditions() {
    let win = protagonist.checkWinCondition();
    if (win || antagonist.checkWinCondition()) {
        mode = MODES.RESOLUTION_WIN;
        actor = win ? protagonist : antagonist;
        return true;
    }

    let lose = protagonist.checkLoseCondition();
    if (lose || antagonist.checkLoseCondition()) {
        mode = MODES.RESOLUTION_LOSE;
        actor = lose ? protagonist : antagonist;
        return true;
    }

    return false;
}

// Resets the scene to an initial state and sets an approacing antagonist
function reset() {
    // Take us back to our initial state and textCurrent
    mode = MODES.SELECTION;
    textCurrent = '000000';

    // Reset the selectable character array
    charsSelectable = [];
    for (let i = 0; i < chars.length; i++) {
        // While we're iterating, go ahead and reset the characters
        chars[i].reset();
        charsSelectable.push(chars[i]);
    }

    // Select an approaching antagonist
    let selection = Math.floor(random(chars.length));
    antagonist = chars[selection];
    antagonist.Role = Character.ROLES.ANTAGONIST;
    actor = antagonist;
    protagonist = undefined;

    // Splice out the antagonist from the selectable characters
    charsSelectable.splice(selection, 1);

    // Kick off approaching text
    resolveText();
}

// Sets buttons states based on mode
function resolveButtonStates() {
    switch(mode) {
        case MODES.PLAYER:
            let currentChoices = texts[textCurrent].choices;
            if (currentChoices !== undefined) {
                // 3, 3 types of for loop, ah-ah-ha
                choices.forEach((choice, i) => {
                    if (i < currentChoices.length) {
                        choice.Text = actee.getText(currentChoices[i].content,
                            { "name2": [actor.Name] });
                        choice.Visible = true;
                    } else {
                        choice.Visible = false;
                    }
                });

                buttons[BUTTONS.CONTINUE].Visible = false;
            }
        break;
        case MODES.RESOLUTION_LOSE:
        case MODES.RESOLUTION_WIN:
            buttons[BUTTONS.CONTINUE].Visible = false;
        break;
        case MODES.SELECTION:
            choices.forEach((choice, i) => {
                if (i < charsSelectable.length) {
                    choice.Text = charsSelectable[i].Name;
                    choice.Visible = true;
                } else {
                    choice.Visible = false;
                }
            });
        break;
        case MODES.ANTAGONIST:
        case MODES.ANTAGONIST_REACTION:
        case MODES.PROTAGONIST:
        case MODES.PROTAGONIST_REACTION:
            for (let choice of choices) {
                choice.Visible = false;
            }
            buttons[BUTTONS.CONTINUE].Visible = true;
        break;
    }
}

// Calculate and apply character effects based on textCurrent and actor/actee
function resolveCharacterEffects() {
    let self = texts[textCurrent].self;
    if (self !== undefined) {
        actor.Energy += calculateDelta(actor.Introversion, self);
    }

    let other = texts[textCurrent].other;
    if (other !== undefined) {
        actee.Energy += calculateDelta(actee.Introversion, other);
    }
}

// Sets main textOut based on mode
function resolveText() {
    let obj;
    if (actee !== undefined) {
        obj = {
            "name2": [actee.Name]
        }
    }

    switch(mode) {
        case MODES.ANTAGONIST:
        case MODES.PROTAGONIST:
        case MODES.SELECTION:
            textOut = actor.getText(texts[textCurrent].action, obj);
        break;
        case MODES.ANTAGONIST_REACTION:
        case MODES.PLAYER:
        case MODES.PROTAGONIST_REACTION:
            textOut = actor.getText(texts[textCurrent].reaction, obj);
        break;
        case MODES.RESOLUTION_LOSE:
            textOut = actor.getText(TEXT_LOSE);
        break;
        case MODES.RESOLUTION_WIN:
            textOut = actor.getText(TEXT_WIN);
        break;
    }

    resolveButtonStates();
}

// UI stuff down here
function mousePressed() {
    for (let button of buttons) {
        button.mousePressed();
    }

    for (let choice of choices) {
        choice.mousePressed();
    }
}

function mouseReleased() {
    for (let button of buttons) {
        button.mouseReleased();
    }

    for (let choice of choices) {
        choice.mouseReleased();
    }
}
