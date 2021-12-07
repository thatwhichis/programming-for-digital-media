class Button {

    _args;
    _drawable;
    _func;
    // ok, let's just localize properties for reuse right now
    _properties;
    _state;
    _text;
    _visible;

    static State = {
        ENABLED: 0,
        HOVER: 1,
        PRESSED: 2,
        DISABLED: 3
    }

    constructor(drawable, x, y, func, properties) {

        properties.width = properties.width || 10;
        properties.height = properties.height || 10;
        properties.color = properties.color || color(255, 255, 255);
        properties.strokeColor = properties.strokeColor || color(0, 0, 0);

        this._drawable = new drawable(x, y, properties);
        // TODO - verify this is of type function
        this._func = func;
        this._args = properties.args;
        // localize properties - may refactor for button since drawable doesn't
        // need the button specifics
        this._properties = properties;
        this._state = Button.State.ENABLED;
        this._text = properties.text;
        this._textColor = properties.textColor;

        this._visible = true;
    }

    get Position() {
        return this._drawable.Position;
    }

    get Text() {
        return this._text;
    }

    get Visible() {
        return this._visible;
    }

    set Position(value) {
        this._drawable.Position = value;
    }

    set Text(value) {
        this._text = value;
    }

    set Visible(value) {
        this._visible = value;
        this._state = value ? Button.State.ENABLED : Button.State.DISABLED;
    }

    update() {
        switch(this._state) {
            case (Button.State.ENABLED):
                if (this.checkCollision(mouseX, mouseY)) {
                    this._state = Button.State.HOVER;
                }
            break;
            case (Button.State.HOVER):
                if (!this.checkCollision(mouseX, mouseY)) {
                    this._state = Button.State.ENABLED;
                }
            break;
        }
    }

    draw() {
        if (this._visible) {
            switch(this._state) {
                case Button.State.HOVER:
                    this._drawable.StrokeColor = this._properties.strokeColorHover;
                break;
                case Button.State.PRESSED:
                    this._drawable.StrokeColor = this._properties.strokeColorPressed;
                break;
                case Button.State.ENABLED:
                default:
                    this._drawable.StrokeColor = this._properties.strokeColor;
                break;
            }

            this._drawable.draw();

            // Allows buttons to have a rendered text property
            if (this._text !== undefined) {
                push();
                fill(this._textColor);
                translate(this._drawable._position.x, this._drawable._position.y);
                text(this._text, 0, 0);
                pop();
            }
        }
    }

    // Returns true if x, y point is within the Rectangular button
    checkCollision(x, y) {
        return this._drawable.checkCollision(x, y);
    }

    mousePressed() {
        if (this._state === Button.State.HOVER ||
            (this._state === Button.State.ENABLED && 
            this.checkCollision(mouseX, mouseY))) {
            this._state = Button.State.PRESSED;

            // TODO - this may be worth breaking out into a more fleshed out
            // way of calling functions by name
            //this._func();
            if (typeof this._func === 'function') {
                this._func(this._args);
            } else if (typeof this._func === 'string') {
                if (window[this._func]) {
                    window[this._func](this._args);
                }
            }
        }
    }

    mouseReleased() {
        if (this._state !== Button.State.DISABLED) {
            if (this.checkCollision(mouseX, mouseY)) {
                this._state = Button.State.HOVER;
            } else {
                this._state = Button.State.ENABLED;
            }
        }
    }
}
