var gDrawingRightNow = false;

var gDebug3D = false;

function drawScreenSubmap3D(position, distance) {
	ctx.lineWidth = 1;

	var ratioDistance = 1 / distance;

	if (distance == 0) {
		ratioDistance = 2;
	}

	var width = canvas.width * 0.8;
	var height = canvas.height * 0.8;

	var sizewall = [width / 4, height / 4];
	var xsuwall = [-sizewall[0], sizewall[0]];
	var ysuwall = [sizewall[1], sizewall[1]];
	var xsdwall = [sizewall[0], -sizewall[0]];
	var ysdwall = [-sizewall[1], -sizewall[1]];

	for (let i = 0; i < xsuwall.length; i++) {
		xsuwall[i] = (xsuwall[i] * (ratioDistance) + width / 2 +
			(width / 2 * (position)) * (ratioDistance));
		ysuwall[i] = (-ysuwall[i] * (ratioDistance) + height / 2);
		xsdwall[i] = (xsdwall[i] * (ratioDistance) + width / 2 +
			(width / 2 * (position)) * (ratioDistance));
		ysdwall[i] = (-ysdwall[i] * (ratioDistance) + height / 2);
	}


	// for left sides
	if (position > 0) {
		var xsunwall = [-sizewall[0], sizewall[0]];
		var ysunwall = [sizewall[1], sizewall[1]];
		var xsdnwall = [sizewall[0], -sizewall[0]];
		var ysdnwall = [-sizewall[1], -sizewall[1]];

		for (let i = 0; i < xsunwall.length; i++) {
			xsunwall[i] = (xsunwall[i] * (1 / (distance + 1)) + width / 2 +
				(width / 2 * (position - 1)) * (1 / (distance + 1)));
			ysunwall[i] = (-ysunwall[i] * (1 / (distance + 1)) + height / 2);
			xsdnwall[i] = (xsdnwall[i] * (1 / (distance + 1)) + width / 2 +
				(width / 2 * (position - 1)) * (1 / (distance + 1)));
			ysdnwall[i] = (-ysdnwall[i] * (1 / (distance + 1)) + height / 2);
		}

		var xslwall = [
			xsuwall[0],
			xsunwall[1],
			xsunwall[1],
			xsuwall[0]
		];
		var yslwall = [
			ysuwall[0],
			ysunwall[1],
			ysdnwall[1],
			ysdwall[1]
		];

		ctx.strokeStyle = gColorsCGA.WHITE;
		ctx.beginPath();
		ctx.moveTo(xslwall[0], yslwall[0]);
		ctx.lineTo(xslwall[1], yslwall[1]);
		ctx.lineTo(xslwall[2], yslwall[2]);
		ctx.lineTo(xslwall[3], yslwall[3]);
		ctx.closePath();
		ctx.stroke();

		xslwall[0] = xslwall[0] + 0;
		xslwall[1] = xslwall[1] - 0;
		xslwall[2] = xslwall[2] - 0;
		xslwall[3] = xslwall[3] + 1;

		yslwall[0] = yslwall[0] + 0;
		yslwall[1] = yslwall[1] + 1;
		yslwall[2] = yslwall[2] - 1;
		yslwall[3] = yslwall[3] - 0;

		ctx.fillStyle = gColorsCGA.BLACK;
		ctx.beginPath();
		ctx.moveTo(xslwall[0], yslwall[0]);
		ctx.lineTo(xslwall[1], yslwall[1]);
		ctx.lineTo(xslwall[2], yslwall[2]);
		ctx.lineTo(xslwall[3], yslwall[3]);
		ctx.closePath();
		ctx.fill();

		// for right sides
	} else if (position < 0) {
		var xsunwall = [-sizewall[0], sizewall[0]];
		var ysunwall = [sizewall[1], sizewall[1]];
		var xsdnwall = [sizewall[0], -sizewall[0]];
		var ysdnwall = [-sizewall[1], -sizewall[1]];

		for (let i = 0; i < xsunwall.length; i++) {
			xsunwall[i] = (xsunwall[i] * (1 / (distance + 1)) + width / 2 +
				(width / 2 * (position + 1)) * (1 / (distance + 1)));
			ysunwall[i] = (-ysunwall[i] * (1 / (distance + 1)) + height / 2);
			xsdnwall[i] = (xsdnwall[i] * (1 / (distance + 1)) + width / 2 +
				(width / 2 * (position + 1)) * (1 / (distance + 1)));
			ysdnwall[i] = (-ysdnwall[i] * (1 / (distance + 1)) + height / 2);
		}

		var xsrwall = [
			xsuwall[1],
			xsunwall[0],
			xsunwall[0],
			xsuwall[1]
		];
		var ysrwall = [
			ysuwall[1],
			ysunwall[0],
			ysdnwall[0],
			ysdwall[1]
		];

		ctx.strokeStyle = gColorsCGA.WHITE;
		ctx.beginPath();
		ctx.moveTo(xsrwall[0], ysrwall[0]);
		ctx.lineTo(xsrwall[1], ysrwall[1]);
		ctx.lineTo(xsrwall[2], ysrwall[2]);
		ctx.lineTo(xsrwall[3], ysrwall[3]);
		ctx.closePath();
		ctx.stroke();

		xsrwall[0] = xsrwall[0];
		xsrwall[1] = xsrwall[1];
		xsrwall[2] = xsrwall[2];
		xsrwall[3] = xsrwall[3];

		ysrwall[0] = ysrwall[0];
		ysrwall[1] = ysrwall[1];
		ysrwall[2] = ysrwall[2];
		ysrwall[3] = ysrwall[3];

		ctx.fillStyle = gColorsCGA.BLACK;
		ctx.beginPath();
		ctx.moveTo(xsrwall[0], ysrwall[0]);
		ctx.lineTo(xsrwall[1], ysrwall[1]);
		ctx.lineTo(xsrwall[2], ysrwall[2]);
		ctx.lineTo(xsrwall[3], ysrwall[3]);
		ctx.closePath();
		ctx.fill();

	}

	ctx.fillStyle = gColorsCGA.BLACK;
	ctx.fillRect(xsuwall[0], ysuwall[0], xsuwall[1] - xsuwall[0], ysdwall[0] - ysuwall[0]);

	ctx.strokeStyle = gColorsCGA.WHITE;
	ctx.strokeRect(xsuwall[0], ysuwall[0], xsuwall[1] - xsuwall[0], ysdwall[0] - ysuwall[0]);

	// verticals
	// g.setColor(Interface.color[15]);
	// g.drawLine(xsuwall[0]+1, ysuwall[0], xsdwall[1]+1, ysdwall[1]);
	// g.drawLine(xsuwall[1]+1, ysuwall[1], xsdwall[0]+1, ysdwall[0]);


}


