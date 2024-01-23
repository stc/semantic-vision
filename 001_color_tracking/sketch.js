var colors;
var capture;
var trackingData;

function setup() {
  var c = createCanvas(windowWidth,windowHeight)
  c.position(0,0);

  capture = createCapture(VIDEO); //capture the webcam
  capture.position(0,0) //move the capture to the top left
  capture.style('opacity',0.5)// use this to hide the capture later on (change to 0 to hide)...
  capture.id("myVideo"); //give the capture an ID so we can use it in the tracker below.

  tracking.ColorTracker.registerColor('white', function(r, g, b) {
        var dx = r - 255;
        var dy = g - 255;
        var dz = b - 255;
        if ((b - g) >= 100 && (r - g) >= 60) {
          return true;
        }
        return dx * dx + dy * dy + dz * dz < 3500;
      });

  colors = new tracking.ColorTracker(['white']);
  tracking.track('#myVideo', colors); // start the tracking of the colors above on the camera in p5

  //start detecting the tracking
  colors.on('track', function(event) { //this happens each time the tracking happens
      trackingData = event.data // break the trackingjs data into a global so we can access it with p5
  });

}

function draw() {
	clear();
  // console.log(trackingData);
  if(trackingData){ //if there is tracking data to look at, then...
    for (var i = 0; i < trackingData.length; i++) { //loop through each of the detected colors
      noFill();
      strokeWeight(4);
      stroke(255,0,100);
      rect(trackingData[i].x,trackingData[i].y,trackingData[i].width,trackingData[i].height)
    }
  }
}