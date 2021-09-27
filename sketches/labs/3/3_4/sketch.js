// 3-4
// Builds upon 3-3
// 1. User can add particle effect
// 2. No more than 30 particles at any given time
// 3. User selects emitter position when button is selected
// 4. Tool named P as button
// 5. Particles accelerate on Y-axis due to "gravity"
// 6. Color is user's selected color when emitter is created
// 7. "the drawing should support multiple particles" - does this mean emitters?
// 7. (con't) - if this just means particles, is supported by single emitter
// 7. (con't) - is this satisfied by allowing the user to choose particle color?
// 8. Each particle is tracked in an array and updated each frame
// 9. Each particle has a direction (vector) in Shape.js
// 10. direction is used to update particle positions
// 11. "gravity" is applied to the particle direction vector (faked to "look good")

const bgColor = 128;
const canvasHeight = 400, canvasWidth = 400;
const defaultScale = 5;
const fr = 30;
const spacing = 30;

let buttons = [];
let colours = [];
let drawables = [];
let modes = [];

// Control variables
let button, colour, drawable, keye, mode, particle, selected, deselected;

function setup() {
    createCanvas(canvasWidth, canvasHeight);
    background(bgColor);

    // Don't react to drags/releases that begin in a button
    button = false;

    // Define our drawing modes, or tools
    modes = ["square", "circle", "line", "particle"];

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
        buttons.push(new Button(spacing + (i + 1) * spacing, spacing,
            { height: spacing - 10, width: spacing - 10, colour: colours[i],
            strokeColour: deselected }));
        if (i === colour) {
            buttons[i].strokeColour = selected;
        }
    }

    // Generate the tool selection buttons
    for (let i = 0; i < modes.length; i++) {
        buttons.push(new Button(spacing, spacing + (i + 1) * spacing,
            { height: spacing - 10, width: spacing - 10,
            colour: color(200, 200, 200), strokeColour: deselected,
            text: modes[i].charAt(0) }));
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
            case "particle":
                break;
            case "square":
            case "circle":
            default:
                let distance = dist(mouseX, mouseY,
                    drawable.position.x,
                    drawable.position.y);
                if (distance >= defaultScale) {
                    drawable.scale = distance * 2;
                } else {
                    drawable.scale = defaultScale;
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
        case "particle":
             // From module: "a particle effect to their drawing. There should
             // only be 30 particles at any given time." From this, I'd infer
             // we only want one particle emitter at a time. Therefore, we'll
             // track and remove the old one.
            if (particle !== undefined) drawables.splice(particle, 1);

            // Set the current drawable as a particle emitter Shape
            drawable = new Shape(modes[mode], mouseX, mouseY,
                { scale: defaultScale, colour: colours[colour], weight: 0 });
            break;
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
            case "particle":
                // Store current length as index to remove for new particles
                particle = drawables.length;
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