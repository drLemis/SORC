var gInterfaceLogs = [];

function drawInterfaceFrame() {
    ctx.strokeStyle = getCurrentPalette().WHITE;
    ctx.lineWidth = 3;

    ctx.fillStyle = getCurrentPalette().BLACK;
    ctx.fillRect(0, height * 0.80, width, height * 0.25);
    ctx.fillRect(width * 0.8, 0, width * 0.2, height * 0.80);

    //bottom
    ctx.strokeRect(1, height * 0.80 + 1, width - 2, height * 0.25 - 2);
    //right
    ctx.strokeRect(width * 0.8 + 1, 1, width * 0.2 - 2, height - 1);

    ctx.strokeRect(1, 1, width - 2, height - 2);
}

function drawInterfaceStatus() {
    if (gGamePosition == eGamePositions.SUBMAP && gWorld.mapLocal) {
        var locW = width * 0.80;
        var offH = height * 0.80;

        var cellSize = width * 0.005; // px

        // не пытайтесь что-то изменить
        // людей переписавшим сойдут с ума
        if (gPlayer.localY < 10)
            offH += cellSize * (10 - gPlayer.localY);
        if (gPlayer.localX < 10)
            locW += cellSize * (10 - gPlayer.localX);


        var fromCoord = [locW, offH]; // left-top offset

        ctx.lineWidth = 1;

        var cX = 0;
        var cY = 0;

        for (let iX = Math.max(0, gPlayer.localY - 10); iX < Math.min(gWorld.mapLocal.grid.length, gPlayer.localY + 10); iX++) {
            cX++;
            cY = 0;
            for (let iY = Math.max(0, gPlayer.localX - 10); iY < Math.min(gWorld.mapLocal.grid[0].length, gPlayer.localX + 10); iY++) {
                cY++;
                ctx.strokeStyle = getCurrentPalette().WHITE;
                var cellCoord = [fromCoord[0] + (cY * cellSize), fromCoord[1] + (cX * cellSize)];

                ctx.fillStyle = getCurrentPalette().BLACK;

                var tile = gWorld.mapLocal.grid[iY][iX];

                if (tile.getPass() != true)
                    ctx.fillStyle = getCurrentPalette().DARKGRAY;

                if (tile.items.length > 0) {
                    ctx.fillStyle = getCurrentPalette().YELLOW;
                }

                if (tile.getCreature() != null) {
                    if (tile.getCreature() == gPlayer) {
                        ctx.fillStyle = getCurrentPalette().WHITE;
                    } else {
                        ctx.fillStyle = getCurrentPalette().RED;
                    }
                }

                if (ctx.fillStyle != getCurrentPalette().BLACK) {
                    ctx.fillRect(cellCoord[0], cellCoord[1], cellSize, cellSize);
                }
            }
        }

        var locW = width * 0.80 + 5;
        var locH = 16;
        var offH = height * 0.80;
        var i = 0;

        ctx.textAlign = "left";

        ctx.fillStyle = getCurrentPalette().WHITE;
        ctx.lineWidth = 3;
        ctx.font = locH + "px Consolas";

        var n = e = w = s = " ";

        switch (gPlayer.heading) {
            case 3:
                e = ">";
                break;
            case 2:
                s = "v";
                break;
            case 1:
                w = "<";
                break;
            default:
                n = "^";
                break;
        }

        ctx.fillText("          ||     ", locW, ++i * locH + offH);
        ctx.fillText("          ||  " + n + "   ", locW, ++i * locH + offH);
        ctx.fillText("          || " + w + "N" + e + " ", locW, ++i * locH + offH);
        ctx.fillText("          ||  " + s + "  ", locW, ++i * locH + offH);
        ctx.fillText("          ||     ", locW, ++i * locH + offH);
        ctx.fillText("=================", locW, ++i * locH + offH);
        ctx.fillText(setPadding(dateToYMD(gWorld.date), 14), locW, ++i * locH + offH);
    } else {
        var locW = width * 0.80 + 5;
        var locH = 16;
        var offH = height * 0.80;
        var i = 0;

        ctx.fillStyle = getCurrentPalette().WHITE;
        ctx.lineWidth = 3;
        ctx.font = locH + "px Consolas";

        ctx.fillText("      =====      ", locW, ++i * locH + offH);
        ctx.fillText("  ====     ====  ", locW, ++i * locH + offH);
        ctx.fillText(" ===         === ", locW, ++i * locH + offH);
        ctx.fillText("=================", locW, ++i * locH + offH);
        ctx.fillText("      SUNNY      ", locW, ++i * locH + offH);
        ctx.fillText("=================", locW, ++i * locH + offH);
        ctx.fillText(setPadding(dateToYMD(gWorld.date), 14), locW, ++i * locH + offH);
    }
}


