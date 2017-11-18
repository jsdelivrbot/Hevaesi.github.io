class TextureAtlas {
    constructor(image, tileW, tileH) {
        this.image = image;
        this.tileW = tileW;
        this.tileH = tileH;
        this.width = image.naturalWidth / tileW;
        this.height = image.naturalHeight / tileH;
    }

    draw(context, x, y, tileX, tileY) {
        context.drawImage(
            this.image,
            this.tileW * tileX, this.tileH * tileY,
            this.tileW, this.tileH,
            x, y,
            this.tileW, this.tileH
        );
    }
}