function drawScreenSubmap2D(submap) {
	gDrawingRightNow = true;
	var fromCoord = [0, 0]; // left-top offset
	var cellSize = Math.min(width * 0.80 / submap.width, height * 0.80 / submap.height); // px

	ctx.lineWidth = 1;

	for (let iX = 0; iX < submap.width; iX++) {
		for (let iY = 0; iY < submap.height; iY++) {
			ctx.strokeStyle = gColorsCGA.WHITE;
			var cellCoord = [fromCoord[0] + (iY * cellSize), fromCoord[1] + (iX * cellSize)];

			var text = "";

			ctx.fillStyle = gColorsCGA.BLACK;

			var tile = submap.grid[iY][iX];

			if (tile.getPass() != true)
				ctx.fillStyle = gColorsCGA.DARKGRAY;

			if (tile.items.length > 0) {
				ctx.fillStyle = gColorsCGA.YELLOW;
				if (tile.items.length > 9)
					text = 0;
				else
					text = tile.items.length.toString();
			}

			if (tile.getCreature() != null) {
				if (tile.getCreature() == gPlayer) {
					ctx.fillStyle = gColorsCGA.WHITE;

					switch (gPlayer.heading) {
						case 1:
							text = ">"
							break;
						case 2:
							text = "v"
							break;
						case 3:
							text = "<"
							break;
						default:
							text = "^"
							break;
					}

				} else {
					ctx.fillStyle = gColorsCGA.BROWN;
					text = tile.getCreature().name.charAt(0);
				}
			}

			if (ctx.fillStyle != gColorsCGA.BLACK) {
				ctx.fillRect(cellCoord[0], cellCoord[1], cellSize, cellSize);

				if (tile.getCreature() && tile.getCreature().name) {
					ctx.textAlign = "center";
					ctx.font = cellSize * 1.5 + "px Consolas";

					ctx.fillStyle = gColorsCGA.BLACK;
					ctx.fillText(text, cellCoord[0] + cellSize / 2, cellCoord[1] + cellSize);
				}
			}
		}
	}
	gDrawingRightNow = false;
}

