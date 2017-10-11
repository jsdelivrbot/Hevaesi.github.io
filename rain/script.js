// Get and setup canvas
const canvas = document.getElementById("mainCanvas");

// Get context
const ctx = canvas.getContext("2d");

// Class definitions
class RainDrop {
	constructor () {
		this.depth = random(20);
		this.x = random(canvas.width);
		this.y = random(-canvas.height * 2, -canvas.height);
		this.height = 3;
		this.velocity = random(5, 10);
	}

	update() {
		this.y += this.velocity + Math.floor(0.1 * this.depth);
		if(this.y > canvas.height) {
			this.reset();
		}
	}

	draw() {
		line(this.x, this.y, this.x, this.y + this.height + this.depth, raindropColour);
	}

	reset() {
		this.y = 0;
		this.x = random(canvas.width);
		this.velocity = random(5, 10);
	}
}

// Variables
let backgroundColour = setColour("background", "#000000");
let raindropColour = setColour("drop", "#3F9CCF");
let rainDrops;

// Clears canvas using given colour
//====================================================================================================
// If colour is not specified, defaults to black
function clear(colour) {
	if(typeof colour === "undefined") {
		colour = "#000000";
	}
	ctx.fillStyle = colour;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Populates rainDrops array with RainDrop objects
function createRaindrops(amount) {
	rainDrops = [];
	for(let i = 0; i < amount; i++) {
		rainDrops.push(new RainDrop());
	}
}

// Makes sure that canvas always are in fullscreen mode
function handleResize() {
	if(canvas.width !== window.innerWidth) {
		canvas.width = window.innerWidth;
	}
	if(canvas.height !== window.innerHeight) {
		canvas.height = window.innerHeight;
	}
}

// Gets query variable from url
function getQueryVariable(variable) {
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for(var i = 0; i < vars.length; i++) {
		var pair = vars[i].split("=");
		if (decodeURIComponent(pair[0]) == variable) {
			return decodeURIComponent(pair[1]);
		}
	}
	return false;
}

function setColour(type, defaultColour) {
	var colour = getQueryVariable(type);
	if(!colour) {
		return defaultColour;
	} else {
		return "#" + colour;
	}
}

// Draws a line between two specified points
function line(x1, y1, x2, y2, colour) {
	ctx.strokeStyle = colour;
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.stroke();
}

// Main loop function
function mainLoop() {
	clear(backgroundColour);
	for(let i = 0; i < rainDrops.length; i++) {
		rainDrops[i].update();
		rainDrops[i].draw();
	}
	requestAnimationFrame(mainLoop);
}

// Generates a random number in specified range [min, max]
//====================================================================================================
// If only one integer is passed in, min is 0 and max is set to given integer
function random(min, max) {
	if(typeof max === "undefined") {
		max = min;
		min = 0;
	}
	return Math.floor(Math.random() * (++max - min)) + min;
}

// Sets everything up
function setup() {
	handleResize();
	createRaindrops(500);
	mainLoop();
}

// Event that fires on window resize
window.addEventListener("resize", handleResize);

setup();
