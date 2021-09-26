class Shape {
    colour; // Colour applied to Shape fills
    height; // Height property of Rectangles
    position; // Position of the Shape
    scale; // Scale property of Squares
    strokeColour; // Stroke Colour of Shapes
    type; // Type of shape - Circle, Line, Particle (Emitter), Square, Rectangle
    weight; // Stroke Weight of Shapes
    width; // Width property of Rectangles

    // properties: {
    //     colour,
    //     height,
    //     scale,
    //     strokeColour,
    //     weight,
    //     width,
    // }
    constructor(type, x, y, properties) {
        this.type = type;
        this.position = createVector(x, y);

        this.colour = properties.colour || color(255, 255, 255);
        this.height = properties.height;
        this.scale = properties.scale;
        this.strokeColour = properties.strokeColour || color(0, 0, 0);
        // Ah, right- doing || here returns falsy for 0
        this.weight = (properties.weight === undefined) ? 1 : properties.weight;
        this.width = properties.width;
    }

    draw() {
        push();

        // Set properties common to shapes
        translate(this.position.x, this.position.y);
        fill(this.colour);
        strokeWeight(this.weight);
        stroke(this.strokeColour);


        // Set properties for specific shape types and draw
        switch(this.type) {
            case rect:
                // draw
                this.type(0, 0, this.width, this.height);
                break;
            case square:
            default:
                // draw
                this.type(0, 0, this.scale);
                break;
        }

        pop();
    }
}
