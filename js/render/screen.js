var gDrawingRightNow = false;

var gDebug3D = true;

function drawBrickPattern(x, y, w, h, color1, color2) {
	ctx.fillStyle = color1;
	ctx.fillRect(x, y, w, h);
	ctx.strokeStyle = color2;
	ctx.lineWidth = 1;
	// Horizontal lines
	for (let i = 1; i < 4; i++) {
		ctx.beginPath();
		ctx.moveTo(x, y + (h * i) / 4);
		ctx.lineTo(x + w, y + (h * i) / 4);
		ctx.stroke();
	}
	// Vertical lines (offset for bricks)
	for (let i = 0; i < 4; i++) {
		let offset = (i % 2 === 0) ? 0 : w / 4;
		for (let j = 1; j < 4; j += 2) {
			ctx.beginPath();
			ctx.moveTo(x + offset + (w * j) / 4, y + (h * i) / 4);
			ctx.lineTo(x + offset + (w * j) / 4, y + (h * (i + 1)) / 4);
			ctx.stroke();
		}
	}
}

function drawBrickPatternSkewed(xy, color1, color2) {
	// xy: array of 4 [x, y] points, in order: top-left, top-right, bottom-right, bottom-left
	ctx.save();
	ctx.beginPath();
	ctx.moveTo(xy[0][0], xy[0][1]);
	ctx.lineTo(xy[1][0], xy[1][1]);
	ctx.lineTo(xy[2][0], xy[2][1]);
	ctx.lineTo(xy[3][0], xy[3][1]);
	ctx.closePath();
	ctx.clip();

	// Fill base
	ctx.fillStyle = color1;
	ctx.beginPath();
	ctx.moveTo(xy[0][0], xy[0][1]);
	ctx.lineTo(xy[1][0], xy[1][1]);
	ctx.lineTo(xy[2][0], xy[2][1]);
	ctx.lineTo(xy[3][0], xy[3][1]);
	ctx.closePath();
	ctx.fill();

	ctx.strokeStyle = color2;
	ctx.lineWidth = 1;
	const rows = 4, cols = 4;
	// Horizontal brick lines
	for (let i = 1; i < rows; i++) {
		let t = i / rows;
		let xA = xy[0][0] + t * (xy[3][0] - xy[0][0]);
		let yA = xy[0][1] + t * (xy[3][1] - xy[0][1]);
		let xB = xy[1][0] + t * (xy[2][0] - xy[1][0]);
		let yB = xy[1][1] + t * (xy[2][1] - xy[1][1]);
		ctx.beginPath();
		ctx.moveTo(xA, yA);
		ctx.lineTo(xB, yB);
		ctx.stroke();
	}
	// Vertical brick lines (offset every other row)
	for (let r = 0; r < rows; r++) {
		let t0 = r / rows, t1 = (r + 1) / rows;
		let xL0 = xy[0][0] + t0 * (xy[3][0] - xy[0][0]);
		let yL0 = xy[0][1] + t0 * (xy[3][1] - xy[0][1]);
		let xR0 = xy[1][0] + t0 * (xy[2][0] - xy[1][0]);
		let yR0 = xy[1][1] + t0 * (xy[2][1] - xy[1][1]);
		let xL1 = xy[0][0] + t1 * (xy[3][0] - xy[0][0]);
		let yL1 = xy[0][1] + t1 * (xy[3][1] - xy[0][1]);
		let xR1 = xy[1][0] + t1 * (xy[2][0] - xy[1][0]);
		let yR1 = xy[1][1] + t1 * (xy[2][1] - xy[1][1]);
		let nVert = cols;
		let offset = (r % 2 === 0) ? 0 : 0.5;
		for (let c = 1; c < nVert; c += 2) {
			let s = (c + offset) / nVert;
			if (s >= 1) continue;
			let x0 = xL0 + s * (xR0 - xL0);
			let y0 = yL0 + s * (yR0 - yL0);
			let x1 = xL1 + s * (xR1 - xL1);
			let y1 = yL1 + s * (yR1 - yL1);
			ctx.beginPath();
			ctx.moveTo(x0, y0);
			ctx.lineTo(x1, y1);
			ctx.stroke();
		}
	}
	ctx.restore();
}

