let random, max = 3;


let x, y;

function setup() {
    // Create the canvas
    createCanvas(720, 400);

    x = width / 50;
    y = height / 50;

    mouseClicked();
}

function draw() {
    /*background(100);

    switch(random)
    {
        case 0:
            ellipse(100, 100, 50, 50);
            break;
        case 1:
            square(75, 75, 50);
            break;
        case 2:
        default:
            point(100, 100);
            break;
    }
    */
    /* alternate:

    if (random == 0) { ellipse(100, 100, 50, 50); }
    else if (random == 1) { square(75, 75, 50); }
    else if (random == 2) { point(100, 100); }
    else { point(100, 100); }
    */
}

function mouseClicked() {
    for (y = height / 50; y > 0; y--) {
        for (x = width / 50; x > 0; x--) {
            fill(x * 10 * y);
            circle(50 * x, 50 * y, 100);
        }
    }

    /*do {
        fill(x * 10 * y);
        circle(50 * x, 50 * y, 100);
        x -= 1;
        if (x < 0) {
            y -= 1;
            x = width;
        }
    } while (y >= 0);
    */

    // random = Math.floor(Math.random() * max);
    // console.log(random);
}