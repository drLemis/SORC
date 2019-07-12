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
        STNG: getRandomInt(6, 12),
        AGIL: getRandomInt(6, 12),
        LUCK: getRandomInt(6, 12),
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
            gSubmap.getTile(this.parent.subX, this.parent.subY).removeCreature();
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

function getStatusColor(stat, colors) {
    if (stat.MAX > stat.MIN && stat.CURRENT >= stat.MIN && stat.MAX >= stat.CURRENT && colors.length > 1) {
        return colors[Math.floor((stat.CURRENT - stat.MIN) / (stat.MAX - stat.MIN) * colors.length)];
    } else
        return null;
}