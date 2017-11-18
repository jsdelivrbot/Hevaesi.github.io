const Input = {
    Strength : {
        X : 8,
        Y : 6
    },
    X : 0,
    Y : 0
};

document.addEventListener("keydown", (event) => {
    if(event.keyCode == 37) {
        Input.X = -1;
    }
    if(event.keyCode == 39) {
       Input.X = 1;
    }
    if(event.keyCode == 38) {
        Input.Y = -1;
    }
    if(event.keyCode == 40) {
        Input.Y = 1;
    }
});

document.addEventListener("keyup", (event) => {
    if(event.keyCode == 37) {
        Input.X = 0;
    }
    if(event.keyCode == 39) {
       Input.X = 0;
    }
    if(event.keyCode == 38) {
        Input.Y = 0;
    }
    if(event.keyCode == 40) {
        Input.Y = 0;
    }
});
