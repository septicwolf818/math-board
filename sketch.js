var MODE = "draw";
var lastX = -1;
var lastY = -1;
var isDrawing = false;
var selectingPoint = 1;
var point1 = [-1, -1];
var point2 = [-1, -1];
const first = (sketch) => {
  sketch.setup = function () {
    sketch.createCanvas(sketch.windowWidth, sketch.windowHeight - 70);
    sketch.stroke(0);
    sketch.strokeWeight(3);
    sketch.background(255);
  }
  sketch.touchMoved = function () {
    if (isDrawing) {
      if (lastX == -1 || lastY == -1) {
        lastX = sketch.mouseX;
        lastY = sketch.mouseY;
      }
      if (lastX != sketch.mouseX || lastY != sketch.mouseY) {
        sketch.line(lastX, lastY, sketch.mouseX, sketch.mouseY);
        lastX = sketch.mouseX;
        lastY = sketch.mouseY;
      }
    }
  }
  sketch.mouseMoved = function () {
    if (isDrawing) {
      if (lastX == -1 || lastY == -1) {
        lastX = sketch.mouseX;
        lastY = sketch.mouseY;
      }
      if (lastX != sketch.mouseX || lastY != sketch.mouseY) {
        line(lastX, lastY, sketch.mouseX, sketch.mouseY);
        lastX = sketch.mouseX;
        lastY = sketch.mouseY;
      }
    }
  }
  sketch.touchStarted = function () {
    if (sketch.mouseX > 0 && sketch.mouseX < sketch.width && sketch.mouseY > 0 && sketch.mouseY < sketch.height) {
      if (MODE == "draw") {
        isDrawing = true;
        sketch.point(sketch.mouseX, sketch.mouseY);
        if (lastX == -1 || lastY == -1) {
          lastX = sketch.mouseX;
          lastY = sketch.mouseY;
        }
        console.log("User is drawing!");
      }
    }
  }
  sketch.mousePressed = function () {
    if (sketch.mouseX > 0 && sketch.mouseX < sketch.width && sketch.mouseY > 0 && sketch.mouseY < sketch.height) {
      if (MODE == "draw") {
        isDrawing = true;
        sketch.point(sketch.mouseX, sketch.mouseY);
        if (lastX == -1 || lastY == -1) {
          lastX = sketch.mouseX;
          lastY = sketch.mouseY;
        }
        console.log("User is drawing!");
      }
    }
  }
  sketch.touchEnded = function () {
    if (sketch.mouseX > 0 && sketch.mouseX < sketch.width && sketch.mouseY > 0 && sketch.mouseY < sketch.height) {
      if (MODE == "draw") {
        isDrawing = false;
        console.log("User has stopped drawing!");
        lastX = -1;
        lastY = -1;
      }
    }
  }
  sketch.mouseReleased = function () {
    if (sketch.mouseX > 0 && sketch.mouseX < sketch.width && sketch.mouseY > 0 && sketch.mouseY < sketch.height) {
      if (MODE == "draw") {
        isDrawing = false;
        console.log("User has stopped drawing!");
        lastX = -1;
        lastY = -1;
      }
    }
  }
  sketch.mouseClicked = function () {
    if ((sketch.mouseX > 0 && sketch.mouseX < sketch.width && sketch.mouseY > 0 && sketch.mouseY < sketch.height)) {
      if (MODE != "draw") {
        if (selectingPoint == 1) {
          point1 = [sketch.mouseX, sketch.mouseY];
          selectingPoint++;
        } else if (selectingPoint == 2) {
          point2 = [sketch.mouseX, sketch.mouseY];
          switch (MODE) {
            case "line":
              sketch.line(point1[0], point1[1], point2[0], point2[1]);
              break;
            case "square":
              sketch.rectMode(sketch.CORNERS);
              sketch.noFill();
              sketch.rect(point1[0], point1[1], point2[0], point2[1]);
              break;
            case "circle":
              sketch.noFill();
              sketch.ellipseMode(sketch.RADIUS);
              sketch.ellipse(point1[0], point1[1], Math.abs(point1[0] - point2[0]), Math.abs(point1[1] - point2[1]));
              break;
          }
          selectingPoint = 1;
        }
      }
    }
  }
  sketch.clearCanvas = function () {
    sketch.clear();
    sketch.background(255);
    console.log("Canvas cleared!");
  }
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
const second = (sketch) => {
  sketch.setup = function () {
    sketch.createCanvas(sketch.windowWidth, sketch.windowHeight - 70);
    sketch.stroke("rgba(0,0,0,.4)");
    sketch.noFill();
    sketch.strokeWeight(3);
  }
  sketch.draw = function () {
    var clear = true;
    if (selectingPoint == 2) {
      clear = true;
      sketch.clear()
      switch (MODE) {
        case "line":
          sketch.line(point1[0], point1[1], sketch.mouseX, sketch.mouseY);
          break;
        case "square":
          sketch.rectMode(sketch.CORNERS);
          sketch.noFill();
          sketch.rect(point1[0], point1[1], sketch.mouseX, sketch.mouseY);
          break;
        case "circle":
          sketch.noFill();
          sketch.ellipseMode(sketch.RADIUS);
          sketch.ellipse(point1[0], point1[1], Math.abs(point1[0] - sketch.mouseX), Math.abs(point1[1] - sketch.mouseY));
          break;
      }
    } else {
      if (clear) {
        sketch.clear();
        clear = false;
      }
    }
  }
}
cnvs1 = new p5(first);
cnvs2 = new p5(second);

function changeColor(obj) {
  var colors = document.getElementsByClassName("color");
  var color = obj.dataset.color;
  for (var i = 0; i < colors.length; i++) {
    colors[i].classList.remove("coloractive");
  }
  obj.classList.add("coloractive")
  cnvs1.strokeWeight(3)
  switch (color) {
    case "black":
      cnvs1.stroke(0);
      break;
    case "red":
      cnvs1.stroke(255, 0, 0);
      break;
    case "green":
      cnvs1.stroke(0, 255, 0);
      break;
    case "blue":
      cnvs1.stroke(0, 0, 255);
      break;
    case "white":
      cnvs1.strokeWeight(30);
      cnvs1.stroke(255, 255, 255);
      break;
  }
}