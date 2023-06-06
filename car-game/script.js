let car;
let obstacles = [];
let buildings = [];
let gameIsOver = false;

let buildingHeight = 600;
let buildingSpeed = 1; // Decreased the speed
let lastBuildingY = 0;

let buildingSpacing = 150;
let buildingChance = 0.7;


function setup() {
    let canvas = createCanvas(400, 600);
    canvas.parent('sketch-holder');  

    car = new Car();

    for (let i = 0; i < buildingHeight / buildingSpacing; i++) {
        let y = i * buildingSpacing;

        // Randomly decide whether to create a building on the left
        if (random() < buildingChance) {
            let leftBuildingHeight = random(50, 150);
            buildings.push(new Building(0, y, 50, leftBuildingHeight));  // left side
        }

        // Randomly decide whether to create a building on the right
        if (random() < buildingChance) {
            let rightBuildingHeight = random(50, 150);
            buildings.push(new Building(width - 50, y, 50, rightBuildingHeight));  // right side
        }
    }
}

function draw() {
    background(50);

    for (let i = 0; i < buildings.length; i++) {
        buildings[i].y += buildingSpeed;
        buildings[i].show();
    }
    

    // Create new buildings at the top
    if (lastBuildingY + buildingSpacing <= height) {
        let y = lastBuildingY - buildingSpacing;

        // Randomly decide whether to create a building on the left
        if (random() < buildingChance) {
            let leftBuildingHeight = random(50, 150);
            buildings.unshift(new Building(0, y, 50, leftBuildingHeight));  // left side
        }

        // Randomly decide whether to create a building on the right
        if (random() < buildingChance) {
            let rightBuildingHeight = random(50, 150);
            buildings.unshift(new Building(width - 50, y, 50, rightBuildingHeight));  // right side
        }

        lastBuildingY = y;
    }

    // Remove buildings that have moved off the bottom
    while (buildings.length > 0 && buildings[buildings.length - 1].y - buildings[buildings.length - 1].h > height) {
        buildings.pop();
    }


    drawRoad();

    if (!gameIsOver) {
        car.show();
        car.move();

        if (random() < 0.02) {
            let newObstacle = new Obstacle();
            let overlap = false;
            for (let i = 0; i < obstacles.length; i++) {
                if (newObstacle.intersects(obstacles[i])) {
                    overlap = true;
                    break;
                }
            }
            if (!overlap) {
                obstacles.push(newObstacle);
            }
        }

        for (let i = obstacles.length - 1; i >= 0; i--) {
            obstacles[i].show();
            obstacles[i].move();

            if (obstacles[i].hits(car)) {
                gameIsOver = true;
            }

            if (obstacles[i].offscreen()) {
                obstacles.splice(i, 1);
            }
        }
    } else {
        fill(255);
        textSize(24);
        text("Game Over", width / 2 - 50, height / 2);
    }
}

function drawRoad() {
    fill(255);
    for(let y = 0; y < height; y += 40) {
        rect(width/2, y, 2, 20);
    }
}

class Car {
    constructor() {
        this.x = width / 2;
        this.y = height - 50;
        this.speed = 2;
        this.w = 20;
        this.h = 40;
    }

    show() {
        rectMode(CENTER);
        rect(this.x, this.y, this.w, this.h);
    }

    move() {
        this.x = constrain(this.x, 0, width);
        this.y = constrain(this.y, 0, height);

        if (keyIsDown(LEFT_ARROW)) {
            this.x -= this.speed;
        }

        if (keyIsDown(RIGHT_ARROW)) {
            this.x += this.speed;
        }

        if (keyIsDown(UP_ARROW)) {
            this.y -= this.speed;
        }

        if (keyIsDown(DOWN_ARROW)) {
            this.y += this.speed;
        }
    }
}

class Obstacle {
    constructor() {
        this.x = random(width / 2 - 100, width / 2 + 100);  // Limits the obstacle to fall within the road
        this.y = 0;
        this.speed = 2;
        this.w = random(20, 100);
        this.h = 20;
    }

    show() {
        rect(this.x, this.y, this.w, this.h);
    }

    move() {
        this.y += this.speed;
    }

    hits(car) {
        let left = this.x - this.w / 2;
        let right = this.x + this.w / 2;
        let top = this.y - this.h / 2;
        let bottom = this.y + this.h / 2;

        let carLeft = car.x - car.w / 2;
        let carRight = car.x + car.w / 2;
        let carTop = car.y - car.h / 2;
        let carBottom = car.y + car.h / 2;

        return !(carBottom < top || carTop > bottom || carRight < left || carLeft > right);
    }

    offscreen() {
        return this.y > height;
    }

    intersects(other) {
        let left = this.x - this.w / 2;
        let right = this.x + this.w / 2;
        let top = this.y - this.h / 2;
        let bottom = this.y + this.h / 2;

        let otherLeft = other.x - other.w / 2;
        let otherRight = other.x + other.w / 2;
        let otherTop = other.y - other.h / 2;
        let otherBottom = other.y + other.h / 2;

        return !(otherBottom < top || otherTop > bottom || otherRight < left || otherLeft > right);
    }
}


class Building {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    show() {
        rectMode(CORNER);
        rect(this.x, this.y, this.w, this.h);
    }
}
