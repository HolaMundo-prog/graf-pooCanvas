// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Clase Ball (Pelota)
class Ball {
    constructor(x, y, radius, speedX, speedY, color = 'red') {
        this.initialX = x;
        this.initialY = y;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speedX = speedX;
        this.speedY = speedY;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    move() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.y - this.radius <= 0 || this.y + this.radius >= canvas.height) {
            this.speedY = -this.speedY;
        }
    }

    reset() {
        this.x = this.initialX;
        this.y = this.initialY;
        this.speedX = -this.speedX;
    }
}

// Clase Paddle (Paleta)
class Paddle {
    constructor(x, y, width, height, isPlayerControlled = false) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.isPlayerControlled = isPlayerControlled;
        this.speed = 6;
    }

    draw(color = 'blue') {
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    move(direction) {
        if (direction === 'up' && this.y > 0) {
            this.y -= this.speed;
        } else if (direction === 'down' && this.y + this.height < canvas.height) {
            this.y += this.speed;
        }
    }

    autoMove(ball) {
        if (ball.y < this.y + this.height / 2) {
            this.y -= this.speed;
        } else if (ball.y > this.y + this.height / 2) {
            this.y += this.speed;
        }
    }
}

// Clase Game
class Game {
    constructor() {
        this.balls = [
            new Ball(200, 100, 10, 4, 3, 'red'),
            new Ball(300, 150, 12, -3, 2.5, 'green'),
            new Ball(150, 200, 14, 2.5, -3, 'blue'),
            new Ball(400, 250, 16, -2.8, -3.5, 'orange'),
            new Ball(250, 120, 18, 3.2, 3.2, 'purple'),
        ];

        this.paddle1 = new Paddle(0, canvas.height / 2 - 50, 10, 100, true);
        this.paddle2 = new Paddle(canvas.width - 10, canvas.height / 2 - 50, 10, 100);
        this.keys = {};

        this.scorePlayer = 0;
        this.scoreAI = 0;
    }

    drawScores() {
        ctx.font = "20px Arial";
        ctx.fillStyle = "black";
        ctx.fillText(`Jugador: ${this.scorePlayer}`, 20, 30);
        ctx.fillText(`IA: ${this.scoreAI}`, canvas.width - 100, 30);
    }

    draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        this.balls.forEach(ball => ball.draw());

        this.paddle1.draw('blue');
        this.paddle2.draw('yellow');

        this.drawScores();
    }

    update() {
        this.balls.forEach(ball => {
            ball.move();

            this.paddle2.autoMove(this.balls[0]);

            if (this.keys['ArrowUp']) this.paddle1.move('up');
            if (this.keys['ArrowDown']) this.paddle1.move('down');

            // Colisiones
            if (
                ball.x - ball.radius <= this.paddle1.x + this.paddle1.width &&
                ball.y >= this.paddle1.y &&
                ball.y <= this.paddle1.y + this.paddle1.height
            ) {
                ball.speedX = Math.abs(ball.speedX);
            }

            if (
                ball.x + ball.radius >= this.paddle2.x &&
                ball.y >= this.paddle2.y &&
                ball.y <= this.paddle2.y + this.paddle2.height
            ) {
                ball.speedX = -Math.abs(ball.speedX);
            }

            // Puntos
            if (ball.x + ball.radius < 0) {
                this.scoreAI++;
                ball.reset();
            }

            if (ball.x - ball.radius > canvas.width) {
                this.scorePlayer++;
                ball.reset();
            }
        });
    }

    handleInput() {
        window.addEventListener('keydown', (event) => {
            this.keys[event.key] = true;
        });

        window.addEventListener('keyup', (event) => {
            this.keys[event.key] = false;
        });
    }

    run() {
        this.handleInput();
        const gameLoop = () => {
            this.update();
            this.draw();
            requestAnimationFrame(gameLoop);
        };
        gameLoop();
    }
}

// Iniciar juego
const game = new Game();
game.run();
