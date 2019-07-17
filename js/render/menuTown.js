function drawMenuTown() {
    ctx.textAlign = "left";
    ctx.font = "16px Consolas";

    var locW = 5;
    var locH = 16;
    var offH = -1;

    var i = 0;

    ctx.fillStyle = gColorsCGA.WHITE;

    ctx.fillText("WELCOME TO " + gWorld.mapGlobal.getTile(gPlayer.globalX, gPlayer.globalY).town.name + "!", locW, ++i * locH + offH);
    ctx.fillText("", locW, ++i * locH + offH);
    ctx.fillText("1) [CLOSED] VISIT AUTHORITIES", locW, ++i * locH + offH);
    ctx.fillText("2) [CLOSED] VISIT STORE", locW, ++i * locH + offH);
    ctx.fillText("3) VISIT TAVERN", locW, ++i * locH + offH);
    ctx.fillText("", locW, ++i * locH + offH);
    ctx.fillText("SPACE TO LEAVE...", locW, ++i * locH + offH);
}

function drawMenuTownTavern() {
    ctx.textAlign = "left";
    ctx.font = "16px Consolas";

    var locW = 5;
    var locH = 16;
    var offH = -1;

    var i = 0;

    ctx.fillStyle = gColorsCGA.WHITE;

    ctx.fillText("TAVERN KEEPER GREETING YOU. WHAT WOULD YOU LIKE TO DO?", locW, ++i * locH + offH);
    ctx.fillText("", locW, ++i * locH + offH);
    ctx.fillText("1) RENT A ROOM OVERNIGHT", locW, ++i * locH + offH);
    ctx.fillText("2) DROP SOME ITEMS", locW, ++i * locH + offH);
    ctx.fillText("3) RETRIEVE SOME ITEMS", locW, ++i * locH + offH);
    ctx.fillText("", locW, ++i * locH + offH);
    ctx.fillText("SPACE TO GET BACK TO TOWN...", locW, ++i * locH + offH);
}

function drawMenuTownTavernRest() {
    ctx.textAlign = "left";
    ctx.font = "16px Consolas";

    var locW = 5;
    var locH = 16;
    var offH = -1;

    var i = 0;

    ctx.fillStyle = gColorsCGA.WHITE;

    ctx.fillText("ROOM RENT IS 10 GOLD PER NIGHT. WOULD YOU LIKE TO PURCHASE?", locW, ++i * locH + offH);
    ctx.fillText("", locW, ++i * locH + offH);
    ctx.fillText("Y) YES", locW, ++i * locH + offH);
    ctx.fillText("N) NO", locW, ++i * locH + offH);
    ctx.fillText("", locW, ++i * locH + offH);
    ctx.fillText("SPACE TO GET BACK TO TAVERN...", locW, ++i * locH + offH);
}