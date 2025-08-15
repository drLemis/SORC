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
		var result = map[1][0];

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
			"aiType": "random",
			"moveChance": 0.3,
			"visionRange": 1,
			"followPlayer": false,
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
		"bat": {
			"difficulty": 2,
			"name": "BAT",
			"aiType": "random",
			"moveChance": 0.5,
			"visionRange": 2,
			"followPlayer": false,
			"stats": {
				"health": [4, 10],
				"xp": [8, 30],
				"attributes": { "AGIL": [2, 4] }
			},
			"inventory": {
				"gold": [0, 5],
				"equipped": [{ "type": "natural", "stats": { "patk": [1, 2] } }]
			}
		},
		"spider": {
			"difficulty": 3,
			"name": "SPIDER",
			"aiType": "random",
			"moveChance": 0.4,
			"visionRange": 2,
			"followPlayer": false,
			"stats": {
				"health": [8, 18],
				"xp": [15, 40],
				"attributes": { "AGIL": [1, 3], "LUCK": [1, 2] }
			},
			"inventory": {
				"gold": [2, 10],
				"equipped": [{ "type": "natural", "stats": { "patk": [2, 3], "mdmg": [1, 2] } }]
			}
		},
		"goblin": {
			"difficulty": 4,
			"name": "GOBLIN",
			"aiType": "aggressive",
			"moveChance": 0.6,
			"visionRange": 3,
			"followPlayer": true,
			"stats": {
				"health": [12, 22],
				"xp": [20, 60],
				"attributes": { "STNG": [2, 4], "LUCK": [1, 2] }
			},
			"inventory": {
				"gold": [5, 30],
				"equipped": [
					{ "type": "sword", "patk": [1, 2], "chance": 0.7 },
					{ "type": "armor", "parm": [1, 2], "chance": 0.5 }
				]
			}
		},
		"skeleton": {
			"difficulty": 6,
			"name": "SKELETON",
			"aiType": "aggressive",
			"moveChance": 0.7,
			"visionRange": 4,
			"followPlayer": true,
			"stats": {
				"health": [18, 28],
				"xp": [30, 80],
				"attributes": { "STNG": [3, 5] }
			},
			"inventory": {
				"gold": [10, 40],
				"equipped": [
					{ "type": "sword", "patk": [2, 3], "chance": 0.7 },
					{ "type": "armor", "parm": [2, 3], "chance": 0.5 }
				],
				"bag": [
					{ "type": "ring", "cost": [10, 50], "chance": 0.2 }
				]
			}
		},
		"orc": {
			"difficulty": 8,
			"name": "ORC",
			"aiType": "aggressive",
			"moveChance": 0.7,
			"visionRange": 4,
			"followPlayer": true,
			"stats": {
				"health": [25, 40],
				"xp": [50, 120],
				"attributes": { "STNG": [4, 7] }
			},
			"inventory": {
				"gold": [20, 80],
				"equipped": [
					{ "type": "axe", "patk": [3, 5], "chance": 0.8 },
					{ "type": "armor", "parm": [3, 5], "chance": 0.7 }
				],
				"bag": [
					{ "type": "amulet", "cost": [20, 80], "chance": 0.15 }
				]
			}
		},
		"troll": {
			"difficulty": 12,
			"name": "TROLL",
			"aiType": "aggressive",
			"moveChance": 0.6,
			"visionRange": 3,
			"followPlayer": true,
			"stats": {
				"health": [40, 70],
				"xp": [100, 200],
				"attributes": { "STNG": [6, 10] }
			},
			"inventory": {
				"gold": [40, 120],
				"equipped": [
					{ "type": "club", "patk": [4, 7], "chance": 0.8 },
					{ "type": "armor", "parm": [4, 7], "chance": 0.7 }
				],
				"bag": [
					{ "type": "ring", "cost": [30, 100], "chance": 0.2 }
				]
			}
		},
		"wraith": {
			"difficulty": 15,
			"name": "WRAITH",
			"aiType": "aggressive",
			"moveChance": 0.8,
			"visionRange": 6,
			"followPlayer": true,
			"stats": {
				"health": [30, 60],
				"xp": [120, 250],
				"attributes": { "LUCK": [5, 10], "AGIL": [5, 10] }
			},
			"inventory": {
				"gold": [60, 150],
				"equipped": [
					{ "type": "natural", "mdmg": [8, 15], "chance": 1.0 }
				],
				"bag": [
					{ "type": "amulet", "cost": [50, 150], "chance": 0.3 }
				]
			}
		},
		"minotaur": {
			"difficulty": 18,
			"name": "MINOTAUR",
			"aiType": "aggressive",
			"moveChance": 0.7,
			"visionRange": 5,
			"followPlayer": true,
			"stats": {
				"health": [80, 120],
				"xp": [200, 400],
				"attributes": { "STNG": [10, 15], "AGIL": [3, 6] }
			},
			"inventory": {
				"gold": [100, 300],
				"equipped": [
					{ "type": "axe", "patk": [7, 12], "chance": 1.0 },
					{ "type": "armor", "parm": [6, 10], "chance": 0.8 }
				],
				"bag": [
					{ "type": "amulet", "cost": [80, 200], "chance": 0.3 }
				]
			}
		},
		"dragon": {
			"difficulty": 25,
			"name": "DRAGON",
			"aiType": "boss",
			"moveChance": 0.9,
			"visionRange": 8,
			"followPlayer": true,
			"stats": {
				"health": [200, 300],
				"xp": [1000, 2000],
				"attributes": { "STNG": [20, 30], "LUCK": [10, 20], "AGIL": [10, 20] }
			},
			"inventory": {
				"gold": [1000, 3000],
				"equipped": [
					{ "type": "natural", "patk": [20, 30], "mdmg": [20, 30], "chance": 1.0 }
				],
				"bag": [
					{ "type": "amulet", "cost": [200, 500], "chance": 0.5 },
					{ "type": "ring", "cost": [100, 300], "chance": 0.5 }
				]
			}
		},
		"jabberwocky": {
			"difficulty": 30,
			"name": "JABBERWOCKY",
			"aiType": "boss",
			"moveChance": 0.9,
			"visionRange": 8,
			"followPlayer": true,
			"stats": {
				"health": [300, 350],
				"xp": [5000, 6000]
			},
			"inventory": {
				"gold": [10000, 15000],
				"equipped": [{
					"type": "natural",
					"stats": {
						"patk": [30, 40],
						"pdmg": [40, 50],
					}
				}]
			}
		}
	}
};

const gDatabaseEnemies = new DatabaseEnemies();