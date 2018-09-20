let featureExtractor;
let regressor;
let video;
let loss;
let slider;
let samples = 0;
let position = 0;
var rev = 0;

var p3, globe, numPoints, modelSize, rotationPhase, wavePhase;
let changer = 0;
let c = 0;
let easing = 0.05;
let res = 0;

function preload() {
  globe = loadModel('data/globe.obj');
}

function setup() {
  let c = createCanvas(displayWidth, displayHeight);
  c.position(0,0);

  video = createCapture(VIDEO);
  video.hide();
  featureExtractor = ml5.featureExtractor('MobileNet', modelReady);
  regressor = featureExtractor.regression(video, videoReady);
  setupButtons();

  numPoints = 2000;
  rotationPhase = 0;
  modelSize = 2.5;
  wavePhase = 0;

  p3 = createGraphics(700,500,WEBGL);
  p3.ambientLight(0);

  waveVertices = [];
  for(var i = 0; i < numPoints; i++) {
    waveVertices[i] = createVector(random(-300, 300), 0, random(-300, 300));
  }
}

function draw() {
  clear();
  image(video, 20, 50, 340, 260);
  fill(0,20);
  noStroke();
  rect(20,50,340,260);
  
  drawAnimation();
  noFill();
  stroke(255,30);
  rect(390,50,720,520)

  
  rotationPhase = frameCount * 0.001;
  wavePhase = frameCount * 0.002;

  //let target = mouseX / width;
  let target = res;
  let d = target - c;
  c += d * easing;
  changer = c;
}

function modelReady() {
  select('#modelStatus').html('Model loaded!');
}

function videoReady() {
  select('#videoStatus').html('Video ready!');
}

function predict() {
  regressor.predict(gotResults);
}

function setupButtons() {
  slider = select('#slider');
  select('#addSample').mousePressed(function() {
    regressor.addImage(slider.value());
    select('#amountOfSamples').html(samples++);
  });

  select('#train').mousePressed(function() {
    regressor.train(function(lossValue) {
      if (lossValue) {
        loss = lossValue;
        select('#loss').html('Loss: ' + loss);
      } else {
        select('#loss').html('Done Training! Final Loss: ' + loss);
      }
    });
  });

  select('#buttonPredict').mousePressed(predict);
}

function gotResults(err, result) {
  perform = true;
  if (err) {
    console.error(err);
  }
  position = floor(map(result, 0, 1, 0, 11));
  res = result;
  slider.value(result);
  predict();
}

function drawAnimation() {
  // custom animation to try interpolating possibilities with regression
  p3.background(0);
  p3.fill(255);

  p3.push();
  p3.rotateZ(radians(180)); 
  p3.translate(350, 250, -900);
  p3.specularMaterial(250);
  p3.rotateY(rotationPhase)

  p3.pointLight(255, 255, 255, sin(frameCount*0.02) * 1000,cos(frameCount*0.02) * 1000, -500);
  for(var i = 0; i < numPoints; i++) {

    var index = floor(map(i, 0, numPoints, 0, globe.vertices.length));
    var globeVertex = globe.vertices[index];

    var waveVertex = waveVertices[i];
    waveVertex.y = sin(waveVertex.x + wavePhase) * cos(waveVertex.z + wavePhase) * 100;

    var animationLoopPosition = changer;
    var vert = createVector(
      map(animationLoopPosition, 0, 1, waveVertex.x, globeVertex.x),
      map(animationLoopPosition, 0, 1, waveVertex.y, globeVertex.y),
      map(animationLoopPosition, 0, 1, waveVertex.z, globeVertex.z)
    )

    p3.push();
    p3.translate(vert.x * modelSize, vert.y * modelSize, vert.z * modelSize);
    //p3.box(5,2,2);
    p3.sphere(2);
    p3.pop();
  }
  p3.pop();
  image(p3, 400, 60);
}
