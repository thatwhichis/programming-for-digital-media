class Character {

    _actions;
    _name;
    _properties;

    _grammar;
    _grammarSeed;

    _energy;
    _energy_min;
    _energy_max;
    _introversion;

    _role;

    _drawX;
    _textAlignmentX;

    static ROLES = { ANTAGONIST: 0, PROTAGONIST: 1 }

    constructor(character, min, max) {
        this._actions = character.actions;
        this._name = character.name;
        this._properties = character.properties;

        this._energy_min = min;
        this._energy_max = max;

        // localize individual properties for use
        this.reset();

        this._grammarSeed = {
            "origin": [],
            "name1": [this._name],
            "name2": [this._name],
            ...this._actions
        };
    }

    get Actions() {
        return this._actions;
    }

    get Name() {
        return this._name;
    }

    get Energy() {
        return this._energy;
    }

    get Introversion() {
        return this._introversion;
    }

    set Energy(value) {
        this._energy = value;
    }

    set Introversion(value) {
        this._introversion = value;
    }

    set Role(value) {
        this._role = value;

        if (this._role === Character.ROLES.ANTAGONIST) {
            this._drawX = CANVAS_WIDTH - 10;
            this._textAlignmentX = RIGHT;
        } else {
            this._drawX = 10;
            this._textAlignmentX = LEFT;
        }
    }

    draw() {
        if (this._role !== undefined) {
            push();
            textAlign(this._textAlignmentX, CENTER);
            text("Name: " + this._name, this._drawX, CANVAS_HEIGHT / 4 - 20);
            text("Introversion: " + this._introversion + " / 2", this._drawX, CANVAS_HEIGHT / 4);
            text("Energy: " + this._energy + " / " + this._energy_max, this._drawX, CANVAS_HEIGHT / 4 + 20);
            pop();
        }
    }

    checkLoseCondition() {
        return (this._energy <= this._energy_min) ? true : false;
    }

    checkWinCondition() {
        return (this._energy >= this._energy_max) ? true : false;
    }

    getText(origin, args) {
        let seed = this._grammarSeed;
        this._grammarSeed = {
            ...seed,
            ...args
        }
        this._grammarSeed.origin = origin;

        // Hate to redo this every time but probably beats modifying
        // tracery raw/symbols; may revisit
        this._grammar = tracery.createGrammar(this._grammarSeed);
        this._grammar.addModifiers(tracery.baseEngModifiers);

        return this._grammar.flatten("#origin#");
    }

    reset() {
        this._energy = this._properties.energy;
        this._introversion = this._properties.introversion;
        this._role = undefined;
    }
}
