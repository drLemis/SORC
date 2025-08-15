'use strict';

var Item = function (name, slot, canDrop = true) {
	this.name = name.toUpperCase().trim();
	this.shortname = this.name;

	this.canDrop = canDrop;

	if (name.length > 12) {
		this.shortname = this.name.replace(/[aeiouy]/gi, '');

		if (this.shortname.length > 12) {
			if (name.split(" ")[0].length <= 12)
				this.shortname = this.name.split(" ")[0];
			else if (name.split(" ")[0].replace(/[aeiouy ]/gi, '').length <= 12)
				this.shortname = this.name.split(" ")[0].replace(/[aeiouy ]/gi, '');
		}
	}

	this.weight = Math.ceil(Math.random() * 10);

	this.toJSON = () => [
	['name',this.name],
	['canDrop', this.canDrop],
	['slot', this.slot],
	['master', this.master],
	['weight', this.weight],
	['stats', this.stats]
	];
		

	
	this.getStatsAsString = function () {
		var result = ""
		Object.keys(this.stats).forEach(stat => {
			if (this.stats[stat] != "" && this.stats[stat] != null && this.stats[stat] != 0) {
				result += " " + stat + ":";
				if (this.stats[stat] > 0)
					result += "+"
				result += this.stats[stat]
			}
		});

		return result;
	}

	this.getStatsShortAsString = function () {
		var result = ""
		Object.keys(this.stats).forEach(stat => {
			if (this.stats[stat] != "" && this.stats[stat] != null && this.stats[stat] != 0) {
				result += " " + stat.substr(0, 2);
				if (this.stats[stat] > 0)
					result += "+"
				result += this.stats[stat]
			}
		});
		return result;
	}

	this.master = "";

	this.slot = slot;

	this.stats = {
		HP: 0, // + health.max
		MP: 0, // + mana.max
		STNG: 0, // + strength
		AGIL: 0, // + agility
		LUCK: 0, // + luck
		PDMG: 0, // physical damage
		MDMG: 0, // magical damage
		PATK: 0, // physical attack
		MATK: 0, // magical attack
		PARM: 0, // physical armor
		MARM: 0, // magical armor
		COST: 10 // default cost for shop
	};
}

function createItemFromJSON(data){
	data = new Map(data)
	var item = new Item(data['name'], data['slot'], data['canDrop']);
	item.master = data['master'];
	item.stats = data['stats'];
	item.weight = data['weight'];
	return item;
}

// Expanded item name and stat pools
const ITEM_NAMES = {
	weapon: [
		"IRON SWORD", "STEEL AXE", "BRONZE MACE", "COPPER DAGGER", "SILVER SABER", "GOLDEN CLAYMORE", "OBSIDIAN SCIMITAR", "CRYSTAL RAPIER", "OAK CLUB", "IVORY FLAIL", "ONYX MORNING STAR", "LEAD WARHAMMER", "ASH SPEAR", "PEARL TRIDENT", "JADE HALBERD", "BONE PIKE", "RUBY FALCHION", "SAPPHIRE KATANA", "EMERALD CUTLASS", "TOPAZ BROADSWORD", "QUARTZ ESTOC", "AMBER GLADIUS", "MAPLE LONGSWORD", "EBONY SHORTSWORD", "STEEL BATTLEAXE", "IRON GREATAXE", "STONE MAUL", "COPPER SICKLE", "BONE SCYTHE", "LEATHER WHIP", "WILLOW STAFF", "BRASS CROWBILL", "IVORY BARDICHE", "BRONZE BILLHOOK", "ONYX BLADE", "GOLDEN EDGE", "SILVER EDGE", "CRYSTAL EDGE", "JADE EDGE", "BONE EDGE", "RUBY EDGE", "SAPPHIRE EDGE", "EMERALD EDGE", "TOPAZ EDGE", "QUARTZ EDGE", "AMBER EDGE", "MAPLE EDGE", "EBONY EDGE"
	],
	armor: [
		"IRON ARMOR", "STEEL MAIL", "BRONZE PLATE", "COPPER COAT", "SILVER BRIGANDINE", "GOLDEN BREASTPLATE", "OBSIDIAN ROBE", "CRYSTAL TUNIC", "OAK GAMBESON", "IVORY CUIRASS", "ONYX CLOAK", "LEAD JACKET", "ASH VEST", "PEARL JERKIN", "JADE SURCOAT", "BONE HAUBERK", "RUBY VEST", "SAPPHIRE COAT", "EMERALD ARMOR", "TOPAZ MAIL", "QUARTZ PLATE", "AMBER ROBE", "MAPLE TUNIC", "EBONY GAMBESON"
	],
	helmet: [
		"IRON HELM", "STEEL HELM", "BRONZE CAP", "COPPER HOOD", "SILVER CROWN", "GOLDEN MASK", "OBSIDIAN VISOR", "CRYSTAL COIF", "OAK HAT", "IVORY BANDANA", "ONYX HELM", "LEAD HOOD", "ASH CAP", "PEARL CROWN", "JADE MASK", "BONE VISOR", "RUBY COIF", "SAPPHIRE HAT", "EMERALD BANDANA", "TOPAZ HELM", "QUARTZ HOOD", "AMBER CAP", "MAPLE CROWN", "EBONY MASK"
	],
	bow: [
		"OAK BOW", "IVORY LONGBOW", "ONYX SHORTBOW", "LEAD CROSSBOW", "ASH RECURVE", "PEARL COMPOSITE", "JADE SLING", "BONE HUNTING BOW", "RUBY WAR BOW", "SAPPHIRE ELVEN BOW", "EMERALD BOW", "TOPAZ BOW", "QUARTZ BOW", "AMBER BOW", "MAPLE BOW", "EBONY BOW"
	],
	amulet: [
		"ONYX AMULET", "SILVER AMULET", "GOLDEN AMULET", "MYSTIC AMULET", "ANCIENT AMULET", "DRAGON AMULET", "PHOENIX AMULET", "SHADOW AMULET", "SUN AMULET", "MOON AMULET", "STARS AMULET", "IMMORTAL AMULET", "CURSED AMULET", "ENIGMA AMULET", "VOID AMULET", "EMBER AMULET", "FROST AMULET", "THUNDER AMULET", "BLOOD AMULET", "BONE AMULET"
	],
	ring: [
		"ONYX RING", "SILVER RING", "GOLDEN RING", "MYSTIC RING", "ANCIENT RING", "DRAGON RING", "PHOENIX RING", "SHADOW RING", "SUN RING", "MOON RING", "STARS RING", "IMMORTAL RING", "CURSED RING", "ENIGMA RING", "VOID RING", "EMBER RING", "FROST RING", "THUNDER RING", "BLOOD RING", "BONE RING"
	],
	consumable: [
		"ELIXIR", "TONIC", "DRAUGHT", "DROUGHT", "ESSENCE", "DUST", "POWDER", "TEA", "BREW", "INFUSION", "SYRUP", "NECTAR", "AMBER VIAL", "CRIMSON VIAL", "EMERALD VIAL", "AZURE VIAL", "ONYX VIAL", "GOLDEN VIAL", "MYSTIC VIAL", "ANCIENT VIAL", "VOID VIAL", "EMBER VIAL", "FROST VIAL", "THUNDER VIAL", "BLOOD VIAL", "BONE VIAL"
	]
};

