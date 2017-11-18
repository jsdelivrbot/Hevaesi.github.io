class Camera {
    constructor(canvas) {
        this.viewPort = canvas;
        this.ctx = canvas.getContext("2d");
        this.x = 0;
        this.y = 0;
    }

    move(x, y) {
        this.x += x;
        this.y += y;
    }

    moveTo(x, y) {
        this.x = x;
        this.y = y;
    }
}
