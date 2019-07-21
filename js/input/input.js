function inputProcessing(e) {
    if (gDrawingRightNow || e.repeat) {
        return;
    }
    // DEBUG 
    if (e.altKey && e.code == 'KeyG') { // left
        gWorld = generateWorld(prompt("Your seed is " + gWorld.seed + ", input new one!", gWorld.seed));
    }

    if (e.code == 'Slash') {
        drawInterfaceLogs("I TO OPEN INVENTORY, G TO PICKUP, U TO USE/WEAR, D TO DROP/TAKE OFF");
        drawInterfaceLogs("O TO ENTER/LEAVE DUNGEONS AND TOWNS");
        drawInterfaceLogs("ARROWS TO WALK");
        drawInterfaceLogs("? TO GET HELP");
    }

    if (gGameState == eGameStates.PLAYING) {
        // INVENTORY
        if (e.code == 'KeyI') {
            gGameStateLast = gGameState;
            gGameState = eGameStates.INVENTORY;
            draw();
            return;
        }

        if (gGamePosition == eGamePositions.SUBMAP) {
            // ENTER GET MODE
            if (e.code == 'KeyG' && getCurrentLocalTile().items.length > 0) {
                gGameStateLast = gGameState;
                gGameState = eGameStates.INVENTORY_GET;
                drawInterfaceLogs("WHICH ITEM TO PICK UP? SPACE TO STOP");
                draw();
                return;
            }

            //movement
            var oldTile = getCurrentLocalTile();
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
                    gWorld.mapGlobal.movePlayer(gWorld.mapGlobal.getTileAdjacent(getCurrentGlobalTile(), [-1, 0]));
                    break;
                case "ArrowUp":
                    gWorld.mapGlobal.movePlayer(gWorld.mapGlobal.getTileAdjacent(getCurrentGlobalTile(), [0, -1]));
                    break;
                case "ArrowRight":
                    gWorld.mapGlobal.movePlayer(gWorld.mapGlobal.getTileAdjacent(getCurrentGlobalTile(), [1, 0]));
                    break;
                case "ArrowDown":
                    gWorld.mapGlobal.movePlayer(gWorld.mapGlobal.getTileAdjacent(getCurrentGlobalTile(), [0, 1]));
                    break;
                default:
                    break;
            }

            if (e.code == 'KeyO') {
                if (getCurrentGlobalTile().submapSeed != null) {
                    gGamePosition = eGamePositions.SUBMAP;
                    gWorld.mapLocal = seedToMapLocal(getCurrentGlobalTile().submapSeed);
                } else if (getCurrentGlobalTile().town != null) {
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
            if (e.code == 'KeyG' && getCurrentLocalTile().items.length > 0) {
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
            gGameState = gGameStateLast;
            drawMenuInventoryPage = 0;
            gGameStateLast = 0;
            drawInterfaceLogs("NO MORE ITEM TOSSING");
        }

        if (keyCodeToIndexFromA(e.which) >= 0) {
            if (gGamePosition == eGamePositions.SUBMAP || gGameStateLast == eGameStates.TOWN_TAVERN) {
                gPlayer.inventory.itemDrop(gPlayer.inventory.bag[keyCodeToIndexFromA(e.which) + drawMenuInventoryPage * (30 - drawMenuPreRows - 1)]);
            } else {
                drawInterfaceLogs("YOU CAN'T DROP ITEMS ON GLOBAL MAP!");
            }
        }
        // 8 slots at all
        if (e.which >= 49 && e.which <= 56) {
            var keys = Object.keys(gPlayer.inventory.slots);
            for (let index = 0; index < keys.length; index++) {
                if (e.which - 49 == index) {
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
            var items;
            if (gGameStateLast == eGameStates.TOWN_TAVERN)
                items = getCurrentGlobalTile().town.items;
            else
                items = getCurrentLocalTile().items;

            gPlayer.inventory.itemPickup(items[keyCodeToIndexFromA(e.which) + drawMenuInventoryPage * (30 - drawMenuPreRows - 1)]);


            if (items.length == 0) {
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
        switch (e.code) {
            case 'Space':
                gGameState = eGameStates.PLAYING;
                drawInterfaceLogs("LEAVING TOWN...");
                break;
            case 'Digit1':
                gGameState = eGameStates.TOWN_AUTHORITIES;
                break;
            case 'Digit2':
                break;
            case 'Digit3':
                gGameState = eGameStates.TOWN_TAVERN;
                break;
            default:
                break;
        }
    } else if (gGameState == eGameStates.TOWN_TAVERN) {
        switch (e.code) {
            case 'Space':
                gGameState = eGameStates.TOWN;
                break;
            case 'Digit1':
                gGameState = eGameStates.TOWN_TAVERN_REST;
                break;
            case 'Digit2':
                gGameStateLast = gGameState;
                gGameState = eGameStates.INVENTORY_DROP;
                break;
            case 'Digit3':
                if (getCurrentGlobalTile().town.items.length > 0) {
                    gGameStateLast = gGameState;
                    gGameState = eGameStates.INVENTORY_GET;
                } else
                    drawInterfaceLogs("YOU HAVE NOT DROPPED ANYTHING AT THIS TAVERN!");
                break;
            default:
                break;
        }
    } else if (gGameState == eGameStates.TOWN_TAVERN_REST) {
        switch (e.code) {
            case 'KeyN':
            case 'Space':
                gGameState = eGameStates.TOWN_TAVERN;
                break;
            case 'KeyY':
                if (gPlayer.inventory.gold >= 10) {
                    gPlayer.inventory.gold -= 10;
                    gPlayer.stats.health.CURRENT = gPlayer.stats.health.MAX
                    gPlayer.stats.mana.CURRENT = gPlayer.stats.mana.MAX
                    gGameState = eGameStates.TOWN_TAVERN;
                    drawInterfaceLogs("YOU RESTED WELL, RESTORING YOUR HEALTH AND POWER!");
                } else {
                    drawInterfaceLogs("YOU HAVE NO SUCH FUNDS FOR NOW!");
                    gGameState = eGameStates.TOWN_TAVERN;
                }
                break;
            default:
                break;
        }
    } else if (gGameState == eGameStates.TOWN_AUTHORITIES) {
        switch (e.code) {
            case 'Space':
                gGameState = eGameStates.TOWN;
                break;
            case 'Digit1':
                break;
            case 'Digit2':
                gGameState = eGameStates.TOWN_AUTHORITIES_LEARN;
                break;
            default:
                break;
        }
    } else if (gGameState == eGameStates.TOWN_AUTHORITIES_LEARN) {
        if (e.code == 'Space') {
            gGameState = eGameStates.TOWN_AUTHORITIES;
        } else if (keyCodeToIndexFromA(e.which) >= 0 && keyCodeToIndexFromA(e.which) < 7) {
            if (gPlayer.stats.xp.CURRENT < gWorld.lessonXpCost) {
                drawInterfaceLogs("YOU HAVE NO XP FOR THIS LESSON!");
            } else {
                gPlayer.stats.addXP(-gWorld.lessonXpCost);
                gWorld.lessonXpCost = Math.round(gWorld.lessonXpCost * gWorld.lessonXpCostModifier / 10) * 10;
                switch (e.code) {
                    case 'KeyA':
                        gPlayer.stats.health.MAX += 10;
                        drawInterfaceLogs("YOU IMPROVED YOUR HP!");
                        break;
                    case 'KeyB':
                        gPlayer.stats.mana.MAX += 10;
                        drawInterfaceLogs("YOU IMPROVED YOUR MP!");
                        break;
                    case 'KeyC':
                        gPlayer.stats.attributes.STNG += 1;
                        drawInterfaceLogs("YOU IMPROVED YOUR STRENGTH!");
                        break;
                    case 'KeyD':
                        gPlayer.stats.attributes.AGIL += 1;
                        drawInterfaceLogs("YOU IMPROVED YOUR AGILITY!");
                        break;
                    case 'KeyE':
                        gPlayer.stats.attributes.LUCK += 1;
                        drawInterfaceLogs("YOU IMPROVED YOUR LUCK!");
                        break;
                    default:
                        break;
                }
            }
        }
    }

    draw();
}

document.onkeydown = function (e) {
    inputProcessing(e);
}