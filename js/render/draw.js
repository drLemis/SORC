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

var gColorsCGA = {
    0: "#000000",
    1: "#0000AA",
    2: "#00AA00",
    3: "#00AAAA",
    4: "#AA0000",
    5: "#AA00AA",
    6: "#AA5500",
    7: "#AAAAAA",
    8: "#555555",
    9: "#5555FF",
    10: "#55FF55",
    11: "#55FFFF",
    12: "#FF5555",
    13: "#FF55FF",
    14: "#FFFF55",
    15: "#FFFFFF",

    BLACK: "#000000",
    BLUE: "#0000AA",
    GREEN: "#00AA00",
    CYAN: "#00AAAA",
    RED: "#AA0000",
    MAGENTA: "#AA00AA",
    BROWN: "#AA5500",
    LIGHTGRAY: "#AAAAAA",
    DARKGRAY: "#555555",
    LIGHTBLUE: "#5555FF",
    LIGHTGREEN: "#55FF55",
    LIGHTCYAN: "#55FFFF",
    LIGHTRED: "#FF5555",
    LIGHTMAGENTA: "#FF55FF",
    YELLOW: "#FFFF55",
    WHITE: "#FFFFFF",
};

var colorBack = gColorsCGA.BLACK; // black
var colorMain = gColorsCGA.WHITE; // white
var colorWarn = gColorsCGA.RED; // red
var colorAttn = gColorsCGA.YELLOW; // yellow
var colorGood = gColorsCGA.GREEN; // green

function draw() {
    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = colorBack;
    ctx.fillRect(0, 0, width, height);

    drawInterfaceFrame();

    switch (gGameState) {
        case eGameStates.INVENTORY:
        case eGameStates.INVENTORY_DROP:
        case eGameStates.INVENTORY_USE:
            drawMenuInventory();
            break;
        case eGameStates.INVENTORY_GET:
            if (gGameStateLast == eGameStates.TOWN_TAVERN)
                drawMenuPickup(getCurrentGlobalTile().town.items);
            else
                drawMenuPickup(getCurrentLocalTile().items);
            break;
        case eGameStates.TOWN:
            drawMenuTown();
            break;
        case eGameStates.TOWN_TAVERN:
            drawMenuTownTavern();
            break;
        case eGameStates.TOWN_TAVERN_REST:
            drawMenuTownTavernRest();
            break;
        default:
            if (gGamePosition == eGamePositions.SUBMAP && gWorld.mapLocal)
                drawScreenSubmap2D(gWorld.mapLocal);
            else
                drawScreenGlobalmap2D(gWorld.mapGlobal);
            break;
    }

    drawInterfaceStats();
    drawInterfaceStatus();
    drawInterfaceLogs();

    // рендер каждый возможный кадр
    // window.requestAnimationFrame(draw);

    //рендер 1 раз в секунду
    // setTimeout(() => {
    //     draw();
    // }, 1000 / 1);
}