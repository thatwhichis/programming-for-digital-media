// TODO - move this to script
// textStyle(NORMAL);

class Text {

    _box;
    _current;
    _position;
    _speed;
    _text;

    constructor(text, x, y, speed) {
        this._current = 0;
        this._position = createVector(x, y);
        this._speed = speed;
        this._text = text;
    }

    get Done() {
        return this._current === this._text.length;
    }

    set Speed(value) {
        this._speed = value;
    }

    setText(text) {
        this._text = text;
        this._current = 0
    }

    draw(frame) {
        push();

        if(frame % this._speed === 0 &&
            this._current < this._text.length) {
                this._current++;
        }

        translate(this._position.x, this._position.y);

        // IF we want to change textStyle, do so before calculating width
        let t = this._text.substring(0, this._current);
        let width = textWidth(t);

        text (t, 0, 0);

        pop();

        return width;
    }
}
