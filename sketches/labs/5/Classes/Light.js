class Light {

    _circles;
    _count;
    _diag;
    _flicker;
    _min;
    _position;
    _width;

    constructor(diag, min, width, count, flicker) {
        this._count = count;
        this._flicker = (flicker === undefined) ? false : flicker; 
        this._min = min;
        this._padding = 2;
        this._position = createVector(0, 0);
        this._diag = diag * 2;
        this._width = width;

        this.createCircles();
    }

    get Count() {
        return this._count;
    }

    get Min() {
        return this._min;
    }

    get Width() {
        return this._width;
    }

    set Count(value) {
        this._count = value > 0 ? value : 1;
        this.createCircles();
    }

    set Min(value) {
        this._min = value > 0 ? value : 0;
    }

    set Width(value) {
        this._width = value > 0 ? value : 0;
    }

    createCircles() {
        this._circles = [];

        // Build transitory circles
        let radius = this._width / this._count;
        let color = 255 / (this._count + 1);
        for (let i = 0; i < this._count; i++) {
            this._circles.push({ 
                size: (this._min * 2) + ((i + 1) * radius * 2) - radius,
                weight: radius + this._padding,
                alpha: (i + 1) * color
            });
        }

        // Build final, outer-most circle to cover the rest of the screen
        let max = this._circles[this._circles.length - 1];
        let edge = max.size + max.weight;
        radius = (this._diag + edge) / 2;
        this._circles.push({ 
            size: radius,
            weight: radius - edge + this._padding,
            alpha: 255
        });
    }

    flicker() {
        let min = this._min + (random(3));

        // Update transitory circles
        let radius = this._width / this._count;
        for (let i = 0; i < this._count; i++) {
            this._circles[i].size = (min * 2) + ((i + 1) * radius * 2) - radius;
            this._circles[i].weight =  radius + this._padding;
        }

        // Update final, outer-most circle to cover the rest of the screen
        let mask = this._circles[this._circles.length - 1];
        let max = this._circles[this._circles.length - 2];
        let edge = max.size + max.weight;
        radius = (this._diag + edge) / 2;
        mask.size = radius;
        mask.weight = radius - edge + this._padding;
    }

    update(v2) {
        this._position = v2;

        if (this._flicker && this._min > 0 && this._count > 0) {
            this.flicker();
        }
    }

    draw() {
        push();

        noFill();

        for (let i = 0; i < this._circles.length; i++) {
            //if (!this._circles[i].weight) console.log(i);
            strokeWeight(this._circles[i].weight);
            stroke(color(0, 0, 0, this._circles[i].alpha));
            circle(this._position.x, this._position.y, this._circles[i].size);
        }

        pop();
    }
}