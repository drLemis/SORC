/* jshint esversion: 6 */

const DatabaseEnemies = function () {
	this.getEntry = function getEntry(entry) {
		return this.database[entry.toLowerCase()];
	};

	this.getDifficultyMap = function getDifficultyMap() {
		var map = [];
		Object.keys(this.database).forEach(entity => {
			if (map[this.database[entity].difficulty])
				map[this.database[entity].difficulty].push(this.database[entity]);
			else
				map[this.database[entity].difficulty] = [this.database[entity]];
		});

		return map;
	};

	this.getClosestDifficulty = function getClosestDifficulty(difficulty, fromTop = false) {
		var map = this.getDifficultyMap();
		var result = {
			"difficulty": 0
		};

		if (fromTop) {
			for (let element of map) {
				if (element) {
					for (let entry of element) {
						if (entry && entry.difficulty > difficulty) {
							result = entry;
							break;
						}
					}
				};
			}
		} else {
			for (let element of map) {
				if (element) {
					for (let entry of element) {
						if (entry && entry.difficulty > difficulty)
							break;

						if (entry && entry.difficulty > result.difficulty && entry.difficulty <= difficulty)
							result = entry;
					}
				}
			};
		}
		return result;
	};

	this.database = {
		"rat": {
			"difficulty": 1,
			"name": "RAT",
			"stats": {
				"health": [5, 15],
				"xp": [10, 50]
			},
			"inventory": {
				"gold": [1, 20],
				"equipped": [{
					"type": "natural",
					"stats": {
						"patk": [1, 2]
					}
				}]
			}
		},
		"zombie": {
			"difficulty": 5,
			"name": "ZOMBIE",
			"stats": {
				"xp": [30, 100],
				"health": [10, 30],
				"attributes": {
					"STNG": [2, 4]
				}
			},
			"inventory": {
				"gold": [10, 100],
				"equipped": [{
						"type": "natural",
						"patk": [2, 3]
					},
					{
						"type": "sword",
						"patk": [1, 2],
						"chance": 0.5
					},
					{
						"type": "armor",
						"parm": [1, 2],
						"chance": 0.5
					}
				],
				"bag": [{
					"type": "neck",
					"cost": [10, 50],
					"chance": 0.2
				}]
			}
		}
	}
};

const gDatabaseEnemies = new DatabaseEnemies();