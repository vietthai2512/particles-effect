var canvas = document.getElementById('canvas1');
var ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var particleArray;
var adjustX = 5;
var adjustY = 12;
var mouse = {
    x: 0,
    y: 0,
    radius: 150
};
window.addEventListener('mousemove', function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
});
ctx.fillStyle = 'white';
ctx.font = '1rem Verdana';
ctx.fillText('Abc', 0, 30);
var textCoordinates = ctx.getImageData(0, 0, 100, 100);
var Particle = /** @class */ (function () {
    function Particle(x, y) {
        this.x = x + 100;
        this.y = y;
        this.size = 3;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 40) + 5;
    }
    Particle.prototype.draw = function () {
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    };
    Particle.prototype.update = function () {
        var dx = mouse.x - this.x;
        var dy = mouse.y - this.y;
        var distance = Math.sqrt(dx * dx + dy * dy);
        var forceDirectionX = dx / distance;
        var forceDirectionY = dy / distance;
        var maxDistance = mouse.radius;
        var force = (maxDistance - distance) / maxDistance;
        var directionX = forceDirectionX * force * this.density;
        var directionY = forceDirectionY * force * this.density;
        if (distance < mouse.radius) {
            this.x -= directionX;
            this.y -= directionY;
        }
        else {
            if (this.x !== this.baseX) {
                var dx_1 = this.x - this.baseX;
                this.x -= dx_1 / 10;
            }
            if (this.y !== this.baseY) {
                var dy_1 = this.y = this.baseY;
                this.y -= dy_1 / 10;
            }
        }
    };
    return Particle;
}());
function init() {
    particleArray = [];
    for (var y = 0, y2 = textCoordinates.height; y < y2; ++y) {
        for (var x = 0, x2 = textCoordinates.width; x < x2; ++x) {
            if (textCoordinates.data[(y * 4 * textCoordinates.width) + (x * 4) + 3] > 128) {
                var positionX = x + adjustX;
                var positionY = y + adjustY;
                particleArray.push(new Particle(positionX * 20, positionY * 20));
            }
        }
    }
}
init();
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < particleArray.length; ++i) {
        particleArray[i].draw();
        particleArray[i].update();
    }
    connect();
    requestAnimationFrame(animate);
}
animate();
function connect() {
    var opacityValue = 1;
    for (var a = 0; a < particleArray.length; a++) {
        for (var b = a; b < particleArray.length; b++) {
            var dx = particleArray[a].x - particleArray[b].x;
            var dy = particleArray[a].y - particleArray[b].y;
            var distance = Math.sqrt(dx * dx + dy * dy);
            opacityValue = 1 - (distance / 50);
            ctx.strokeStyle = 'rgba(255, 255, 255,' + opacityValue + ')';
            if (distance < 50) {
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(particleArray[a].x, particleArray[a].y);
                ctx.lineTo(particleArray[b].x, particleArray[b].y);
                ctx.stroke();
            }
        }
    }
}