function drawScreenGlobalmap2D(globalmap) {
	gDrawingRightNow = true;
	var fromCoord = [0, 0]; // left-top offset
	var cellSize = Math.min(width * 0.80 / globalmap.width, height * 0.80 / globalmap.height); // px

	ctx.fillStyle = gColorsCGA.LIGHTGRAY;
	ctx.fillRect(0, 0, cellSize * globalmap.width, cellSize * globalmap.height);

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

			if (ctx.fillStyle != gColorsCGA.LIGHTGRAY)
				ctx.fillRect(cellCoord[0], cellCoord[1], cellSize, cellSize)
		}
	}
	gDrawingRightNow = false;
}


function drawScreenSubmap3DDebug(submap) {
	var array = [
		[]
	];

	for (let Y = 0; Y < submap.height; Y++) {
		for (let X = 0; X < submap.width; X++) {
			if (!array[Y])
				array[Y] = [];
			array[Y][X] = submap.getTile(X, Y).getPass();
		}
	}

	var params = getRenderableArray(array, gPlayer.localX, gPlayer.localY, gPlayer.heading)

	for (let Y = 0; Y < params.array.length; Y++) {
		for (let X = 0; X < params.offset; X++) {
			var leftright = X - params.offset;
			var distance = params.array.length - Y - 1;
			if (!params.array[Y][X]) {
				drawScreenSubmap3D(leftright, distance);
			}
		}
	}

	for (let Y = 0; Y < params.array.length; Y++) {
		for (let X = params.array[0].length; X > params.offset; X--) {
			var leftright = X - params.offset;
			var distance = params.array.length - Y - 1;
			if (!params.array[Y][X]) {
				drawScreenSubmap3D(leftright, distance);
			}
		}
	}

	for (let Y = 0; Y < params.array.length; Y++) {
		var distance = params.array.length - Y - 1;
		if (!params.array[Y][params.offset]) {
			drawScreenSubmap3D(0, distance);
		}
	}
}

var PlayerPosInRender = function (array, offset) {
	this.array = array;
	this.offset = offset;
};

function getRenderableArray(array, posX, posY, heading = 0) {
	var offset = 0;

	switch (heading) {
		case 3: // west
			array = getSubarray(array, 0, 0, posX, array.length);
			offset = array.length - gPlayer.localY - 1;
			break;
		case 2: // south
			array = getSubarray(array, 0, posY, array[0].length, array.length);
			offset = array[0].length - gPlayer.localX - 1;
			break;
		case 1: // east
			array = getSubarray(array, posX, 0, array[0].length, array.length);
			offset = gPlayer.localY;
			break;
		default: // north
			array = getSubarray(array, 0, 0, array[0].length, posY);
			offset = gPlayer.localX;
			break;
	}

	switch (heading) {
		case 3:
			array = rotateArrayCounterclockwise(array);
		case 2:
			array = rotateArrayCounterclockwise(array);
		case 1:
			array = rotateArrayCounterclockwise(array);
		default:
			break;
	}

	var result = new PlayerPosInRender(array, offset);
	return result;
}

function getSubarray(array, fromY, fromX, toY, toX) {
	fromX = Math.max(0, fromX);
	fromY = Math.max(0, fromY);
	toX = Math.min(array[0].length - 1, toX);
	toY = Math.min(array.length - 1, toY);

	var result = [
		[]
	];

	for (let iX = fromX; iX <= toX; iX++) {
		for (let iY = fromY; iY <= toY; iY++) {
			if (!result[iX - fromX])
				result[iX - fromX] = [];

			result[iX - fromX][iY - fromY] = array[iX][iY];
		}
	}
	return result;
}