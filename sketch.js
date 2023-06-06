let fairy;
let grounds = [];
let witches;
let fairyImg, ogreImg, ghostImg, witchImg;
let gameState = "playing";
let fairyLives = 3;
let level = 1;

function preload() {
  fairyImg = loadImage("fairy.png");
  ogreImg = loadImage("ogre.png");
  ghostImg = loadImage("ghost.png");
  witchImg = loadImage("witch.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  fairy = createSprite(100, 300, 50, 50);
  fairy.addImage(fairyImg);
  fairy.scale = 0.1;

  fairy.velocity.y = -5;

  let x_coords = [];

  for (let i = 0; i < 5; i++) {
    let ground;

    while (true) {
      let x = random(50, width - 50);
      let y = random(height / 2, height - 50);
      let w = random(100, 200);
      let h = random(10, 30);

      if (x_coords.some((existingX) => abs(existingX - x) < 150)) {
        continue;
      }

      ground = createSprite(x, y, w, h);

      let overlaps = false;

      for (let other of grounds) {
        if (ground.overlap(other)) {
          overlaps = true;
          ground.remove();
          break;
        }
      }

      if (!overlaps) {
        x_coords.push(x);
        break;
      } else {
        ground.remove();
      }
    }

    let groundColor = color(random(255), random(255), random(255));
    ground.shapeColor = groundColor;
    grounds.push(ground);
  }

  grounds.sort((a, b) => a.position.x - b.position.x);

  ogre = createSprite(
    grounds[1].position.x,
    grounds[1].position.y - grounds[1].height / 2,
    40,
    40
  );
  ogre.addImage(ogreImg);
  ogre.scale = 0.05;

  ogre.velocity.x = 2; // Set initial velocity for ogre

  ghosts = new Group();
}

function draw() {
  background(255); // Set background color to white

  if (gameState === "playing") {
    fairy.velocity.y += 0.1;

    for (let ground of grounds) {
      if (fairy.collide(ground)) {
        fairy.velocity.y = 0;

        if (ground === grounds[grounds.length - 1]) {
          level++;
          nextLevel();
        }
      }
    }

    if (keyDown(UP_ARROW)) {
      fairy.velocity.y -= 2;
    }

    if (keyDown(LEFT_ARROW)) {
      fairy.velocity.x -= 0.5;
    }

    if (keyDown(RIGHT_ARROW)) {
      fairy.velocity.x += 0.5;
    }

    fairy.velocity.x = constrain(fairy.velocity.x, -2, 2);

    if (fairy.position.x < 0) {
      fairy.velocity.x = abs(fairy.velocity.x) * 0.8;
    }

    if (fairy.position.x > width) {
      fairy.velocity.x = -abs(fairy.velocity.x) * 0.8;
    }

    if (fairy.position.y < 0) {
      fairy.velocity.y = abs(fairy.velocity.y) * 0.8;
    }

    if (fairy.position.y > height) {
      fairyLives--;
      resetGame();
    }

    if (fairy.overlap(ogre)) {
      fairyLives--;
      resetGame();
    }

    for (let ghost of ghosts) {
      if (fairy.overlap(ghost)) {
        fairyLives--;
        resetGame();
      }
    }

    if (fairyLives === 0) {
      gameState = "over";
    }

    // Ogre's movement behavior
    if (
      ogre.position.x >=
      grounds[1].position.x + grounds[1].width / 2 - ogre.width / 2
    ) {
      ogre.velocity.x = -2; // Move left
    }
    if (
      ogre.position.x <=
      grounds[1].position.x - grounds[1].width / 2 + ogre.width / 2
    ) {
      ogre.velocity.x = 2; // Move right
    }

    // Adjust camera position
    camera.position.x = fairy.position.x;

    drawSprites();

    fill(0); // Set text color to black
    textSize(32);
    textAlign(LEFT, TOP);
    text("Lives: " + fairyLives, camera.position.x - width / 2 + 10, 10);
    text("Level: " + level, camera.position.x - width / 2 + 10, 50);
  } else if (gameState === "over") {
    fill(0); // Set text color to black
    textSize(32);
    textAlign(CENTER, CENTER);
    text("Game Over", camera.position.x, height / 2);
  } else if (gameState === "won") {
    fill(0); // Set text color to black
    textSize(32);
    textAlign(CENTER, CENTER);
    text("Win", camera.position.x, height / 2);
  }
}

function resetGame() {
  fairy.position.x = 100;
  fairy.position.y = 300;
  fairy.velocity.y = -5; // Make the fairy jump automatically after restarting
}

function nextLevel() {
  fairy.position.x = 100;
  fairy.position.y = 300;
  fairy.velocity.y = -5; // Make the fairy jump automatically after advancing to the next level
  grounds = [];
  ogre.remove();
  ghosts.removeSprites();

  let x_coords = [];

  for (let i = 0; i < 5 + level; i++) {
    let ground;

    while (true) {
      let x = random(50, width - 50);
      let y = random(height / 2, height - 50);
      let w = random(100, 200);
      let h = random(10, 30);

      if (x_coords.some((existingX) => abs(existingX - x) < 150)) {
        continue;
      }

      ground = createSprite(x, y, w, h);

      let overlaps = false;

      for (let other of grounds) {
        if (ground.overlap(other)) {
          overlaps = true;
          ground.remove();
          break;
        }
      }

      if (!overlaps) {
        x_coords.push(x);
        break;
      } else {
        ground.remove();
      }
    }

    let groundColor = color(random(255), random(255), random(255));
    ground.shapeColor = groundColor;
    grounds.push(ground);
  }

  grounds.sort((a, b) => a.position.x - b.position.x);

  if (level === 2) {
    ogre = createSprite(
      grounds[1].position.x,
      grounds[1].position.y - grounds[1].height / 2,
      40,
      40
    );
    ogre.addImage(ogreImg);
    ogre.scale = 0.05;

    ogre.velocity.x = 2; // Set initial velocity for ogre
  } else if (level === 3) {
    witches = new Group();
    for (let i = 0; i < 3; i++) {
      let witch = createSprite(
        random(width),
        random(height / 2),
        50,
        50
      );
      witch.addImage(witchImg);
      witch.scale = 0.1;
      witch.velocity.y = random(-2, 2);
      witch.velocity.x = random(-2, 2);
      witches.add(witch);
    }
  }

  gameState = "playing";
}