// Improved helper to draw 45-degree diagonal stripes fully covering a polygon face
function drawDiagonalStripesPolygon(points, color, spacing = 6, angle = 45) {
	ctx.save();
	ctx.beginPath();
	ctx.moveTo(points[0][0], points[0][1]);
	for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
	ctx.closePath();
	ctx.clip();
	// Compute bounding box
	let minX = Math.min(...points.map(p => p[0]));
	let maxX = Math.max(...points.map(p => p[0]));
	let minY = Math.min(...points.map(p => p[1]));
	let maxY = Math.max(...points.map(p => p[1]));
	// Draw diagonal lines at 45 degrees, fully covering the bounding box
	ctx.strokeStyle = color;
	ctx.lineWidth = 2;
	let diag = Math.sqrt((maxX-minX)**2 + (maxY-minY)**2);
	let step = spacing / Math.SQRT2;
	for (let d = -diag; d < diag*2; d += step) {
		ctx.beginPath();
		ctx.moveTo(minX + d, minY);
		ctx.lineTo(minX, minY + d);
		ctx.stroke();
	}
	ctx.restore();
}

function drawScreenSubmap3DCube(position, distance, maincolor = getCurrentPalette().BLACK, subcolor = getCurrentPalette().WHITE, text = "", textcolor = getCurrentPalette().WHITE, alwaysFill = false, visibleFaces = {left:true,right:true,front:true}, stripes = false) {
	ctx.imageSmoothingEnabled = false;
	ctx.lineWidth = 1;
	var ratioDistance = 1 / distance;
	if (distance == 0) ratioDistance = 2;
	var width = Math.round(canvas.width * 0.8);
	var height = Math.round(canvas.height * 0.8);
	var sizewall = [Math.round(width / 4), Math.round(height / 4)];
	var xsuwall = [-sizewall[0], sizewall[0]];
	var ysuwall = [sizewall[1], sizewall[1]];
	var xsdwall = [sizewall[0], -sizewall[0]];
	var ysdwall = [-sizewall[1], -sizewall[1]];
	for (let i = 0; i < xsuwall.length; i++) {
		xsuwall[i] = Math.round((xsuwall[i] * (ratioDistance) + width / 2 + (width / 2 * (position)) * (ratioDistance)));
		ysuwall[i] = Math.round((-ysuwall[i] * (ratioDistance) + height / 2));
		xsdwall[i] = Math.round((xsdwall[i] * (ratioDistance) + width / 2 + (width / 2 * (position)) * (ratioDistance)));
		ysdwall[i] = Math.round((-ysdwall[i] * (ratioDistance) + height / 2));
	}
	function shouldFillCube() {
		return alwaysFill || gWallDetailMode === 'detailed' || gWallDetailMode === 'simple';
	}
	// In simple mode, always fill with solid black and outline with white
	if (gWallDetailMode === 'simple' && !alwaysFill && !stripes) {
		ctx.fillStyle = getCurrentPalette().BLACK;
		ctx.strokeStyle = getCurrentPalette().WHITE;
		// Only draw visible faces
		if (visibleFaces.left && position > 0) {
			var xsunwall = [-sizewall[0], sizewall[0]];
			var ysunwall = [sizewall[1], sizewall[1]];
			var xsdnwall = [sizewall[0], -sizewall[0]];
			var ysdnwall = [-sizewall[1], -sizewall[1]];
			for (let i = 0; i < xsunwall.length; i++) {
				xsunwall[i] = Math.round((xsunwall[i] * (1 / (distance + 1)) + width / 2 + (width / 2 * (position - 1)) * (1 / (distance + 1))));
				ysunwall[i] = Math.round((-ysunwall[i] * (1 / (distance + 1)) + height / 2));
				xsdnwall[i] = Math.round((xsdnwall[i] * (1 / (distance + 1)) + width / 2 + (width / 2 * (position - 1)) * (1 / (distance + 1))));
				ysdnwall[i] = Math.round((-ysdnwall[i] * (1 / (distance + 1)) + height / 2));
			}
			var xslwall = [xsuwall[0], xsunwall[1], xsunwall[1], xsuwall[0]];
			var yslwall = [ysuwall[0], ysunwall[1], ysdnwall[1], ysdwall[1]];
			ctx.beginPath();
			ctx.moveTo(xslwall[0], yslwall[0]);
			ctx.lineTo(xslwall[1], yslwall[1]);
			ctx.lineTo(xslwall[2], yslwall[2]);
			ctx.lineTo(xslwall[3], yslwall[3]);
			ctx.closePath();
			ctx.fill();
			ctx.stroke();
		}
		if (visibleFaces.right && position < 0) {
			var xsunwall = [-sizewall[0], sizewall[0]];
			var ysunwall = [sizewall[1], sizewall[1]];
			var xsdnwall = [sizewall[0], -sizewall[0]];
			var ysdnwall = [-sizewall[1], -sizewall[1]];
			for (let i = 0; i < xsunwall.length; i++) {
				xsunwall[i] = Math.round((xsunwall[i] * (1 / (distance + 1)) + width / 2 + (width / 2 * (position + 1)) * (1 / (distance + 1))));
				ysunwall[i] = Math.round((-ysunwall[i] * (1 / (distance + 1)) + height / 2));
				xsdnwall[i] = Math.round((xsdnwall[i] * (1 / (distance + 1)) + width / 2 + (width / 2 * (position + 1)) * (1 / (distance + 1))));
				ysdnwall[i] = Math.round((-ysdnwall[i] * (1 / (distance + 1)) + height / 2));
			}
			var xsrwall = [xsuwall[1], xsunwall[0], xsunwall[0], xsuwall[1]];
			var ysrwall = [ysuwall[1], ysunwall[0], ysdnwall[0], ysdwall[1]];
			ctx.beginPath();
			ctx.moveTo(xsrwall[0], ysrwall[0]);
			ctx.lineTo(xsrwall[1], ysrwall[1]);
			ctx.lineTo(xsrwall[2], ysrwall[2]);
			ctx.lineTo(xsrwall[3], ysrwall[3]);
			ctx.closePath();
			ctx.fill();
			ctx.stroke();
		}
		if (visibleFaces.front) {
			ctx.beginPath();
			ctx.rect(xsuwall[0], ysuwall[0], xsuwall[1] - xsuwall[0], ysdwall[0] - ysuwall[0]);
			ctx.fill();
			ctx.stroke();
		}
		if (text != "" && distance > 0) {
			ctx.textAlign = "center";
			ctx.font = 30 / distance * 1.5 + "px Consolas";
			ctx.fillStyle = textcolor;
			ctx.fillText(text, Math.round(xsuwall[0] + (xsuwall[1] - xsuwall[0]) / 2), Math.round(ysuwall[0] + (ysdwall[0] - ysuwall[0]) / 2));
		}
		return;
	}
	// In detailed mode, do NOT draw outlines for wall cubes, only fill and brick pattern
	// Draw floor and ceiling in detailed mode
	if (gWallDetailMode === 'detailed') {
		// Floor
		ctx.fillStyle = getCurrentPalette().LIGHTGRAY;
		ctx.beginPath();
		ctx.moveTo(xsuwall[0], ysdwall[0]);
		ctx.lineTo(xsuwall[1], ysdwall[1]);
		ctx.lineTo(xsuwall[1], ysuwall[1]);
		ctx.lineTo(xsuwall[0], ysuwall[0]);
		ctx.closePath();
		ctx.fill();
		// Ceiling
		ctx.fillStyle = getCurrentPalette().DARKGRAY;
		ctx.beginPath();
		ctx.moveTo(xsuwall[0], ysuwall[0]);
		ctx.lineTo(xsuwall[1], ysuwall[1]);
		ctx.lineTo(xsuwall[1], ysdwall[1]);
		ctx.lineTo(xsuwall[0], ysdwall[0]);
		ctx.closePath();
		ctx.fill();
	}
	// Left wall
	if (position > 0) {
		var xsunwall = [-sizewall[0], sizewall[0]];
		var ysunwall = [sizewall[1], sizewall[1]];
		var xsdnwall = [sizewall[0], -sizewall[0]];
		var ysdnwall = [-sizewall[1], -sizewall[1]];
		for (let i = 0; i < xsunwall.length; i++) {
			xsunwall[i] = Math.round((xsunwall[i] * (1 / (distance + 1)) + width / 2 + (width / 2 * (position - 1)) * (1 / (distance + 1))));
			ysunwall[i] = Math.round((-ysunwall[i] * (1 / (distance + 1)) + height / 2));
			xsdnwall[i] = Math.round((xsdnwall[i] * (1 / (distance + 1)) + width / 2 + (width / 2 * (position - 1)) * (1 / (distance + 1))));
			ysdnwall[i] = Math.round((-ysdnwall[i] * (1 / (distance + 1)) + height / 2));
		}
		var xslwall = [xsuwall[0], xsunwall[1], xsunwall[1], xsuwall[0]];
		var yslwall = [ysuwall[0], ysunwall[1], ysdnwall[1], ysdwall[1]];
		if (shouldFillCube()) {
			if (stripes) {
				drawDiagonalStripesPolygon([
					[xslwall[0], yslwall[0]],
					[xslwall[1], yslwall[1]],
					[xslwall[2], yslwall[2]],
					[xslwall[3], yslwall[3]]
				], maincolor);
			} else {
				ctx.fillStyle = maincolor;
				ctx.beginPath();
				ctx.moveTo(xslwall[0], yslwall[0]);
				ctx.lineTo(xslwall[1], yslwall[1]);
				ctx.lineTo(xslwall[2], yslwall[2]);
				ctx.lineTo(xslwall[3], yslwall[3]);
				ctx.closePath();
				ctx.fill();
			}
			if (!stripes && (maincolor === getCurrentPalette().DARKGRAY || maincolor === getCurrentPalette().BLACK)) {
				if (gWallDetailMode === 'detailed') {
					drawBrickPatternSkewed([
						[xslwall[0], yslwall[0]],
						[xslwall[1], yslwall[1]],
						[xslwall[2], yslwall[2]],
						[xslwall[3], yslwall[3]]
					], getCurrentPalette().DARKGRAY, getCurrentPalette().LIGHTGRAY);
				}
			}
		}
	}
	// Right wall
	else if (position < 0) {
		var xsunwall = [-sizewall[0], sizewall[0]];
		var ysunwall = [sizewall[1], sizewall[1]];
		var xsdnwall = [sizewall[0], -sizewall[0]];
		var ysdnwall = [-sizewall[1], -sizewall[1]];
		for (let i = 0; i < xsunwall.length; i++) {
			xsunwall[i] = Math.round((xsunwall[i] * (1 / (distance + 1)) + width / 2 + (width / 2 * (position + 1)) * (1 / (distance + 1))));
			ysunwall[i] = Math.round((-ysunwall[i] * (1 / (distance + 1)) + height / 2));
			xsdnwall[i] = Math.round((xsdnwall[i] * (1 / (distance + 1)) + width / 2 + (width / 2 * (position + 1)) * (1 / (distance + 1))));
			ysdnwall[i] = Math.round((-ysdnwall[i] * (1 / (distance + 1)) + height / 2));
		}
		var xsrwall = [xsuwall[1], xsunwall[0], xsunwall[0], xsuwall[1]];
		var ysrwall = [ysuwall[1], ysunwall[0], ysdnwall[0], ysdwall[1]];
		if (shouldFillCube()) {
			if (stripes) {
				drawDiagonalStripesPolygon([
					[xsrwall[0], ysrwall[0]],
					[xsrwall[1], ysrwall[1]],
					[xsrwall[2], ysrwall[2]],
					[xsrwall[3], ysrwall[3]]
				], maincolor);
			} else {
				ctx.fillStyle = maincolor;
				ctx.beginPath();
				ctx.moveTo(xsrwall[0], ysrwall[0]);
				ctx.lineTo(xsrwall[1], ysrwall[1]);
				ctx.lineTo(xsrwall[2], ysrwall[2]);
				ctx.lineTo(xsrwall[3], ysrwall[3]);
				ctx.closePath();
				ctx.fill();
			}
			if (!stripes && (maincolor === getCurrentPalette().DARKGRAY || maincolor === getCurrentPalette().BLACK)) {
				if (gWallDetailMode === 'detailed') {
					drawBrickPatternSkewed([
						[xsrwall[0], ysrwall[0]],
						[xsrwall[1], ysrwall[1]],
						[xsrwall[2], ysrwall[2]],
						[xsrwall[3], ysrwall[3]]
					], getCurrentPalette().DARKGRAY, getCurrentPalette().LIGHTGRAY);
				}
			}
		}
	}
	// Face wall
	if (shouldFillCube()) {
		if (stripes) {
			drawDiagonalStripesPolygon([
				[xsuwall[0], ysuwall[0]],
				[xsuwall[1], ysuwall[1]],
				[xsdwall[0], ysdwall[0]],
				[xsdwall[1], ysdwall[1]]
			], maincolor);
		} else {
			ctx.fillStyle = maincolor;
			ctx.fillRect(xsuwall[0], ysuwall[0], xsuwall[1] - xsuwall[0], ysdwall[0] - ysuwall[0]);
		}
		if (!stripes && (maincolor === getCurrentPalette().DARKGRAY || maincolor === getCurrentPalette().BLACK)) {
			if (gWallDetailMode === 'detailed') {
				drawBrickPattern(xsuwall[0], ysuwall[0], xsuwall[1] - xsuwall[0], ysdwall[0] - ysuwall[0], getCurrentPalette().DARKGRAY, getCurrentPalette().LIGHTGRAY);
			}
		}
	}
	if (text != "" && distance > 0) {
		ctx.textAlign = "center";
		ctx.font = 30 / distance * 1.5 + "px Consolas";
		ctx.fillStyle = textcolor;
		ctx.fillText(text, Math.round(xsuwall[0] + (xsuwall[1] - xsuwall[0]) / 2), Math.round(ysuwall[0] + (ysdwall[0] - ysuwall[0]) / 2));
	}
}

