// Game Board
let board;
let boardWidth = 360;
let boardHeight = 576;
let context;
let gameScreen = document.getElementById("board");

// Doodler
let doodlerWidth = 46;
let doodlerHeight = 46;
let doodlerX = boardWidth / 2 - doodlerWidth / 2;
let doodlerY = (boardHeight * 7) / 8 - doodlerHeight;
let doodlerRightImg;
let doodlerLeftImg;

// Physics
let velocityX = 0;
let velocityY = 0;
let initialVelocityY = -6;
let gravity = 0.2;

// Platforms
let platformArray = [];
let platformWidth = 60;
let platformHeight = 18;
let platformImg;

let score = 0;
let maxScore = 0;
let gameStart = false;
let gameOver = false;

let doodler = {
  img: null,
  x: doodlerX,
  y: doodlerY,
  width: doodlerWidth,
  height: doodlerHeight,
};

let platform = {
  img: platformImg,
  x: boardWidth / 3,
  y: boardHeight - 80,
  width: platformWidth,
  height: platformHeight,
};
platformArray.push(platform);

const gameIntro = document.getElementById("game-intro");
const startGameBtn = document.getElementById("start-game");
startGameBtn.addEventListener("click" || "Space", () => {
  gameIntro.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  placePlatforms();
  document.addEventListener("keydown", moveDoodler);
  document.addEventListener("keyup", stopDoodler);
  requestAnimationFrame(update);
});
board = document.getElementById("board");
board.height = boardHeight;
board.width = boardWidth;
context = board.getContext("2d");

// Load images
doodlerRightImg = new Image();
doodlerRightImg.src = "Assets/doodler-right.png";
doodler.img = doodlerRightImg;
doodlerRightImg.onload = function () {
  context.drawImage(
    doodler.img,
    doodler.x,
    doodler.y,
    doodler.width,
    doodler.height
  );
};
doodlerLeftImg = new Image();
doodlerLeftImg.src = "./Assets/doodler-left.png";

platformImg = new Image();
platformImg.src = "./Assets/platform.png";

velocityY = initialVelocityY;

function introDoodle() {}

function update() {
  requestAnimationFrame(update);
  context.clearRect(0, 0, boardWidth, boardHeight);

  // Player
  doodler.x += velocityX;
  if (doodler.x > boardWidth) {
    doodler.x = 0;
  }
  if (doodler.x < -56) {
    doodler.x = boardWidth;
  }
  velocityY += gravity;
  doodler.y += velocityY;
  if (doodler.y > board.height) {
    gameOver = true;
  }
  context.drawImage(
    doodler.img,
    doodler.x,
    doodler.y,
    doodler.width,
    doodler.height
  );

  // Platforms
  for (let i = 0; i < platformArray.length; i++) {
    let platform = platformArray[i];
    if (velocityY < 0 && doodler.y < boardHeight * 0.5) {
      platform.y -= velocityY;
    }
    // }
    if (detectCollision(doodler, platform) && velocityY > 0) {
      //   if (!platform.hasBeenTouched) {
      //     score += 20;
      //   }
      //   platform.hasBeenTouched = true;
      velocityY = initialVelocityY;
    }
    context.drawImage(
      platform.img,
      platform.x,
      platform.y,
      platform.width,
      platform.height
    );
  }
  // Clear platforms and add new platform
  while (platformArray.length > 0 && platformArray[0].y >= boardHeight) {
    platformArray.shift();
    newPlatform();
  }

  // Score
  updateScore();
  context.fillStyle = "black";
  context.font = "16px rock-salt";
  context.fillText(score, 5, 20);

  if (gameOver) {
    context.fillText(
      "Game Over: Press 'Space' to Restart",
      boardWidth / 7,
      (boardHeight * 7) / 8
    );
  }
}

function moveDoodler(e) {
  if (e.code == "ArrowRight") {
    velocityX = 6;
    doodler.img = doodlerRightImg;
  } else if (e.code == "ArrowLeft") {
    velocityX = -6;
    doodler.img = doodlerLeftImg;
  } else if (e.code == "Space" && gameOver) {
    doodler = {
      img: doodlerRightImg,
      x: doodlerX,
      y: doodlerY,
      width: doodlerWidth,
      height: doodlerHeight,
    };

    velocityX = 0;
    velocityY = initialVelocityY;
    score = 0;
    maxScore = 0;
    gameOver = false;
    placePlatforms();
  }
}

function stopDoodler() {
  velocityX = 0;
}

function placePlatforms() {
  platformArray = [];

  let platform = {
    img: platformImg,
    x: boardWidth / 3,
    y: boardHeight - 80,
    width: platformWidth,
    height: platformHeight,
  };
  platformArray.push(platform);

  for (let i = 0; i < 6; i++) {
    let randomX = Math.floor(Math.random() * boardWidth * 0.75);
    let platform = {
      img: platformImg,
      x: randomX,
      y: boardHeight - 75 * i - 150,
      width: platformWidth,
      height: platformHeight,
    };
    platformArray.push(platform);
  }
}

function newPlatform() {
  let randomX = Math.floor((Math.random() * boardWidth * 3) / 4); //(0-1) * boardWidth*3/4
  let platform = {
    img: platformImg,
    x: randomX,
    y: -platformHeight,
    width: platformWidth,
    height: platformHeight,
    // hasBeenTouched: false,
  };

  platformArray.push(platform);
}

function detectCollision(a, b) {
  //   const leftDoodler = a.x;
  //   const leftPlatform = b.x;
  return (
    a.x < b.x + b.width - 5 &&
    a.x + a.width > b.x + 5 &&
    a.y < b.y + b.height - 56 &&
    a.y + a.height > b.y
  );
}

function updateScore() {
  let points = Math.floor(50 * Math.random()); //(0-1) *50 --> (0-50)
  if (velocityY < 0) {
    //negative going up
    maxScore += points;
    if (score < maxScore) {
      score = maxScore;
    }
  } else if (velocityY >= 0) {
    maxScore -= points;
  }
}
