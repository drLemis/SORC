function drawScreenSubmap2D(submap) {
    var fromCoord = [0, 0]; // left-top offset
    var cellSize = Math.min(width * 0.80 / submap.width, height * 0.80 / submap.height); // px

    ctx.strokeStyle = colorMain;
    ctx.lineWidth = 1;

    for (let iX = 0; iX < submap.width; iX++) {
        for (let iY = 0; iY < submap.height; iY++) {
            var cellCoord = [fromCoord[0] + (iY * cellSize), fromCoord[1] + (iX * cellSize)];

            ctx.fillStyle = gColorsCGA.BLACK;

            var tile = submap.grid[iY][iX];

            if (tile.getPass() != true)
                ctx.fillStyle = gColorsCGA.DARKGRAY;

            if (tile.items.length > 0)
                ctx.fillStyle = gColorsCGA.YELLOW;

            if (tile.getCreature() != null) {
                if (tile.getCreature() == gPlayer) {
                    ctx.fillStyle = gColorsCGA.WHITE;
                } else
                    ctx.fillStyle = gColorsCGA.BROWN;
            }

            ctx.fillRect(cellCoord[0], cellCoord[1], cellSize, cellSize)
            ctx.strokeRect(cellCoord[0], cellCoord[1], cellSize, cellSize);
        }
    }
}

function drawScreenGlobalmap2D(globalmap) {
    var fromCoord = [0, 0]; // left-top offset
    var cellSize = Math.min(width * 0.80 / globalmap.width, height * 0.80 / globalmap.height); // px

    ctx.strokeStyle = colorMain;
    ctx.lineWidth = 1;

    for (let iX = 0; iX < globalmap.width; iX++) {
        for (let iY = 0; iY < globalmap.height; iY++) {
            var cellCoord = [fromCoord[0] + (iY * cellSize), fromCoord[1] + (iX * cellSize)];

            ctx.fillStyle = gColorsCGA.LIGHTGRAY;

            var tile = globalmap.grid[iY][iX];

            if (tile.onFoot != true) {
                ctx.fillStyle = gColorsCGA.GREEN; // forest
                if (tile.onSail == true)
                    ctx.fillStyle = gColorsCGA.BLUE; // sea
                if (tile.onFlight != true)
                    ctx.fillStyle = gColorsCGA.DARKGRAY; // mountain
            } else if (tile.onSail == true) {
                ctx.fillStyle = gColorsCGA.LIGHTBLUE; // river
            }

            if (tile.submapSeed != null)
                ctx.fillStyle = gColorsCGA.YELLOW; // submap

            if (tile.town != null)
                ctx.fillStyle = gColorsCGA.RED; // town

            if (tile.x == gPlayer.globalX && tile.y == gPlayer.globalY) {
                ctx.fillStyle = gColorsCGA.WHITE; // player
            }

            ctx.fillRect(cellCoord[0], cellCoord[1], cellSize, cellSize)
            ctx.strokeRect(cellCoord[0], cellCoord[1], cellSize, cellSize);
        }
    }
}