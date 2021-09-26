class Button extends Shape{
    text;

    // TODO - Allow for button shapes other than Rectangles
    constructor(x, y, properties) {
        properties.width = properties.width || 10;
        properties.height = properties.height || 10;
        properties.colour = properties.colour || color(255, 255, 255);
        properties.strokeColour = properties.strokeColour || color(0, 0, 0);

        super(rect, x, y, properties);

        this.text = properties.text;
    }

    draw() {
        // Base draw
        super.draw();

        // Allows buttons to have a rendered text property
        if (this.text !== undefined) {
            push();
            translate(this.position.x, this.position.y);
            text(this.text, 0, 0);
            pop();
        }
    }

    // Returns true if x, y point is within the Rectangular button
    checkCollision(x, y) {
        if (x > this.position.x - this.width / 2 && 
            y > this.position.y - this.height / 2 &&
            x < this.position.x + this.width / 2 &&
            y < this.position.y + this.height / 2) {
                return true;
        } else {
            return false;
        }
    }
}
