/* jshint esversion: 6 */

const DatabaseEnemies = function () {
	this.getEntry = function getEntry(entry) {
		return this.database[entry.toLowerCase()];
	};

	this.database = {
		"rat": {
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