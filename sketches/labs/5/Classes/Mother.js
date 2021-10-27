class Mother extends Character {

    constructor(x, y, charColor) {
        super(x, y, charColor, CHARACTER.MOTHER);

        this._basket = true;

        this._rectangle = {
            x: CANVAS_WIDTH / 2,
            y: CANVAS_HEIGHT - 25,
            width: CANVAS_WIDTH,
            height: 50
        }

        this._texts = [
            [
                {char: CHARACTER.MOTHER, text: "Oh hello, Love!"},
                {char: CHARACTER.MOTHER, text: "I have a job for you this afternoon."},
                {char: CHARACTER.LRRH, text: "Oh? What is it, Mom?"},
                {char: CHARACTER.MOTHER, text: "Please visit your Grandmother"},
                {char: CHARACTER.MOTHER, text: "on the other side of the forest."},
                {char: CHARACTER.MOTHER, text: "She's not been feeling herself lately."},
                {char: CHARACTER.LRRH, text: "The forest frightens me Mom..."},
                {char: CHARACTER.LRRH, text: "The darkness is imposing."},
                {char: CHARACTER.LRRH, text: "It feels full. Alive."},
                {char: CHARACTER.LRRH, text: "Like things are watching me."},
                {char: CHARACTER.MOTHER, text: "It's dangerous to go alone!"},
                {char: CHARACTER.MOTHER, text: "Take this."},
                {char: CHARACTER.LRRH, text: "...Mom. Are you serious."},
                {char: CHARACTER.LRRH, text: "It's a basket."},
                {char: CHARACTER.MOTHER, text: "Isn't it just wonderful!"},
                {char: CHARACTER.MOTHER, text: "Take it to your Grandmother."},
                {char: CHARACTER.MOTHER, text: "And remember:"},
                {char: CHARACTER.MOTHER, text: "you're probably safe"},
                {char: CHARACTER.MOTHER, text: "if you stay on the green path!"},
                {char: CHARACTER.LRRH, text: "...Good tip. Thanks Mom."}
            ],
            [
                {char: CHARACTER.MOTHER, text: "OH! What happened, Love?"},
                {char: CHARACTER.LRRH, text: "...I was frightened Mom."},
                {char: CHARACTER.LRRH, text: "I heard a wolf howl."},
                {char: CHARACTER.LRRH, text: "I dropped the basket and ran."},
                {char: CHARACTER.LRRH, text: "...I'm so ashamed."},
                {char: CHARACTER.LRRH, text: "...I wasn't strong enough."},
                {char: CHARACTER.MOTHER, text: "Oh dear! Honey, I love you."},
                {char: CHARACTER.MOTHER, text: "You don't have to go"},
                {char: CHARACTER.MOTHER, text: "if it's too hard."},
                {char: CHARACTER.LRRH, text: "I'm feeling better..."},
                {char: CHARACTER.LRRH, text: "I think I can make it."},
                {char: CHARACTER.MOTHER, text: "Here, I prepped another basket."},
                {char: CHARACTER.LRRH, text: "Thanks Mom!"},
                {char: CHARACTER.MOTHER, text: "Remember to stay on the path!"},
            ]
        ];

        this._text = new Text(
            this._texts[0][0].text,
            // Setting with a left alignment now to place character portraits
            60,
            CANVAS_HEIGHT - 20,
            2
        );
    }

    draw() {
        super.predraw();

        circle(2, -24, 23)
        circle(0, -16, 30);
        arc(2, 0, 40, 40, PI, 0);

        this.drawBasket();

        super.postdraw();
    }

    reset() {
        if (!this._basket && this._convo < this._texts.length - 1) {
            this._convo++;
        }
        this._current = 0;
        this._basket = true;
    }

    say() {
        if (super.say()) {
            // REFACTOR - BASKET HANDOFF
            if (this._current === 11 && this._basket) { 
                this._basket = false;
                player.Basket = true;
            }

            if (this._texts[this._convo][this._current].char === this._character) {
                push();

                translate(this._rectangle.x - 170, this._rectangle.y + 15);
                fill(this._color);
                circle(2, -24, 23);
                circle(0, -16, 30);
                arc(2, 0, 40, 40, PI, 0);

                this.drawBasket();

                pop();
            } else {
                player.say(this._rectangle.x - 170, this._rectangle.y + 8);
            }
        }
    }
}