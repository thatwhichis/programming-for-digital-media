class Drawable {

    // SHARED SHAPE PROPERTIES (WIP)
    _color;
    _position;
    _rotation;
    _scale;
    _strokeColor;
    _strokeWeight;
    
    constructor(x, y, properties) {
        this._position = createVector(x, y);
        
        properties = properties || {};
        this._color = (properties.color === undefined) ? color(255) : properties.color;
        this._rotation = (properties.rotation === undefined) ? 0 : properties.rotation;
        this._scale = (properties.scale === undefined) ? 1 : properties.scale;
        this._strokeColor = (properties.strokeColor === undefined) ? color(0) : properties.strokeColor;
        this._strokeWeight = (properties.strokeWeight === undefined) ? 1 : properties.strokeWeight;
    }

    get Color() {
        return this._color;
    }
    
    get Position() {
        return this._position;
    }

    get Rotation() {
        return this._rotation;
    }

    get Scale() {
        return this._scale;
    }

    get StrokeColor() {
        return this._strokeColor;
    }

    get StrokeWeight() {
        return this._strokeWeight;
    }

    set Color(value) {
        this._color = value;
    }

    set Position(value) {
        this._position = value;
    }

    set Rotation(value) {
        this._rotation = value;
    }

    set Scale(value) {
        this._scale = value;
    }

    set StrokeColor(value) {
        this._strokeColor = value;
    }

    set StrokeWeight(value) {
        this._strokeWeight = value;
    }

    // Stub
    update() { }

    predraw() {
        push();

        // Set properties common to shapes
        translate(this._position.x, this._position.y);
        fill(this._color);
        rotate(this._rotation);
        scale(this._scale);
        strokeWeight(this._strokeWeight);
        stroke(this._strokeColor);
    }

    // Stub
    draw() { }

    postdraw() {
        pop();
    }

    // Stub
    checkCollision() { }
}
