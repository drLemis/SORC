document.onkeydown = function (e) {
    if (gGamePosition == eGamePositions.SUBMAP) {
        if ((e.keyCode == 'D'.charCodeAt(0))) {
            gPlayer.inventory.itemDrop(gPlayer.inventory.bag[0]);
        }
        if ((e.keyCode == 'G'.charCodeAt(0))) {
            gPlayer.inventory.itemPickup(gSubmap.grid[gPlayer.subX][gPlayer.subY].items[0]);
        }


        var oldTile = gSubmap.grid[gPlayer.subX][gPlayer.subY];
        var newTile = null;

        if (e.keyCode == 37) { // left
            newTile = gSubmap.getTileAdjacent(oldTile, [-1, 0]);
        } else if (e.keyCode == 38) { // up
            newTile = gSubmap.getTileAdjacent(oldTile, [0, -1]);
        } else if (e.keyCode == 39) { // right
            newTile = gSubmap.getTileAdjacent(oldTile, [1, 0]);
        } else if (e.keyCode == 40) { // down
            newTile = gSubmap.getTileAdjacent(oldTile, [0, 1]);
        }

        if (newTile != null && newTile != undefined)
            gSubmap.moveCreature(oldTile, newTile);


        if ((e.keyCode == 'O'.charCodeAt(0))) {
            gGamePosition = eGamePositions.GLOBALMAP;
            gSubmap = null;
        }
    } else if (gGamePosition == eGamePositions.GLOBALMAP) {
        var oldTile = gGlobalmap.grid[gPlayer.globalX][gPlayer.globalY];
        var newTile = null;

        if (e.keyCode == 37) { // left
            newTile = gGlobalmap.getTileAdjacent(oldTile, [-1, 0]);
        } else if (e.keyCode == 38) { // up
            newTile = gGlobalmap.getTileAdjacent(oldTile, [0, -1]);
        } else if (e.keyCode == 39) { // right
            newTile = gGlobalmap.getTileAdjacent(oldTile, [1, 0]);
        } else if (e.keyCode == 40) { // down
            newTile = gGlobalmap.getTileAdjacent(oldTile, [0, 1]);
        }

        if (newTile != null && newTile != undefined)
            gGlobalmap.movePlayer(oldTile, newTile);

        if ((e.keyCode == 'O'.charCodeAt(0))) {
            if (gGlobalmap.getTile(gPlayer.globalX, gPlayer.globalY).submap != null) {
                gGamePosition = eGamePositions.SUBMAP;
                gSubmap = gGlobalmap.getTile(gPlayer.globalX, gPlayer.globalY).submap;
            }
        }
    }

    draw();
}