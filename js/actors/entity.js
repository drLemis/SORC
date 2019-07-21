'use strict';

var Entity = function (name) {
	this.name = name;
	this.race = "";
	this.class = "";

	this.localX = 0;
	this.localY = 0;

	this.globalX = 0;
	this.globalY = 0;

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

		var log = this.name + " ATTACKS " + entity.name + "! " + patk + "->" + parm + "/" + matk + "->" + marm

		if (damage > 0)
			log += ", " + damage + " DAMAGE!";

		drawInterfaceLogs(log);

		entity.stats.setHealthDelta(-damage);

		if (entity.stats.health.CURRENT <= 0) {
			this.stats.addXP(entity.stats.xp.CURRENT);
			this.inventory.gold += entity.inventory.gold;
		}
	}
}

function readEntityFromDatabase(enemy) {
	var dbEntry = gDatabaseEnemies.getEntry(enemy);
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

		if (dbEntry.inventory) {
			if (dbEntry.inventory.gold)
				entity.inventory.gold = varFromArray(dbEntry.inventory.gold);
			if (dbEntry.inventory.food)
				entity.inventory.food = varFromArray(dbEntry.inventory.food);

			if (dbEntry.inventory.equipped) {
				dbEntry.inventory.equipped.forEach(dbItem => {
					if (!dbItem.chance || Math.random() <= dbItem.chance) {
						if (Array.isArray(dbItem) && dbItem.length > 1)
							entity.inventory.bag.push(itemGenerate(dbItem.type[0], dbItem.type[1]));
						else if (Array.isArray(dbItem) && dbItem.length == 1)
							entity.inventory.bag.push(itemGenerate(dbItem.type[0]));
						else
							entity.inventory.bag.push(itemGenerate(dbItem.type));

						if (dbItem.stats) {
							Object.keys(dbItem.stats).forEach(dbStat => {
								entity.inventory.bag[entity.inventory.bag.length - 1].stats[dbStat] = varFromArray(dbItem.stats[dbStat]);
							});
						}
						entity.inventory.itemEquip(entity.inventory.bag[entity.inventory.bag.length - 1]);
					}
				});
			}

			if (dbEntry.inventory.bag) {
				dbEntry.inventory.bag.forEach(dbItem => {
					if (!dbItem.chance || Math.random() <= dbItem.chance) {
						if (Array.isArray(dbItem) && dbItem.length > 1)
							entity.inventory.bag.push(itemGenerate(dbItem.type[0], dbItem.type[1]));
						else if (Array.isArray(dbItem) && dbItem.length == 1)
							entity.inventory.bag.push(itemGenerate(dbItem.type[0]));
						else
							entity.inventory.bag.push(itemGenerate(dbItem.type));

						if (dbItem.stats) {
							Object.keys(dbItem.stats).forEach(dbStat => {
								entity.inventory.bag[entity.inventorry.bag.length - 1].stats[dbStat] = varFromArray(dbItem.stats[dbStat]);
							});
						}
					}
				});
			}
		}
		return entity;
	} else {
		return null;
	}
}