class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    setMagnitude(newMagnitude, magnitude) {
        var magnitudeRatio = newMagnitude / (magnitude || this.getMagnitude());
        this.x *= magnitudeRatio;
        this.y *= magnitudeRatio;
    }

    getMagnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    limit(maxMagnitude) {
        var magnitude = this.getMagnitude();
        if(magnitude > maxMagnitude) {
            this.setMagnitude(maxMagnitude, magnitude);
        }
    }

    normalize() {
        var magnitude = this.getMagnitude();
        if(magnitude > 0) {
            this.div(magnitude);
        }
    }

    div(scalar) {
        this.x /= scalar;
        this.y /= scalar;
    }

    mul(scalar) {
        this.x *= scalar;
        this.y *= scalar;
    }
}
