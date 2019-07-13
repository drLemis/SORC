//helper cucktion
function CreateGlobalTileArray(map, h, w) {
	arr = new Array(h)
	for (var i = 0; i < h; i++) {
		arr[i] = new Array(w)
		for (var j = 0; j < w; j++) {
			arr[i][j] = new GlobalTile(map, i, j)
		}
	}
	return arr
}

function GlobalmapFromArray(array) {
	map = new Globalmap(array.length, array[0].length)

	for (curX = 0; curX < array[0].length; curX++) {
		for (curY = 0; curY < array.length; curY++) {
			if (array[curY][curX] == 1)
				map.getTile(curX, curY).setPass(false);
		}
	}
	return map
}

var Globalmap = function (w, h) {
	this.grid = CreateGlobalTileArray(this, h, w)
	this.height = h
	this.width = w

	this.getTile = function (x, y) {
		if (x >= 0 && x < h && y >= 0 && y < w)
			return this.grid[x][y];
		else {
			return null;
		}
	}

	this.setTile = function (newTile, x, y) {
		newTile.x = x
		newTile.y = y
		newTile.parent = this
		this.grid[x][y] = newTile
		return this
	}

	this.movePlayer = function (fromTile, toTile) {
		if (fromTile != toTile) {
			if (toTile.onFoot != true) {
				drawInterfaceLogs("YOU CAN'T MOVE THERE!");
				return;
			}
			gPlayer.globalX = toTile.x;
			gPlayer.globalY = toTile.y;
		}
	}

	this.getTileAdjacent = function (fromTile, vector) {
		return this.getTile(fromTile.x + vector[0], fromTile.y + vector[1]);
	}

	return this;
};

var GlobalTile = function (map, x, y) {
	this.x = x;
	this.y = y;
	this.parent = map;

	this.onFoot = new Boolean(true);
	this.onSail = new Boolean(false);
	this.onFlight = new Boolean(true);
	this.submap = null;
}