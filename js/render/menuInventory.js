function drawMenuInventory() {
    ctx.textAlign = "left";
    ctx.font = "16px Consolas";


    var locW = 5;
    var maxW = width * 0.8
    var locH = 16;
    var offH = 0;

    var i = 0;

    var itemIndex = 0

    // screen width is 75 symbols + 8px

    if (gGameState == eGameStates.INVENTORY_DROP) {
        ctx.strokeStyle = colorWarn;
        ctx.strokeRect(1, 1, width * 0.8 - 2, height * 0.75 - 3);
    } else if (gGameState == eGameStates.INVENTORY_USE) {
        ctx.strokeStyle = colorGood;
        ctx.strokeRect(1, 1, width * 0.8 - 2, height * 0.75 - 3);
    }

    ctx.fillStyle = colorMain;

    Object.keys(gPlayer.inventory.slots).forEach(slot => {
        ++itemIndex;
        if (gPlayer.inventory.slots[slot]) {
            ctx.fillText(itemIndex + ") [" + slot.toString() + "] " + gPlayer.inventory.getItemInfoShort(gPlayer.inventory.slots[slot])[0], locW, ++i * locH + offH);
            ctx.textAlign = "right";
            ctx.fillText(gPlayer.inventory.getItemInfoShort(gPlayer.inventory.slots[slot])[1], maxW - locW, i * locH + offH);
            ctx.textAlign = "left";
        }
    });

    ctx.fillText("=================", locW, ++i * locH + offH);

    itemIndex = 64; // pre-A letter

    gPlayer.inventory.bag.forEach(item => {
        var slot = item.slot ? "[" + item.slot + "] " : "";
        ctx.fillText(String.fromCharCode(++itemIndex) + ") " + slot + gPlayer.inventory.getItemInfoShort(item)[0], locW, ++i * locH + offH);
        ctx.textAlign = "right";
        ctx.fillText(gPlayer.inventory.getItemInfoShort(item)[1], maxW - locW, i * locH + offH);
        ctx.textAlign = "left";

    });
}