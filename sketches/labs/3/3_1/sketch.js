// 3-1
// 1. Created a sketch that allows the user to place a square onto the canvas
// 2. Three options for colors- white, dark gray, black
// 3. Colors can be selected - chose to implement via 
// "a square that detects when the user clicks on it"
// 4. The selected color has a stroke that indicates it is selected
// 5. When the user clicks a shape is added to the canvas whose origin is the
// original mouse position
// 6. QUESTION ASKED IN CLASS - I don't think the assignment mentions scaling?
// But it was mentioned in class and I asked, so shapes scale from original
// position to mouseX/Y square width in mouseDragged
// 7. When the mouse is released the shape created in mousePressed is added to
// an array of shapes drawn every frame
// 8. The latest shapes are always drawn last

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
let button, colour, drawable, mode, selected, deselected;

function setup() {
    createCanvas(canvasWidth, canvasHeight);
    background(bgColor);

    // Don't react to drags/releases that begin in a button
    button = false;

    // Define our drawing modes, or tools
    modes = ["square"];

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

    // Nice to make rectangles and text draw from the center
    rectMode(CENTER);
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
    }

    // Draw buttons last so the user can't draw over them
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].draw();
    }
}

// Called from both mousePressed and keyPressed
function checkButtons() {

    // Parse buttons array for collision
    for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].checkCollision(mouseX, mouseY)) {
            if (i < colours.length) {
                if (colour != i) {
                    buttons[colour].strokeColour = deselected;
                    colour = i;
                    buttons[colour].strokeColour = selected;
                }
            }

            // If the initial click is a button, don't perform drag/release
            button = true;

            // If a button returns collision, end mousePressed
            return true;
        }
    }

    return false;
}

function mouseDragged() {
    // Check to see if the initial click was on a button
    if (!button) {

        // React appropriately to drawing mode
        switch (modes[mode]) {
            case "square":
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
        case "square":
        default:
            // drawables.push(new Shape(mode, mouseX, mouseY, 5, colour));
            // I think it would actually be easier to add the drawable
            // to the array now and then operate on it, but
            // hmm
            drawable = new Shape(square, mouseX, mouseY,
                { scale: defaultScale, colour: colours[colour], weight: 0 });
            break;
    }
}

function mouseReleased() {
    // Check to see if the initial click was on a button
    if (!button) {

        // React appropriately to the drawing mode
        switch (modes[mode]) {
            case "square":
            default:
                drawables.push(drawable);
                drawable = undefined;
                break;
        }
    }

    button = false;
}