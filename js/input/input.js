function inputProcessing(e) {
    // DEBUG 
    if (e.altKey && e.keyCode == "G".charCodeAt(0)) { // left
        gWorld = generateWorld(prompt("Your seed is " + gWorld.seed + ", input new one!", gWorld.seed));
    }


    if (gGameState == eGameStates.PLAYING) {
        // GAME
        if ((e.keyCode == 'I'.charCodeAt(0))) {
            gGameState = eGameStates.INVENTORY;
            draw();
            return;
        }

        if (gGamePosition == eGamePositions.SUBMAP) {
            //movement
            var oldTile = gWorld.mapLocal.grid[gPlayer.localX][gPlayer.localY];
            var newTile = null;

            switch (e.keyCode) {
                case 37:
                    newTile = gWorld.mapLocal.getTileAdjacent(oldTile, [-1, 0]);
                    break;
                case 38:
                    newTile = gWorld.mapLocal.getTileAdjacent(oldTile, [0, -1]);
                    break;
                case 39:
                    newTile = gWorld.mapLocal.getTileAdjacent(oldTile, [1, 0]);
                    break;
                case 40:
                    newTile = gWorld.mapLocal.getTileAdjacent(oldTile, [0, 1]);
                    break;
                default:
                    break;
            }

            if (newTile != null && newTile != undefined)
                gWorld.mapLocal.moveCreature(oldTile, newTile);

            if ((e.keyCode == 'O'.charCodeAt(0))) {
                gGamePosition = eGamePositions.GLOBALMAP;
                gWorld.mapLocal = null;
            }

            if ((e.keyCode == 'G'.charCodeAt(0))) {
                gPlayer.inventory.itemPickup(gWorld.mapLocal.grid[gPlayer.localX][gPlayer.localY].items[0]);
            }
        } else if (gGamePosition == eGamePositions.GLOBALMAP) {
            switch (e.keyCode) {
                case 37: // left
                    gWorld.mapGlobal.movePlayer(gWorld.mapGlobal.getTileAdjacent(gWorld.mapGlobal.getTile(gPlayer.globalX, gPlayer.globalY), [-1, 0]));
                    break;
                case 38: // up
                    gWorld.mapGlobal.movePlayer(gWorld.mapGlobal.getTileAdjacent(gWorld.mapGlobal.getTile(gPlayer.globalX, gPlayer.globalY), [0, -1]));
                    break;
                case 39: // right
                    gWorld.mapGlobal.movePlayer(gWorld.mapGlobal.getTileAdjacent(gWorld.mapGlobal.getTile(gPlayer.globalX, gPlayer.globalY), [1, 0]));
                    break;
                case 40: // down
                    gWorld.mapGlobal.movePlayer(gWorld.mapGlobal.getTileAdjacent(gWorld.mapGlobal.getTile(gPlayer.globalX, gPlayer.globalY), [0, 1]));
                    break;
                default:
                    break;
            }

            if ((e.keyCode == 'O'.charCodeAt(0))) {
                if (gWorld.mapGlobal.getTile(gPlayer.globalX, gPlayer.globalY).submapSeed != null) {
                    gGamePosition = eGamePositions.SUBMAP;
                    gWorld.mapLocal = seedToMapLocal(gWorld.mapGlobal.getTile(gPlayer.globalX, gPlayer.globalY).submapSeed);
                }
            }
        }
    } else if (gGameState == eGameStates.INVENTORY) {
        // CLOSE INVENTORY
        if ((e.keyCode == 'I'.charCodeAt(0))) {
            gGameState = eGameStates.PLAYING;
            draw();
            return;
        }

        // ENTER DROP MODE
        if (e.keyCode == 'D'.charCodeAt(0)) {
            gGameState = eGameStates.INVENTORY_DROP;
            drawInterfaceLogs("WHICH ITEM TO TOSS AWAY? SPACE TO STOP");
        }

        // ENTER USE MODE
        if (e.keyCode == 'U'.charCodeAt(0)) {
            gGameState = eGameStates.INVENTORY_USE;
            drawInterfaceLogs("WHICH ITEM TO USE? SPACE TO STOP");
        }
    } else if (gGameState == eGameStates.INVENTORY_DROP) {
        // INVENTORY
        if ((e.keyCode == 32)) {
            gGameState = eGameStates.INVENTORY;
            drawInterfaceLogs("NO MORE ITEM TOSSING");
        }

        if (e.keyCode >= 'A'.charCodeAt(0)) {
            if (gGamePosition == eGamePositions.SUBMAP) {
                gPlayer.inventory.itemDrop(gPlayer.inventory.bag[e.keyCode - 65]);
            } else {
                drawInterfaceLogs("YOU CAN'T DROP ITEMS ON GLOBAL MAP!");
            }
        }

        // 8 slots at all
        if (e.keyCode >= '1'.charCodeAt(0) && e.keyCode <= '8'.charCodeAt(0)) {
            var keys = Object.keys(gPlayer.inventory.slots);
            for (let index = 0; index < keys.length; index++) {
                if (e.keyCode - 49 == index) {
                    console.log(e.keyCode - 49 + ":" + index + ":" + keys[index])
                    gPlayer.inventory.itemUnequipFromSlot(keys[index]);
                }
            }
        }
    } else if (gGameState == eGameStates.INVENTORY_USE) {
        // INVENTORY
        if (e.keyCode == 32) {
            gGameState = eGameStates.INVENTORY;
            drawInterfaceLogs("NO MORE ITEM USING");
        }

        if (e.keyCode >= 'A'.charCodeAt(0)) {
            gPlayer.inventory.itemEquip(gPlayer.inventory.bag[e.keyCode - 65]);
        }
    }

    draw();
}

document.onkeydown = function (e) {
    inputProcessing(e);
}