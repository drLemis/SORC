function inputProcessing(e) {
    // DEBUG 
    if (e.altKey && e.code == 'KeyG') { // left
        gWorld = generateWorld(prompt("Your seed is " + gWorld.seed + ", input new one!", gWorld.seed));
    }

    if (e.code == 'Slash') {
        drawInterfaceLogs("I TO OPEN INVENTORY, G TO PICKUP, U TO USE/WEAR, D TO DROP/TAKE OFF");
        drawInterfaceLogs("O TO ENTER/LEAVE DUNGEONS AND TOWNS");
        drawInterfaceLogs("ARROWS TO WALK");
    }

    if (gGameState == eGameStates.PLAYING) {
        // INVENTORY
        if (e.code == 'KeyI') {
            gGameState = eGameStates.INVENTORY;
            draw();
            return;
        }

        if (gGamePosition == eGamePositions.SUBMAP) {
            // ENTER GET MODE
            if (e.code == 'KeyG' && gWorld.mapLocal.grid[gPlayer.localX][gPlayer.localY].items.length > 0) {
                gGameStateLast = gGameState;
                gGameState = eGameStates.INVENTORY_GET;
                drawInterfaceLogs("WHICH ITEM TO PICK UP? SPACE TO STOP");
                draw();
                return;
            }

            //movement
            var oldTile = gWorld.mapLocal.grid[gPlayer.localX][gPlayer.localY];
            var newTile = null;

            switch (e.code) {
                case "ArrowLeft":
                    newTile = gWorld.mapLocal.getTileAdjacent(oldTile, [-1, 0]);
                    break;
                case "ArrowUp":
                    newTile = gWorld.mapLocal.getTileAdjacent(oldTile, [0, -1]);
                    break;
                case "ArrowRight":
                    newTile = gWorld.mapLocal.getTileAdjacent(oldTile, [1, 0]);
                    break;
                case "ArrowDown":
                    newTile = gWorld.mapLocal.getTileAdjacent(oldTile, [0, 1]);
                    break;
                default:
                    break;
            }

            if (newTile != null && newTile != undefined)
                gWorld.mapLocal.moveCreature(oldTile, newTile);

            if (e.code == 'KeyO') {
                gGamePosition = eGamePositions.GLOBALMAP;
                gWorld.mapLocal = null;
            }
        } else if (gGamePosition == eGamePositions.GLOBALMAP) {
            switch (e.code) {
                case "ArrowLeft":
                    gWorld.mapGlobal.movePlayer(gWorld.mapGlobal.getTileAdjacent(gWorld.mapGlobal.getTile(gPlayer.globalX, gPlayer.globalY), [-1, 0]));
                    break;
                case "ArrowUp":
                    gWorld.mapGlobal.movePlayer(gWorld.mapGlobal.getTileAdjacent(gWorld.mapGlobal.getTile(gPlayer.globalX, gPlayer.globalY), [0, -1]));
                    break;
                case "ArrowRight":
                    gWorld.mapGlobal.movePlayer(gWorld.mapGlobal.getTileAdjacent(gWorld.mapGlobal.getTile(gPlayer.globalX, gPlayer.globalY), [1, 0]));
                    break;
                case "ArrowDown":
                    gWorld.mapGlobal.movePlayer(gWorld.mapGlobal.getTileAdjacent(gWorld.mapGlobal.getTile(gPlayer.globalX, gPlayer.globalY), [0, 1]));
                    break;
                default:
                    break;
            }

            if (e.code == 'KeyO') {
                if (gWorld.mapGlobal.getTile(gPlayer.globalX, gPlayer.globalY).submapSeed != null) {
                    gGamePosition = eGamePositions.SUBMAP;
                    gWorld.mapLocal = seedToMapLocal(gWorld.mapGlobal.getTile(gPlayer.globalX, gPlayer.globalY).submapSeed);
                } else if (gWorld.mapGlobal.getTile(gPlayer.globalX, gPlayer.globalY).town != null) {
                    gGameState = eGameStates.TOWN;
                }
            }
        }

    } else if (gGameState == eGameStates.INVENTORY) {
        // CLOSE INVENTORY
        if (e.code == 'KeyI' || e.code == 'Space') {
            gGameState = eGameStates.PLAYING;
            draw();
            return;
        }

        // ENTER DROP MODE
        if (e.code == 'KeyD') {
            gGameState = eGameStates.INVENTORY_DROP;
            drawInterfaceLogs("WHICH ITEM TO TOSS AWAY? SPACE TO STOP");
        }


        if (gGamePosition == eGamePositions.SUBMAP) {
            // ENTER GET MODE
            if (e.code == 'KeyG' && gWorld.mapLocal.grid[gPlayer.localX][gPlayer.localY].items.length > 0) {
                gGameStateLast = gGameState;
                drawMenuInventoryPage = 0;
                gGameState = eGameStates.INVENTORY_GET;
                drawInterfaceLogs("WHICH ITEM TO PICK UP? SPACE TO STOP");
            }
        }

        // ENTER USE MODE
        if (e.code == 'KeyU') {
            gGameState = eGameStates.INVENTORY_USE;
            drawInterfaceLogs("WHICH ITEM TO USE? SPACE TO STOP");
        }

        // PREV PAGE PGUP
        if (drawMenuInventoryPage > 0 && e.code == 'PageUp') {
            drawMenuInventoryPage--;
        }
        // NEXT PAGE PGDN
        if (drawMenuInventoryRows >= 30 && e.code == 'PageDown') {
            drawMenuInventoryPage++;
        }
    } else if (gGameState == eGameStates.INVENTORY_DROP) {
        // INVENTORY
        if (e.code == 'Space') {
            gGameState = eGameStates.INVENTORY;
            drawInterfaceLogs("NO MORE ITEM TOSSING");
        }

        if (keyCodeToIndexFromA(e.which) >= 0) {
            if (gGamePosition == eGamePositions.SUBMAP) {
                gPlayer.inventory.itemDrop(gPlayer.inventory.bag[keyCodeToIndexFromA(e.which) + drawMenuInventoryPage * (30 - drawMenuPreRows - 1)]);
            } else {
                drawInterfaceLogs("YOU CAN'T DROP ITEMS ON GLOBAL MAP!");
            }
        }

        // 8 slots at all
        if (e.key >= '1' && e.key <= '8') {
            var keys = Object.keys(gPlayer.inventory.slots);
            for (let index = 0; index < keys.length; index++) {
                if (e.key - 49 == index) {
                    gPlayer.inventory.itemUnequipFromSlot(keys[index]);
                }
            }
        }

        // PREV PAGE PGUP
        if (drawMenuInventoryPage > 0 && e.code == 'PageUp') {
            drawMenuInventoryPage--;
        }
        // NEXT PAGE PGDN
        if (drawMenuInventoryRows >= 30 && e.code == 'PageDown') {
            drawMenuInventoryPage++;
        }
    } else if (gGameState == eGameStates.INVENTORY_USE) {
        // INVENTORY
        if (e.code == 'Space') {
            gGameState = eGameStates.INVENTORY;
            drawInterfaceLogs("NO MORE ITEM USING");
        }

        if (keyCodeToIndexFromA(e.which) >= 0) {
            gPlayer.inventory.itemEquip(gPlayer.inventory.bag[keyCodeToIndexFromA(e.which) + drawMenuInventoryPage * (30 - drawMenuPreRows - 1)]);
        }

        // PREV PAGE PGUP
        if (drawMenuInventoryPage > 0 && e.code == 'PageUp') {
            drawMenuInventoryPage--;
        }
        // NEXT PAGE PGDN
        if (drawMenuInventoryRows >= 30 && e.code == 'PageDown') {
            drawMenuInventoryPage++;
        }
    } else if (gGameState == eGameStates.INVENTORY_GET) {
        // INVENTORY
        if (e.code == 'Space') {
            gGameState = gGameStateLast;
            drawMenuInventoryPage = 0;
            gGameStateLast = 0;
            drawInterfaceLogs("NO MORE ITEM PICK UP");
        }

        if (keyCodeToIndexFromA(e.which) >= 0) {
            gPlayer.inventory.itemPickup(gWorld.mapLocal.grid[gPlayer.localX][gPlayer.localY].items[keyCodeToIndexFromA(e.which) + drawMenuInventoryPage * (30 - drawMenuPreRows - 1)]);
            if (gWorld.mapLocal.grid[gPlayer.localX][gPlayer.localY].items.length == 0) {
                gGameState = gGameStateLast;
                drawMenuInventoryPage = 0;
                gGameStateLast = 0;
                drawInterfaceLogs("NO MORE ITEMS TO PICK UP");
            }
        }

        // PREV PAGE PGUP
        if (drawMenuInventoryPage > 0 && e.code == 'PageUp') {
            drawMenuInventoryPage--;
        }
        // NEXT PAGE PGDN
        if (drawMenuInventoryRows >= 30 && e.code == 'PageDown') {
            drawMenuInventoryPage++;
        }
    } else if (gGameState == eGameStates.TOWN) {
        // GLOBAL MAP
        if (e.code == 'Space') {
            gGameState = eGameStates.PLAYING;
            drawInterfaceLogs("LEAVING TOWN...");
        }
    }

    draw();
}

document.onkeydown = function (e) {
    inputProcessing(e);
}