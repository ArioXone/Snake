class Field {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }
}

class Snake {
  constructor(field) {
    this.body = [
      { x: 5, y: 5 },
      { x: 5, y: 6 },
    ];
    this.direction = "up";
    this.field = field;
  }

  move() {
    const head = this.body[0];
    let newHead;

    switch (this.direction) {
      case "up":
        newHead = { x: head.x, y: head.y - 1 };
        break;
      case "down":
        newHead = { x: head.x, y: head.y + 1 };
        break;
      case "left":
        newHead = { x: head.x - 1, y: head.y };
        break;
      case "right":
        newHead = { x: head.x + 1, y: head.y };
        break;
    }

    if (newHead.x < 0) newHead.x = this.field.width - 1;
    if (newHead.x >= this.field.width) newHead.x = 0;
    if (newHead.y < 0) newHead.y = this.field.height - 1;
    if (newHead.y >= this.field.height) newHead.y = 0;

    this.body.unshift(newHead);
  }
}

class Apple {
  constructor(field, snake) {
    this.field = field;
    this.snake = snake;
    this.position = {
      x: Math.floor(Math.random() * field.width),
      y: Math.floor(Math.random() * field.height),
    };
  }

  respawn() {
    do {
      this.position = {
        x: Math.floor(Math.random() * this.field.width),
        y: Math.floor(Math.random() * this.field.height),
      };
    } while (
      this.snake.body.some(
        (segment) =>
          segment.x === this.position.x && segment.y === this.position.y
      )
    );
  }
}

class Game {
  constructor() {
    this.field = new Field(10, 10);
    this.snake = new Snake(this.field);
    this.apple = new Apple(this.field, this.snake);
    this.score = 0;
    this.record = localStorage.getItem("snakeRecord") || 0;

    document.getElementById("record").innerText = `Record: ${this.record}`;

    document.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "ArrowUp":
          this.snake.direction = "up";
          break;
        case "ArrowDown":
          this.snake.direction = "down";
          break;
        case "ArrowLeft":
          this.snake.direction = "left";
          break;
        case "ArrowRight":
          this.snake.direction = "right";
          break;
      }
    });

    document
      .getElementById("restart")
      .addEventListener("click", () => this.restartGame());

    this.gameLoop();
  }

  gameLoop() {
    setInterval(() => {
      this.snake.move();

      if (this.isSnakeCollidingWithApple()) {
        this.score++;
        document.getElementById("score-value").innerText = this.score;

        if (this.score > this.record) {
          this.record = this.score;
          localStorage.setItem("snakeRecord", this.record);
          document.getElementById(
            "record"
          ).innerText = `Record: ${this.record}`;
        }

        this.apple.respawn();
      }

      this.renderGame();
    }, 500);
  }

  renderGame() {
    const gameElement = document.getElementById("game");
    gameElement.innerHTML = "";

    const snakeCells = new Set(
      this.snake.body.map((segment) => `${segment.x},${segment.y}`)
    );

    for (let y = 0; y < this.field.height; y++) {
      for (let x = 0; x < this.field.width; x++) {
        const cellElement = document.createElement("div");
        cellElement.classList.add("cell");

        if (this.apple.position.x === x && this.apple.position.y === y) {
          cellElement.classList.add("apple");
        }

        if (snakeCells.has(`${x},${y}`)) {
          cellElement.classList.add("snake");
        }

        gameElement.appendChild(cellElement);
      }
    }
  }

  isSnakeCollidingWithApple() {
    return this.snake.body.some(
      (segment) =>
        segment.x === this.apple.position.x &&
        segment.y === this.apple.position.y
    );
  }

  isSnakeCollidingWithItself() {
    const [head, ...bodyWithoutHead] = this.snake.body;
    return bodyWithoutHead.some(
      (segment) => segment.x === head.x && segment.y === head.y
    );
  }

  restartGame() {
    this.snake.body = [
      { x: 5, y: 5 },
      { x: 5, y: 6 },
    ];
    this.snake.direction = "up";
    this.score = 0;
    document.getElementById("score-value").innerText = this.score;
    this.apple.respawn();
  }
}

const game = new Game();

const gameElement = document.getElementById("game");
for (let y = 0; y < game.field.height; y++) {
  for (let x = 0; x < game.field.width; x++) {
    const cellElement = document.createElement("div");
    cellElement.classList.add("cell");

    if (game.apple.position.x === x && game.apple.position.y === y) {
      cellElement.classList.add("apple");
    }

    if (game.snake.body.some((segment) => segment.x === x && segment.y === y)) {
      cellElement.classList.add("snake");
    } else {
      if (
        !game.snake.body.some((segment) => segment.x === x && segment.y === y)
      ) {
        cellElement.classList.remove("snake");
      }
    }

    gameElement.appendChild(cellElement);
  }
}

const newGame = new Game();
newGame.renderGame();
