const GeneratorSettings = {
    scale : 0.0656146466,
    biomeScale : 1,
};

const cameraPosition = document.getElementById("cameraPosition");

function main() {
    var seed = prompt("Please enter world seed:", "seed");
    if(seed == null || seed == "") {
        seed = "DEFAULT";
        alert("You haven't entered a seed, so \""+seed+"\" will be used. Every seed corresponds to *mostly* unique world, so if you saw something and liked it, you can always get back to it!");
    }
    GeneratorSettings.seed = seed;

    var img = Resources.Textures.terrain;
    var atlas = new TextureAtlas(img, 32, 48);

    var canvas = document.getElementById("canvas");
    canvas.height = 360;
    canvas.width = 480;

    var camera = new Camera(canvas);
    var grid = new HexGrid(48, 14, 24, camera, atlas, GeneratorSettings);
    draw(grid);
}

function draw(sceneManager) {
    sceneManager.input();
    sceneManager.draw();
    requestAnimationFrame(() => draw(sceneManager));
}
