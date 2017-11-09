var ce = {
    "cSize" : {
        "width" : 800,
        "height" : 600
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
    navigator.getUserMedia(
        {video : true}, 
        (stream) => {
            ce.video.src = window.URL.createObjectURL(stream);
            ce.video.play();
            ce.video.onplay = () => {
                showVideo();
            }
        },
        (err) => {
            displayErrorMessage("There was an error with accessing camera stream: " + err.name, err);
        }
    );
}

function showVideo() {
    ce.video.classList.add("visible");
}

setupScopeVariables(ce);
enableCamera();
