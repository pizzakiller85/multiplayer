"use strict";
var shareStateTimeInterval = 10;
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let max = 200;
let x = canvas.width / 2 + Math.floor(Math.random() * max);
let y = canvas.height / 2 + Math.floor(Math.random() * max);
const size = 20;
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
        document.getElementById("pingAvg").innerHTML = (latencyAvg / 60).toFixed(2) + "ms";

        latencyAvg = 0
    }
    allPositions
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
    connection.invoke("ShareUserPosition", userid.toString(), x, y,
        keysPressed.ArrowUp, keysPressed.ArrowRight, keysPressed.ArrowDown, keysPressed.ArrowLeft
    ).catch(function (err) {
        return console.error(err.toString());
    });
}
let fixX = 200;
let fixY = 200;
function tempFixedCircle() {
    ctx.beginPath();
    ctx.fillStyle = '#000000';

    ctx.arc(fixX, fixY, size, 0, 2 * Math.PI);

    ctx.fill();
    ctx.closePath();
}

function drawAll(allPostions) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    tempFixedCircle();
    var count = 0;
    allPostions.forEach(function (val, key, map) {
        count++;
        ctx.beginPath();
        ctx.fillStyle = '#'+ val.Key;
        
        var x = val.Value.x;
        var y = val.Value.y;

        ctx.arc(x, y, size, 0, 2 * Math.PI);
        
        ctx.fill();
        ctx.closePath();

        //ctx.fillRect(x, y, 1, 1);
    });

    document.getElementById("playerCount").innerHTML = count;


    
}
function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
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

    var dist = distance(fixX, fixY, x, y);
    if (dist < size * 2) {
    //if (false) {
        let vCollision = { x: fixX - x, y: fixY - y };

        let vC = { x: vCollision.x / dist, y: vCollision.y / dist };
        console.log(vC)
        
        x=x - vC.x;
        y=y - vC.y;
        fixX=fixX + vC.x;
        fixY = fixY + vC.y;

        console.log(fixX);
        console.log(fixY);

        //fixX--;
    }

    //console.log(dist);

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

