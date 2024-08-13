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

let score = 0;
let x = document.getElementById("score");
x.innerHTML = score;

new Phaser.Game(config);

// Cargar todos los elementos antes de iniciar el juego
function preload() {
  this.load.image("snake1", "assets/blocks/Leaves.PNG");
  this.load.image("apple", "assets/blocks/Tnt.PNG");
}

// Iniciar el juego, crear los elementos necesarios
function create() {
  // Crear la cabeza de la serpiente
  this.snake = this.physics.add
    .sprite(100, 50, "snake1")
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
        this.snake.x,
        this.snake.y,
        "snake1"
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
  // Mover la serpiente
  this.snake.body.setVelocity(0);

  if (this.keys.left.isDown) {
    this.snake.body.setVelocityX(-200);
    this.snake.flipX = true;
  } else if (this.keys.right.isDown) {
    this.snake.body.setVelocityX(200);
    this.snake.flipX = false;
  }

  if (this.keys.up.isDown) {
    this.snake.body.setVelocityY(-200);
    this.snake.flipY = true;
  } else if (this.keys.down.isDown) {
    this.snake.body.setVelocityY(200);
    this.snake.flipY = false;
  }

  // Mover los segmentos de la serpiente
  let prevX = this.snake.x;
  let prevY = this.snake.y;

  this.snakeSegments.children.iterate(function (segment) {
    let tempX = segment.x;
    let tempY = segment.y;

    segment.x = prevX;
    segment.y = prevY;

    prevX = tempX;
    prevY = tempY;
  });
}
