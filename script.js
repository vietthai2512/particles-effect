var canvas = document.getElementById('canvas1');
var ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var particleArray;
var mouse = {
    x: 0,
    y: 0,
    radius: 150
};
window.addEventListener('mousemove', function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
    //console.log(mouse.x, mouse.y)
});
ctx.fillStyle = 'white';
ctx.font = '2rem Verdana';
ctx.fillText('A', 0, 40);
var data = ctx.getImageData(0, 0, 100, 100);
var Particle = /** @class */ (function () {
    function Particle(x, y) {
        this.x = x + 100;
        this.y = y;
        this.size = 3;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 30) + 1;
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
        if (distance < 10) {
            this.size = 5;
        }
        else {
            this.size = 3;
        }
    };
    return Particle;
}());
function init() {
    particleArray = [];
    for (var i = 0; i < 500; ++i) {
        var x = Math.random() * 500;
        var y = Math.random() * 500;
        particleArray.push(new Particle(x, y));
    }
}
init();
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < particleArray.length; ++i) {
        particleArray[i].draw();
        particleArray[i].update();
    }
    requestAnimationFrame(animate);
}
animate();
