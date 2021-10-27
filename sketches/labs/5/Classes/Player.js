class Player extends Character {

    _advance;
    _direction;
    _initialPosition;
    _light;
    _previous;
    _state;
    _states;

    constructor(x, y, charColor) {
        super(x, y, charColor, CHARACTER.LRRH);

        this._advance = false;

        this._basket = false;

        this._direction = createVector(0, 0);

        this._initialPosition = createVector(x, y);

        this._light = new Light(
            // canvas diagonal
            Math.sqrt(CANVAS_WIDTH * CANVAS_WIDTH + CANVAS_HEIGHT * CANVAS_HEIGHT),
            // min dist to first ring
            15,
            // width of transition
            75,
            // number of rings in transition
            35,
            // flicker?
            true);

        // darkness
        this._previous = 0;

        this._state = STATES.GAME;
    }

    get Advance() {
        return this._advance;
    }

    get Light() {
        return this._light.Min;
    }

    get State() {
        return this._state;
    }

    set State(value) {
        this._state = value;
    }

    handleInput(value) {
        switch(value) {
            case INPUT.LEFT:
                this._direction.x = (this._state < STATES.TALKING) ? this._direction.x - SPEED : 0;
            break;
            case INPUT.RIGHT:
                this._direction.x = (this._state < STATES.TALKING) ? this._direction.x + SPEED : 0;
            break;
            case INPUT.UP:
                this._direction.y = (this._state < STATES.TALKING) ? this._direction.y - SPEED : 0;
            break;
            case INPUT.DOWN:
                this._direction.y = (this._state < STATES.TALKING) ? this._direction.y + SPEED : 0;
            break;
            case INPUT.ADVANCE:
                this._advance = true;
            break;
        }
    }

    // Overrides Character.update
    update(value) {
        this.adjustLight(value);

        this._advance = false;

        // Check and dispatch input events for held keys
        if (keyIsPressed) {
            // Zeroize the direction vector every turn to recalc speed offsets
            this._direction = createVector(0, 0);

            inputs.forEach(value => { 
                if (keys[value]) {
                    this.handleInput(value);
                }
            });

            if(this._direction.y < 0 && this._position.y < SPEED ||
                this._direction.y > 0 && this._position.y > CANVAS_HEIGHT - SPEED) {
                    this._direction.y = 0;
            }

            if(this._direction.x < 0 && this._position.x < SPEED ||
                this._direction.x > 0 && this._position.x > CANVAS_HEIGHT-SPEED) {
                    this._direction.x = 0;
            }

            this._direction.normalize();
            this._facing = createVector(this._direction.x, this._direction.y).mult(0.5);
            this._position = this._position.add(this._direction);
        }

        this._light.update(createVector(this._position.x, this._position.y - PLAYER_WIDTH));
    }

    // Overrides but calls Character.draw
    draw() {
        // predraw super class Character
        super.predraw();

        // Draw basket first or last based on _facing y
        if (this._facing.y * PLAYER_WIDTH < 0) {
            this.drawBasket();
            fill(this._color);
            triangle(0, -PLAYER_WIDTH * 2, PLAYER_WIDTH, 0, -PLAYER_WIDTH, 0);
        } else {
            triangle(0, -PLAYER_WIDTH * 2, PLAYER_WIDTH, 0, -PLAYER_WIDTH, 0);
            this.drawBasket();
        }

        // postdraw super class Character
        super.postdraw();
    }

    adjustLight(value) {
        if (value !== this._previous) {
            if (value > this._previous) {
                this._light.Min -= 0.25;
                this._light.Width -= 1.25;
            }
            else {
                if (this._light.Min < 15) {
                    this._light.Min += 1;
                    this._light.Width += 5;
                }
            }

            this._light.Count = Math.floor(this._light.Width / 2);
            this._previous = value;
        }
    }

    drawLight() {
        this._light.draw();
    }

    reset() {
        this.Position = createVector(this._initialPosition.x, this._initialPosition.y);
        this._light.Min = 15;
        this._light.Width = 75;
        this._basket = false;
    }

    say(x, y) {
        push();

        translate(x, y);
        fill(this._color);
        triangle(0, -PLAYER_WIDTH * 2, PLAYER_WIDTH, 0, -PLAYER_WIDTH, 0);

        this.drawBasket();

        pop();
    }
}
