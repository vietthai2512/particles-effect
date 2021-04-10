var canvas = document.getElementById('canvas1');
var ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var particleArray;
var adjustX = canvas.width / 200;
var adjustY = canvas.height / 200;
var mouse = {
    x: 0,
    y: 0,
    radius: 100
};
window.addEventListener('mousemove', function (event) {
    mouse.x = event.x + canvas.clientLeft / 2;
    mouse.y = event.y + canvas.clientTop / 2;
});
ctx.fillStyle = 'white';
ctx.font = 'bold 1rem Verdana';
ctx.fillText('THÁI', 0, 40);
var textCoordinates = ctx.getImageData(0, 0, canvas.width, 100);
var Particle = /** @class */ (function () {
    function Particle(x, y) {
        this.x = x;
        this.y = y;
        this.size = 3;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 30) + 1;
        this.random = Math.random();
        this.angle = Math.random() * 2;
    }
    Particle.prototype.draw = function () {
        if (this.random > 0.05) {
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }
        else {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            ctx.restore();
        }
    };
    Particle.prototype.update = function () {
        var dx = mouse.x - this.x;
        var dy = mouse.y - this.y;
        var distance = Math.sqrt(dx * dx + dy * dy);
        var forceDirectionX = dx / distance;
        var forceDirectionY = dy / distance;
        var maxDistance = mouse.radius;
        var force = (maxDistance - distance) / maxDistance;
        if (force < 0)
            force = 0;
        var directionX = forceDirectionX * force * this.density;
        var directionY = forceDirectionY * force * this.density;
        if (distance < mouse.radius + this.size) {
            this.x -= directionX;
            this.y -= directionY;
        }
        else {
            if (this.x !== this.baseX) {
                var dx_1 = this.x - this.baseX;
                this.x -= dx_1 / 10;
            }
            if (this.y !== this.baseY) {
                var dy_1 = this.y - this.baseY;
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
                particleArray.push(new Particle(positionX * 15, positionY * 15));
            }
        }
    }
}
function animate() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    connect();
    for (var i = 0; i < particleArray.length; ++i) {
        particleArray[i].update();
        particleArray[i].draw();
    }
    requestAnimationFrame(animate);
}
init();
animate();
window.addEventListener('resize', function () {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    adjustX = canvas.width / 200;
    adjustY = canvas.height / 200;
    init();
});
function connect() {
    var opacityValue = 1;
    for (var a = 0; a < particleArray.length; a++) {
        for (var b = a; b < particleArray.length; b++) {
            var dx = particleArray[a].x - particleArray[b].x;
            var dy = particleArray[a].y - particleArray[b].y;
            var distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 50) {
                opacityValue = 1 - (distance / 50);
                var dMouseX = mouse.x - particleArray[a].x;
                var dMouseY = mouse.y - particleArray[a].y;
                var mouseDistance = Math.sqrt(dMouseX * dMouseX + dMouseY * dMouseY);
                if (mouseDistance < mouse.radius / 2) {
                    ctx.strokeStyle = 'rgba(255,255,0,' + opacityValue + ')';
                }
                else if (mouseDistance < mouse.radius - 50) {
                    ctx.strokeStyle = 'rgba(255,255,140,' + opacityValue + ')';
                }
                else if (mouseDistance < mouse.radius + 20) {
                    ctx.strokeStyle = 'rgba(255,255,210,' + opacityValue + ')';
                }
                else {
                    ctx.strokeStyle = 'rgba(255,255,255,' + opacityValue + ')';
                }
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particleArray[a].x, particleArray[a].y);
                ctx.lineTo(particleArray[b].x, particleArray[b].y);
                ctx.stroke();
            }
        }
    }
}