function drawInterfaceStats() {
    ctx.textAlign = "left";
    ctx.font = "16px Consolas";

    var locW = width * 0.80 + 5;
    var locH = 16;
    var offH = -2;

    var i = 0;

    ctx.fillStyle = getCurrentPalette().WHITE;
    ctx.fillText(gPlayer.name, locW, ++i * locH + offH);
    ctx.fillText("=================", locW, ++i * locH + offH);
    ctx.fillText(gPlayer.race, locW, ++i * locH + offH);
    ctx.textAlign = "right"
    ctx.fillText(gPlayer.class, width - 3, i * locH + offH);
    ctx.textAlign = "left"

    ctx.fillText("=================", locW, ++i * locH + offH);

    ctx.fillStyle = getStatusColor(gPlayer.stats.health, [getCurrentPalette().RED, getCurrentPalette().YELLOW, getCurrentPalette().WHITE, getCurrentPalette().WHITE]);
    ctx.fillText("HEALTH", locW, ++i * locH + offH);
    ctx.fillStyle = getStatusColor(gPlayer.stats.mana, [getCurrentPalette().RED, getCurrentPalette().YELLOW, getCurrentPalette().WHITE, getCurrentPalette().WHITE]);
    ctx.fillText("            POWER", locW, i * locH + offH);

    ctx.fillStyle = getStatusColor(gPlayer.stats.health, [getCurrentPalette().RED, getCurrentPalette().YELLOW, getCurrentPalette().WHITE, getCurrentPalette().WHITE]);
    ctx.fillText(gPlayer.stats.getHealthAsString(), locW, ++i * locH + offH);
    ctx.fillStyle = getStatusColor(gPlayer.stats.mana, [getCurrentPalette().RED, getCurrentPalette().YELLOW, getCurrentPalette().WHITE, getCurrentPalette().WHITE]);
    ctx.fillText("          " + gPlayer.stats.getManaAsString(), locW, i * locH + offH);


    ctx.fillStyle = getCurrentPalette().WHITE;
    ctx.fillText("EXPERIENCE   GOLD", locW, ++i * locH + offH);
    ctx.fillText(gPlayer.stats.getXP(), locW, ++i * locH + offH);
    ctx.fillText(gPlayer.inventory.getGold(), locW, i * locH + offH);

    ctx.fillText("=================", locW, ++i * locH + offH);

    ctx.fillStyle = getCurrentPalette().WHITE;
    ctx.fillText("STNG  AGIL  LUCK", locW, ++i * locH + offH);
    ctx.fillText(gPlayer.stats.getStat("STNG") + " " + gPlayer.stats.getStat("AGIL") + " " + gPlayer.stats.getStat("LUCK"), locW, ++i * locH + offH);

    ctx.fillText("=================", locW, ++i * locH + offH);

    ctx.fillStyle = getCurrentPalette().WHITE;
    ctx.fillText("HEAD:" + gPlayer.inventory.getSlotAsString("HEAD"), locW, ++i * locH + offH);
    ctx.fillText("NECK:" + gPlayer.inventory.getSlotAsString("NECK"), locW, ++i * locH + offH);
    ctx.fillText("BODY:" + gPlayer.inventory.getSlotAsString("BODY"), locW, ++i * locH + offH);
    ctx.fillText("HAND:" + gPlayer.inventory.getSlotAsString("HAND"), locW, ++i * locH + offH);
    ctx.fillText("LEGS:" + gPlayer.inventory.getSlotAsString("LEGS"), locW, ++i * locH + offH);

    ctx.fillText("WEPN:" + gPlayer.inventory.getSlotAsString("MAIN"), locW, ++i * locH + offH);
    ctx.fillText("DIST:" + gPlayer.inventory.getSlotAsString("DIST"), locW, ++i * locH + offH);
    ctx.fillText("AMMO:" + gPlayer.inventory.getSlotAsString("AMMO"), locW, ++i * locH + offH);

    ctx.fillText("=================", locW, ++i * locH + offH);

    ctx.fillStyle = getCurrentPalette().WHITE;
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

function drawInterfaceLogs(newLog = "") {
    if (newLog != "")
        gInterfaceLogs.push(newLog);

    ctx.strokeStyle = getCurrentPalette().WHITE;

    var locH = height * 0.85 + 3;
    var stepH = 16;

    var i = 0;

    for (let index = gInterfaceLogs.length - 1; index >= 0; index--) {
        var text = gInterfaceLogs[index];
        var color = getCurrentPalette().WHITE;

        if (Array.isArray(gInterfaceLogs[index])) {
            text = gInterfaceLogs[index][0];
            color = gInterfaceLogs[index][1];
        }

        ctx.fillStyle = color;
        ctx.fillText(text.toUpperCase().trim(), 5, (i++ - 1) * stepH + locH);
    }
}