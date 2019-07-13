document.onkeydown = function (e) {
    // DEBUG 

    if (e.altKey && e.keyCode == "G".charCodeAt(0)) { // left
        gWorld = generateWorld(prompt("Your seed is " + gWorld.seed + ", input new one!", gWorld.seed));
    }

    // GAME
    if (gGamePosition == eGamePositions.SUBMAP) {
        if ((e.keyCode == 'D'.charCodeAt(0))) {
            gPlayer.inventory.itemDrop(gPlayer.inventory.bag[0]);
        }
        if ((e.keyCode == 'G'.charCodeAt(0))) {
            gPlayer.inventory.itemPickup(gWorld.mapLocal.grid[gPlayer.localX][gPlayer.localY].items[0]);
        }

        var oldTile = gWorld.mapLocal.grid[gPlayer.localX][gPlayer.localY];
        var newTile = null;

        if (e.keyCode == 37) { // left
            newTile = gWorld.mapLocal.getTileAdjacent(oldTile, [-1, 0]);
        } else if (e.keyCode == 38) { // up
            newTile = gWorld.mapLocal.getTileAdjacent(oldTile, [0, -1]);
        } else if (e.keyCode == 39) { // right
            newTile = gWorld.mapLocal.getTileAdjacent(oldTile, [1, 0]);
        } else if (e.keyCode == 40) { // down
            newTile = gWorld.mapLocal.getTileAdjacent(oldTile, [0, 1]);
        }

        if (newTile != null && newTile != undefined)
            gWorld.mapLocal.moveCreature(oldTile, newTile);


        if ((e.keyCode == 'O'.charCodeAt(0))) {
            gGamePosition = eGamePositions.GLOBALMAP;
            gWorld.mapLocal = null;
        }
    } else if (gGamePosition == eGamePositions.GLOBALMAP) {
        if (e.keyCode == 37) { // left
            gWorld.mapGlobal.movePlayer(gWorld.mapGlobal.getTileAdjacent(gWorld.mapGlobal.getTile(gPlayer.globalX, gPlayer.globalY), [-1, 0]));
        } else if (e.keyCode == 38) { // up
            gWorld.mapGlobal.movePlayer(gWorld.mapGlobal.getTileAdjacent(gWorld.mapGlobal.getTile(gPlayer.globalX, gPlayer.globalY), [0, -1]));
        } else if (e.keyCode == 39) { // right
            gWorld.mapGlobal.movePlayer(gWorld.mapGlobal.getTileAdjacent(gWorld.mapGlobal.getTile(gPlayer.globalX, gPlayer.globalY), [1, 0]));
        } else if (e.keyCode == 40) { // down
            gWorld.mapGlobal.movePlayer(gWorld.mapGlobal.getTileAdjacent(gWorld.mapGlobal.getTile(gPlayer.globalX, gPlayer.globalY), [0, 1]));
        }

        if ((e.keyCode == 'O'.charCodeAt(0))) {
            if (gWorld.mapGlobal.getTile(gPlayer.globalX, gPlayer.globalY).submapSeed != null) {
                gGamePosition = eGamePositions.SUBMAP;
                gWorld.mapLocal = seedToMapLocal(gWorld.mapGlobal.getTile(gPlayer.globalX, gPlayer.globalY).submapSeed);
            }
        }
    }

    draw();
}