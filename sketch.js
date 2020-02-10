var MODE = "draw";
var lastX = -1;
var lastY = -1;
var isDrawing = false;
var selectingPoint = 1;
var point1 = [-1, -1];
var point2 = [-1, -1];

function setup() {
  createCanvas(windowWidth, windowHeight - 150);
  background(255, 254, 242);
  stroke(0);
  strokeWeight(2);
}


function touchMoved() {
  if (isDrawing) {
    if (lastX == -1 || lastY == -1) {
      lastX = mouseX;
      lastY = mouseY;
    }
    if (lastX != mouseX || lastY != mouseY) {
      line(lastX, lastY, mouseX, mouseY);
      lastX = mouseX;
      lastY = mouseY;
    }
  }
}

function mouseMoved() {
  if (isDrawing) {
    if (lastX == -1 || lastY == -1) {
      lastX = mouseX;
      lastY = mouseY;
    }
    if (lastX != mouseX || lastY != mouseY) {
      line(lastX, lastY, mouseX, mouseY);
      lastX = mouseX;
      lastY = mouseY;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight - 150);
  background(255, 254, 242);

}

function touchStarted() {
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    if (MODE == "draw") {
      isDrawing = true;
      console.log("User is drawing!");
    }
  }
}

function mousePressed() {
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    if (MODE == "draw") {
      isDrawing = true;
      console.log("User is drawing!");
    }
  }
}

function touchEnded() {
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    if (MODE == "draw") {
      isDrawing = false;
      console.log("User stopped drawing!");
      lastX = -1;
      lastY = -1;
    }
  }
}

function mouseReleased() {
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    if (MODE == "draw") {
      isDrawing = false;
      console.log("User stopped drawing!");
      lastX = -1;
      lastY = -1;
    }
  }
}

function mouseClicked() {
  if ((mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height)) {
    if (MODE != "draw") {
      if (selectingPoint == 1) {
        point1 = [mouseX, mouseY];
        selectingPoint++;
      } else if (selectingPoint == 2) {
        point2 = [mouseX, mouseY];
        switch (MODE) {
          case "line":
            line(point1[0], point1[1], point2[0], point2[1]);
            break;
          case "square":
            rectMode(CORNERS);
            noFill();
            rect(point1[0], point1[1], point2[0], point2[1]);
            break;
          case "circle":
            ellipseMode(CORNERS);
            ellipse(point1[0], point1[1], point2[0], point2[1]);
            break;
        }
        selectingPoint = 1;
      }
    }
  }
}

function clearCanvas() {
  clear();
  console.log("Canvas cleared!");
}

function changeMode(mode, index) {
  MODE = mode;
  var modes = document.getElementsByClassName("mode");

  for (var i = 0; i < modes.length; i++) {
    modes[i].classList.remove("active");
  }
  modes[index].classList.add("active");
  console.log("New mode selected: " + MODE);
}

function changeColor(obj) {
  var color = obj.dataset.color;
  switch (color) {
    case "black":
      stroke(0);
      break;
    case "red":
      stroke(255, 0, 0);
      break;
    case "green":
      stroke(0, 255, 0);
      break;
    case "blue":
      stroke(0, 0, 255);
      break;
  }
}