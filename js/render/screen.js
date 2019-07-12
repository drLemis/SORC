function drawScreenSubmap2D(submap) {
    var fromCoord = [0, 0]; // left-top offset
    var cellSize = [20, 20]; // px

    ctx.strokeStyle = colorMain;
    ctx.lineWidth = 1;

    for (let iX = 0; iX < submap.length; iX++) {
        for (let iY = 0; iY < submap[iX].length; iY++) {
            var cellCoord = [fromCoord[0] + (iY * cellSize[0]), fromCoord[1] + (iX * cellSize[1])];
            ctx.strokeRect(cellCoord[0], cellCoord[1], cellSize[0], cellSize[1]);
        }
    }
}