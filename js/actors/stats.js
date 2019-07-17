'use strict';

var Stats = function (parent) {
    this.parent = parent;
    this.xp = {
        CURRENT: 1200,
        ALL: 1200
    };

    this.health = {
        CURRENT: 150,
        MIN: 0,
        MAX: 150
    };
    this.mana = {
        CURRENT: 80,
        MIN: 0,
        MAX: 80
    };
    this.attributes = {
        STNG: getRandomInt(1, 3),
        AGIL: getRandomInt(1, 3),
        LUCK: getRandomInt(1, 3),
    };

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

            while (this.parent.inventory.bag.length > 0)
                this.parent.inventory.itemDrop(this.parent.inventory.bag[0]);

            drawInterfaceLogs([this.parent.name + " IS DEAD!", colorWarn]);
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
}