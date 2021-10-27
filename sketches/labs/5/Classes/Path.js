var darkness = 0;
//let circleSize = 20;

let thePath
// function setup() {
//     createCanvas(400, 400);
//     background(0);
//     thePath = new Path()
//     thePath.addLight(4, 40, 60);
//     thePath.addLight(94, 68, 20);
//     thePath.addLight(133, 32, 15, 255);
//     thePath.addLight(153, 77, 20);
//     thePath.addLight(211, 44, 25);
//     thePath.addLight(244, 94, 15);
//     thePath.addLight(219, 142, 20);
//     thePath.addLight(260, 130, 15);
//     thePath.addLight(209, 186, 12);
//     thePath.addLight(146, 191, 20);
//     thePath.addLight(66, 233, 35);
//     thePath.addLight(80, 301, 20);
//     thePath.addLight(131, 305, 14);
//     thePath.addLight(156, 357, 25);
//     thePath.addLight(211, 322, 15);
//     thePath.addLight(255, 285, 20);
//     thePath.addLight(286, 330, 14);
//     thePath.addLight(306, 372, 12);
//     thePath.addLight(385, 386, 55);
//     //thePath.addLight(, , );
// }


// function draw() {
//     background(0);
//     //showing path
//     let light = thePath.isInLight(mouseX, mouseY);
//     thePath.show()
//     if (!light) {
//         darkness++
//     } else if (light && darkness > 0) {
//         darkness--
//     }
// }


class Path {
    constructor() {
        this.path = []
    }

    addLight(x, y, r) {
        this.path.push({ on: true, x: x, y: y, r: r, mod: 0, brightness: 100, color: [0, random(200, 255), random(100, 200)] });
    }

    isInLight(px, py) {
        let light = false
        for (let i = 0; i < this.path.length; i++) {
            if (this.path[i].brightness > 25) {
                light = light || dist(px, py,
                    this.path[i].x, this.path[i].y) < this.path[i].r//paths[i].hover(mouseX, mouseY);
            }
        }
        return light
    }

    show() {
        for (var light of this.path) {
            strokeWeight(0);
            if (light.on) {
                if (light.brightness < 100) {
                    light.brightness++
                }
            } else {
                if (light.brightness > 0) {
                    light.brightness--
                }
            }
            //strokeWeight(1)
            //stroke(light.color);
            fill(light.color[0] * light.brightness / 100, light.color[1] * light.brightness / 100, light.color[2] * light.brightness / 100);
            if (frameCount % 7 == 0) {
                //light.mod = random(0, 2)
                light.mod = 0
            }
            ellipse(light.x, light.y, light.brightness / 100 * (2 * light.r + 2.5 - light.mod));
        }

    }

}