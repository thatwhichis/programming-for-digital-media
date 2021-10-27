class Character {

    _basket;
    _character;
    _color;
    _facing;
    _position;
    _rectangle;
    _speaking;
    _text;

    _texts;
    _convo;
    _current;

    constructor(x, y, charColor, character) {
        this._character = character;
        this._convo = 0;
        this._current = 0;
        this._position = createVector(x, y);
        this._speaking = 0;
        this._facing = createVector(0, 0);
        this._color = charColor;
    }

    get Basket() {
        return this._basket;
    }

    get Position() {
        return this._position;
    }

    set Basket(value) {
        this._basket = value;
    }

    set Position(value) {
        this._position = value;
    }

    drawBasket() {
        if (this._basket)
        {
            fill(color(42, 24, 33));
            arc(this._facing.x * PLAYER_WIDTH,
                this._facing.y * PLAYER_WIDTH - PLAYER_WIDTH,
                10, 10, 0, PI);
        }
    }

    predraw() {
        push();

        fill(this._color);
        translate(this._position.x, this._position.y);
    }

    // If draw is overridden, use predraw/postdraw in draw call
    draw() {
        this.predraw();

        square(0, 0, PLAYER_WIDTH * 2);
        circle(this._facing.x * PLAYER_WIDTH,
            this._facing.y * PLAYER_WIDTH,
            5);
        
        this.postdraw();
    }

    postdraw() {
        pop();
    }

    reset() {
        this._convo = 0;
        this._current = 0;
        this._basket = false;
    }

    say() {
        if(this._speaking < 1) {
            return false;
        }

        if (this._speaking === 1) {
            this.predraw();

            fill(0);
            square(20, -40, 20);
            fill(255);
            textAlign(CENTER, CENTER);
            text('x', 20, -40);

            this.postdraw();

            return false;
        }

        // Pushing and popping removes need to reset properties in script.js
        push();

        // Text background properties
        fill(127, 127, 127);
        rect(this._rectangle.x,
            this._rectangle.y,
            this._rectangle.width,
            this._rectangle.height);

        // Text properties
        textSize(20);
        fill(255);

        // Draw text
        this._text.draw(iterator);

        // If text is done parsing, draw 'x' to indicate the advancement key
        if (this._text.Done) {
            text('x', this._rectangle.x + this._rectangle.width / 2 - 15,
                this._rectangle.y + this._rectangle.height / 2 - 5)
        }

        pop();

        return true;
    }

    update(advance) {
        let distance = 10;
        let front = createVector(this._position.x, this._position.y + (distance));

        // This is hideous; 1/10 would implement again
        if (front.dist(player.Position) >= distance) {
            this._speaking = 0;
        } else if (front.dist(player.Position) < distance &&
            !this._speaking &&
            this._current !== this._texts[this._convo].length - 1) {
                this._speaking = 1;
        } else if (this._speaking === 1 &&
            advance &&
            this._speaking !== 2) {
                this._speaking = 2;
                this._text.setText(this._texts[this._convo][this._current].text);
                player.State = STATES.TALKING;
        } else if (this._speaking > 1 &&
            advance &&
            this._text.Done) {
            if (this._current < this._texts[this._convo].length - 1) {
                this._current++;
                this._text.setText(this._texts[this._convo][this._current].text);
            } else {
                this._speaking = 0;
                player.State = STATES.GAME;
                // Stub if we want to implement endings based on time
                timer = 0;

                // Set game mode based on Grandmother ending
                if (this._character === CHARACTER.GRANDMOTHER) {
                    if (this._convo === 0) {
                        mode = MODE.OVER;
                        superText.setText(TEXT.BAD);
                    } else {
                        mode = MODE.OVER;
                        superText.setText(TEXT.GOOD);
                    }
                    subText.setText(TEXT.OVER_SUB);
                }
            }
        }
    }
}
