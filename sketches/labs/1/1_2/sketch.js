function setup() {

    const spacing = 30;

    createCanvas(spacing * 11, spacing * 11);
    background(100);
    textAlign(CENTER, CENTER);

    for (let y = 0; y < 10; y++) {
        for (let x = 1; x < 11; x++) {
            let value = x + (y * 10);
            let fizz = value % 3 == 0;
            let buzz = value % 5 == 0;
            let node = createVector(x * spacing, (y + 1) * spacing);

            if (fizz && buzz) {
                triangle(node.x, node.y - 5,
                    node.x - 5, node.y + 5,
                    node.x + 5, node.y + 5);
            } else if (fizz) {
                circle(node.x, node.y, 10);
            } else if (buzz) {
                square(node.x - 5, node.y - 5, 10);
            } else {
                text(value, node.x, node.y);
            }
        }
    }
}
