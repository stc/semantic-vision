var player;
var wall1, wall2, wall3;

function setup() {
  createCanvas(1000,600);
  player = new Player();
  makeWalls();
}

function draw() {
  background(0);
  player.draw();

  wall1.draw();
  wall2.draw();
  wall3.draw();

  if(wall1.over(player.x, player.y) || wall2.over(player.x, player.y) || wall3.over(player.x, player.y)) {
    textSize(50);
    textAlign(CENTER,CENTER);
    fill(255);
    noStroke();
    text("GAME OVER", width/2, height/2);
    noLoop(); 
  }
}

function makeWalls() {
  var wallWidth = 30;
  wall1 = new Wall( random(wallWidth,width/4), 0, wallWidth, random( 100, height - 100) );
  var randomHeight = random( 100, height - 100);
  wall2 = new Wall( random(width/3,width/2 + width/4), height - randomHeight, wallWidth, randomHeight );
  wall3 = new Wall( random(width/2+width/4,width-wallWidth), 0, wallWidth, random( 100, height - 100) );
}

class Player {
  constructor() {
    this.x = 0;
    this.y = height/2;
    this.size = 20;
    this.speed = 4;
  }

  draw() {
    noStroke();
    fill(255);
    ellipse(this.x, this.y, this.size, this.size);
    this.x += this.speed;
    this.y = mouseY;
    if(this.x > width) {
      makeWalls();
      this.x = 0;
    }
  }
}

class Wall {
  constructor(x,y,w,h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  draw() {
    noFill();
    stroke(255);
    rect(this.x, this.y, this.w, this.h);
  }

  over(x,y) {
    if((x > this.x && x < this.x + this.w) && (y > this.y && y < this.y + this.h)) {
      return true;
    } else {
      return false;
    }
  }
}