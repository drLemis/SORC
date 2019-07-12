'use strict';

var Entity = function (name) {
    this.name = name;

    this.subX;
    this.subY;

    this.inventory = new Inventory(this);
    this.stats = new Stats(this);

    this.attackMain = function attackMain(entity) {
        var random = Math.floor(gTwister.random() * 20 + 1);

        var patk = random + +this.stats.attributes.LUCK + +this.inventory.getSlotsAllMod("PATK") + +this.stats.attributes.AGIL + +this.inventory.getSlotsAllMod("STNG");
        var matk = random + +this.stats.attributes.LUCK + +this.inventory.getSlotsAllMod("MATK") + +this.stats.attributes.AGIL;

        var parm = entity.inventory.getSlotsAllMod("PARM") + +entity.stats.attributes.AGIL + +entity.inventory.getSlotsAllMod("AGIL");
        var marm = entity.inventory.getSlotsAllMod("MARM");

        var pdmg = this.inventory.getSlotsAllMod("PDMG");
        var mdmg = this.inventory.getSlotsAllMod("MDMG");
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
            log += " " + damage + " DAMAGE!";

        drawInterfaceLogs(log);

        entity.stats.setHealthDelta(-damage);
    }
}