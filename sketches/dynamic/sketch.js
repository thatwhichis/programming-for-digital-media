let distX, distY, halfWidth, halfHeight;
let size = 401;
let color = 100;

function setup() {
    createCanvas(size, size);
    background(color);

    halfWidth = width / 2;
    halfHeight = height / 2;

    noLoop();

    update(50, 50);
}

function update(x, y) {
    distX = Math.abs(x - width / 2);
    distY = Math.abs(y - height / 2);
    
    if (distX != 0 && distY != 0) {
        redraw();
    }
}

function draw() {
    background(color);

    translate(halfWidth, halfHeight);

    // Moved here outside the loop 20210913_1732
    strokeWeight(distX);
    stroke(map(distY, 0, halfHeight, 0, 255));

    for (let y = -halfHeight; y < halfHeight; y++ ) {
        for (let x = -halfWidth; x < halfWidth; x++) {
            if (x % distX == 0 && y % distY == 0) {
                // This is already graded, but in hindsight,
                // could move these out of the loop
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
