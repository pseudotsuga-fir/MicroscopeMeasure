/*
Solution to responsive canvas size?
https://stackoverflow.com/questions/18679414/how-put-percentage-width-into-html-canvas-no-css
*/

var c = document.getElementById("canvas");
var ctx = c.getContext("2d");
let testTxt = document.getElementById("testTxt");
let slider = document.getElementById("lineWidthSlider");
let fieldIn = document.getElementById("fnumber");
let lensIn = document.getElementById("lensMag");
let objIn = document.getElementById("objMag");
let submit = document.getElementById("FOVcalc");

c.width = testImg.width * 0.2;
c.height = testImg.height * 0.2;

let startPos = {x: 0, y: 0};
let endPos = {x: 0, y: 0};
let lineFOV = {x1: 0, y1: 0, x2: 0, y2: 0};
let actualFOV = 45;
let distFOV;
let remapFOVRatio;
let measurement;

let lineFOVWidth = 2;
let lineColor = "#000000";

let isDrawLine = false;
let checkSizeEnd = false;
let distSet = false;

slider.oninput = () => {
  draws();
  lineFOVWidth = mapRange(slider.value, 1, 100, 0.4, 6);
}

submit.onclick = () => {
  actualFOV = calcActualFOV(fieldIn.value, lensIn.value, objIn.value);
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
  ctx.lineCap = "round";
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(startPos.x, startPos.y);
  ctx.lineTo(endPos.x, endPos.y);
  ctx.stroke();
}

const drawBackground = () => {
  ctx.drawImage(document.getElementById("testImg"),0,0, testImg.width * 0.2, testImg.height * 0.2);
}

const drawDist = () => {
  measurement = (getDist(startPos.x,startPos.y,endPos.x,endPos.y).toFixed(2) * remapFOVRatio).toFixed(2);
  ctx.font = "15px Arial"
  ctx.fillText(measurement, (startPos.x + endPos.x)/2 + 10, (startPos.y + endPos.y)/2 + 10);
}

const getDist = (x1, y1, x2, y2) => {
  return Math.sqrt(((x2-x1)**2)+((y2-y1)**2));
}

const mapRange = (value, low1, high1, low2, high2) => {
    return low2+(high2-low2)*(value-low1)/(high1-low1);
}

const calcActualFOV = (field, lens, objective) => {
  //In micrometers
  return (field/(lens*objective))*1000;
}
window.onload = function() {
  drawBackground();
}

//TODO: fix touch listeners
c.addEventListener("mousedown", e => {
  //startPos = {x: e.clientX - rect.left, y: e.clientY - rect.top};
  startPos = getMousePos(e);
  console.log(startPos);
  isDrawLine = true
  if(distSet){
    drawDist();
  }
});

c.addEventListener("mousemove", e => {
  if(!isDrawLine) return;
  //endPos = {x: e.clientX - rect.left, y: e.clientY - rect.top};
  endPos = getMousePos(e);
  draws();
});

c.addEventListener("mouseup", e => {
  isDrawLine = false;
  checkSizeEnd = true;
});

const getMousePos = (e) => {
    var rect = c.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

// c.addEventListener("touchstart", e => {
//   console.log("touched! ")
//   startPos = {x: e.offsetX, y: e.offsetY};
//   isDrawLine = true
//   if(distSet){
//     drawDist();
//   }
// });
//
// c.addEventListener("touchmove", e => {
//   if(!isDrawLine) return;
//   endPos = {x: e.offsetX, y: e.offsetY};
//   draws();
// });
//
// c.addEventListener("touchup", e => {
//   isDrawLine = false;
//   checkSizeEnd = true;
// });

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
