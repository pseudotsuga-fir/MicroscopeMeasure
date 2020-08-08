var c = document.getElementById("canvas");
var ctx = c.getContext("2d");

let testTxt = document.getElementById("testTxt");
let slider = document.getElementById("lineWidthSlider");

let startPos = {x: 0, y: 0};
let endPos = {x: 0, y: 0};
let lineFOV = {x1: 0, y1: 0, x2: 0, y2: 0};
let actualFOV = 18;
let distFOV;
let remapFOVRatio;
let measurement;

let lineFOVWidth = 3;
let lineColor = "#000000";

let isDrawLine = false;
let checkSizeEnd = false;
let distSet = false;

slider.oninput = () => {
  draws();
  lineFOVWidth = mapRange(slider.value, 1, 100, 1, 10);
}

const draws = () => {
  clearCanvas();
  drawBackground();
  if(distSet){
    drawDist();
  }
  drawLine(lineFOVWidth);
}

const clearCanvas = () => {
  ctx.clearRect(0,0, c.width, c.height);
}

const drawLine = (width) => {
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(startPos.x, startPos.y);
  ctx.lineTo(endPos.x, endPos.y);
  ctx.stroke();
}

const drawDist = () => {
  //measurement = mapRange(getDist(startPos.x,startPos.y,endPos.x,endPos.y).toFixed(2), 0, Math.sqrt((ctx.width)+(ctx.height)).toFixed(2), 0, distFOV).toFixed(2);
  measurement = (getDist(startPos.x,startPos.y,endPos.x,endPos.y).toFixed(2) * remapFOVRatio).toFixed(2);
  ctx.font = "30px Arial"
  ctx.fillText(measurement, 5, 100);
}

const getDist = (x1, y1, x2, y2) => {
  return Math.sqrt(((x2-x1)**2)+((y2-y1)**2));
}

const mapRange = (value, low1, high1, low2, high2) => {
    return low2+(high2-low2)*(value-low1)/(high1-low1);
}

const drawBackground = () => {
  ctx.drawImage(document.getElementById("testImg"),0,0, testImg.width * 0.2, testImg.height * 0.2);
  ctx.width = testImg.width * 0.2;
  ctx.height = testImg.height * 0.2;
}
window.onload = function() {
  drawBackground();
}

//TODO: add touch listeners
c.addEventListener("mousedown", e => {
  startPos = {x: e.offsetX, y: e.offsetY};
  isDrawLine = true
  if(distSet){
    drawDist();
  }
});

c.addEventListener("mousemove", e => {
  if(!isDrawLine) return;
  endPos = {x: e.offsetX, y: e.offsetY};
  draws();
});

c.addEventListener("mouseup", e => {
  isDrawLine = false;
  checkSizeEnd = true;
});

window.addEventListener("keyup", e => {
    if(e.code == "Enter" && checkSizeEnd == true){
      setDistFov(e);
    }
});

const setDistFov = (e) => {
    distFOV = getDist(startPos.x,startPos.y,endPos.x,endPos.y).toFixed(2);
    lineFOV = {x1: startPos.x, y1: startPos.y, x2: endPos.x, y2: endPos.y};
    console.log(distFOV);
    remapFOVRatio = actualFOV/distFOV;
    distSet = true;
    checkSizeEnd = false;
    testTxt.innerHTML = "Microscope FOV set";
}
// function callOnce(fn, context) {
// 	var result;
//
// 	return function() {
// 		if(fn) {
// 			ret = fn.apply(context || this, arguments);
// 			fn = null;
// 		}
//
// 		return ret;
// 	};
// }
