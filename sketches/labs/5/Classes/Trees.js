class Trees {

    _trees;
    _front;

    constructor() {
        this._trees = [];
        let treeColor = [40, 23, 32]
        let treeColorRandomize =[random(0,40),random(0,40),random(0,0)]
        // Here be new trees, first two properties are X and Y
        //treeColor[0]+ treeColorRandomize[0],treeColor[1]+ treeColorRandomize[1],treeColor[2]+ treeColorRandomize[2]
        this._trees.push(new Tree(89, 139, 0, random() * 0.5 + 0.8, color(treeColor)));
        this._trees.push(new Tree(189, 115, 0, random() * 0.5 + 0.8, color(treeColor)));
        this._trees.push(new Tree(100, 200, 0, random() * 0.5 + 0.8, color(treeColor)));
        this._trees.push(new Tree(187, 207, 0, random() * 0.5 + 0.8, color(treeColor)));
        this._trees.push(new Tree(45, 315, 0, random() * 0.5 + 0.8, color(treeColor)));
        this._trees.push(new Tree(225, 295, 0, random() * 0.5 + 0.8, color(treeColor)));
        this._trees.push(new Tree(175, 36, 0, random() * 0.5 + 0.8, color(treeColor)));
        this._trees.push(new Tree(247, 64, 0, random() * 0.5 + 0.8, color(treeColor)));
        this._trees.push(new Tree(110, 363, 0, random() * 0.5 + 0.8, color(treeColor)));
        this._trees.push(new Tree(107, 43, 0, random() * 0.5 + 0.8, color(treeColor)));
        this._trees.push(new Tree(255, 210, 0, random() * 0.5 + 0.8, color(treeColor)));
        this._trees.push(new Tree(277, 110, 0, random() * 0.5 + 0.8, color(treeColor)));
        this._trees.push(new Tree(114, 263, 0, random() * 0.5 + 0.8, color(treeColor)));
        this._trees.push(new Tree(67, 190, 5, random() * 0.5 + 0.8, color(treeColor)));
        this._trees.push(new Tree(248, 385, 0, random() * 0.5 + 0.8, color(treeColor)));
        this._trees.push(new Tree(290, 302, 0, random() * 0.5 + 0.8, color(treeColor)));
        this._trees.push(new Tree(323, 348, 0, random() * 0.5 + 0.8, color(treeColor)));
        this._trees.push(new Tree(175, 322, 0, random() * 0.5 + 0.8, color(treeColor)));
        this._trees.push(new Tree(130, 137, 0, random() * 0.5 + 0.8, color(treeColor)));
        this._trees.push(new Tree(190, 442, 0, random() * 0.5 + 0.8, color(treeColor)));
        this._trees.push(new Tree(295, 172, 0, random() * 0.5 + 0.8, color(treeColor)));
        this._trees.push(new Tree(171, 258, 0, random() * 0.5 + 0.8, color(treeColor)));
        this._trees.push(new Tree(315, 247, 0, random() * 0.5 + 0.8, color(treeColor)));
        this._trees.push(new Tree(32, 377, 0, random() * 0.5 + 0.8, color(treeColor)));
        this._trees.push(new Tree(81, 407, 0, random() * 0.5 + 0.8, color(treeColor)));
        this._trees.push(new Tree(342, 97, 0.1, random() * 0.5 + 4, color(treeColor)));
        this._trees.push(new Tree(365, 261, 0, random() * 0.5 + 2, color(treeColor)));
    }

    update(position) {

        //console.log(mouseX + ", " + mouseY)

        for (let i = 0; i < this._trees.length; i++) {
            this._trees[i].update(position);
        }
    }

    drawFront() {
        for (let tree of this._front) {
            tree.draw();
        }
    }

    drawRear(position) {
        this._front = [];
        for (let tree of this._trees) {
            if (tree._position.y <= position.y) {
                tree.draw();
            } else {
                this._front.push(tree);
            }
        }
    }
}

class Tree {

    _color;
    _position;
    _rotation;
    _scale;
    _true;

    constructor(x, y, rotation, scale, colour) {
        this._position = createVector(x, y);
        this._rotation = rotation;
        this._scale = createVector(scale, scale);
        this._true = (createVector(scale, scale));
        this._color = colour;
    }

    update(position) {
        if (this._rotation === 0) {
            this._scale.x = (this._position.x < position.x) ? -this._true.x : this._true.x;
        }
    }

    draw() {
        push();

        translate(this._position.x, this._position.y);
        rotate(this._rotation);
        scale(this._scale.x, this._scale.y);
        fill(this._color);

        beginShape();
        vertex(-5, 0); //1
        vertex(-10, -40);//2
        vertex(-20, -40);//3
        vertex(-25, -50);//4
        vertex(-27, -53);
        vertex(-23, -58);
        vertex(-20, -54);
        vertex(-16, -49);
        vertex(-10, -47);
        vertex(-9, -55);
        vertex(-18, -64);
        vertex(-12, -69);
        vertex(-3, -59);
        vertex(2, -48);
        vertex(0, -42);
        vertex(8, -45);
        vertex(6, -56);
        vertex(16, -64);
        vertex(16, -58);
        vertex(12, -52);
        vertex(12, -42);
        vertex(0, -35)
        vertex(5, 0);
        endShape(CLOSE);

        pop();
    }
}