class Maze {

    _debug = false;

    _ends;
    _grid;
    _size;

    _dimensions = { col: 0, row: 1}

    constructor(size) {
        if (size === undefined) { size = 0; }

        this._size = createVector(size, size);
    }

    get Ends() {
        return this._ends;
    }

    get Size() {
        return this._size;
    }

    get Grid() {
        return this._grid;
    }

    set Size(value) {
        this._size = createVector(value, value);
    }

    log(value) {
        if (this._debug) {
            console.log(value);
        }
    }

    shuffle(x, y) {
        // Reset the grid housing the maze
        this._grid = new Array(this._size.y).fill(0)
            .map(() => new Array(this._size.x).fill(true));

        // Reset the array tracking maze endings
        this._ends = [];

        // Kickoff maze generation from supplied grid position (player position)
        // y, x because I tend to think row dominantly
        this.step(y, x);
    }

    step(y, x) {
        // Set this step false (default/walls are true)
        if (this._grid[y][x] !== false) {
            this._grid[y][x] = false;
        }

        let vectors = [[0,0], [0,0], [0,0], [0,0]];

        while (true) {
            let direction = 0;

            // Check up
            if (y > 1 && this._grid[y - 2][x]) {
                this.track(vectors, direction, this._dimensions.row, y - 2);
                this.track(vectors, direction, this._dimensions.col, x);
                direction++;
            }
            // Check down
            if (y < this._grid.length - 2 && this._grid[y + 2][x]) {
                this.track(vectors, direction, this._dimensions.row,  y + 2);
                this.track(vectors, direction, this._dimensions.col, x);
                direction++;
            }
            // Check left
            if (x > 1 && this._grid[y][x - 2]) {
                this.track(vectors, direction, this._dimensions.row, y);
                this.track(vectors, direction, this._dimensions.col, x - 2);
                direction++;
            }
            // Check right
            if (x < this._grid[y].length - 2 && this._grid[y][x + 2]) {
                this.track(vectors, direction, this._dimensions.row, y);
                this.track(vectors, direction, this._dimensions.col, x + 2);
                direction++;
            }

            // Look for passage ends
            if (direction === 0) {
                let blocked = 0;

                // Check up
                if (this._grid[y - 1][x]) { blocked++; }
                // Check down
                if (this._grid[y + 1][x]) { blocked++; }
                // Check left
                if (this._grid[y][x - 1]) { blocked++; }
                // Check right
                if (this._grid[y][x + 1]) { blocked++; }

                // If 3/4 directions are blocked, it's a passage end
                if (blocked === 3) {
                    this._ends.push(createVector(x, y));
                }

                break;
            }

            // Set the next step direction
            direction = Math.floor(random(direction));

            // Set path false (default/walls are true)
            this._grid
                [(this.track(vectors, direction, this._dimensions.row) + y) / 2]
                [(this.track(vectors, direction, this._dimensions.col) + x) / 2]
                    = false;

            // Proceed to next step based on direction vector
            this.step(
                this.track(vectors, direction, this._dimensions.row),
                this.track(vectors, direction, this._dimensions.col)
            );
        }
    }

    track = function(vector, direction, dimension, value) {
        // Determines whether the function is setting or simply retrieving value
        if (value !== undefined) {
            vector[direction][dimension] = value;
        }

        return vector[direction][dimension];
    }
}
