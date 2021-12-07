class Rect extends Drawable {

    // Drawable unique properties
    _height;
    _width;

    constructor(x, y, properties) {
        properties = properties || {};
        properties.height = (properties.height === undefined) ? 1 : properties.height;
        properties.width = (properties.width === undefined) ? 1 : properties.width;
        super(x, y, properties);

        this._height = properties.height;
        this._width = properties.width;
    }

    get Height() {
        return this._height;
    }

    get Width() {
        return this._width;
    }

    set Height(value) {
        this._height = value;
    }

    set Width(value) {
        this._width = value;
    }

    draw() {
        super.predraw();

        rect(0, 0, this._width, this._height);

        super.postdraw();
    }

    checkCollision(x, y) {
        if (x > this.Position.x - this._width / 2 && 
            y > this.Position.y - this._height / 2 &&
            x < this.Position.x + this._width / 2 &&
            y < this.Position.y + this._height / 2) {
                return true;
        }

        return false;
    }
}
