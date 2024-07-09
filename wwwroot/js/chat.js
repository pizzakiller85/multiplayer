"use strict";
var shareStateTimeInterval = 10;
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

connection.on("AllUserPositions", function (positions) {
    var allPositions = JSON.parse(positions);
    drawAll(allPositions);
});

connection.start().then(function () {

	console.log("start interval");
    var itnevalId = window.setInterval(shareState, shareStateTimeInterval);
  
}).catch(function (err) {
    return console.error(err.toString());
});

function shareState()
{
	console.log("test:"+ userid);
	console.log(x);
    console.log(y);
    connection.invoke("ShareUserPosition", userid.toString(), x, y).catch(function (err) {
        return console.error(err.toString());
    });
}
