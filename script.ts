const canvas = document.getElementById('canvas1') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particleArray: Particle[];

// Handle mouse
interface Mouse {
    x: number,
    y: number,
    radius: number
}

let mouse: Mouse = {
    x: 0,
    y: 0,
    radius: 150
}

window.addEventListener('mousemove', (event) => 
{
    mouse.x = event.x;
    mouse.y = event.y;
    //console.log(mouse.x, mouse.y)
});

ctx.fillStyle = 'white';
ctx.font = '2rem Verdana';
ctx.fillText('A', 0, 40);
const data = ctx.getImageData(0, 0, 100, 100);

class Particle {
    x: number;
    y: number;
    size: number;
    baseX: number;
    baseY: number;
    density: number;

    constructor(x: number, y: number)
    {
        this.x = x + 100;
        this.y = y;
        this.size = 3;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 30) + 1;
    }

    draw() 
    {
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }

    update()
    {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 10)
        {
            this.size = 5;
        }
        else 
        {
            this.size = 3;
        }
    }
}

function init()
{
    particleArray = [];
    for (let i = 0; i < 500; ++i)
    {
        let x = Math.random() * 500;
        let y = Math.random() * 500;
        particleArray.push(new Particle(x, y));
    }
}
init();

function animate()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particleArray.length; ++i)
    {
        particleArray[i].draw();
        particleArray[i].update();
    }
    requestAnimationFrame(animate);
}
animate();