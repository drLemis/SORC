var drawMenuInventoryPage = 0;
var drawMenuInventoryRows = 0;
var drawMenuPreRows = 0;

function drawMenuInventory() {
    ctx.textAlign = "left";
    ctx.font = "16px Consolas";

    var locW = 5;
    var maxW = width * 0.8
    var locH = 16;
    var offH = -3;

    var i = 0;

    var itemIndex = 0
    drawMenuInventoryRows = 1;

    // screen width is 75 symbols + 8px

    if (gGameState == eGameStates.INVENTORY_DROP) {
        ctx.strokeStyle = colorWarn;
        ctx.strokeRect(1, 1, width * 0.8 - 2, height * 0.80 - 3);
    } else if (gGameState == eGameStates.INVENTORY_USE) {
        ctx.strokeStyle = colorGood;
        ctx.strokeRect(1, 1, width * 0.8 - 2, height * 0.80 - 3);
    }

    ctx.fillStyle = colorMain;

    Object.keys(gPlayer.inventory.slots).forEach(slot => {
        ++itemIndex;
        if (gPlayer.inventory.slots[slot]) {
            drawMenuInventoryRows++;
            ctx.fillText(itemIndex + ") [" + slot.toString() + "] " + gPlayer.inventory.getItemInfoShort(gPlayer.inventory.slots[slot])[0], locW, ++i * locH + offH);
            ctx.textAlign = "right";
            ctx.fillText(gPlayer.inventory.getItemInfoShort(gPlayer.inventory.slots[slot])[1], maxW - locW, i * locH + offH);
            ctx.textAlign = "left";
        }
    });

    ctx.fillText("=================", locW, ++i * locH + offH);

    itemIndex = 64; // pre-A letter

    drawMenuPreRows = drawMenuInventoryRows;
    var bDrawnLastLine = false;
    var bDrawnAtLeastOneBagItem = false;

    if (drawMenuInventoryPage > 0) {
        ctx.fillText("============== PGUP TO PREVOUS PAGE    PGDWN TO NEXT PAGE ==============", locW, 30 * locH + offH);
        bDrawnLastLine = true;
    }

    gPlayer.inventory.bag.every(function (item, index) {
        if (index >= drawMenuInventoryPage * (30 - drawMenuPreRows - 1)) {
            bDrawnAtLeastOneBagItem = true;
            if (++drawMenuInventoryRows >= 30) {
                if (drawMenuInventoryPage == 0) {
                    ctx.fillText("============== PGUP TO PREVOUS PAGE    PGDWN TO NEXT PAGE ==============", locW, 30 * locH + offH);
                }
                return false;
            }
            // Do your thing, then:
            var slot = item.slot ? "[" + item.slot + "] " : "";
            ctx.fillText(String.fromCharCode(++itemIndex) + ") " + slot + gPlayer.inventory.getItemInfoShort(item)[0], locW, ++i * locH + offH);
            ctx.textAlign = "right";
            ctx.fillText(gPlayer.inventory.getItemInfoShort(item)[1], maxW - locW, i * locH + offH);
            ctx.textAlign = "left";
            return true;
        } else
            return true;
    })

    console.log(bDrawnAtLeastOneBagItem + ":" + gPlayer.inventory.bag.length + ":" + drawMenuInventoryPage)

    if (!bDrawnAtLeastOneBagItem && gPlayer.inventory.bag.length > 0 && drawMenuInventoryPage > 0) {
        drawMenuInventoryPage--;
        draw();
    }
}