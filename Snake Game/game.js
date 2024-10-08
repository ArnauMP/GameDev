// Crear el Phaser, la pantalla jugable
const config = {
  type: Phaser.AUTO,
  width: 500,
  height: 500,
  backgroundColor: "#049cd8",
  parent: "game",
  physics: {
    default: "arcade",
  },
  scene: {
    preload,
    create,
    update,
  },
};

let directions = ["up", "down", "left", "right"];
let actualDirection = "";
const moveSnakeSegments = (snake, snakeSegments, offsetX = 0, offsetY = 0) => {
  let prevX = snake.x + offsetX;
  let prevY = snake.y + offsetY;

  snakeSegments.children.iterate((segment) => {
    [segment.x, segment.y, prevX, prevY] = [
      prevX,
      prevY,
      segment.x + offsetX,
      segment.y + offsetY,
    ];
  });
};

let score = 0;
let x = document.getElementById("score");
x.innerHTML = score;

new Phaser.Game(config);

// Cargar todos los elementos antes de iniciar el juego
function preload() {
  this.load.image("snakeHeadUp", "assets/images/snake/head_up.png");
  this.load.image("snakeHeadDown", "assets/images/snake/head_down.png");
  this.load.image("snakeHeadLeft", "assets/images/snake/head_left.png");
  this.load.image("snakeHeadRight", "assets/images/snake/head_right.png");

  this.load.image(
    "snakeBodyHorizontal",
    "assets/images/snake/body_horizontal.png"
  );
  this.load.image("snakeHeadVertical", "assets/images/snake/body_vertical.png");

  this.load.image("apple", "assets/images/apple/apple.png");
}

// Iniciar el juego, crear los elementos necesarios
function create() {
  // Crear la cabeza de la serpiente
  this.snake = this.physics.add
    .sprite(100, 50, "snakeHeadUp")
    .setOrigin(0.5, 0.5)
    .setCollideWorldBounds(true);

  // Crear un grupo para los segmentos de la serpiente
  this.snakeSegments = this.add.group();

  // Crear la manzana
  this.apple = this.physics.add
    .sprite(
      Math.floor((Math.random() * config.width) / 2),
      Math.floor((Math.random() * config.height) / 2),
      "apple"
    )
    .setOrigin(0.5, 0.5)
    .refreshBody();

  this.keys = this.input.keyboard.createCursorKeys();

  this.physics.world.setBounds(0, 0, config.width, config.height);

  // Detectar colisión entre la serpiente y la manzana
  this.physics.add.collider(
    this.snake,
    this.apple,
    function () {
      // Reposicionar la manzana
      this.apple.x = Math.floor((Math.random() * config.width) / 2);
      this.apple.y = Math.floor((Math.random() * config.height) / 2);
      this.apple.body.setVelocity(0);
      this.apple.body.setAcceleration(0);

      // Aumentar la puntuación
      score++;
      x.innerHTML = score;

      // Agregar un nuevo segmento a la serpiente
      let newSegment = this.physics.add.sprite(
        -100,
        -100,
        "snakeBodyHorizontal"
      );
      newSegment.setOrigin(0.5, 0.5);
      this.snakeSegments.add(newSegment);

      // Asegurar que las físicas funcionan para cada segmento
      this.physics.add.collider(newSegment, this.snake);
      this.physics.add.collider(newSegment, this.snakeSegments);
    },
    null,
    this
  );
}

// Game Loop
function update() {
  // Mover la serpiente hacia una dirección
  if (this.keys.up.isDown) {
    this.snake.body.setVelocityY(-200);
    this.snake.setTexture("snakeHeadUp");
    actualDirection = directions[0];
  } else if (this.keys.down.isDown) {
    this.snake.body.setVelocityY(200);
    this.snake.setTexture("snakeHeadDown");
    actualDirection = directions[1];
  } else if (this.keys.left.isDown) {
    this.snake.body.setVelocityX(-200);
    this.snake.setTexture("snakeHeadLeft");
    actualDirection = directions[2];
  } else if (this.keys.right.isDown) {
    this.snake.body.setVelocityX(200);
    this.snake.setTexture("snakeHeadRight");
    actualDirection = directions[3];
  }

  // Mantener la velocidad de la última dirección
  this.snake.body.setVelocity(0);
  switch (actualDirection) {
    case directions[0]: // Up
      this.snake.body.setVelocityY(-200);
      moveSnakeSegments(this.snake, this.snakeSegments, 0, 25);
      break;

    case directions[1]: // Down
      this.snake.body.setVelocityY(200);
      moveSnakeSegments(this.snake, this.snakeSegments, 0, -25);
      break;

    case directions[2]: // Left
      this.snake.body.setVelocityX(-200);
      moveSnakeSegments(this.snake, this.snakeSegments, 25, 0);
      break;

    case directions[3]: // Right
      this.snake.body.setVelocityX(200);
      moveSnakeSegments(this.snake, this.snakeSegments, -25, 0);
      break;

    default:
      this.snake.body.setVelocity(0);
  }
}
