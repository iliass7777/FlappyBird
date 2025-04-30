document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    const birdImg = new Image();
    birdImg.src = '/static/images/bird.png';


    let birdY = 200;
    let birdVelocity = 0;
    const gravity = 0.5;
    const jumpStrength = -8;

    let score = 0;
    let isGameOver = false;

    const birdX = 100;
    const birdWidth = 40;
    const birdHeight = 30;

    // Obstacles (tuyaux) 
    let pipes = [];
    const pipeWidth = 60;
    const pipeGap = 200;
    let frameCount = 0;

    function resetGame() {
        birdY = 200;
        birdVelocity = 0;
        pipes = [];
        score = 0;
        isGameOver = false;
        frameCount = 0;
    }

    function drawBird() {
        ctx.drawImage(birdImg, birdX, birdY, birdWidth, birdHeight);
    }

    function drawPipes() {
        ctx.fillStyle = 'black';
        pipes.forEach(pipe => {
            // haut
            ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
            // bas
            ctx.fillRect(pipe.x, pipe.top + pipeGap, pipeWidth, canvas.height);
        });
    }

    function drawScore() {
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.fillText(`Score: ${score}`, 10, 40);
    }

    function updatePipes() {
        pipes.forEach(pipe => pipe.x -= 2);
        if (frameCount % 100 === 0) {
            const topHeight = Math.floor(Math.random() * 250) + 50;
            pipes.push({ x: canvas.width, top: topHeight });
        }

        // Retirer les tuyaux hors écran
        pipes = pipes.filter(pipe => pipe.x + pipeWidth > 0);

        // Scoring
        pipes.forEach(pipe => {
            if (pipe.x + pipeWidth === birdX) {
                score++;
            }
            // pipeGap--
        });
 
    }

    function checkCollision() {
        for (let pipe of pipes) {
            if (
                birdX + birdWidth > pipe.x &&
                birdX < pipe.x + pipeWidth &&
                (birdY < pipe.top || birdY + birdHeight > pipe.top + pipeGap)
            ) {
                return true;
            }
        }
        // Collision avec le sol ou le plafond
        if (birdY < 0 || birdY + birdHeight > canvas.height) {
            return true;
        }
        return false;
    }

    function gameLoop() {
        if (isGameOver) {
            ctx.fillStyle = 'red';
            ctx.font = '40px Arial';
            ctx.fillText('Game Over', 100, 300);
            ctx.font = '20px Arial';
            ctx.fillText('Appuie sur Espace pour recommencer', 50, 350);
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        birdVelocity += gravity;
        birdY += birdVelocity;

        frameCount++;
        updatePipes();

        drawPipes();
        drawBird();
        drawScore();

        if (checkCollision()) {
            isGameOver = true;
        }

        requestAnimationFrame(gameLoop);
    }

    window.addEventListener('keydown', function (e) {
        if (e.code === 'Space') {
            if (isGameOver) {
                resetGame();
                gameLoop();
            } else {
                birdVelocity = jumpStrength;
            }
        }
    });

    birdImg.onload = () => {
        gameLoop(); 
    };
});
