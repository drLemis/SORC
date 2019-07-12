//helper cucktion
function CreateTileArray(map, h, w) {
	arr = new Array(h)
	for (var i = 0; i < h; i++) {
		arr[i] = new Array(w)
		for (var j = 0; j < w; j++) {
			arr[i][j] = new Tile(map, i, j)
		}
	}
	return arr
}


var Submap = function (w, h) {

	this.grid = CreateTileArray(this, h, w)
	this.height = h
	this.width = w

	this.getTile = function (x, y) {
		if (x >= 0 && x < h && y >= 0 && y < w) return this.grid[x][y];
		else console.log("Out of bounds error for tile (%i, %i)", x, y)
	}
	this.setTile = function (newTile, x, y) {
		newTile.x = x
		newTile.y = y
		newTile.parent = this
		this.grid[x][y] = newTile
		return this
	}
	this.wipe = function () {
		this.grid.forEach(function (row) {

			row.forEach(function (tile) {
				tile.clearTile()
			})

		})
		return this
	}
	this.moveCreature = function (fromTile, toTile) {
		if (fromTile.parent != this || toTile.parent != this) {
			console.log("Failed map-based move: tiles don't belong to map!")
			return
		}
		if (toTile.creature !== null) {
			console.log("Failed map-based move: target is occupied!")
			return
		}
		if (!toTile.passable) {
			console.log("Failed map-based move: target is impassible!")
			return
		}
		toTile.setCreature(fromTile.getCreature)
		fromTile.removeCreature
		return this
	}
	return this;
};

var Tile = function (map, x, y) {
	this.x = x;
	this.y = y;
	this.parent = map;

	this.passable = new Boolean(true);
	this.objects = [];
	this.items = [];
	this.creature = null;

	this.getPass = function () {
		return this.passable
	}
	this.getObjects = function () {
		return this.objects
	}
	this.getItems = function () {
		return this.items
	}
	this.getCreature = function () {
		return this.creature
	}

	this.setPass = function (state) {
		this.passable = state;
		return this
	}
	this.setObjects = function (newObjects) {
		this.objects = newObjects;
		return this
	}
	this.addObjects = function (newObjects) {
		this.objects.concat(newObjects);
		return this
	}
	this.removeObjects = function (targetObjects) {
		targetObjects.forEach(function (item) {
			var i = this.objects.indexOf(item)
			if (i > -1) {
				this.objects.splice(i, 1)
			}
		})
		return this
	}
	this.wipeObjects = function () {
		this.objects.length = 0;
		return this
	}

	this.setItems = function (newItems) {
		this.items = newItems;
		return this
	}
	this.addItems = function (newItems) {
		this.items.concat(newItems);
		return this
	}
	this.removeItems = function (targetItems) {
		targetItems.forEach(function (item) {
			var i = this.items.indexOf(item)
			if (i > -1) {
				this.items.splice(i, 1)
			}
		})
		return this
	}
	this.wipeItems = function () {
		this.items.length = 0
	}

	this.setCreature = function (newCreature) {
		this.creature = newCreature;
		this.creature.subX = this.x;
		this.creature.subY = this.y;
		return this
	}
	this.removeCreature = function () {
		this.creature = null;
		return this
	}
	this.moveCreature = function (target) {
		if (this.parent != target.parent) {
			console.log("Failed tile-based move: tiles belong to different maps!")
			return
		}
		if (target.creature !== null) {
			console.log("Failed tile-based move: target tile is occupied!")
			return
		}
		if (!target.passable) {
			console("Failed tile-based move: target is impassible!")
			return
		}
		target.setCreature(this.getCreature)
		this.removeCreature
		return this
	}
}