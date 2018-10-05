var playerx = 0;
var w1, w2, w3;
var gameover = false;
var gameoversound;
var controller = 0;
let video;
let poseNet;
let poses = [];

function setup() {
    createCanvas(640, 480);
    w1 = random(100, 150);
    w2 = random(200, 300);
    w3 = random(350, 450);
    gameoversound = loadSound("data/hang.wav");
    video = createCapture(VIDEO);
    video.size(width, height);
    poseNet = ml5.poseNet(video, modelReady);
    poseNet.on('pose', function(results) {
        poses = results;
    });
    video.hide();
}

function modelReady() {
    console.log("Model loaded");
}

function draw() {
    background(0);
    fill(255);
    rect(playerx, controller, 50, 50);
    playerx++;
    if (playerx > width) {
        playerx = 0;
    }
    Wall(w1, 50, 50, 100);
    Wall(w2, 100, 50, 150);
    Wall(w3, 100, 50, 150);
    if (gameover) {
        noStroke();
        fill(0, 200);
        rect(0, 0, width, height);
        textSize(60);
        fill(255, 0, 0);
        textAlign(CENTER, CENTER);
        text("GAME OVER", width / 2, height / 2);
    }
    for (let i = 0; i < poses.length; i++) {
        let pose = poses[0].pose;
        for (let j = 0; j < pose.keypoints.length; j++) {
            let keypoint = pose.keypoints[j];
            if (keypoint.score > 0.2) {
                fill(255, 0, 0, 100);
                noStroke();
                textSize(8);
                text(j, keypoint.position.x + 40, keypoint.position.y);
                if (j == 10) {
                    controller = keypoint.position.y;
                    fill(255);
                }
                ellipse(keypoint.position.x, keypoint.position.y, 15, 15);
            }
        }
    }
}

function Wall(x, y, w, h) {
    var wallx = x;
    var wally = y;
    var wallw = w;
    var wallh = h;
    noFill();
    stroke(255);
    rect(wallx, wally, wallw, wallh);
    if (playerx + 50 > wallx && controller + 50 > wally && playerx < wallx + wallw && controller < wally + wallh) {
        //playerx = 0;
        gameoversound.play();
        gameover = true;
        noLoop();
    }
}