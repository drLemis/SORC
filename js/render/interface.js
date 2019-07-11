
function drawInterfaceLogo() {
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

function drawInterfaceFrame() {
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

function drawInterfaceStatus() {
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
    ctx.fillText(setPadding(dateToYMD(gWorld.date), 14), locW, ++i * locH + offH);
}


function drawInterfaceStats() {
    ctx.textAlign = "left";
    ctx.font = "16px Consolas";

    var locW = width * 0.80 + 5;
    var locH = 16;
    var offH = -2;

    var i = 0;

    ctx.fillStyle = colorMain;
    ctx.fillText(gPlayer.name, locW, ++i * locH + offH);

    ctx.fillText("=================", locW, ++i * locH + offH);

    ctx.fillStyle = getStatusColor(gPlayer.stats.health, [colorWarn, colorAttn, colorMain, colorMain]);
    ctx.fillText("HEALTH", locW, ++i * locH + offH);
    ctx.fillStyle = getStatusColor(gPlayer.stats.mana, [colorWarn, colorAttn, colorMain, colorMain]);
    ctx.fillText("            POWER", locW, i * locH + offH);

    ctx.fillStyle = getStatusColor(gPlayer.stats.health, [colorWarn, colorAttn, colorMain, colorMain]);
    ctx.fillText(gPlayer.stats.getHealthAsString(), locW, ++i * locH + offH);
    ctx.fillStyle = getStatusColor(gPlayer.stats.mana, [colorWarn, colorAttn, colorMain, colorMain]);
    ctx.fillText("          " + gPlayer.stats.getManaAsString(), locW, i * locH + offH);


    ctx.fillStyle = colorMain;
    ctx.fillText("EXPERIENCE   GOLD", locW, ++i * locH + offH);
    ctx.fillText(gPlayer.stats.getXP(), locW, ++i * locH + offH);
    ctx.fillText(gPlayer.inventory.getGold(), locW, i * locH + offH);

    ctx.fillText("=================", locW, ++i * locH + offH);

    ctx.fillStyle = colorMain;
    ctx.fillText("STNG  AGIL  LUCK", locW, ++i * locH + offH);
    ctx.fillText(gPlayer.stats.getStat("STNG") + " " + gPlayer.stats.getStat("AGIL") + " " + gPlayer.stats.getStat("LUCK"), locW, ++i * locH + offH);

    ctx.fillText("=================", locW, ++i * locH + offH);

    ctx.fillStyle = colorMain;
    ctx.fillText("HEAD:" + gPlayer.inventory.getSlotAsString("HEAD"), locW, ++i * locH + offH);
    ctx.fillText("NECK:" + gPlayer.inventory.getSlotAsString("NECK"), locW, ++i * locH + offH);
    ctx.fillText("BODY:" + gPlayer.inventory.getSlotAsString("BODY"), locW, ++i * locH + offH);
    ctx.fillText("HAND:" + gPlayer.inventory.getSlotAsString("HAND"), locW, ++i * locH + offH);
    ctx.fillText("LEGS:" + gPlayer.inventory.getSlotAsString("LEGS"), locW, ++i * locH + offH);

    ctx.fillText("WEPN:" + gPlayer.inventory.getSlotAsString("MAIN"), locW, ++i * locH + offH);
    ctx.fillText("DIST:" + gPlayer.inventory.getSlotAsString("DIST"), locW, ++i * locH + offH);
    ctx.fillText("AMMO:" + gPlayer.inventory.getSlotAsString("AMMO"), locW, ++i * locH + offH);

    ctx.fillText("=================", locW, ++i * locH + offH);

    ctx.fillStyle = colorMain;
    ctx.fillText("WEPNATK   WEPNDMG", locW, ++i * locH + offH);
    ctx.fillText(setPadding(gPlayer.inventory.getStat("PATK", "MAIN") + "+" + gPlayer.inventory.getStat("MATK", "MAIN"), 3, 3, "+"), locW, ++i * locH + offH);
    ctx.fillText("          " + setPadding(gPlayer.inventory.getStat("PDMG", "MAIN") + "+" + gPlayer.inventory.getStat("MDMG", "MAIN"), 3, 3, "+"), locW, i * locH + offH);

    ctx.fillText("DISTATK   DISTDMG", locW, ++i * locH + offH);
    ctx.fillText(setPadding(gPlayer.inventory.getStat("PATK", "DIST") + "+" + gPlayer.inventory.getStat("MATK", "DIST"), 3, 3, "+"), locW, ++i * locH + offH);
    ctx.fillText("          " + setPadding(gPlayer.inventory.getStat("PDMG", "DIST") + "+" + gPlayer.inventory.getStat("MDMG", "DIST"), 3, 3, "+"), locW, i * locH + offH);
    ctx.fillText("ARMR", locW, ++i * locH + offH);
    ctx.fillText(setPadding(gPlayer.inventory.getArmor(), 3, 3, "+"), locW, ++i * locH + offH);

    ctx.fillText("=================", locW, ++i * locH + offH);

    ctx.fillText("  WEIGHT     FOOD" + gPlayer.inventory.getWeight(), locW, ++i * locH + offH);
    ctx.fillText(gPlayer.inventory.getWeight() + gPlayer.inventory.getFood(), locW, ++i * locH + offH);
}