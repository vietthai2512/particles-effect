const canvas = document.getElementById('canvas1') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particleArray: Particle[];
let adjustX = canvas.width / 200;
let adjustY = canvas.height / 200;

// Handle mouse
interface Mouse {
    x: number,
    y: number,
    radius: number
}

let mouse: Mouse = {
    x: 0,
    y: 0,
    radius: 100
}

window.addEventListener('mousemove', (event) => 
{
    mouse.x = event.x + canvas.clientLeft / 2;
    mouse.y = event.y + canvas.clientTop / 2;
});

ctx.fillStyle = 'white';
ctx.font = 'bold 1rem Verdana';
ctx.fillText('THÁI', 0, 40);
const textCoordinates = ctx.getImageData(0, 0, canvas.width, 100);

class Particle {
    x: number;
    y: number;
    size: number;
    baseX: number;
    baseY: number;
    density: number;
    random: number;
    angle: number;

    constructor(x: number, y: number)
    {
        this.x = x;
        this.y = y;
        this.size = 3;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 30) + 1;
        this.random = Math.random();
        this.angle = Math.random() * 2;
    }

    draw() 
    {
        if (this.random > 0.05)
        {
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }
        else 
        {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            ctx.restore();
        }
    }

    update()
    {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;

        let maxDistance = mouse.radius;

        let force = (maxDistance - distance) / maxDistance;
        if (force < 0) force = 0;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;

        if (distance < mouse.radius + this.size)
        {
            this.x -= directionX;
            this.y -= directionY;
        }
        else 
        {
            if (this.x !== this.baseX)
            {
                let dx = this.x - this.baseX;
                this.x -= dx / 10;
            }
            
            if (this.y !== this.baseY)
            {
                let dy = this.y - this.baseY;
                this.y -= dy / 10;
            }
        }
    }
}

function init()
{
    particleArray = [];
    for (let y = 0, y2 = textCoordinates.height; y < y2; ++y)
    {
        for (let x = 0, x2 = textCoordinates.width; x < x2; ++x)
        {
            if (textCoordinates.data[(y * 4 * textCoordinates.width) + (x * 4) + 3] > 128)
            {
                let positionX = x + adjustX;
                let positionY = y + adjustY;
                particleArray.push(new Particle(positionX * 15, positionY * 15));
            }
        }
    }
}

function animate()
{
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    connect();
    for (let i = 0; i < particleArray.length; ++i)
    {
        particleArray[i].update();
        particleArray[i].draw();
    }
    requestAnimationFrame(animate);
}
init();
animate();

window.addEventListener('resize', () =>
{
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    adjustX = canvas.width / 200;
    adjustY = canvas.height / 200;
    init();
})

function connect()
{
    let opacityValue = 1;
    for (let a = 0; a < particleArray.length; a++)
    {
        for (let b = a; b < particleArray.length; b++)
        {
            let dx = particleArray[a].x - particleArray[b].x;
            let dy = particleArray[a].y - particleArray[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 50)
            {
                opacityValue = 1 - (distance / 50);
                let dMouseX = mouse.x - particleArray[a].x;
                let dMouseY = mouse.y - particleArray[a].y;
                let mouseDistance = Math.sqrt(dMouseX * dMouseX + dMouseY * dMouseY);

                if (mouseDistance < mouse.radius / 2) 
                {
                    ctx.strokeStyle = 'rgba(255,255,0,' + opacityValue + ')';
                }
                else if (mouseDistance < mouse.radius - 50)
                {
                    ctx.strokeStyle = 'rgba(255,255,140,' + opacityValue + ')';
                } 
                else if (mouseDistance < mouse.radius + 20)
                {
                    ctx.strokeStyle = 'rgba(255,255,210,' + opacityValue + ')';
                } 
                else
                {
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