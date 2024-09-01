"use strict";
var shareStateTimeInterval = 10;
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let max = 200;
let x = canvas.width / 2 + Math.floor(Math.random() * max);
let y = canvas.height / 2 + Math.floor(Math.random() * max);
const size = 10;
const speed = 1;
var speedX = 0;
var speedY = 0;
const maxSpeed = 10;
var acc = 0.12;
var friction = 0.98;

var canvasHeight = 600; // html has the actual canvas value

let keysPressed = {};

// ------- latency variables   -------
let latency = 3;

let send;
let recieve;

let latencyCount = 0;
let latencyAvg = 0;


var userid = createHEXColor();
function createHEXColor() {
    let color = Math.floor(Math.random() * 16777215).toString(16);
    return color.padStart(6, '0');
}
function getRandomHexColor() {
    let color = Math.floor(Math.random() * 16777215).toString(16);
    return '#' + color.padStart(6, '0');
}

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

// step 2 get all positions
connection.on("AllUserPositions", function (positions) {
    recieve = performance.now();
    latency = Math.round(recieve - send);
    latencyAvg += latency;
    latencyCount++;
    if (latencyCount >= 60) {
        latencyCount = 0;
        document.getElementById("pingAvg").innerHTML = latencyAvg / 60 + "ms";

        latencyAvg = 0
    }
    var allPositions = JSON.parse(positions);
    drawAll(allPositions);
});

connection.start().then(function () {
    console.log("start interval");
    window.setInterval(shareState, shareStateTimeInterval); // on signalr load step 0, set interval
}).catch(function (err) {
    return console.error(err.toString());
});


// main loop --  step 1
function shareState() {

    document.getElementById("ping").innerHTML = latency + "ms";
    send = performance.now();
    movePlayer();
    connection.invoke("ShareUserPosition", userid.toString(), x, y).catch(function (err) {
        return console.error(err.toString());
    });
}

function drawAll(allPostions) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    allPostions.forEach(function (val, key, map) {
        ctx.fillStyle = '#'+ val.Key;
        
        var x = val.Value.x;
        var y = val.Value.y;
        
        ctx.fillRect(x, y, size, size);
    });
}
function movePlayer() {
    if (keysPressed.ArrowUp) speedY -= acc;
    if (keysPressed.ArrowDown) speedY += acc; 
    if (keysPressed.ArrowLeft) speedX -= acc; 
    if (keysPressed.ArrowRight) speedX += acc;  

    speedX *= friction;
    speedY *= friction;

    speedX = Math.max(Math.min(speedX, maxSpeed), -maxSpeed);
    speedY = Math.max(Math.min(speedY, maxSpeed), -maxSpeed);

    x += speedX;
    y += speedY;

    if (x < 0) {
        x = 0;
    }
    if (x > canvasHeight - size ) {
        x = canvasHeight - size;
    }
    if (y < 0) {
        y = 0;
    }
    if (y > canvasHeight - size ) {
        y = canvasHeight - size;
    }
}

document.addEventListener('keydown', (event) => {
    keysPressed[event.code] = true;
});

document.addEventListener('keyup', (event) => {
    keysPressed[event.code] = false;
});