function drawScreenSubmap2D(submap) {
	gDrawingRightNow = true;
	var fromCoord = [0, 0]; // left-top offset
	var cellSize = Math.min(width * 0.80 / submap.width, height * 0.80 / submap.height); // px

	ctx.imageSmoothingEnabled = false;
	ctx.lineWidth = 1;

	for (let iX = 0; iX < submap.width; iX++) {
		for (let iY = 0; iY < submap.height; iY++) {
			ctx.strokeStyle = getCurrentPalette().WHITE;
			var cellCoord = [fromCoord[0] + (iY * cellSize), fromCoord[1] + (iX * cellSize)];

			var text = "";

			ctx.fillStyle = getCurrentPalette().BLACK;

			var tile = submap.grid[iY][iX];

			if (tile.getPass() != true) {
				if (gWallDetailMode === 'detailed') {
					drawBrickPattern(cellCoord[0], cellCoord[1], cellSize, cellSize, getCurrentPalette().DARKGRAY, getCurrentPalette().LIGHTGRAY);
				} else {
					ctx.strokeRect(cellCoord[0], cellCoord[1], cellSize, cellSize);
				}
			} else {
				if (tile.items.length > 0) {
					ctx.fillStyle = getCurrentPalette().YELLOW;
					if (tile.items.length > 9)
						text = 0;
					else
						text = tile.items.length.toString();
				}

				if (tile.getCreature() != null) {
					if (tile.getCreature() == gPlayer) {
						ctx.fillStyle = getCurrentPalette().WHITE;

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
						ctx.fillStyle = getCurrentPalette().BROWN;
						text = tile.getCreature().name.charAt(0);
					}
				}

				// if (ctx.fillStyle != getCurrentPalette().BLACK) {
				// 	ctx.fillRect(cellCoord[0], cellCoord[1], cellSize, cellSize);

				// 	if (tile.getCreature() && tile.getCreature().name) {
				// 		ctx.textAlign = "center";
				// 		ctx.font = cellSize * 1.5 + "px Consolas";

				// 		ctx.fillStyle = getCurrentPalette().BLACK;
				// 		ctx.fillText(text, cellCoord[0] + cellSize / 2, cellCoord[1] + cellSize);
				// 	}
				// }
			}
		}
	}
	gDrawingRightNow = false;
}

