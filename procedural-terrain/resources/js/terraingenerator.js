class TerrainGenerator {
    constructor(settings) {
        this.scale = settings.scale;
        this.scale_H = settings.scale;
        this.scale_B = settings.scale * settings.biomeScale;
        this.seed = Mathf.hash(settings.seed);
        this.offsetX_H = (this.seed & 0xFFF) * this.scale;
        this.offsetY_H = ((this.seed << 1) & 0xFFF) * this.scale;
        this.offsetX_T = ((this.seed << 2) & 0xFFF) * this.scale;
        this.offsetY_T = ((this.seed << 3) & 0xFFF) * this.scale;
        this.offsetX_P = ((this.seed << 4) & 0xFFF) * this.scale;
        this.offsetY_P = ((this.seed << 5) & 0xFFF) * this.scale;
        this.noise = new NoiseGenerator();
    }

    generate(x, y) {
        var noise = {};
        noise.height = this.getPerlinValue(x, y, this.offsetX_H, this.offsetY_H, this.scale_H);
        noise.temperature = this.getPerlinValue(x, y, this.offsetX_T, this.offsetY_T, this.scale_B);
        noise.humidity = this.getPerlinValue(x, y, this.offsetX_P, this.offsetY_P, this.scale_B);
        return noise;
    }

    getPerlinValue(x, y, offsetX, offsetY, scale) {
        var sampleX = (x + offsetX) * scale;
        var sampleY = (y + offsetY) * scale;
        return (this.noise.noise2D(sampleX, sampleY) + 1) / 2.0;
    }
}
