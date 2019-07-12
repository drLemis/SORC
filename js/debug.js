var debugSubmap2D = false;

// ALT+V
document.onkeydown = function (e) {
    if ((e.altKey && e.keyCode == 'V'.charCodeAt(0))) {
        debugSubmap2D = !debugSubmap2D;
    }

    if (debugSubmap2D == true) {
        var oldTile = gSubmap.grid[gPlayer.subX][gPlayer.subY];
        var newTile = null;

        if (e.keyCode == 37) { // left
            newTile = gSubmap.getTileAdjacent(oldTile, [-1, 0]);
            drawInterfaceLogs("YOU MOVE WEST");
        } else if (e.keyCode == 38) { // up
            newTile = gSubmap.getTileAdjacent(oldTile, [0, -1]);
            drawInterfaceLogs("YOU MOVE NORTH");
        } else if (e.keyCode == 39) { // right
            newTile = gSubmap.getTileAdjacent(oldTile, [1, 0]);
            drawInterfaceLogs("YOU MOVE EAST");
        } else if (e.keyCode == 40) { // down
            newTile = gSubmap.getTileAdjacent(oldTile, [0, 1]);
            drawInterfaceLogs("YOU MOVE SOUTH");
        }

        if (newTile != null)
            gSubmap.moveCreature(oldTile, newTile);
    }

    draw();
}