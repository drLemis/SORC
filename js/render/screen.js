function drawScreenSubmap2D(submap) {
    var fromCoord = [0, 0]; // left-top offset
    var cellSize = Math.min(width * 0.80 / submap.width, height * 0.80 / submap.height); // px

    ctx.strokeStyle = gColorsCGA.WHITE;
    ctx.lineWidth = 1;

    for (let iX = 0; iX < submap.width; iX++) {
        for (let iY = 0; iY < submap.height; iY++) {
			ctx.strokeStyle = gColorsCGA.WHITE;
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
			
			if (debug_rooms.length > 0) {
				for (var i = 0; i < debug_rooms.length; i++) {
					ctx.strokeStyle = gColorsCGA.RED;
					ctx.strokeRect(debug_rooms[i][1]*cellSize, debug_rooms[i][0]*cellSize, cellSize, cellSize)
				}
			}
			
			if (debug_passages.length > 0) {
				ctx.strokeStyle = gColorsCGA.BLUE;
				for (var i = 0; i < debug_passages.length; i++) {
					ctx.beginPath()
					ctx.moveTo((debug_passages[i][0][1]+0.5)*cellSize, (debug_passages[i][0][0]+0.5)*cellSize)
					for (var j = 1; j < debug_passages[i].length; j++){
						ctx.lineTo((debug_passages[i][j][1]+0.5)*cellSize, (debug_passages[i][j][0]+0.5)*cellSize)
					}
					ctx.stroke();
				}
				
			}
        }
    }
}

function drawScreenGlobalmap2D(globalmap) {
    var fromCoord = [0, 0]; // left-top offset
    var cellSize = Math.min(width * 0.80 / globalmap.width, height * 0.80 / globalmap.height); // px

    ctx.strokeStyle = gColorsCGA.WHITE;
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