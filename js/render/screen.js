function drawScreenSubmap2D(submap) {
    var fromCoord = [0, 0]; // left-top offset
    var cellSize = [20, 20]; // px

    ctx.strokeStyle = colorMain;
    ctx.lineWidth = 1;

    for (let iX = 0; iX < submap.width; iX++) {
        for (let iY = 0; iY < submap.height; iY++) {
            var cellCoord = [fromCoord[0] + (iY * cellSize[0]), fromCoord[1] + (iX * cellSize[1])];

            ctx.fillStyle = colorsCGA[0]; // black

            var tile = submap.grid[iY][iX];

            if (tile.getPass() != true)
                ctx.fillStyle = colorsCGA[8]; // dark gray

            if (tile.items.length > 0)
                ctx.fillStyle = colorsCGA[14]; // yellow

            if (tile.getCreature() != null) {
                if (tile.getCreature() == gPlayer) {
                    ctx.fillStyle = colorsCGA[1]; // blue
                } else
                    ctx.fillStyle = colorsCGA[6]; // brown
            }

            ctx.fillRect(cellCoord[0], cellCoord[1], cellSize[0], cellSize[1])
            ctx.strokeRect(cellCoord[0], cellCoord[1], cellSize[0], cellSize[1]);
        }
    }

}