//helper function
function CreateTileLocalArray(map, h, w) {
	arr = new Array(h)
	for (var i = 0; i < h; i++) {
		arr[i] = new Array(w)
		for (var j = 0; j < w; j++) {
			arr[i][j] = new TileLocal(map, i, j)
		}
	}
	return arr
}

function MapLocalFromArray(array) {
	map = new MapLocal(array.length, array[0].length)

	for (curX = 0; curX < array[0].length; curX++) {
		for (curY = 0; curY < array.length; curY++) {
			if (array[curY][curX] == 1)
				map.getTile(curX, curY).setPass(false);
		}
	}
	return map
}

var MapLocal = function (w, h) {
	this.grid = CreateTileLocalArray(this, h, w)
	this.height = h
	this.width = w

	this.seed = 0;

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

	this.wipe = function () {
		this.grid.forEach(function (row) {
			row.forEach(function (tile) {
				tile.clearTile()
			})
		})
		return this
	}

	this.moveCreature = function (fromTile, toTile) {
		if (fromTile != toTile) {
			if (toTile.creature != null) {
				if (fromTile.creature == gPlayer) {
					gPlayer.attackMain(toTile.creature);
					if (toTile.creature)
						toTile.creature.attackMain(gPlayer);
				}
				return;
			}
			if (toTile.passable != true) {
				drawInterfaceLogs("YOU CAN'T MOVE THERE!");
				return;
			}
			toTile.setCreature(fromTile.getCreature());
			fromTile.removeCreature();
			return this;
		}
	}

	this.getTileAdjacent = function (fromTile, vector) {
		return this.getTile(fromTile.x + vector[0], fromTile.y + vector[1]);
	}
	return this;
};

var TileLocal = function (map, x, y) {
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
	this.wipeItems = function () {
		this.items.length = 0
	}

	this.setCreature = function (newCreature) {
        console.log("TCL: this.setCreature -> newCreature", newCreature)
		this.creature = newCreature;
		this.creature.localX = this.x;
		this.creature.localY = this.y;
		return this
	}
	this.removeCreature = function () {
		this.creature = null;
		return this
	}
}

var seedToMapLocal = function (seed) {
	// generating mapLocal
	var mapLocal = MapLocalFromArray(GenerateDungeon(seed));

	var twister = new MersenneTwister(seed);

	for (let index = 0; index < Math.floor(twister.random() * 20 + 1); index++) {
		var enemy = new Entity("ENEMY");
		var x = Math.floor(twister.random() * mapLocal.width);
		var y = Math.floor(twister.random() * mapLocal.height);

		while (mapLocal.getTile(x, y) && (mapLocal.getTile(x, y).getPass() != true || mapLocal.getTile(x, y).creature != null)) {
			x = Math.floor(twister.random() * mapLocal.width);
			y = Math.floor(twister.random() * mapLocal.height);
		}

		tile = mapLocal.getTile(x, y);
		tile.setCreature(enemy);

		item = itemGenerate("sword");
		enemy.inventory.bag.push(item);
		enemy.inventory.itemEquip(item);
		item = itemGenerate("armor");
		enemy.inventory.bag.push(item);
		enemy.inventory.itemEquip(item);
		item = itemGenerate("helmet");
		enemy.inventory.bag.push(item);
		enemy.inventory.itemEquip(item);
		item = new Item(getRandomItemName(), "");
		enemy.inventory.bag.push(item);
		item = new Item(getRandomItemName(), "");
		enemy.inventory.bag.push(item);
		item = new Item(getRandomItemName(), "");
		enemy.inventory.bag.push(item);
	}

	var x = Math.floor(twister.random() * mapLocal.width);
	var y = Math.floor(twister.random() * mapLocal.height);

	while (mapLocal.getTile(x, y) && (mapLocal.getTile(x, y).getPass() != true || mapLocal.getTile(x, y).creature != null)) {
		x = Math.floor(twister.random() * mapLocal.width);
		y = Math.floor(twister.random() * mapLocal.height);
	}

	mapLocal.getTile(x, y).setCreature(gPlayer);
	return mapLocal;
}