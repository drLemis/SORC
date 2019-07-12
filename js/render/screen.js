function drawScreenSubmap2D(submap) {
    var fromCoord = [0, 0]; // left-top offset
    var cellSize = Math.min(width*0.75/submap.width, height*0.75/submap.height); // px

    ctx.strokeStyle = colorMain;
    ctx.lineWidth = 1;

    for (let iX = 0; iX < submap.width; iX++) {
        for (let iY = 0; iY < submap.height; iY++) {
            var cellCoord = [fromCoord[0] + (iY * cellSize), fromCoord[1] + (iX * cellSize)];

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

            ctx.fillRect(cellCoord[0], cellCoord[1], cellSize, cellSize)
            ctx.strokeRect(cellCoord[0], cellCoord[1], cellSize, cellSize);
        }
    }

}