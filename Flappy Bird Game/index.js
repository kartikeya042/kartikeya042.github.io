//board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

//bird
let birdWidth = 34; // width/height ratio = 408/228 = 17/12
let birdHeight = 24;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let bird = {
  height: birdHeight,
  width: birdWidth,
  x: birdX,
  y: birdY,
};

//pipes
let pipeArray = [];
let pipeWidth = 64; // width/height ratio = 384/3072 = 1/8
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;
let gameStarted = false;

// Game Physics:
let xvel = -2; // pipes moving left speed;
let yvel = 0; // bird jump speed;
let gravity = 0.175;
let gameOver = false;
let score = 0;
let pipeInterval;
let highScore;

function startGame() {
  if (pipeInterval) {
    clearInterval(pipeInterval);
  }
  bird.y = birdY;
  pipeArray = [];
  score = 0;
  gameOver = false;
  yvel = 0;

  // Start placing pipes every 750 ms
  pipeInterval = setInterval(placePipes, 750);
}

highScore = Number(sessionStorage.getItem("FlappyBirdScore")) || 0;
window.onload = function () {
  
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d"); // used for drawing on the board

  // load images:
  birdImg = new Image();
  birdImg.src = "./flappybird.gif";

  topPipeImg = new Image();
  topPipeImg.src = "./toppipe.png";

  bottomPipeImg = new Image();
  bottomPipeImg.src = "./bottompipe.png";

  requestAnimationFrame(update);

  document.addEventListener("keydown", function (e) {
    if (e.code === "Space" || e.code === "ArrowUp") {
      if (!gameStarted) {
        gameStarted = true; // mark game as started
        startGame(); // begin game loop & pipes
        yvel = -5; // initial jump on first press (optional)
      } else if (!gameOver) {
        yvel = -5; // bird jumps normally
      } else {
        // Game over, restart on space
        gameStarted = true;
        startGame();
        yvel = -5;
      }
    }
  });
};

function update() {
  requestAnimationFrame(update);

  if (!gameStarted) {
    // Show "Press Space to Start" message
    context.clearRect(0, 0, board.width, board.height);
    context.fillStyle = "white";
    context.font = "30px sans-serif";
    context.textAlign = "center";
    context.fillText("Press Space to Start", board.width / 2, board.height / 2);

    // Draw bird in initial position
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    return;
  }

  if (gameOver) {
     if(score > highScore){
          highScore = score;
          sessionStorage.setItem("FlappyBirdScore", highScore);
        }
    clearInterval(pipeInterval);
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.textAlign = "left";
    context.fillText("GAME OVER", 5, 90);
    gameStarted = false;
    return;
  }

  if (bird.y > board.height) {
    gameOver = true;
  }

  context.clearRect(0, 0, board.width, board.height);

  // Bird physics
  yvel += gravity;
  bird.y = Math.max(bird.y + yvel, 0);
  context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

  // Pipes movement and drawing
  for (let i = 0; i < pipeArray.length; i++) {
    let pipe = pipeArray[i];
    pipe.x += xvel;
    context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

    if (!pipe.passed && bird.x > pipe.x + pipe.width) {
      score += 0.5; // half point per pipe, full point per pair
      pipe.passed = true;
    }

    if (detectCollision(bird, pipe)) {
      gameOver = true;
    }
  }

  // Remove pipes that went off screen
  while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
    pipeArray.shift();
  }

  // Score display
  context.fillStyle = "white";
  context.font = "25px sans-serif";
  context.textAlign = "left";
  context.fillText("HighScore:" + highScore, 5, 25);
  context.fillText("Score:" + score, 5, 50);
}

function placePipes() {
  let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
  let openingSpace = board.height / 3.5;

  let topPipe = {
    img: topPipeImg,
    x: pipeX,
    y: randomPipeY,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };
  pipeArray.push(topPipe);

  let bottomPipe = {
    img: bottomPipeImg,
    x: pipeX,
    y: randomPipeY + pipeHeight + openingSpace,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };
  pipeArray.push(bottomPipe);
}

function detectCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function goBack() {
    window.location.href = "../index.html";
}