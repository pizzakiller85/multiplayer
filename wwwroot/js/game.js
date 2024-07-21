const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let max = 200;
let x = canvas.width / 2 + Math.floor(Math.random() * max);
let y = canvas.height / 2 + Math.floor(Math.random() * max);
const size = 20;
const speed = 3;

function drawAll(allPostions) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    allPostions.forEach(function (val, key, map) {
        ctx.fillStyle = '#'+ val.Key;
        
        var x = val.Value.x;
        var y = val.Value.y;
        
        ctx.fillRect(x, y, size, size);
    });
}

function moveSquare(e) {
    switch (e.key) {
        case 'ArrowUp':
            y -= speed;
            break;
        case 'ArrowDown':
            y += speed;
            break;
        case 'ArrowLeft':
            x -= speed;
            break;
        case 'ArrowRight':
            x += speed;
            break;
    }
}

document.addEventListener('keydown', moveSquare);
