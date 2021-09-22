function setup() {
    createCanvas(400, 400);
    background(100);

    const mult = 50;

    // Tried to stick to the spirit of the problem presented by using
    // the string length property as the loop control variable
    for(let hash = "#"; hash.length < 8; hash += "#") {
        for (let col = 1; col <= hash.length; col++) {
            ellipse(col * mult, hash.length * mult, mult, mult);
        }
    }
}
