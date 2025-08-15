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
	this.heading = 0;

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

	this.passable = true;
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

var seedToMapLocal = function (seed, difficulty = 0) {
	// generating mapLocal
	var mapLocal = MapLocalFromArray(GenerateDungeon(seed));

	var twister = new MersenneTwister(seed);
	mapLocal.heading = twister.genrand_int32() % 4;

	while (difficulty > 0) {
		var entry = gDatabaseEnemies.getClosestDifficulty(difficulty)
		var enemy = createEntityFromEntry(entry);

		if (Math.random() < 0.5) {
			entry = gDatabaseEnemies.getClosestDifficulty(entry.difficulty / 2)
			enemy = createEntityFromEntry(entry);
		}

		if (!enemy)
			break;

		difficulty -= entry.difficulty

		var x = Math.floor(Math.random() * mapLocal.width);
		var y = Math.floor(Math.random() * mapLocal.height);

		while (mapLocal.getTile(x, y) && (mapLocal.getTile(x, y).getPass() != true || mapLocal.getTile(x, y).creature != null)) {
			x = Math.floor(Math.random() * mapLocal.width);
			y = Math.floor(Math.random() * mapLocal.height);
		}

		mapLocal.getTile(x, y).setCreature(enemy);
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

function processEnemyTurn(mapLocal) {
	for (let x = 0; x < mapLocal.width; x++) {
		for (let y = 0; y < mapLocal.height; y++) {
			let tile = mapLocal.getTile(x, y);
			let enemy = tile.getCreature();
			if (enemy && enemy != gPlayer && enemy.moveChance && Math.random() < enemy.moveChance) {
				let dx = 0, dy = 0;
				let moved = false;

				// Check if adjacent to player
				let isAdjacent = false;
				for (let [adx, ady] of [[1,0],[-1,0],[0,1],[0,-1]]) {
					let tx = x + adx, ty = y + ady;
					if (mapLocal.getTile(tx, ty) && mapLocal.getTile(tx, ty).getCreature() === gPlayer) {
						isAdjacent = true;
						break;
					}
				}

				if (isAdjacent) {
					// Attack player
					enemy.attackMain(gPlayer);
					moved = true;
				}

				if (!moved && enemy.followPlayer && enemy.visionRange > 0 && canSeePlayer(mapLocal, x, y, enemy.visionRange)) {
					// Move toward player
					dx = Math.sign(gPlayer.localX - x);
					dy = Math.sign(gPlayer.localY - y);
					// Prefer horizontal or vertical movement randomly
					if (Math.abs(dx) > 0 && Math.abs(dy) > 0) {
						if (Math.random() < 0.5) dy = 0; else dx = 0;
					}
					let newTile = mapLocal.getTile(x+dx, y+dy);
					if (newTile && newTile.getPass() && !newTile.getCreature()) {
						newTile.setCreature(enemy);
						tile.removeCreature();
						moved = true;
					}
				}
				if (!moved && enemy.aiType === "random") {
					let dirs = [[1,0],[-1,0],[0,1],[0,-1]];
					let [rdx, rdy] = dirs[Math.floor(Math.random()*dirs.length)];
					let newTile = mapLocal.getTile(x+rdx, y+rdy);
					if (newTile && newTile.getPass() && !newTile.getCreature()) {
						newTile.setCreature(enemy);
						tile.removeCreature();
					}
				}
			}
		}
	}
}

function canSeePlayer(mapLocal, ex, ey, range) {
	let px = gPlayer.localX, py = gPlayer.localY;
	let dx = px - ex, dy = py - ey;
	if (Math.abs(dx) > range || Math.abs(dy) > range) return false;
	// Bresenham's line algorithm for line of sight
	let steps = Math.max(Math.abs(dx), Math.abs(dy));
	for (let i = 1; i <= steps; i++) {
		let tx = Math.round(ex + (dx * i) / steps);
		let ty = Math.round(ey + (dy * i) / steps);
		if ((tx !== px || ty !== py) && mapLocal.getTile(tx, ty) && mapLocal.getTile(tx, ty).getPass() !== true) {
			return false; // Wall blocks vision
		}
	}
	return true;
}