function getRandomItemName(type = "weapon") {
	const pool = ITEM_NAMES[type] || ITEM_NAMES.weapon;
	return pool[Math.floor(Math.random() * pool.length)];
}

function calculateItemCost(item) {
	let base = 5;
	let multiplier = 7;
	let sum = 0;
	for (let stat in item.stats) {
		if (stat === "COST") continue;
		if (typeof item.stats[stat] === "number" && item.stats[stat] > 0) sum += Math.ceil(item.stats[stat]);
	}
	return base + multiplier * sum;
}

function itemGenerate(type = "sword", mult = 1) {
	var item;
	switch (type) {
		case "armor":
			item = new Item(getRandomItemName("armor"), "BODY");
			item.stats["STNG"] = Math.ceil(getRandomInt(0, 2) * mult);
			item.stats["PARM"] = Math.ceil(getRandomInt(2, 12) * mult);
			item.stats["MARM"] = Math.ceil(getRandomInt(1, 5) * mult);
			break;
		case "helmet":
			item = new Item(getRandomItemName("helmet"), "HEAD");
			item.stats["PARM"] = Math.ceil(getRandomInt(1, 6) * mult);
			item.stats["MARM"] = Math.ceil(getRandomInt(0, 3) * mult);
			item.stats["LUCK"] = Math.ceil(getRandomInt(0, 2) * mult);
			break;
		case "bow":
			item = new Item(getRandomItemName("bow"), "DIST");
			item.stats["AGIL"] = Math.ceil(getRandomInt(1, 3) * mult);
			item.stats["PATK"] = Math.ceil(getRandomInt(1, 5) * mult);
			item.stats["MATK"] = Math.ceil(getRandomInt(0, 3) * mult);
			item.stats["PDMG"] = Math.ceil(getRandomInt(2, 6) * mult);
			item.stats["MDMG"] = Math.ceil(getRandomInt(0, 3) * mult);
			break;
		case "amulet":
			item = new Item(getRandomItemName("amulet"), "NECK");
			item.stats["HP"] = Math.ceil(getRandomInt(0, 20) * mult);
			item.stats["MP"] = Math.ceil(getRandomInt(0, 20) * mult);
			item.stats["LUCK"] = Math.ceil(getRandomInt(0, 3) * mult);
			break;
		case "ring":
			item = new Item(getRandomItemName("ring"), "HAND");
			item.stats["STNG"] = Math.ceil(getRandomInt(0, 2) * mult);
			item.stats["AGIL"] = Math.ceil(getRandomInt(0, 2) * mult);
			item.stats["LUCK"] = Math.ceil(getRandomInt(0, 2) * mult);
			break;
		case "consumable":
			item = new Item(getRandomItemName("consumable"), "");
			item.stats["HP"] = Math.ceil(getRandomInt(0, 30) * mult);
			item.stats["MP"] = Math.ceil(getRandomInt(0, 30) * mult);
			break;
		case "natural":
			item = new Item("CLAWS", "MAIN", false);
			item.stats["PATK"] = Math.ceil(getRandomInt(0, 3) * mult);
			item.stats["PDMG"] = Math.ceil(getRandomInt(1, 3) * mult);
			item.stats["COST"] = 0;
			return item;
		default:
			item = new Item(getRandomItemName("weapon"), "MAIN");
			item.stats["STNG"] = Math.ceil(getRandomInt(1, 3) * mult);
			item.stats["PATK"] = Math.ceil(getRandomInt(1, 5) * mult);
			item.stats["MATK"] = Math.ceil(getRandomInt(0, 3) * mult);
			item.stats["PDMG"] = Math.ceil(getRandomInt(2, 6) * mult);
			item.stats["MDMG"] = Math.ceil(getRandomInt(0, 3) * mult);
			break;
	}
	// Ensure all stats are rounded up
	Object.keys(item.stats).forEach(stat => {
		if (typeof item.stats[stat] === "number") item.stats[stat] = Math.ceil(item.stats[stat]);
	});
	item.stats["COST"] = calculateItemCost(item);
	return item;
}