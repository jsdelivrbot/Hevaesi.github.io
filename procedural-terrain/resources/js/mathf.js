class Mathf {
    static hash(value) {
        var hash = 5381;
        value = "" + value;
        for(let i = 0; i < value.length; i++) {
            hash = ((hash << 5) + hash) + value.charCodeAt(i);
        }
        return hash;
    }

    static lerp(a, b, t) {
        return a + t * (b - a);
    }

    static inverseLerp(a, b, t) {
        return (t - a) / (b - a);
    }
}
