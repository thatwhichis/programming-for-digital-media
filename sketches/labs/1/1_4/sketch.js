const size = 401;
const color = 100;
let distX, distY, halfWidth, halfHeight;

function setup() {
    createCanvas(size, size);
    background(color);

    halfWidth = width / 2;
    halfHeight = height / 2;

    // Disable looping; call redraw manually from mouseMoved -> update
    noLoop();

    // Call update initially so the user sees something on screen
    update(50, 50);
}

function update(x, y) {
    distX = Math.abs(x - halfWidth);
    distY = Math.abs(y - halfHeight);
    
    if (distX != 0 && distY != 0) {
        redraw();
    }
}

function draw() {
    background(color);

    translate(halfWidth, halfHeight);

    // Moved here outside the loops 20210913_1732
    strokeWeight(distX);
    stroke(map(distY, 0, halfHeight, 0, 255));

    for (let y = -halfHeight; y < halfHeight; y++ ) {
        for (let x = -halfWidth; x < halfWidth; x++) {
            if (x % distX == 0 && y % distY == 0) {
                // This is already graded, but in hindsight,
                // should move these out of the loops
                // strokeWeight(distX);
                // stroke(map(distY, 0, halfHeight, 0, 255));
                point(x, y);
            }
        }
    }
}

function mouseMoved() {
    update(mouseX, mouseY);
}
