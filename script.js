const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const canvasWidth = 400;
const canvasHeight = 400;
canvas.width = canvasWidth;
canvas.height = canvasHeight;
document.addEventListener("touchstart", handleTouchStart);
document.addEventListener("touchmove", handleTouchMove);

let xDown = null;
let yDown = null;
// mobile touch controls
let touchStartX = 0;
let touchStartY = 0;
document.addEventListener("touchstart", handleTouchStart, false);
document.addEventListener("touchmove", handleTouchMove, false);

function handleTouchStart(event) {
  touchStartX = event.touches[0].clientX;
  touchStartY = event.touches[0].clientY;
}

function handleTouchMove(event) {
  if (!touchStartX || !touchStartY) {
    return;
  }

  let touchEndX = event.touches[0].clientX;
  let touchEndY = event.touches[0].clientY;

  let dx = touchEndX - touchStartX;
  let dy = touchEndY - touchStartY;

  if (Math.abs(dx) > Math.abs(dy) && dx > 0 && snakeDirection !== "left") {
    snakeDirection = "right";
  } else if (
    Math.abs(dx) > Math.abs(dy) &&
    dx < 0 &&
    snakeDirection !== "right"
  ) {
    snakeDirection = "left";
  } else if (
    Math.abs(dy) > Math.abs(dx) &&
    dy < 0 &&
    snakeDirection !== "down"
  ) {
    snakeDirection = "up";
  } else if (Math.abs(dy) > Math.abs(dx) && dy > 0 && snakeDirection !== "up") {
    snakeDirection = "down";
  }

  touchStartX = 0;
  touchStartY = 0;
}

function handleTouchStart(event) {
  const firstTouch = event.touches[0];
  xDown = firstTouch.clientX;
  yDown = firstTouch.clientY;
}

function handleTouchMove(event) {
  if (!xDown || !yDown) {
    return;
  }

  let xUp = event.touches[0].clientX;
  let yUp = event.touches[0].clientY;

  let xDiff = xDown - xUp;
  let yDiff = yDown - yUp;

  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    if (xDiff > 0 && dx == 0) {
      dx = -tileSize;
      dy = 0;
    } else if (xDiff < 0 && dx == 0) {
      dx = tileSize;
      dy = 0;
    }
  } else {
    if (yDiff > 0 && dy == 0) {
      dx = 0;
      dy = -tileSize;
    } else if (yDiff < 0 && dy == 0) {
      dx = 0;
      dy = tileSize;
    }
  }

  xDown = null;
  yDown = null;
}

const tileSize = 10;
const tileCount = canvasWidth / tileSize;

let snakeX = 10 * tileSize;
let snakeY = 10 * tileSize;
let dx = tileSize;
let dy = 0;

let appleX = 0;
let appleY = 0;

let score = 0;

let snake = [];
snake[0] = { x: snakeX, y: snakeY };

document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
  if (event.keyCode == 37 && dx == 0) {
    dx = -tileSize;
    dy = 0;
  } else if (event.keyCode == 38 && dy == 0) {
    dx = 0;
    dy = -tileSize;
  } else if (event.keyCode == 39 && dx == 0) {
    dx = tileSize;
    dy = 0;
  } else if (event.keyCode == 40 && dy == 0) {
    dx = 0;
    dy = tileSize;
  }
}

function generateApple() {
  appleX = Math.floor(Math.random() * tileCount) * tileSize;
  appleY = Math.floor(Math.random() * tileCount) * tileSize;
}

function drawSnake() {
  for (let i = 0; i < snake.length; i++) {
    if (i === 0) {
      ctx.fillStyle = "blue";
    } else {
      ctx.fillStyle = "white";
    }
    ctx.fillRect(snake[i].x, snake[i].y, tileSize, tileSize);
  }
}

function updateSnake() {
  snakeX += dx;
  snakeY += dy;

  if (snakeX < 0) {
    snakeX = canvasWidth - tileSize;
  } else if (snakeX >= canvasWidth) {
    snakeX = 0;
  }

  if (snakeY < 0) {
    snakeY = canvasHeight - tileSize;
  } else if (snakeY >= canvasHeight) {
    snakeY = 0;
  }

  if (snakeX == appleX && snakeY == appleY) {
    score++;
    generateApple();
  } else {
    snake.pop();
  }

  let newHead = { x: snakeX, y: snakeY };
  snake.unshift(newHead);
}

function drawApple() {
  ctx.fillStyle = "red";
  ctx.fillRect(appleX, appleY, tileSize, tileSize);
}

function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 20);
}

function drawBackground() {
  const gradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
  gradient.addColorStop(0, "#2c2f33");
  gradient.addColorStop(1, "#23272a");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
}

function gameLoop() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  drawBackground();
  drawSnake();
  updateSnake();
  drawApple();
  drawScore();
}

function init() {
  generateApple();
  setInterval(gameLoop, 100);
}

init();
