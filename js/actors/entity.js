'use strict';

var Entity = function (name) {
    this.name = name;

    this.subX;
    this.subY;

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
    }
}