function drawScreenGlobalmap2D(globalmap) {
	gDrawingRightNow = true;
	var fromCoord = [0, 0]; // left-top offset
	var cellSize = Math.min(width * 0.80 / globalmap.width, height * 0.80 / globalmap.height); // px

	ctx.imageSmoothingEnabled = false;
	ctx.fillStyle = getCurrentPalette().LIGHTGRAY;
	ctx.fillRect(0, 0, cellSize * globalmap.width, cellSize * globalmap.height);

	ctx.strokeStyle = getCurrentPalette().WHITE;
	ctx.lineWidth = 1;

	for (let iX = 0; iX < globalmap.width; iX++) {
		for (let iY = 0; iY < globalmap.height; iY++) {
			var cellCoord = [fromCoord[0] + (iY * cellSize), fromCoord[1] + (iX * cellSize)];

			ctx.fillStyle = getCurrentPalette().LIGHTGRAY;

			var tile = globalmap.grid[iY][iX];

			if (tile.onFoot != true) {
				ctx.fillStyle = getCurrentPalette().GREEN; // forest
				if (tile.onSail == true)
					ctx.fillStyle = getCurrentPalette().BLUE; // sea
				if (tile.onFlight != true)
					ctx.fillStyle = getCurrentPalette().DARKGRAY; // mountain
			} else if (tile.onSail == true) {
				ctx.fillStyle = getCurrentPalette().LIGHTBLUE; // river
			}

			if (tile.submapSeed != null)
				ctx.fillStyle = getCurrentPalette().YELLOW; // submap

			if (tile.town != null)
				ctx.fillStyle = getCurrentPalette().RED; // town

			if (tile.x == gPlayer.globalX && tile.y == gPlayer.globalY) {
				ctx.fillStyle = getCurrentPalette().WHITE; // player
			}

			if (ctx.fillStyle != getCurrentPalette().LIGHTGRAY)
				ctx.fillRect(cellCoord[0], cellCoord[1], cellSize, cellSize)
		}
	}
	gDrawingRightNow = false;
}

