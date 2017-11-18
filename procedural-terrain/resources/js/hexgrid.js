class HexGrid {
    constructor(offsetX, offsetY, offsetH, camera, atlas, generatorSettings) {
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.offsetH = offsetH;
        this.camera = camera;
        this.atlas = atlas;
        this.terrain = new TerrainGenerator(generatorSettings);
    }

    draw() {
        var camTileX = Math.floor(this.camera.x / this.offsetX);
        var camTileY = Math.floor(this.camera.y / this.offsetY);
        var minX = camTileX - 1;
        var maxX = camTileX + Math.floor(this.camera.viewPort.width / this.offsetX) + 1;
        var minY = camTileY - 3;
        var maxY = camTileY + Math.floor(this.camera.viewPort.height / this.offsetY) + 1;
        for(let y = minY; y < maxY; y++) {
            var offsetH = y % 2 === 0 ? 0 : this.offsetH;
            for(let x = minX; x < maxX; x++) {
                var tileX = x * this.offsetX + offsetH;
                var tileY = y * this.offsetY;
                var sprite = this.getTile(x, y);
                this.atlas.draw(this.camera.ctx, tileX - this.camera.x, tileY - this.camera.y, sprite.x, sprite.y);
            }
        } 
    }

    input() {
        this.camera.move(Input.X * Input.Strength.X, Input.Y * Input.Strength.Y);
    }

    getTile(x, y) {
        var noise = this.terrain.generate(x, y);
        var tile = {x : 0, y : 0};
        if(noise.height > 0.5) { // land
            if(noise.temperature > 0.5) { 
                if(noise.humidity < 0.33) { // desert
                    if(noise.height > 0.7) {
                        tile.x = 3;
                        tile.y = 0;
                    } else if(noise.height > 0.65) {
                        tile.x = 2;
                        tile.y = 0;
                    } else if(noise.height > 0.6) {
                        tile.x = 1;
                        tile.y = 0;
                    } else {
                        tile.x = 0;
                        tile.y = 0;
                    }
                } else { // tropical rainforest
                    tile.x = 4;
                    tile.y = 0;
                }
            } else if(noise.temperature > 0.45) {
                if(noise.height > 0.75) {
                    tile.x = 5;
                    tile.y = 1;
                } else {
                    if(noise.humidity > 0.66) { // tropical rainforest
                        tile.x = 4;
                        tile.y = 0;
                    } else if(noise.humidity > 0.55) { // else forest
                        if(noise.height < 0.65) {
                            tile.x = 2;
                            tile.y = 1
                        } else {
                            tile.x = 4;
                            tile.y = 1;
                        }
                    } else if(noise.humidity > 0.45) {
                        if(noise.height < 0.65) {
                            tile.x = 1;
                            tile.y = 1;
                        } else {
                            tile.x = 4;
                            tile.y = 1;
                        }
                    } else {
                        if(noise.height < 0.65) {
                            tile.x = 0;
                            tile.y = 1;
                        } else {
                            tile.x = 3;
                            tile.y = 1;
                        }
                    }
                }
            } else if(noise.temperature > 0.35) {
                if(noise.humidity > 0.6) { // swamp
                    tile.x = 2;
                    tile.y = 2;
                } else if(noise.humidity > 0.55) {
                    tile.x = 1;
                    tile.y = 2;
                } else if(noise.humidity > 0.5) {
                    tile.x = 0;
                    tile.y = 2;
                } else if(noise.humidity > 0.55) { // else forest
                    if(noise.height < 0.65) {
                        tile.x = 2;
                        tile.y = 1
                    } else if(noise.height < 0.75){
                        tile.x = 4;
                        tile.y = 1;
                    } else {
                        tile.x = 5;
                        tile.y = 1;
                    }
                } else if(noise.humidity > 0.45) {
                    if(noise.height < 0.65) {
                        tile.x = 1;
                        tile.y = 1
                    } else if(noise.height < 0.75){
                        tile.x = 4;
                        tile.y = 1;
                    } else {
                        tile.x = 5;
                        tile.y = 1;
                    }
                } else {
                    if(noise.height < 0.65) {
                        tile.x = 0;
                        tile.y = 1
                    } else if(noise.height < 0.75){
                        tile.x = 3;
                        tile.y = 1;
                    } else {
                        tile.x = 5;
                        tile.y = 1;
                    }
                }
            } else {
                if(noise.humidity > 0.6) { // taiga
                    if(noise.height < 0.65) {
                        tile.x = 2;
                        tile.y = 3;
                    } else if(noise.height < 0.75){
                        tile.x = 4;
                        tile.y = 3;
                    } else {
                        tile.x = 5;
                        tile.y = 1;
                    }
                } else if(noise.humidity > 0.55) {
                    if(noise.height < 0.65) {
                        tile.x = 1;
                        tile.y = 3;
                    } else if(noise.height < 0.75){
                        tile.x = 4;
                        tile.y = 3;
                    } else {
                        tile.x = 5;
                        tile.y = 1;
                    }
                } else {
                    if(noise.height < 0.65) {
                        tile.x = 0;
                        tile.y = 3;
                    } else if(noise.height < 0.75){
                        tile.x = 3;
                        tile.y = 3;
                    } else {
                        tile.x = 5;
                        tile.y = 1;
                    }
                }
            }
        } else {
            if(noise.temperature > 0.25) {
                tile.x = 5;
                tile.y = 0;
            } else {
                tile.x = 5;
                tile.y = 3;
            }
        }
        return tile;
    }
}
