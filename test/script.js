var ce = {
    cSize : {
        width : 800,
        height : 600
    },
    vConstraints : {
        audio : false,
        video : {
            width : 800,
            height : 600
        }
    }
};

function setupScopeVariables(scope) {
    scope.canvas = document.getElementById("canvas");
    scope.ctx = ce.canvas.getContext("2d");
    scope.canvas.width = ce.cSize.width;
    scope.canvas.height = ce.cSize.height;
    scope.video = document.getElementById("camera-stream");
}

function enableCamera() {
    navigator.mediaDevices.getUserMedia(ce.vConstraints)
    .then((stream) => {
        ce.video.srcObject = stream;
        ce.video.onloadedmetadata = () => {
            ce.video.play();
        }
    })
    .catch((err) => {
        console.log(err.name + " " + err.message);
    });
}

function drawOnCanvas() {
    ce.ctx.drawImage(ce.video, 0, 0)
}

setupScopeVariables(ce);
enableCamera();
