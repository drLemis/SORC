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
    ctx.fillText("1) VISIT AUTHORITIES", locW, ++i * locH + offH);
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

function drawMenuTownAuthorities() {
    ctx.textAlign = "left";
    ctx.font = "16px Consolas";

    var locW = 5;
    var locH = 16;
    var offH = -1;

    var i = 0;

    ctx.fillStyle = gColorsCGA.WHITE;

    ctx.fillText("TOWNSFOLK HEAD GREETING YOU! WHAT DOY YOU WANT TO ASK HIM?", locW, ++i * locH + offH);
    ctx.fillText("", locW, ++i * locH + offH);
    ctx.fillText("1) [CLOSED] LEND SOME HELPING HAND", locW, ++i * locH + offH);
    ctx.fillText("2) LEARN A LESSON OR TWO", locW, ++i * locH + offH);
    ctx.fillText("", locW, ++i * locH + offH);
    ctx.fillText("SPACE TO GET BACK TO TOWN...", locW, ++i * locH + offH);
}

function drawMenuTownAuthoritiesLearn() {
    ctx.textAlign = "left";
    ctx.font = "16px Consolas";

    var locW = 5;
    var locH = 16;
    var offH = -1;

    var i = 0;

    ctx.fillStyle = gColorsCGA.WHITE;

    ctx.fillText("WHAT STAT DO YOU WANT TO IMPROVE? IT WILL COST YOU " + gWorld.lessonXpCost + "XP!", locW, ++i * locH + offH);
    ctx.fillText("", locW, ++i * locH + offH);
    ctx.fillText("A) +10 MAX HP", locW, ++i * locH + offH);
    ctx.fillText("B) +10 MAX MP", locW, ++i * locH + offH);
    ctx.fillText("", locW, ++i * locH + offH);
    ctx.fillText("C) +1 STRENGTH", locW, ++i * locH + offH);
    ctx.fillText("D) +1 AGILITY", locW, ++i * locH + offH);
    ctx.fillText("E) +1 LUCK", locW, ++i * locH + offH);
    ctx.fillText("", locW, ++i * locH + offH);
    ctx.fillText("SPACE TO GET BACK TO OFFICE...", locW, ++i * locH + offH);
}
