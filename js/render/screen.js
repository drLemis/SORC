function drawScreenSubmap2D(submap) {
    var fromCoord = [0, 0]; // left-top offset
    var cellSize = Math.min(width * 0.80 / submap.width, height * 0.80 / submap.height); // px

    ctx.strokeStyle = colorMain;
    ctx.lineWidth = 1;

    for (let iX = 0; iX < submap.width; iX++) {
        for (let iY = 0; iY < submap.height; iY++) {
            var cellCoord = [fromCoord[0] + (iY * cellSize), fromCoord[1] + (iX * cellSize)];

            ctx.fillStyle = gColorsCGA[0]; // black

            var tile = submap.grid[iY][iX];

            if (tile.getPass() != true)
                ctx.fillStyle = gColorsCGA[8]; // dark gray

            if (tile.items.length > 0)
                ctx.fillStyle = gColorsCGA[14]; // yellow

            if (tile.getCreature() != null) {
                if (tile.getCreature() == gPlayer) {
                    ctx.fillStyle = gColorsCGA[15]; // white
                } else
                    ctx.fillStyle = gColorsCGA[6]; // brown
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

            ctx.fillStyle = gColorsCGA[7]; // light gray

            var tile = globalmap.grid[iY][iX];

            if (tile.onFoot != true) {
                ctx.fillStyle = gColorsCGA[2]; // forest, green
                if (tile.onSail == true)
                    ctx.fillStyle = gColorsCGA[1]; // sea, blue
                if (tile.onFlight != true)
                    ctx.fillStyle = gColorsCGA[8]; // mountain, dark gray
            } else if (tile.onSail == true) {
                ctx.fillStyle = gColorsCGA[9]; // river, light blue
            }

            if (tile.submapSeed != null)
                ctx.fillStyle = gColorsCGA[14]; // submap, yellow

            if (tile.x == gPlayer.globalX && tile.y == gPlayer.globalY) {
                ctx.fillStyle = gColorsCGA[15]; // player, white
            }

            ctx.fillRect(cellCoord[0], cellCoord[1], cellSize, cellSize)
            ctx.strokeRect(cellCoord[0], cellCoord[1], cellSize, cellSize);
        }
    }
}