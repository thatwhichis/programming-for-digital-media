function setup() {
    createCanvas(450, 450);
    background(100);

    const size = 8;
    let hash = "";
    let spacing = width / (size + 1);

    // This algorithm replaces the one commented out below
    // and properly scales grid to odd int size bindings
    for (let y = 0; y < size; y++ )
    {
        for (let x = 0; x < size; x++) {
            // We begin by building the string as described
            // in the original exercise
            // (newline applied below after inner loop)
            hash += (x % 2 == ((y % 2 == 0) ? 0 : 1)) ? " " : "#";

            // WHOOPSIE, this works for even numbered sizes, but
            // not odd, because it counts on the \n char alternating
            // the checkerboard pattern
            // hash += (hash.length % 2 == 0) ? " " : "#";

            // For the p5.js requirement, we draw a circle
            // if the most recent character is a "#"
            if (hash.slice(-1) == "#") {
                ellipse((x + 1) * spacing, (y + 1) * spacing, spacing);
            }
        }
        hash += "\n";
    }
}
