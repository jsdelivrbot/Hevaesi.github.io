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
        if(victory) {
            this.killMines();
        }
        for(let y = 0; y < this.height; y++) {
            for(let x = 0; x < this.width; x++) {
                minesweeper.textures.draw(this.getTile(x, y).ID, x * this.tileSize, y * this.tileSize);
            }
        }
        enableContextMenu(true);
    }

    reveal(x, y) {
        var tile = this.getTile(x, y);
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

        if(tile.neighbours < 1) {
            this.revealNeighbours(x, y);
        }
    }

    revealNeighbours(x, y) {
        if(x - 1 >= 0) {
            this.reveal(x - 1, y);
        }

        if(x + 1 < this.width) {
            this.reveal(x + 1, y);
        }

        if(y - 1 >= 0) {
            this.reveal(x, y - 1);
        }

        if(y + 1 < this.height) {
            this.reveal(x, y + 1);
        }

        if(x - 1 >= 0 && y - 1 >= 0) {
            this.reveal(x - 1, y - 1);
        }

        if(x + 1 < this.width && y - 1 >= 0) {
            this.reveal(x + 1, y - 1);
        }

        if(x - 1 >= 0 && y + 1 < this.height) {
            this.reveal(x - 1, y + 1);
        }

        if(x + 1 < this.width && y + 1 < this.height) {
            this.reveal(x + 1, y + 1);
        }
    }

    flag(x, y) {
        var tile = this.getTile(x, y);
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
        return this.board[this.height * y + x];
    }

    click(button, x, y) {
        if(this.ignoreInput) {
            return;
        }

        var cellX = Math.floor(x / this.tileSize);
        var cellY = Math.floor(y / this.tileSize);

        if(button === minesweeper.Mouse.Left) {
            this.reveal(cellX, cellY);
        }

        if(button === minesweeper.Mouse.Right) {
            this.flag(cellX, cellY);
        }
    }

    killMines() {
        for(let y = 0; y < this.height; y++) {
            for(let x = 0; x < this.width; x++) {
                var tile = this.getTile(x, y);
                if(tile.ID === minesweeper.Tiles.Mine) {
                    tile.ID = minesweeper.Tiles.MineEliminated;
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
                    this.unrevealed--;
                } else {
                    cell.ID = minesweeper.Tiles.Unrevealed;
                }
                this.board[this.height * y + x] = cell;
            }
        }
    }

    calculateNeighbouringMines() {
        for(let y = 0; y < this.height; y++) {
            for(let x = 0; x < this.width; x++) {
                var tile = this.getTile(x, y);
                if(tile.ID === minesweeper.Tiles.Mine) {
                    tile.neighbours = -1;
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
                console.log(neighbours);
            }
        }
    }

    start() {
        this._setupCanvas();
        this.generateNewMinefield();
        this.calculateNeighbouringMines();
        for(let y = 0; y < this.height; y++) {
            for(let x = 0; x < this.width; x++) {
                minesweeper.textures.draw(minesweeper.Tiles.Unrevealed, x * this.tileSize, y * this.tileSize);
            }
        }
        this.ignoreInput = false;
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