function drawScreenSubmap3DDebug(submap) {
	var array = [[]];
	for (let Y = 0; Y < submap.height; Y++) {
		for (let X = 0; X < submap.width; X++) {
			if (!array[Y]) array[Y] = [];
			var tile = submap.getTile(X, Y);
			array[Y][X] = new TileContentInRender(!tile.getPass(), tile.getCreature(), tile.getItems());
		}
	}
	var params = getRenderableArray(array, gPlayer.localX, gPlayer.localY, gPlayer.heading)
	// left hand walls
	for (let Y = 0; Y < params.array.length; Y++) {
		for (let X = 0; X < params.offset; X++) {
			var leftright = X - params.offset;
			var distance = params.array.length - Y - 1;
			var tile = params.array[Y][X];
			if (tile) {
				if (tile.wall) {
					drawScreenSubmap3DCube(leftright, distance);
				} else if (tile.creature && tile.creature.name != gPlayer.name) {
					drawScreenSubmap3DCube(leftright, distance, "#FF0000", "#FF0000", tile.creature.name, "#FFFFFF", true, {left:true,right:true,front:true}, true);
				} else if (tile.loot.length > 0) {
					drawScreenSubmap3DCube(leftright, distance, "#FFFF00", "#FFFF00", "LOOT", "#000000", true, {left:true,right:true,front:true}, true);
				}
			}
		}
	}
	// right hand walls
	for (let Y = 0; Y < params.array.length; Y++) {
		for (let X = params.array[0].length; X > params.offset; X--) {
			var leftright = X - params.offset;
			var distance = params.array.length - Y - 1;
			var tile = params.array[Y][X];
			if (tile) {
				if (tile.wall) {
					drawScreenSubmap3DCube(leftright, distance);
				} else if (tile.creature && tile.creature.name != gPlayer.name) {
					drawScreenSubmap3DCube(leftright, distance, "#FF0000", "#FF0000", tile.creature.name, "#FFFFFF", true, {left:true,right:true,front:true}, true);
				} else if (tile.loot.length > 0) {
					drawScreenSubmap3DCube(leftright, distance, "#FFFF00", "#FFFF00", "LOOT", "#000000", true, {left:true,right:true,front:true}, true);
				}
			}
		}
	}
	// face walls
	for (let Y = 0; Y < params.array.length; Y++) {
		var distance = params.array.length - Y - 1;
		var X = params.offset;
		var leftright = 0;
		var tile = params.array[Y][X];
		if (tile) {
			if (tile.wall) {
				drawScreenSubmap3DCube(leftright, distance);
			} else if (tile.creature && tile.creature.name != gPlayer.name) {
				drawScreenSubmap3DCube(leftright, distance, "#FF0000", "#FF0000", tile.creature.name, "#FFFFFF", true, {left:true,right:true,front:true}, true);
			} else if (tile.loot.length > 0) {
				drawScreenSubmap3DCube(leftright, distance, "#FFFF00", "#FFFF00", "LOOT", "#000000", true, {left:true,right:true,front:true}, true);
			}
		}
	}
}

var PlayerPosInRender = function (array, offset) {
	this.array = array;
	this.offset = offset;
};

var TileContentInRender = function (wall, creature, loot) {
	this.wall = wall;
	this.creature = creature;
	this.loot = loot;
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