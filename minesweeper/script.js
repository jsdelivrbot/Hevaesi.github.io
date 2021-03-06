const canvas = document.getElementById("Minefield");
const ctx = canvas.getContext("2d");

canvas.oncontextmenu = function() {
    return false;
}

var minesweeper = {};

minesweeper.Tiles = {
    Unrevealed : 9,
    Flag : 10,
    Mine : 11,
    MineClicked : 12,
    MineEliminated : 13
};

minesweeper.Mouse = {
    Left : 0,
    Right : 2
};

class TextureAtlas {
    constructor(image, tileSize) {
        this.image = image;
        this.tileSize = tileSize;
        this.width = this.image.naturalWidth / this.tileSize;
        this.height = this.image.naturalHeight / this.tileSize;
    }

    draw(spriteID, x, y) {
        var tileX = spriteID % this.width;
        var tileY = Math.floor(spriteID / this.width);
        ctx.drawImage(
            this.image,
            this.tileSize * tileX, this.tileSize * tileY,
            this.tileSize, this.tileSize,
            x, y,
            this.tileSize, this.tileSize
        );
    }
}

class Game {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.tileSize = minesweeper.textures.tileSize;
        this.ignoreInput = true;
    }

    revealEverything(victory) {
        this.ignoreInput = true;
        this.killMines(victory);
        for(let y = 0; y < this.height; y++) {
            for(let x = 0; x < this.width; x++) {
                minesweeper.textures.draw(this.getTile(x, y).ID, x * this.tileSize, y * this.tileSize);
            }
        }
    }

    reveal(x, y, directClick) {
        var tile = this.getTile(x, y);

        if(tile.ID < 9 && tile.ID > 0 && directClick) {
            this.revealUnflagged(x, y);
        }

        if(tile.revealed || tile.flagged) {
            return;
        }

        tile.revealed = true;

        if(tile.ID !== minesweeper.Tiles.Mine) {
            minesweeper.textures.draw(tile.neighbours, x * this.tileSize, y * this.tileSize);
            tile.ID = tile.neighbours;
            if(--this.unrevealed < 1) {
                this.revealEverything(true);
                return;
            }
        }

        if(tile.ID === minesweeper.Tiles.Mine) {
            tile.ID = minesweeper.Tiles.MineClicked;
            this.revealEverything(false);
            return;
        }

        if(tile.neighbours == 0) {
            this.revealNeighbours(x, y);
        }
    }

    revealUnflagged(x, y) {
        var tile = this.getTile(x, y);
        var flags = 0;
        for(let _y = y - 1; _y <= y + 1; _y++) {
            for(let _x = x - 1; _x <= x + 1; _x++) {
                var neighbour = this.getTile(_x, _y);
                if(neighbour !== undefined) {
                    if(neighbour.flagged) {
                        flags++;
                    }
                }
            }
        }
        if(flags == tile.ID) {
            this.revealNeighbours(x, y);
        }
    }

    flagUnrevealed(x, y) {
        var tile = this.getTile(x, y);
        var flags = 0;
        var unrevealed = 0;
        for(let _y = y - 1; _y <= y + 1; _y++) {
            for(let _x = x - 1; _x <= x + 1; _x++) {
                var neighbour = this.getTile(_x, _y);
                if(neighbour !== undefined) {
                    if(neighbour.flagged) {
                        flags++;
                    } else if(!neighbour.revealed) {
                        unrevealed++;
                    }
                }
            }
        }
        if(flags + unrevealed == tile.ID) {
            this.flagNeighbours(x, y);
        }

        console.log("flags:", flags, "unrevealed:", unrevealed, "tile.ID:", tile.ID);
    }

    revealNeighbours(x, y) {
        if(x - 1 >= 0) {
            this.reveal(x - 1, y, false);
        }

        if(x + 1 < this.width) {
            this.reveal(x + 1, y, false);
        }

        if(y - 1 >= 0) {
            this.reveal(x, y - 1, false);
        }

       if(y + 1 < this.height) {
            this.reveal(x, y + 1, false);
        }

        if(x - 1 >= 0 && y - 1 >= 0) {
            this.reveal(x - 1, y - 1, false);
        }
        if(x + 1 < this.width && y - 1 >= 0) {
            this.reveal(x + 1, y - 1, false);
        }

        if(x - 1 >= 0 && y + 1 < this.height) {
            this.reveal(x - 1, y + 1, false);
        }

        if(x + 1 < this.width && y + 1 < this.height) {
            this.reveal(x + 1, y + 1, false);
        }
    }

    flagNeighbours(x, y) {
        if(x - 1 >= 0) {
            this.flag(x - 1, y, false);
        }

        if(x + 1 < this.width) {
            this.flag(x + 1, y, false);
        }

        if(y - 1 >= 0) {
            this.flag(x, y - 1, false);
        }

       if(y + 1 < this.height) {
            this.flag(x, y + 1, false);
        }

        if(x - 1 >= 0 && y - 1 >= 0) {
            this.flag(x - 1, y - 1, false);
        }
        if(x + 1 < this.width && y - 1 >= 0) {
            this.flag(x + 1, y - 1, false);
        }

        if(x - 1 >= 0 && y + 1 < this.height) {
            this.flag(x - 1, y + 1, false);
        }

        if(x + 1 < this.width && y + 1 < this.height) {
            this.flag(x + 1, y + 1, false);
        }
    }

    flag(x, y, directClick) {
        var tile = this.getTile(x, y);

        if(tile.ID < 9 && tile.ID > 0 && directClick) {
            this.flagUnrevealed(x, y);
            return;
        }

        if(!directClick && tile.ID > 8) {
            tile.flagged = true;
            minesweeper.textures.draw(minesweeper.Tiles.Flag, x * this.tileSize, y * this.tileSize);
            return;
        }

        if(!tile.revealed) {
            if(tile.flagged) {
                tile.flagged = false;
                minesweeper.textures.draw(minesweeper.Tiles.Unrevealed, x * this.tileSize, y * this.tileSize);
            } else {
                tile.flagged = true;
                minesweeper.textures.draw(minesweeper.Tiles.Flag, x * this.tileSize, y * this.tileSize);
            }
        }
    }

    setTile(ID, x, y) {
        this.board[this.height * y + x].ID = ID;
    }

    getTile(x, y) {
        if(x < this.width && y < this.height && x >= 0 && y >= 0) {
            return this.board[this.height * y + x];
        }
        return undefined;
    }

    click(button, x, y) {
        if(this.ignoreInput) {
            return;
        }

        var cellX = Math.floor(x / this.tileSize);
        var cellY = Math.floor(y / this.tileSize);

        if(button === minesweeper.Mouse.Left) {
            if(this.firstClick) {
                this.firstClick = false;
                this.clearFirstClick(cellX, cellY);
                this.calculateNeighbouringMines();
            }
            this.reveal(cellX, cellY, true);
        }

        if(button === minesweeper.Mouse.Right) {
            this.flag(cellX, cellY, true);
        }
    }

    killMines(all) {
        for(let y = 0; y < this.height; y++) {
            for(let x = 0; x < this.width; x++) {
                var tile = this.getTile(x, y);
                if(tile.ID === minesweeper.Tiles.Mine && all) {
                    tile.ID = minesweeper.Tiles.MineEliminated;
                } else if(tile.ID === minesweeper.Tiles.Mine && tile.flagged) {
                    tile.ID = minesweeper.Tiles.MineEliminated;
                } else if(tile.ID !== minesweeper.Tiles.Mine && all) {
                    tile.ID = tile.neighbours;
                }
            }
        }
    }

    generateNewMinefield() {
        this.board = new Array(this.width * this.height);
        this.unrevealed = this.width * this.height;

        for(let y = 0; y < this.height; y++) {
            for(let x = 0; x < this.width; x++) {
                var cell = new Cell();
                if(Math.random() < 0.15) {
                    cell.ID = minesweeper.Tiles.Mine;
                } else {
                    cell.ID = minesweeper.Tiles.Unrevealed;
                }
                this.board[this.height * y + x] = cell;
            }
        }
    }

    clearFirstClick(x, y) {
        for(let _y = y - 1; _y <= y + 1; _y++) {
            for(let _x = x - 1; _x <= x + 1; _x++) {
                if(_x >= 0 && _x < this.width && _y >= 0 && _y < this.height) {
                    var tile = this.getTile(_x, _y);
                    if(tile !== undefined) {
                        tile.ID = minesweeper.Tiles.Unrevealed;
                    }
                }
            }
        }
    }

    calculateNeighbouringMines() {
        for(let y = 0; y < this.height; y++) {
            for(let x = 0; x < this.width; x++) {
                var tile = this.getTile(x, y);
                if(tile.ID === minesweeper.Tiles.Mine) {
                    tile.neighbours = -1;
                    this.unrevealed--;
                    continue;
                }

                var neighbours = 0;
                for(let _y = y - 1; _y <= y + 1; _y++) {
                    for(let _x = x - 1; _x <= x + 1; _x++) {
                        if(_x >= 0 && _x < this.width && _y >= 0 && _y < this.height) {
                            if(this.getTile(_x, _y).ID === minesweeper.Tiles.Mine) {
                                neighbours++;
                            }
                        }
                    }
                }
                tile.neighbours = neighbours;
            }
        }
    }

    start() {
        this._setupCanvas();
        this.generateNewMinefield();
        for(let y = 0; y < this.height; y++) {
            for(let x = 0; x < this.width; x++) {
                minesweeper.textures.draw(minesweeper.Tiles.Unrevealed, x * this.tileSize, y * this.tileSize);
            }
        }
        this.ignoreInput = false;
        this.firstClick = true;
    }

    _setupCanvas() {
        canvas.width = this.width * this.tileSize;
        canvas.height = this.height * this.tileSize;
        clearCanvas("#000000");
    }
}

class Cell {
    constructor() {
        this.ID = 0;
        this.flagged = false;
        this.revealed = false;
        this.neighbours = 0;
    }
}

function clearCanvas(colour) {
    ctx.fillStyle = colour;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for(var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    return false;
}

function loadTexture(src, callback) {
    var image = new Image();
    image.addEventListener("load", function() { callback(image); }, false);
    image.src = src;
}

function setup() {
    loadTexture("./tileset.png", run);
}

function run(image) {
    minesweeper.textures = new TextureAtlas(image, 16, 16);
    var width = getQueryVariable("width");
    var height = getQueryVariable("height");
    width = width === false ? 32 : width;
    height = height === false ? 32 : height;
    minesweeper.game = new Game(width, height);
    canvas.addEventListener("mousedown", function(event) { handleMouseInput(event); }, false);
    minesweeper.game.start();
}

function handleMouseInput(event) {
    var x = 0;
    var y = 0;
    if(event.pageX != undefined && event.pageY != undefined) {
        x = event.pageX;
        y = event.pageY;
    } else {
        x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;
    minesweeper.game.click(event.button, x, y);
}

window.addEventListener("load", setup, false);
