// Game constants
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

const shipWidth = 40;
const shipHeight = 20;
const enemyWidth = 30;
const enemyHeight = 30;
const bulletWidth = 4;
const bulletHeight = 10;
const enemyRowCount = 5;
const enemyColumnCount = 10;
const enemyPadding = 10;
const enemyOffsetTop = 30;
const enemyOffsetLeft = 30;
const initialEnemySpeed = 0.2;
const bulletSpeed = 2;
const shipSpeed = 4;

let ship = {
    x: canvasWidth / 2 - shipWidth / 2,
    y: canvasHeight - shipHeight - 10,
    width: shipWidth,
    height: shipHeight,
    dx: 0,
};

let enemies = [];
let bullets = [];

let enemySpeed = initialEnemySpeed;
let direction = 1;
let score = 0;
let gameover = false;

// Create enemies
function createEnemies() {
    for (let row = 0; row < enemyRowCount; row++) {
      enemies[row] = [];
      for (let col = 0; col < enemyColumnCount; col++) {
        enemies[row][col] = {
          x: col * (enemyWidth + enemyPadding) + enemyOffsetLeft,
          y: row * (enemyHeight + enemyPadding) + enemyOffsetTop,
          width: enemyWidth,
          height: enemyHeight,
          alive: true,
        };
      }
    }
}

// Move ship
function moveShip() {
    ship.x += ship.dx;
  
    // Keep the ship within the canvas bounds
    if (ship.x < 0) {
      ship.x = 0;
    }
    if (ship.x + ship.width > canvasWidth) {
      ship.x = canvasWidth - ship.width;
    }
}

// Move bullets
function moveBullets() {
    bullets.forEach((bullet, index) => {
      bullet.y -= bulletSpeed;
  
      // Remove bullets that go out of bounds
      if (bullet.y < 0) {
        bullets.splice(index, 1);
      }
    });
}

// Move enemies
function moveEnemies() {
    for (let row = 0; row < enemyRowCount; row++) {
      for (let col = 0; col < enemyColumnCount; col++) {
        const enemy = enemies[row][col];
  
        if (enemy.alive) {
          enemy.x += enemySpeed * direction;
  
          // Move enemies down if they reach the canvas edge
          if (enemy.x + enemy.width > canvasWidth || enemy.x < 0) {
            direction *= -1;
            moveEnemiesDown();
            break;
          }
  
          // Check for collision with ship
          if (checkCollision(enemy, ship)) {
            gameover = true;
          }
  
          // Check for collision with bullets
          bullets.forEach((bullet, bulletIndex) => {
            if (checkCollision(enemy, bullet)) {
              enemy.alive = false;
              bullets.splice(bulletIndex, 1);
              score++;
  
              // Check if all enemies are defeated
              if (score === enemyRowCount * enemyColumnCount) {
                gameover = true;
              }
            }
          });
        }
      }
    }
}

// Move enemies down
function moveEnemiesDown() {
    for (let row = 0; row < enemyRowCount; row++) {
      for (let col = 0; col < enemyColumnCount; col++) {
        const enemy = enemies[row][col];
        enemy.y += enemyHeight;
      }
    }
  }
  
  // Draw ship
  function drawShip() {
    ctx.fillStyle = "#00f";
    ctx.fillRect(ship.x, ship.y, ship.width, ship.height);
  }
  
  // Draw bullets
  function drawBullets() {
    bullets.forEach(bullet => {
      ctx.fillStyle = "#f00";
      ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
  }
  
  // Draw enemies
  function drawEnemies() {
    for (let row = 0; row < enemyRowCount; row++) {
      for (let col = 0; col < enemyColumnCount; col++) {
        const enemy = enemies[row][col];
  
        if (enemy.alive) {
          ctx.fillStyle = "#0f0";
          ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        }
      }
    }
  }
  
  // Draw score
  function drawScore() {
    ctx.fillStyle = "#000";
    ctx.font = "16px Arial";
    ctx.fillText("Score: " + score, 8, 20);
  }
  
  // Check collision between two objects
  function checkCollision(obj1, obj2) {
    return (
      obj1.x < obj2.x + obj2.width &&
      obj1.x + obj1.width > obj2.x &&
      obj1.y < obj2.y + obj2.height &&
      obj1.y + obj1.height > obj2.y
    );
  }
  
  // Handle keydown events for ship movement and bullet firing
  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);
  
  function handleKeyDown(event) {
    if (event.key === "a") {
      ship.dx = -shipSpeed;
    } else if (event.key === "d") {
      ship.dx = shipSpeed;
    } else if (event.key === " ") {
      fireBullet();
    }
  }
  
  function handleKeyUp(event) {
    if (event.key === "a" || event.key === "d") {
      ship.dx = 0;
    }
  }
  
  // Fire a bullet
  function fireBullet() {
    const bullet = {
      x: ship.x + ship.width / 2 - bulletWidth / 2,
      y: ship.y,
      width: bulletWidth,
      height: bulletHeight,
    };
    bullets.push(bullet);
  }
  
  // Game loop
  function gameLoop() {
    if (!gameover) {
      clearCanvas();
      moveShip();
      moveBullets();
      moveEnemies();
      drawShip();
      drawBullets();
      drawEnemies();
      drawScore();
      requestAnimationFrame(gameLoop);
    } else {
      showGameOver();
    }
  }
  
  // Clear the canvas
  function clearCanvas() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  }
  
  // Show game over message
  function showGameOver() {
    ctx.fillStyle = "#000";
    ctx.font = "30px Arial";
    ctx.fillText("Game Over", canvasWidth / 2 - 90, canvasHeight / 2);
  }
  
  // Start the game
  createEnemies();
  gameLoop();