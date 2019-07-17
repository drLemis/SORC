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
    ctx.fillText("3) [CLOSED] VISIT TAVERN", locW, ++i * locH + offH);
    ctx.fillText("", locW, ++i * locH + offH);
    ctx.fillText("SPACE TO LEAVE...", locW, ++i * locH + offH);
}