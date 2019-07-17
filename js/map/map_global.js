//helper function
function CreateTileGlobalArray(map, h, w) {
	arr = new Array(h)
	for (var i = 0; i < h; i++) {
		arr[i] = new Array(w)
		for (var j = 0; j < w; j++) {
			arr[i][j] = new TileGlobal(map, i, j)
		}
	}
	return arr
}

var MapGlobal = function (w, h) {
	this.grid = CreateTileGlobalArray(this, h, w)
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

	this.movePlayer = function (toTile) {
		if (toTile != null && toTile != undefined) {
			if (toTile.onFoot != true) {
				drawInterfaceLogs("YOU CAN'T MOVE THERE!");
				return;
			}
			gPlayer.globalX = toTile.x;
			gPlayer.globalY = toTile.y;
		}
	}

	this.getTileAdjacent = function (fromTile, vector) {
		if (fromTile != null)
			return this.getTile(fromTile.x + vector[0], fromTile.y + vector[1]);
		return null
	}

	return this;
};

var TileGlobal = function (map, x, y) {
	this.x = x;
	this.y = y;
	this.parent = map;

	this.onFoot = new Boolean(true);
	this.onSail = new Boolean(false);
	this.onFlight = new Boolean(true);
	this.submapSeed = null;

	this.town = null;
}


var Town = function (tile, name) {
	tile.town = this;

	this.name = name;
	this.items = [];

	this.addItems = function (newItems) {
		this.items = this.items.concat(newItems);
		return this
	}
	this.removeItems = function (targetItems) {
		var itemsOnFloor = this.items;
		targetItems.forEach(function (item) {
			var i = itemsOnFloor.indexOf(item)
			if (i > -1) {
				itemsOnFloor.splice(i, 1)
			}
		})
		this.items = itemsOnFloor.filter(function (el) {
			return el != null;
		});
		return this
	}
}