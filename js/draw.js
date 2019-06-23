'use strict';

const canvas = document.getElementById("graphCanvas");
const ctx = canvas.getContext("2d");

const width = 800;
const height = 600;

function init() {
    canvas.width = width;
    canvas.height = height;
    window.requestAnimationFrame(draw);
}

var colorBack = "#050505"
var colorMain = "#FFFFFF"
var colorWarn = "#FF0000"
var colorAttn = "#FFFF00"

function draw() {
    ctx.clearRect(0, 0, width, height);

    player.stats.setHealth(Math.floor(player.stats.health.MIN + Math.random() * (player.stats.health.MAX - player.stats.health.MIN)));
    player.stats.setMana(Math.floor(player.stats.mana.MIN + Math.random() * (player.stats.mana.MAX - player.stats.mana.MIN)));

    drawLogo();

    drawFrame();
    drawStats();
    drawStatus();

    //window.requestAnimationFrame(draw);
}

function drawLogo() {
    ctx.fillStyle = colorBack;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = colorMain;
    ctx.textAlign = "left";
    ctx.font = "60px Consolas";
    ctx.fillText("S.O.R.C.", 0, 50);
    ctx.font = "16.5px Consolas";
    ctx.fillText("Some Oldstyle Roguelike Crap", 0, 70);
    ctx.font = "10px Consolas";
    ctx.fillText("CLICK and F5", 0, 85);
}

function drawFrame() {
    ctx.strokeStyle = colorMain;
    ctx.lineWidth = 3;

    ctx.fillStyle = colorBack;
    ctx.fillRect(0, height * 0.75, width, height * 0.25);
    ctx.fillRect(width * 0.8, 0, width * 0.2, height * 0.75);

    //bottom
    ctx.strokeRect(1, height * 0.75 + 1, width - 2, height * 0.25 - 2);
    //right
    ctx.strokeRect(width * 0.8 + 1, 1, width * 0.2 - 2, height - 1);
}

function drawStatus() {
    ctx.strokeStyle = colorMain;
    ctx.lineWidth = 3;

    var locW = width * 0.80 + 5;
    var locH = 16;
    var offH = height * 0.75;
    
    var i = 0;

    ctx.fillText("      =====      ", locW, ++i * locH + offH);
    ctx.fillText("   ===========   ", locW, ++i * locH + offH);
    ctx.fillText("  ====     ====  ", locW, ++i * locH + offH);
    ctx.fillText(" ===         === ", locW, ++i * locH + offH);
    ctx.fillText(" ===         === ", locW, ++i * locH + offH);
    ctx.fillText("=================", locW, ++i * locH + offH);
    ctx.fillText("      SUNNY      ", locW, ++i * locH + offH);
    ctx.fillText("=================", locW, ++i * locH + offH);
    ctx.fillText(setPadding(dateToYMD(new Date(getRandomInt(100000000000000, 150000000000000))), 14), locW, ++i * locH + offH);    
    
}


function drawStats() {
    ctx.textAlign = "left";
    ctx.font = "16px Consolas";

    var locW = width * 0.80 + 5;
    var locH = 16;
    var offH = -2;

    var i = 0;

    ctx.fillStyle = colorMain;
    ctx.fillText(player.name, locW, ++i * locH + offH);

    ctx.fillText("=================", locW, ++i * locH + offH);

    ctx.fillStyle = getStatusColor(player.stats.health, [colorWarn, colorAttn, colorMain, colorMain]);
    ctx.fillText("HEALTH", locW, ++i * locH + offH);
    ctx.fillStyle = getStatusColor(player.stats.mana, [colorWarn, colorAttn, colorMain, colorMain]);
    ctx.fillText("            POWER", locW, i * locH + offH);

    ctx.fillStyle = getStatusColor(player.stats.health, [colorWarn, colorAttn, colorMain, colorMain]);
    ctx.fillText(player.stats.getHealthAsString(), locW, ++i * locH + offH);
    ctx.fillStyle = getStatusColor(player.stats.mana, [colorWarn, colorAttn, colorMain, colorMain]);
    ctx.fillText("          " + player.stats.getManaAsString(), locW, i * locH + offH);


    ctx.fillStyle = colorMain;
    ctx.fillText("EXPERIENCE   GOLD", locW, ++i * locH + offH);
    ctx.fillText(player.stats.getXP(), locW, ++i * locH + offH);
    ctx.fillText(player.inventory.getGold(), locW, i * locH + offH);

    ctx.fillText("=================", locW, ++i * locH + offH);

    ctx.fillStyle = colorMain;
    ctx.fillText("STNG  AGIL  LUCK", locW, ++i * locH + offH);
    ctx.fillText(player.stats.getStat("STNG") + " " + player.stats.getStat("AGIL") + " " + player.stats.getStat("LUCK"), locW, ++i * locH + offH);

    ctx.fillText("=================", locW, ++i * locH + offH);

    ctx.fillStyle = colorMain;
    ctx.fillText("HEAD:" + player.inventory.getSlotAsString("HEAD"), locW, ++i * locH + offH);
    ctx.fillText("NECK:" + player.inventory.getSlotAsString("NECK"), locW, ++i * locH + offH);
    ctx.fillText("BODY:" + player.inventory.getSlotAsString("BODY"), locW, ++i * locH + offH);
    ctx.fillText("HAND:" + player.inventory.getSlotAsString("HAND"), locW, ++i * locH + offH);
    ctx.fillText("LEGS:" + player.inventory.getSlotAsString("LEGS"), locW, ++i * locH + offH);

    ctx.fillText("WEPN:" + player.inventory.getSlotAsString("MAIN"), locW, ++i * locH + offH);
    ctx.fillText("DIST:" + player.inventory.getSlotAsString("DIST"), locW, ++i * locH + offH);
    ctx.fillText("AMMO:" + player.inventory.getSlotAsString("AMMO"), locW, ++i * locH + offH);

    ctx.fillText("=================", locW, ++i * locH + offH);

    ctx.fillStyle = colorMain;
    ctx.fillText("WEPNATK   WEPNDMG", locW, ++i * locH + offH);
    ctx.fillText(setPadding(player.inventory.getStat("PATK", "MAIN") + "+" + player.inventory.getStat("MATK", "MAIN"), 3, 3, "+"), locW, ++i * locH + offH);
    ctx.fillText("          " + setPadding(player.inventory.getStat("PDMG", "MAIN") + "+" + player.inventory.getStat("MDMG", "MAIN"), 3, 3, "+"), locW, i * locH + offH);

    ctx.fillText("DISTATK   DISTDMG", locW, ++i * locH + offH);
    ctx.fillText(setPadding(player.inventory.getStat("PATK", "DIST") + "+" + player.inventory.getStat("MATK", "DIST"), 3, 3, "+"), locW, ++i * locH + offH);
    ctx.fillText("          " + setPadding(player.inventory.getStat("PDMG", "DIST") + "+" + player.inventory.getStat("MDMG", "DIST"), 3, 3, "+"), locW, i * locH + offH);
    ctx.fillText("ARMR", locW, ++i * locH + offH);
    ctx.fillText(setPadding(player.inventory.getArmor(), 3, 3, "+"), locW, ++i * locH + offH);

    ctx.fillText("=================", locW, ++i * locH + offH);

    ctx.fillText("  WEIGHT     FOOD" + player.inventory.getWeight(), locW, ++i * locH + offH);
    ctx.fillText(player.inventory.getWeight() + player.inventory.getFood(), locW, ++i * locH + offH);
}