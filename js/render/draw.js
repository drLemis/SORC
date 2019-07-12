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

var colorBack = "#050505"
var colorMain = "#FFFFFF"
var colorWarn = "#FF0000"
var colorAttn = "#FFFF00"

var gSubmap = [
    [1, 1, 1, 1],
    [1, 1, 1, 1],
    [1, 1, 1, 1]
];

function draw() {
    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = colorBack;
    ctx.fillRect(0, 0, width, height);

    //drawInterfaceLogo();

    if (gSubmap)
        drawScreenSubmap2D(gSubmap);

    drawInterfaceFrame();
    drawInterfaceStats();
    drawInterfaceStatus();

    // рендер каждый возможный кадр
    // window.requestAnimationFrame(draw);

    //рендер 1 раза в секунду
    setTimeout(() => {
        draw();
    }, 1000 / 1);
}