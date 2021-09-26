class Shape {
    colour; // Colour applied to Shape fills; doesn't affect Lines
    direction; // Direction vector of Particles
    height; // Height property of Rectangles
    particles; // Array of Particles
    points; // Array of points for Lines
    position; // Position of the Shape
    scale; // Scale property of Circles, Squares
    strokeColour; // Stroke Colour of Shapes; bypassed for Lines
    type; // Type of shape - Circle, Line, Particle (Emitter), Square, Rectangle
    weight; // Stroke Weight of Shapes; doesn't affect Lines
    width; // Width property of Rectangles

    // properties: {
    //     colour,
    //     direction
    //     height,
    //     particles,
    //     points,
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
        this.particles = [];
        this.scale = properties.scale;
        this.strokeColour = properties.strokeColour || color(0, 0, 0);
        // Ah, right- doing || here returns falsy for 0
        this.weight = (properties.weight === undefined) ? 1 : properties.weight;
        this.direction = properties.direction ||
            createVector(random(-3, 3), random(-3, 3));
        this.width = properties.width;

        this.points = [{x: 0, y: 0}];
    }

    draw() {
        push();

        // Set properties common to shapes
        translate(this.position.x, this.position.y);
        fill(this.colour);
        strokeWeight(this.weight);

        // Set properties for specific shape types and draw
        switch(this.type) {
            case "particle":
                // If we're at 30 particles, pop the last from the array
                if (this.particles.length > 29) this.particles.pop();

                // Push a new particle to the front of the array
                this.particles.unshift(new Shape(circle, 0, 0,
                    { scale: this.scale,
                        colour: this.colour,
                        weight: this.weight
                    }));
                
                // Parse particles
                for(let i = this.particles.length - 1; i >= 0; i--) {
                    // Apply "gravity" to movement direction
                    this.particles[i].direction.y += 9.8 / 30;
                    
                    // Update particle position
                    this.particles[i].position.add(this.particles[i].direction);
                    
                    // draw
                    this.particles[i].draw();
                }
                break;
            case line:
                // Parse points in the line, starting at 1 because we need 2 pts
                for(let i = 1; i < this.points.length; i++) {
                    // Set stroke based on colour of most recent point
                    // Allows for changing line colors mid-line
                    stroke(this.points[i].colour);

                    // draw
                    this.type(this.points[i].x, this.points[i].y,
                        this.points[i - 1].x, this.points[i - 1].y);
                }
                break;
            case rect:
                // stroke set herein because Line works differently
                stroke(this.strokeColour);

                // draw
                this.type(0, 0, this.width, this.height);
                break;
            case circle:
            case square:
            default:
                // stroke set herein because Line works differently
                stroke(this.strokeColour);

                // Circle and Square use the same number of parameters
                // draw
                this.type(0, 0, this.scale);
                break;
        }

        pop();
    }
}
