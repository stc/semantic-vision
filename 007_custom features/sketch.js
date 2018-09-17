let featureExtractor;
let classifier;
let video;
let loss;

let class1Images = 0;
let class2Images = 0;
let class3Images = 0;

let snd1;
let snd2;
let snd3;

let fft1;
let fft2;
let fft3;

let classID = 0;

function preload() {
  snd1 = loadSound('data/001.wav');
  snd2 = loadSound('data/002.wav');
  snd3 = loadSound('data/003.wav');
}

function setup() {
  var c = createCanvas(600,310);
  c.position(0,0);
  video = createCapture(VIDEO);
  video.parent('videoContainer');
  featureExtractor = ml5.featureExtractor('MobileNet', modelReady);
  featureExtractor.numClasses=3;
  classifier = featureExtractor.classification(video, videoReady);
  setupButtons();
  
  snd1.loop();
  snd1.setVolume(0);

  snd2.loop();
  snd2.setVolume(0);

  snd3.loop();
  snd3.setVolume(0);

  fft1 = new p5.FFT();
  fft1.setInput(snd1);
  fft2 = new p5.FFT();
  fft2.setInput(snd2);
  fft3 = new p5.FFT();
  fft3.setInput(snd3);
}

function draw() {
  clear();
  fill(0,50);
  noStroke();
  rect(0,0,width/2+10,height);
  fill(0,150);
  noStroke();
  rect(width/2+10,0,width,height);

  var spectrum1 = fft1.analyze();
  beginShape();
  noFill();
  stroke(255,0,100);
  for (i = 0; i<spectrum1.length; i++) {
    vertex(i/2 + width/2 + width/4, map(spectrum1[i], 0, 255, height/4, 0) );
  }
  endShape();

  var spectrum2 = fft2.analyze();
  beginShape();
  noFill();
  stroke(255,0,100);
  for (i = 0; i<spectrum2.length; i++) {
    vertex(i/2 + width/2 + width/4, map(spectrum2[i], 0, 255, height/2, height/4) );
  }
  endShape();

  var spectrum3 = fft3.analyze();
  beginShape();
  noFill();
  stroke(255,0,100);
  for (i = 0; i<spectrum3.length; i++) {
    vertex(i/2 + width/2 + width/4, map(spectrum3[i], 0, 255, height-height/4, height/2) );
  }
  endShape();

  noStroke();
  fill(255);
  textSize(12);
  text("CURRENT CLASS:", width/2+width/20,height/3);
  textSize(26);
  text(classID, width/2+width/20,height/2);
}

function modelReady() {
  select('#modelStatus').html('Base Model (MobileNet) loaded!');
}

function videoReady () {
  select('#videoStatus').html('Video ready!');
}

function classify() {
  classifier.classify(gotResults);
}

function setupButtons() {
  buttonA = select('#button1');
  buttonA.mousePressed(function() {
    classifier.addImage('class1');
    select('#amountOfClass1').html(class1Images++);
  });

  buttonB = select('#button2');
  buttonB.mousePressed(function() {
    classifier.addImage('class2');
    select('#amountOfClass2').html(class2Images++);
  });

  buttonC = select('#button3');
  buttonC.mousePressed(function() {
    classifier.addImage('class3');
    select('#amountOfClass3').html(class3Images++);
  });

  
  // Train Button
  train = select('#train');
  train.mousePressed(function() {
    classifier.train(function(lossValue) {
      if (lossValue) {
        loss = lossValue;
        select('#loss').html('Loss: ' + loss);
      } else {
        select('#loss').html('Done Training! Final Loss: ' + loss);
      }
    });
  });

  // Predict Button
  buttonPredict = select('#buttonPredict');
  buttonPredict.mousePressed(classify);
}

// Show the results
function gotResults(err, result) {
  // Display any error
  if (err) {
    console.error(err);
  }
  select('#result').html(result);
  if(result == 'class1') {
    snd1.setVolume(1);
    snd2.setVolume(0);
    snd3.setVolume(0);
  } else if(result == 'class2') {
    snd1.setVolume(0);
    snd2.setVolume(1);
    snd3.setVolume(0);
  } else if(result == 'class3') {
    snd1.setVolume(0);
    snd2.setVolume(0);
    snd3.setVolume(1);
  }
  classID = result;
  classify();
}
