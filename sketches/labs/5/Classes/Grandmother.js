class Grandmother extends Character {

    constructor(x, y, charColor) {
        super(x, y, charColor, CHARACTER.GRANDMOTHER);

        this._basket = false;

        this._rectangle = {
            x: CANVAS_WIDTH / 2,
            y: 25,
            width: CANVAS_WIDTH,
            height: 50
        }

        this._texts = [
            [
                {char: CHARACTER.GRANDMOTHER, text: "Oh, hello, Dear!"},
                {char: CHARACTER.LRRH, text: "It was scary out there, Grandma!"},
                {char: CHARACTER.LRRH, text: "I heard a wolf howling!"},
                {char: CHARACTER.GRANDMOTHER, text: "How frightening indeed!"},
                {char: CHARACTER.GRANDMOTHER, text: "Did you bring your Mom’s basket?"},
                {char: CHARACTER.LRRH, text: "No, I left before talking to her..."},
                {char: CHARACTER.GRANDMOTHER, text: "Oh Dearie, my medicine was in there!"},
                {char: CHARACTER.LRRH, text: "I'm sorry."},
                {char: CHARACTER.GRANDMOTHER, text: "I’m afraid you or your Mom "},
                {char: CHARACTER.GRANDMOTHER, text: "need to make another trip,"},
                {char: CHARACTER.GRANDMOTHER, text: "I’m not myself without my medicine."},
                {char: CHARACTER.LRRH, text: "Oh..."},
                {char: CHARACTER.LRRH, text: "...alright..."},

                // {char: CHARACTER.GRANDMOTHER, text: "but you were quite brave."},
                // {char: CHARACTER.LRRH, text: "Grandmother..."},
                // {char: CHARACTER.LRRH, text: "What large eyes you have."},
                // {char: CHARACTER.GRANDMOTHER, text: "The better to see you with!"},
                // {char: CHARACTER.LRRH, text: "And such large teeth?"},
                // {char: CHARACTER.GRANDMOTHER, text: "Why, the better to eat you with!"},
                // {char: CHARACTER.GRANDMOTHER, text: "I could just gobble you up."},
                // {char: CHARACTER.GRANDMOTHER, text: "I wish your mother had prepared"},
                // {char: CHARACTER.GRANDMOTHER, text: "one of her wonderful baskets."},
                // {char: CHARACTER.GRANDMOTHER, text: "Come inside with me;"},
                // {char: CHARACTER.GRANDMOTHER, text: "we'll have a fine feast!"}
            ],
            // Right now, this _convo is inaccessible - 
            // TODO: good, bad endings? Grandma/Wolf? Did LRRH bring the basket?
            [
                {char: CHARACTER.GRANDMOTHER, text: "Oh, thank you so much, Dear!"},
                {char: CHARACTER.GRANDMOTHER, text: "Your Mother is so thoughtful"},
                {char: CHARACTER.GRANDMOTHER, text: "to prepare this basket."},
                {char: CHARACTER.LRRH, text: "It was scary out there, Grandma!"},
                {char: CHARACTER.GRANDMOTHER, text: "I'm sure it was,"},
                {char: CHARACTER.GRANDMOTHER, text: "but you were quite brave!"},
                {char: CHARACTER.GRANDMOTHER, text: "I'm very proud of you."},
                {char: CHARACTER.LRRH, text: "Thanks Grandma!"},
                {char: CHARACTER.LRRH, text: "I've missed you."},
                {char: CHARACTER.GRANDMOTHER, text: "I've missed you, too!"},
                {char: CHARACTER.GRANDMOTHER, text: "Come inside with me;"},
                {char: CHARACTER.GRANDMOTHER, text: "we'll have a fine feast."}
            ]
        ];

        this._text = new Text(
            this._texts[0][0],
            // Setting with a left alignment now to place character portraits
            60,
            30,
            2
        );
    }

    draw() {
        super.predraw();

        let ptX = 0;
        let ptY = 0;
        let grow = 1.8;

        beginShape()
        vertex((ptX - 10) * grow, (ptY) * grow);
        vertex((ptX - 5) * grow, (ptY - 15) * grow)
        vertex((ptX + 5) * grow, (ptY - 15) * grow);
        vertex((ptX + 10) * grow, ptY * grow);
        endShape(CLOSE)

        this.drawBasket();

        // beginShape()
        // vertex(20, 20);
        // vertex(28, 10);
        // curveVertex(30, 5);
        // vertex(32, 10);
        // vertex(40, 20);
        // //curveVertex(20, 20);
        // endShape(CLOSE)

        super.postdraw();
    }

    say() {
        if (super.say()) {
            // REFACTOR - BASKET HANDOFF
            if (player.Basket) { 
                this._basket = true;
                player.Basket = false;
                this._convo = 1;
            }

            if (this._texts[this._convo][this._current].char === this._character) {
                push();

                translate(this._rectangle.x - 170, this._rectangle.y + 15);
                fill(this._color);

                let ptX = 0;
                let ptY = 0;
                let grow = 1.8;
        
                beginShape();
                vertex((ptX - 10) * grow, (ptY) * grow);
                vertex((ptX - 5) * grow, (ptY - 15) * grow);
                vertex((ptX + 5) * grow, (ptY - 15) * grow);
                vertex((ptX + 10) * grow, ptY * grow);
                endShape(CLOSE);

                this.drawBasket();

                pop();
            } else {
                player.say(this._rectangle.x - 170, this._rectangle.y + 8);
            }
        }
    }
}