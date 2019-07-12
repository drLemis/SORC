'use strict';

var Inventory = function (parent) {
    this.parent = parent;

    this.slots = {
        HEAD: "",
        NECK: "",
        BODY: "",
        HAND: "",
        LEGS: "",

        MAIN: "",
        DIST: "",
        AMMO: ""
    };

    this.bag = [];

    this.gold = getRandomInt(0, 10000);
    this.food = getRandomInt(0, 20);

    this.getGold = function () {
        return setPadding(this.gold, 17);
    }

    this.getStat = function (typeSTAT, typeWPN) {
        var result = [0, 0];
        if (this.slots[typeSTAT]) {
            result[0] = this.slots[typeWPN].stats[typeSTAT];
        }

        var bonus = 0;
        Object.keys(this.slots).forEach(slotName => {
            if (typeWPN != slotName && this.slots[slotName])
                bonus += this.slots[slotName].stats[typeSTAT];
        });

        result[1] = bonus;

        var result = result[0] + result[1];
        return result;
    }


    this.getArmor = function () {
        var A = this.getSlotsAllMod("PARM") + this.parent.stats.attributes["AGIL"] + this.getSlotsAllMod("AGIL");
        var B = this.getSlotsAllMod("MARM");
        var result = A + "+" + B;

        return result;
    }

    this.getSlotAsString = function (slot) {
        var result = "";

        if (this.slots[slot])
            result = this.slots[slot].shortname;

        return setPadding(result, 12);
    };

    this.itemEquip = function (item) {
        if (this.bag.indexOf(item) > -1) {
            this.bag.splice(this.bag.indexOf(item), 1);

            this.itemUnequipFromSlot(item.slot);

            this.parent.stats.health.MAX += item.stats["HP"];
            this.parent.stats.mana.MAX += item.stats["MP"];

            this.slots[item.slot] = item;
        }
    }

    this.itemUnequipFromSlot = function (slot) {
        if (this.slots[slot]) {
            this.parent.stats.health.max -= this.slots[slot].stats["HP"];
            this.parent.stats.mana.max -= this.slots[slot].stats["MP"];
            this.bag.push(this.slots[slot]);
            this.slots[slot] = "";
        }
    }

    this.itemPickup = function (item) {
        this.bag.push(item);
    }


    this.getSlotsMod = function (modname) {
        var result = 0;

        Object.keys(this.slots).forEach(slotName => {
            if (slotName != "MAIN" && slotName != "DIST" && slotName != "AMMO" && this.slots[slotName])
                result += this.slots[slotName].stats[modname];
        });

        return result;
    }

    this.getSlotsAllMod = function (modname) {
        var result = 0;

        Object.keys(this.slots).forEach(slotName => {
            if (this.slots[slotName])
                result += this.slots[slotName].stats[modname];
        });

        return result;
    }

    this.getWeight = function () {
        var result = 0;

        this.bag.forEach(item => {
            result += item.weight;
        });

        return setPadding(result, 8);
    }
    this.getFood = function () {
        return setPadding(this.food, 8);
    }
}