const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const gameOverScreen = document.getElementById("gameOverScreen");
const restartButton = document.getElementById("restartButton");
const finalScore = document.getElementById("finalScore");

canvas.width = 320;
canvas.height = 480;

const GRAVITY = 0.25;
const FLAP = -5;
const SPAWN_RATE = 90;
const PIPE_WIDTH = 50;
const PIPE_SPACING = 200;
const PIPE_GAP = 150;
const BIRD_WIDTH = 30;
const BIRD_HEIGHT = 30;

let bird = { x: 50, y: canvas.height / 2, velocity: 0 };
let pipes = [];
let score = 0;
let gameRunning = true;

function createPipe() {
    const pipeHeight = Math.floor(Math.random() * (canvas.height - PIPE_GAP));
    pipes.push({
        x: canvas.width,
        top: pipeHeight,
        bottom: pipeHeight + PIPE_GAP
    });
}

function drawBird() {
    bird.velocity += GRAVITY;
    bird.y += bird.velocity;

    if (bird.y + BIRD_HEIGHT > canvas.height) {
        endGame();
    }

    ctx.fillStyle = "yellow";
    ctx.fillRect(bird.x, bird.y, BIRD_WIDTH, BIRD_HEIGHT);
}

function drawPipes() {
    for (let i = 0; i < pipes.length; i++) {
        const pipe = pipes[i];
        ctx.fillStyle = "green";
        ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.top); // top pipe
        ctx.fillRect(pipe.x, pipe.bottom, PIPE_WIDTH, canvas.height - pipe.bottom); // bottom pipe

        pipe.x -= 2;

        if (pipe.x + PIPE_WIDTH <= 0) {
            pipes.splice(i, 1);
            score++;
            i--;
        }

        // Collision detection
        if (
            bird.x + BIRD_WIDTH > pipe.x &&
            bird.x < pipe.x + PIPE_WIDTH &&
            (bird.y < pipe.top || bird.y + BIRD_HEIGHT > pipe.bottom)
        ) {
            endGame();
        }
    }
}

function drawScore() {
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 30);
}

function endGame() {
    gameRunning = false;
    finalScore.textContent = score;
    gameOverScreen.style.display = "block";
}

function restartGame() {
    bird = { x: 50, y: canvas.height / 2, velocity: 0 };
    pipes = [];
    score = 0;
    gameRunning = true;
    gameOverScreen.style.display = "none";
    gameLoop();
}

function gameLoop() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBird();
    drawPipes();
    drawScore();

    if (Math.random() < 1 / SPAWN_RATE) {
        createPipe();
    }

    requestAnimationFrame(gameLoop);
}

function flap() {
    if (gameRunning) {
        bird.velocity = FLAP;
    }
}

document.addEventListener("keydown", flap);
document.addEventListener("click", flap);
restartButton.addEventListener("click", restartGame);

gameLoop();
