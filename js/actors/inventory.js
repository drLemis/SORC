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

    this.gold = 0;
    this.food = 0;

    this.getGold = function () {
        return setPadding(this.gold, 17);
    }

    this.getStat = function (typeSTAT, typeWPN) {
        var result = [0, 0];
        if (this.slots[typeWPN]) {
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

    this.getItemInfo = function (item) {
        var result = ["", ""];
        if (item)
            result = [item.name, item.getStatsAsString()]

        return result;
    }

    this.getItemInfoShort = function (item) {
        var result = ["", ""];
        if (item)
            result = [item.name, item.getStatsShortAsString()]

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
        if (item && item.slot) {
            if (this.bag.indexOf(item) > -1) {
                this.bag.splice(this.bag.indexOf(item), 1);

                this.itemUnequipFromSlot(item.slot);

                this.parent.stats.health.MAX += item.stats["HP"];
                this.parent.stats.mana.MAX += item.stats["MP"];

                this.slots[item.slot] = item;
            }
        }
    }

    this.itemUnequipFromSlot = function (slot) {
        if (this.slots[slot] && this.slots[slot].canDrop) {
            this.parent.stats.health.max -= this.slots[slot].stats["HP"];
            this.parent.stats.mana.max -= this.slots[slot].stats["MP"];
            this.bag.push(this.slots[slot]);
            drawInterfaceLogs("YOU PUT " + this.slots[slot].name + " IN A BAG");
            this.slots[slot] = "";
        }
    }

    this.itemPickup = function (item) {
        if (item) {
            if (gGameStateLast == eGameStates.TOWN_TAVERN)
                getCurrentGlobalTile(this.parent).town.removeItems([item]);
            else
                getCurrentLocalTile(this.parent).removeItems([item]);

            this.bag.push(item);
            if (this.parent == gPlayer)
                drawInterfaceLogs("YOU GOT " + item.name);
        }
    }

    this.itemDrop = function (item) {
        var index = this.bag.indexOf(item);
        if (index >= 0) {
            if (gGameStateLast == eGameStates.TOWN_TAVERN) {
                getCurrentGlobalTile(this.parent).town.addItems(item);
            } else
                getCurrentLocalTile(this.parent).addItems(item);

            var i = this.bag.indexOf(item)
            if (i > -1) {
                this.bag.splice(i, 1);
            }

            this.bag = this.bag.filter(function (el) {
                return el != null;
            });
            if (this.parent == gPlayer)
                drawInterfaceLogs("YOU DROPPED " + item.name);
        }
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
            if (item)
                result += item.weight;
        });

        return setPadding(result, 8);
    }
    this.getFood = function () {
        return setPadding(this.food, 8);
    }
}