'use strict';

var Entity = function (name) {
	this.name = name;
	this.race = "";
	this.class = "";

	this.localX = 0;
	this.localY = 0;

	this.globalX = 0;
	this.globalY = 0;

	this.heading = 0;

	this.inventory = new Inventory(this);
	this.stats = new Stats(this);

	this.attackMain = function attackMain(entity) {
		var random = Math.floor(Math.random() * (20 + +this.stats.attributes.LUCK) + 1);

		var patk = random + +this.inventory.getSlotsAllMod("PATK") + +this.stats.attributes.STNG + +this.inventory.getSlotsAllMod("STNG");
		var matk = random + +this.inventory.getSlotsAllMod("MATK");

		var parm = entity.inventory.getSlotsAllMod("PARM") + +entity.stats.attributes.AGIL + +entity.inventory.getSlotsAllMod("AGIL");
		var marm = entity.inventory.getSlotsAllMod("MARM");

		var pdmg = this.inventory.getSlotsMod("PDMG") + +this.inventory.getStat("PDMG", "MAIN");
		var mdmg = this.inventory.getSlotsMod("MDMG") + +this.inventory.getStat("MDMG", "MAIN");
		var hand = this.stats.attributes.STNG + +this.inventory.getSlotsAllMod("STNG");

		if (pdmg < 0)
			pdmg = 0;
		if (mdmg < 0)
			pdmg = 0;
		if (hand < 0)
			hand = 0;

		var damage = 0;

		if (parm <= patk) {
			damage += pdmg;
			damage += hand;
		}

		if (marm <= matk)
			damage += mdmg;

		// Always round up damage
		damage = Math.ceil(damage);

		var log = this.name + " ATTACKS " + entity.name + "! " + patk + "->" + parm + "/" + matk + "->" + marm

		if (damage > 0)
			log += ", " + damage + " DAMAGE!";

		drawInterfaceLogs(log);

		entity.stats.setHealthDelta(-damage);

		if (entity.stats.health.CURRENT <= 0 && entity != gPlayer) {
			this.stats.addXP(+entity.stats.xp.CURRENT);
			this.inventory.gold += +entity.inventory.gold;
			entity.stats.xp = 0;
			entity.inventory.gold = 0;
		}
	}
	this.toJSON = () => [
			['name', this.name],
			['race', this.race],
			['class', this.class],
			['localX', this.localX],
			['localY', this.localY],
			['globalX', this.globalX],
			['globalY', this.globalY],
			['heading', this.heading],
			['inventory', this.inventory.toJSON()],
			['stats', this.stats.toJSON()]
		]
	
	this.fromJSON = function(data){
		data = newMap(data);
		this.name = data['name'];
		this.race = data['race'];
		this.class = data['class'];
		this.localX = data['localX'];
		this.localY = data['localY'];
		this.globalX = data['globalX'];
		this.globalY = data['globalY'];
		this.heading = data['heading'];
		this.inventory.fromJSON(data['inventory']);
		this.stats.fromJSON(data['stats']);
		return this;
	}
}

function readEntityFromDatabase(dbEntry) {
	return createEntityFromEntry(gDatabaseEnemies.getEntry(dbEntry));
}

function createEntityFromEntry(dbEntry) {
	if (dbEntry) {
		var entity = new Entity(dbEntry.name);

		entity.stats.health.MAX = entity.stats.health.CURRENT = varFromArray(dbEntry.stats.health);
		entity.stats.mana.MAX = entity.stats.mana.CURRENT = varFromArray(dbEntry.stats.mana);
		entity.stats.addXP(varFromArray(dbEntry.stats.xp));

		if (dbEntry.stats.attributes) {
			if (dbEntry.stats.attributes.STNG)
				entity.stats.attributes.STNG = varFromArray(dbEntry.stats.attributes.STNG);
			if (dbEntry.stats.attributes.AGIL)
				entity.stats.attributes.AGIL = varFromArray(dbEntry.stats.attributes.AGIL);
			if (dbEntry.stats.attributes.LUCK)
				entity.stats.attributes.LUCK = varFromArray(dbEntry.stats.attributes.LUCK);
		}

		// Determine loot multiplier based on difficulty
		var lootMult = 1;
		if (dbEntry.difficulty) lootMult = 1 + dbEntry.difficulty / 10;
		if (dbEntry.inventory) {
			if (dbEntry.inventory.gold)
				entity.inventory.gold = Math.ceil(varFromArray(dbEntry.inventory.gold));
			if (dbEntry.inventory.food)
				entity.inventory.food = Math.ceil(varFromArray(dbEntry.inventory.food));

			if (dbEntry.inventory.equipped) {
				dbEntry.inventory.equipped.forEach(dbItem => {
					if (!dbItem.chance || Math.random() <= dbItem.chance) {
						let item;
						if (Array.isArray(dbItem) && dbItem.length > 1)
							item = itemGenerate(dbItem.type[0], dbItem.type[1] * lootMult);
						else if (Array.isArray(dbItem) && dbItem.length == 1)
							item = itemGenerate(dbItem.type[0], lootMult);
						else if (typeof dbItem === 'object' && dbItem.type)
							item = itemGenerate(dbItem.type, lootMult);
						else
							item = itemGenerate(dbItem, lootMult);

						if (dbItem.stats) {
							Object.keys(dbItem.stats).forEach(dbStat => {
								item.stats[dbStat.toUpperCase()] = Math.ceil(varFromArray(dbItem.stats[dbStat]));
							});
						}
						entity.inventory.bag.push(item);
						entity.inventory.itemEquip(item);
					}
				});
			}

			if (dbEntry.inventory.bag) {
				dbEntry.inventory.bag.forEach(dbItem => {
					if (!dbItem.chance || Math.random() <= dbItem.chance) {
						let item;
						if (Array.isArray(dbItem) && dbItem.length > 1)
							item = itemGenerate(dbItem.type[0], dbItem.type[1] * lootMult);
						else if (Array.isArray(dbItem) && dbItem.length == 1)
							item = itemGenerate(dbItem.type[0], lootMult);
						else if (typeof dbItem === 'object' && dbItem.type)
							item = itemGenerate(dbItem.type, lootMult);
						else
							item = itemGenerate(dbItem, lootMult);

						if (dbItem.stats) {
							Object.keys(dbItem.stats).forEach(dbStat => {
								item.stats[dbStat.toUpperCase()] = Math.ceil(varFromArray(dbItem.stats[dbStat]));
							});
						}
						entity.inventory.bag.push(item);
					}
				});
			}
		}

		if (dbEntry.aiType) entity.aiType = dbEntry.aiType;
		if (dbEntry.moveChance) entity.moveChance = dbEntry.moveChance;
		if (dbEntry.visionRange) entity.visionRange = dbEntry.visionRange;
		if (dbEntry.followPlayer !== undefined) entity.followPlayer = dbEntry.followPlayer;

		return entity;
	} else {
		return null;
	}
}