'use strict';

var Item = function (name, slot) {
    this.name = name.toUpperCase().trim();
    this.shortname = this.name;

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

    // just in case
    this.slotToColor = function () {
        if (this.slot) {
            var keys = Object.keys(gPlayer.inventory.slots);
            for (let index = 0; index < keys.length; index++) {
                if (slot == keys[index] || index > 14)
                    return gColorsCGA[index];
            }
        }
        return colorsCGA[15];
    }

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
    };
}

function itemGenerate(type = "sword") {
    var item;

    switch (type) {
        case "armor":
            item = new Item(getRandomItemName(), "BODY");
            item.stats["STNG"] = getRandomInt(0, 1);
            item.stats["PARM"] = getRandomInt(1, 10);
            item.stats["MARM"] = getRandomInt(1, 3);
            break;
        case "helmet":
            item = new Item(getRandomItemName(), "HEAD");
            item.stats["PARM"] = getRandomInt(0, 3);
            item.stats["MARM"] = getRandomInt(0, 2);
            break;
        case "bow":
            item = new Item(getRandomItemName(), "DIST");
            item.stats["AGIL"] = getRandomInt(0, 1);
            item.stats["PATK"] = getRandomInt(0, 3);
            item.stats["MATK"] = getRandomInt(0, 2);
            item.stats["PDMG"] = getRandomInt(1, 3);
            item.stats["MDMG"] = getRandomInt(0, 2);
            break;
        case "ammo":
            item = new Item(getRandomItemName(), "AMMO");
            item.stats["PATK"] = getRandomInt(0, 3);
            item.stats["MATK"] = getRandomInt(0, 2);
            item.stats["PDMG"] = getRandomInt(1, 3);
            item.stats["MDMG"] = getRandomInt(0, 2);
            break;
        default:
            item = new Item(getRandomItemName(), "MAIN");
            item.stats["STNG"] = getRandomInt(1, 2);
            item.stats["PATK"] = getRandomInt(0, 3);
            item.stats["MATK"] = getRandomInt(0, 2);
            item.stats["PDMG"] = getRandomInt(1, 3);
            item.stats["MDMG"] = getRandomInt(0, 2);
            break;
    }

    return item;
}