const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");
const scoreText = document.querySelector("#scoreText");
const startBtn = document.querySelector("#startBtn");
const resetBtn = document.querySelector("#resetBtn");
const startGame = document.querySelector("#startGame");
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
function goBack(){
    window.location.href = "../index.html";
}


const boardBackground = "white";
const snakeColor = "lightblue";
const snakeBorder = "black";
const foodColor = "red";
const unitSize = 25;
let running = false;
let xVel = unitSize;
let yVel = 0;
let foodX, foodY;
let score = 0;
let snake = [
    { x: unitSize * 2, y: 0 },
    { x: unitSize, y: 0 },
    { x: 0, y: 0 }
]

window.addEventListener("keydown", changeDirection);
resetBtn.addEventListener("click", resetGame);
startBtn.addEventListener("click", gameStart);

createFood();
drawFood();
drawSnake();

function gameStart() {
        running = true;
        scoreText.textContent = score;
        xVel = unitSize;
        yVel = 0;
        startBtn.style.display = "none";
        nextTic();
    };
function nextTic() {
    if (running) {
        setTimeout(() => {
            clearBoard();
            drawFood();
            moveSnake();
            drawSnake();
            checkGameOver();
            nextTic();
        }, 100)
    }
    else {
        displayGameOver();
    }
};
function clearBoard() {
    ctx.fillStyle = boardBackground;
    ctx.fillRect(0, 0, gameWidth, gameHeight);
};
function createFood() {
    function randomFood(min, max) {
        return Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
    };
    foodX = randomFood(0, gameWidth - unitSize);
    foodY = randomFood(0, gameHeight - unitSize);
    console.log("Food created at:", foodX, foodY);
};
function drawFood() {
    ctx.fillStyle = foodColor;
    ctx.fillRect(foodX, foodY, unitSize, unitSize);
};
function moveSnake() {
    const head = {
        x: snake[0].x + xVel,
        y: snake[0].y + yVel
    };
    snake.unshift(head);
    // If food is eaten:
    if (snake[0].x == foodX && snake[0].y == foodY) {
        score += 1;
        scoreText.textContent = score;
        createFood();
    }
    else {
        snake.pop();
    }
};
function drawSnake() {
    ctx.fillStyle = snakeColor;
    ctx.strokeStyle = snakeBorder;
    snake.forEach(snakePart => {
        ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
        ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
    })
};
function changeDirection(event) {
    const keyPressed = event.key;
    //  console.log(keyPressed);

    const goingUp = (yVel == -unitSize)
    const goingDown = (yVel == +unitSize)
    const goingRight = (xVel == +unitSize)
    const goingLeft = (xVel == -unitSize)

     switch (true) {
        case ((keyPressed === "ArrowLeft" || keyPressed === "a") && !goingRight):
            xVel = -unitSize;
            yVel = 0;
            break;
        case ((keyPressed === "ArrowUp" || keyPressed === "w") && !goingDown):
            xVel = 0;
            yVel = -unitSize;
            break;
        case ((keyPressed === "ArrowRight" || keyPressed === "d") && !goingLeft):
            xVel = unitSize;
            yVel = 0;
            break;
        case ((keyPressed === "ArrowDown" || keyPressed === "s") && !goingUp):
            xVel = 0;
            yVel = unitSize;
            break;
    }
};
function checkGameOver() {
    switch (true) {
        case (snake[0].x < 0):
            running = false;
            break;
        case (snake[0].x >= gameWidth):
            running = false;
            break;
        case (snake[0].y < 0):
            running = false;
            break;
        case (snake[0].y >= gameHeight):
            running = false;
            break;
    }
    for(let i = 1; i<snake.length; i+=1){
        if(snake[i].x == snake[0].x && snake[i].y == snake[0].y){
            running = false;
        }
    }
};
function displayGameOver() { 
    ctx.font = "50px MV Boli";
    ctx.fillStyle = "Black";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER!!", gameWidth/2, gameHeight/2);
    running = false;
    // startBtn.style.display = "inline-block"; 
    // inline-blocks are work better for buttons.
};
function resetGame() {
    startBtn.style.display = "inline-block";
    clearBoard();
    score = 0;
    scoreText.textContent = score;
    xVel = 0;
    yVel = 0;
    snake = [
        { x: unitSize * 2, y: 0 },
        { x: unitSize, y: 0 },
        { x: 0, y: 0 }
    ];
    running = false;
    createFood();
    drawFood();
    drawSnake();
};
