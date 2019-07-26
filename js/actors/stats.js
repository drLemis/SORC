'use strict';

var Stats = function (parent) {
	this.parent = parent;
	this.xp = {
		CURRENT: 0,
		ALL: 0
	};

	this.health = {
		CURRENT: 50,
		MIN: 0,
		MAX: 50
	};
	this.mana = {
		CURRENT: 50,
		MIN: 0,
		MAX: 50
	};
	this.attributes = {
		STNG: 1,
		AGIL: 1,
		LUCK: 1,
	};

	this.toJSON = () => 
		[
		['xp', [this.xp.CURRENT, this.xp.ALL]],
		['health', [this.health.CURRENT, this.health.MIN, this.health.MAX]],
		['mana',[this.mana.CURRENT, this.mana.MIN, this.mana.MAX]],
		['attributes', [this.attributes.STNG, this.attributes.AGIL, this.attributes.LUCK]]
		]
		
	
	
	
	this.fromJSON = function(data){
		data = new Map(data)
		this.xp = {
			CURRENT: data['xp'][0],
			ALL: data['xp'][1]
		};
		this.health = {
			CURRENT: data['health'][0],
			MIN: data['health'][1],
			MAX: data['health'][2]
		};
		this.mana = {
			CURRENT: data['mana'][0],
			MIN: data['mana'][1],
			MAX: data['mana'][2]
		};
		this.attributes = {
			STNG: data['attributes'][0],
			AGIL: data['attributes'][1],
			LUCK: data['attributes'][2]
		};
		return this;
	}
	
	this.getStat = function (statName) {
		var result = this.attributes[statName];

		var statMod = this.parent.inventory.getSlotsAllMod(statName);
		if (statMod > 0)
			result += "+" + statMod;
		else if (statMod < 0)
			result += +statMod;

		return setPadding(result, 2, 2, "+");
	};

	this.setHealth = function (newStat) {
		this.health.CURRENT = Math.min(Math.max(this.health.MIN, newStat), this.health.MAX);

		if (this.health.CURRENT <= 0 && this.parent != gPlayer) {
			getCurrentLocalTile(this.parent).removeCreature();

			this.parent.inventory.itemUnequipFromSlot("HEAD");
			this.parent.inventory.itemUnequipFromSlot("NECK");
			this.parent.inventory.itemUnequipFromSlot("BODY");
			this.parent.inventory.itemUnequipFromSlot("HAND");
			this.parent.inventory.itemUnequipFromSlot("LEGS");
			this.parent.inventory.itemUnequipFromSlot("MAIN");
			this.parent.inventory.itemUnequipFromSlot("DIST");
			this.parent.inventory.itemUnequipFromSlot("AMMO");

			this.parent.inventory.itemsDropAll();

			drawInterfaceLogs([this.parent.name + " IS DEAD!", gColorsCGA.RED]);
		}
	};

	this.setHealthDelta = function (delta) {
		this.setHealth(this.health.CURRENT + delta);
	};

	this.getHealthAsString = function () {
		return setPadding(this.health["CURRENT"] + "/" + this.health["MAX"], 3, 3, "/");
	};

	this.setMana = function (newStat) {
		this.mana.CURRENT = Math.min(Math.max(this.mana.MIN, newStat), this.mana.MAX);
	};

	this.getManaAsString = function () {
		return setPadding(this.mana["CURRENT"] + "/" + this.mana["MAX"], 3, 3, "/");
	};

	this.getXP = function () {
		return this.xp.CURRENT;
	}

	this.addXP = function (delta) {
		this.xp.CURRENT += +delta;
		if (delta > 0)
			this.xp.ALL += +delta;
	}
}