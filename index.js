const score = document.querySelector(".score"),
  start = document.querySelector(".start"),
  gameArea = document.querySelector(".gameArea"),
  car = document.createElement("div");

car.classList.add("car");

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowRight: false,
  ArrowLeft: false,
};

const setting = {
  start: false,
  score: 0,
  speed: 3,
  traffic: 3,
  enemySpeed: 2,
};

start.addEventListener("click", startGame);
document.addEventListener("keydown", startRun);
document.addEventListener("keyup", stopRun);

function getQtnElems(heightElem) {
  return document.documentElement.clientHeight / heightElem + 1;
}

//start game
function startGame() {
  start.classList.add("hide");
  gameArea.innerHTML = "";

  for (let i = 0; i < getQtnElems(100); i++) {
    const line = document.createElement("div");
    line.classList.add("line");
    line.style.top = i * 100 + "px";
    line.y = i * 100;
    gameArea.appendChild(line);
  }

  for (let i = 0; i < getQtnElems(100 * setting.traffic); i++) {
    const enemy = document.createElement("div");
    enemy.classList.add("enemy");
    enemy.y = -100 * setting.traffic * (i + 1);
    enemy.style.left =
      Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + "px";
    enemy.style.top = enemy.y + "px";
    enemy.style.background =
      "transparent url(./styles/image/enemy.png) center / cover no-repeat";
    gameArea.appendChild(enemy);
  }

  setting.score = 0;
  setting.start = true;
  gameArea.appendChild(car);

  car.style.left = gameArea.offsetWidth / 2 - car.offsetWidth / 2 + "px";
  car.style.top = "auto";
  car.style.bottom = "10px";
  setting.x = car.offsetLeft;
  setting.y = car.offsetTop;
  requestAnimationFrame(playGame);
}

//animation framework
function playGame() {
  if (setting.start) {
    setting.score += setting.speed;
    score.innerHTML = "SCORE<br> " + setting.score;

    moveRoad();
    moveEnemy();

    if (keys.ArrowLeft && setting.x > 0) {
      setting.x -= setting.speed;
    }
    if (keys.ArrowRight && setting.x < gameArea.offsetWidth - car.offsetWidth) {
      setting.x += setting.speed;
    }
    if (keys.ArrowUp && setting.y > 0) {
      setting.y -= setting.speed;
    }
    if (
      keys.ArrowDown &&
      setting.y < gameArea.offsetHeight - car.offsetHeight
    ) {
      setting.y += setting.speed;
    }

    car.style.left = setting.x + "px";
    car.style.top = setting.y + "px";

    requestAnimationFrame(playGame);
  }
}

function startRun(e) {
  e.preventDefault();
  keys[e.key] = true;
}

function stopRun(e) {
  e.preventDefault();
  keys[e.key] = false;
}

function moveRoad() {
  let liners = document.querySelectorAll(".line");
  liners.forEach(function (line) {
    line.y += setting.speed;
    line.style.top = line.y + "px";

    if (line.y >= document.documentElement.clientHeight) {
      line.y = -100;
    }
  });
}

function moveEnemy() {
  let enemy = document.querySelectorAll(".enemy");

  enemy.forEach(function (e) {
    let carRect = car.getBoundingClientRect();
    let enemyRect = e.getBoundingClientRect();

    if (
      carRect.top <= enemyRect.bottom &&
      carRect.right >= enemyRect.left &&
      carRect.left <= enemyRect.right &&
      carRect.bottom >= enemyRect.top
    ) {
      setting.start = false;
      start.classList.remove("hide");
      score.style.top = start.offsetHeight;
    }

    e.y += setting.speed / setting.enemySpeed;
    e.style.top = e.y + "px";

    if (e.y >= document.documentElement.clientHeight) {
      e.y = -100 * setting.traffic;
      e.style.left =
        Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + "px";
    }
  });
}
