// 3-3
// Builds upon 3-2
// 1. Creates a tool that allows the user to draw a line by specifying a set of points.
// 2. A new point is added when the user clicks the canvas via mousePressed. 
// 3. A single shape consists of every point added while the tool is active.
// 4. A new shape is created by switching to a different tool.
// 5. BONUS: User may change the color per line-segment by selecting a color swatch.

const bgColor = 128;
const canvasHeight = 400, canvasWidth = 400;
const defaultScale = 5;
const fr = 30;

let buttons = [];
let colours = [];
let drawables = [];
let modes = [];

// Control variables
let button, colour, drawable, keye, mode, selected, deselected;

function setup() {
    createCanvas(canvasWidth, canvasHeight);
    background(bgColor);

    // Don't react to drags/releases that begin in a button
    button = false;

    // Define our drawing modes, or tools
    modes = ["square", "circle", "line"];

    // Set the default mode
    mode = 0;

    // Define our three colors
    colours = [color(255), color(100), color(0)];

    // Set the default color
    colour = 0;

    // Set the selected stroke color
    selected = color(255, 50, 50);

    // Set the deselected stroke color
    deselected = color(50, 50, 255);

    // Generate the three color selection buttons
    for (let i = 0; i < colours.length; i++) {
        buttons.push(new Button(30 + (i + 1) * 30, 30,
            { height: 20, width: 20, colour: colours[i],
            strokeColour: deselected }));
        if (i === colour) {
            buttons[i].strokeColour = selected;
        }
    }

    // Generate the tool selection buttons
    for (let i = 0; i < modes.length; i++) {
        buttons.push(new Button(30, 30 + (i + 1) * 30,
            { height: 20, width: 20, colour: color(200, 200, 200),
            strokeColour: deselected, text: modes[i].charAt(0) } ));
        if (i === mode) {
            buttons[colours.length + i].strokeColour = selected;
        }
    }

    // Nice to make rectangles and text draw from the center
    rectMode(CENTER);
    textAlign(CENTER, CENTER);
    textFont('Georgia');
}

function draw() {
    // Reset the background color to clear the canvas
    background(bgColor);

    // Draw the drawables from the drawables array
    for (let i = 0; i < drawables.length; i++) {
        drawables[i].draw();
    }

    // Draw the current drawable to meet the wording of the exercise:
    // "When the user clicks, a shape is added to the canvas whose origin is
    // the original mouse position. When the mouse is released, it is added to
    // an array of shapes that are drawn to the screen every frame."
    if (drawable !== undefined) {
        drawable.draw();

        if (modes[mode] === "line") {
            push();
            translate(drawable.position.x, drawable.position.y);
            strokeWeight(drawable.weight);
            stroke(colours[colour]);
            line(mouseX - drawable.position.x, mouseY - drawable.position.y,
                drawable.points[drawable.points.length - 1].x,
                drawable.points[drawable.points.length - 1].y);

            pop();
        }
    }

    // Draw buttons last so the user can't draw over them
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].draw();
    }
}

// Called from both mousePressed and keyPressed
function checkButtons() {

    // If key is undefined, parse for button clicks
    if (keye === undefined) {
        // Parse buttons array for collision
        for (let i = 0; i < buttons.length; i++) {
            if (buttons[i].checkCollision(mouseX, mouseY)) {
                if (i < colours.length) {
                    if (colour != i) {
                        buttons[colour].strokeColour = deselected;
                        colour = i;
                        buttons[colour].strokeColour = selected;
                    }
                } else {
                    if (mode != i - colours.length) {
                        if (drawable !== undefined && modes[mode] === "line") {
                            drawables.push(drawable);
                            drawable = undefined;
                        }
                        buttons[mode + colours.length].strokeColour = deselected;
                        mode = i - colours.length;
                        buttons[i].strokeColour = selected;
                    }
                }

                // If the initial click is a button, don't perform drag/release
                button = true;

                // If a button returns collision, end mousePressed
                return true;
            }
        }
    }

    // Parse modes (tools) section of buttons array for appropriate key press
    for (let i = colours.length - 1; i < buttons.length; i++) {
        if (buttons[i].text && buttons[i].text == keye) {
            if (mode != i - colours.length) {
                if (drawable !== undefined && modes[mode] === "line") {
                    drawables.push(drawable);
                    drawable = undefined;
                }
                buttons[mode + colours.length].strokeColour = deselected;
                mode = i - colours.length;
                buttons[i].strokeColour = selected;
            }
        }
    }

    // Clear the key so this doesn't return false positives on mousePresses
    keye = undefined;
    return false;
}

function mouseDragged() {
    // Check to see if the initial click was on a button
    if (!button) {

        // React appropriately to drawing mode
        switch (modes[mode]) {
            case "square":
            case "circle":
            default:
                let distance = dist(mouseX, mouseY,
                    drawable.position.x,
                    drawable.position.y);
                if (distance >= 5) {
                    drawable.scale = distance * 2;
                } else {
                    drawable.scale = 5;
                }
                break;
        }
    }
}

function mousePressed() {
    // Check for button collision
    if (checkButtons()) return;

    // React appropriately to drawing mode
    switch (modes[mode]) {
        case "line":
            // If we're already in line drawing mode, add a relative point
            if (drawable !== undefined && drawable.type === line) {
                drawable.points.push({ x: mouseX - drawable.position.x,
                    y: mouseY - drawable.position.y,
                    colour: colours[colour] });
            } else {
                // Else start a line Shape
                drawable = new Shape(line, mouseX, mouseY,
                    { weight: 5, strokeColour: colours[colour] });
            }
            break;
        case "square":
            // Ugh, Kluge- moved from below due to p5.js internal functions
            // returning an undefined name, and [managed code] in .toString()
            drawable = new Shape(square, mouseX, mouseY,
                { scale: defaultScale, colour: colours[colour], weight: 0 });
                break;
        case "circle":
        default:
            // drawables.push(new Shape(mode, mouseX, mouseY, 5, colour));
            // I think it would actually be easier to add the drawable
            // to the array now and then operate on it, but
            // hmm
            drawable = new Shape(circle, mouseX, mouseY,
                { scale: defaultScale, colour: colours[colour], weight: 0 });
            break;
    }
}

function mouseReleased() {
    // Check to see if the initial click was on a button
    if (!button) {

        // React appropriately to the drawing mode
        switch (modes[mode]) {
            case "line":
                // TODO ?
                break;
            case "circle":
            case "square":
            default:
                drawables.push(drawable);
                drawable = undefined;
                break;
        }
    }

    button = false;
}

function keyPressed() {
    // Right, right- necessary because p5.js retains last key pressed;
    // we reset this after use in checkButtons
    keye = key;
    checkButtons();
}