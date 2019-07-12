'use strict';

const canvas = document.getElementById("graphCanvas");
const ctx = canvas.getContext("2d");

var renderlastFrameTime = 0;

const width = 800;
const height = 600;

function initDraw() {
    canvas.width = width;
    canvas.height = height;
    draw();
}

var colorsCGA = [
    "#000000", // 0  black
    "#0000AA", // 1  blue
    "#00AA00", // 2  green
    "#00AAAA", // 3  cyan
    "#AA0000", // 4  red
    "#AA00AA", // 5  magenta
    "#AA5500", // 6  brown
    "#AAAAAA", // 7  light gray
    "#555555", // 8  dark gray
    "#5555FF", // 9  light blue
    "#55FF55", // 10 light green
    "#55FFFF", // 11 light cyan
    "#FF5555", // 12 light red
    "#FF55FF", // 13 light magenta
    "#FFFF55", // 14 yellow
    "#FFFFFF", // 15 white
];

var colorBack = colorsCGA[0]; // black
var colorMain = colorsCGA[15]; // white
var colorWarn = colorsCGA[4]; // red
var colorAttn = colorsCGA[14]; //yellow

// var gSubmap = [
//     [1, 1, 1, 1],
//     [1, 1, 1, 1],
//     [1, 1, 1, 1]
// ];

function draw() {
    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = colorBack;
    ctx.fillRect(0, 0, width, height);

    //drawInterfaceLogo();

    if (gSubmap && debugSubmap2D)
        drawScreenSubmap2D(gSubmap);

    drawInterfaceFrame();
    drawInterfaceStats();
    drawInterfaceStatus();
    drawInterfaceLogs();

    // рендер каждый возможный кадр
    // window.requestAnimationFrame(draw);

    //рендер 1 раза в секунду
    // setTimeout(() => {
    //     draw();
    // }, 1000 / 1);
}