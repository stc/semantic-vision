let featureExtractor;
let regressor;
let video;
let loss;
let slider;
let samples = 0;
let positionX = 140;

function setup() {
  createCanvas(340, 280);
  video = createCapture(VIDEO);
  video.hide();
  featureExtractor = ml5.featureExtractor('MobileNet', modelReady);
  regressor = featureExtractor.regression(video, videoReady);
  setupButtons();
}

function draw() {
  image(video, 0, 0, 340, 280);
  noStroke();
  fill(255, 0, 0);
  rect(positionX, 120, 50, 50);
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

// Show the results
function gotResults(err, result) {
  if (err) {
    console.error(err);
  }
  positionX = map(result, 0, 1, 0, width);
  slider.value(result);
  predict();
}
