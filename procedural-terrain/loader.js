const __ICE__ = {
    includes : {},
    loaders : {}
};

const Resources = {
    Textures : {}
};

__ICE__.includes["JS"] = [
    "https://hevaesi.github.io/procedural-terrain/resources/js/main.js",
    "https://hevaesi.github.io/procedural-terrain/resources/js/noise.js",
    "https://hevaesi.github.io/procedural-terrain/resources/js/atlas.js",
    "https://hevaesi.github.io/procedural-terrain/resources/js/hexgrid.js",
    "https://hevaesi.github.io/procedural-terrain/resources/js/camera.js",
    "https://hevaesi.github.io/procedural-terrain/resources/js/input.js",
    "https://hevaesi.github.io/procedural-terrain/resources/js/terraingenerator.js",
    "https://hevaesi.github.io/procedural-terrain/resources/js/mathf.js"
];

__ICE__.includes["IMG"] = {
    "terrain" : "./resources/textures/terrain.png"
};

__ICE__.loaders["JS"] = (scripts, callback) => {
    var head = document.getElementsByTagName("head")[0];
    var count = scripts.length;
    for(let i = 0; i < scripts.length; i++) {
        var js = document.createElement("script");
        js.type = "text/javascript";
        js.addEventListener("load", () => {
            if(--count == 0) {
                callback();
            }
        });
        js.src = scripts[i];
        head.appendChild(js);
    }
};

__ICE__.loaders["IMG"] = (images, callback) => {
    var count = Object.keys(images).length;
    for(var key in images) {
        var img = new Image();
        img.addEventListener("load", () => {
            if(--count == 0) {
                callback();
            }
        });
        img.src = images[key];
        Resources.Textures[key] = img;
    }
};

__ICE__.Load = () => {
    var count = Object.keys(__ICE__.includes).length;
    for(var include in __ICE__.includes) {
        __ICE__.loaders[include](__ICE__.includes[include], () => {
            if(--count == 0) {
                __ICE__.Run();
            }
        });
    }
};

__ICE__.Run = () => {
    if(typeof(main) === "function") {
        main();
    }
    else {
        console.error("Please include function \"main\" in your main file!");
    }
}

window.addEventListener("load", () => {
    __ICE__.Load();
});
