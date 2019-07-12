'use strict';

var GENERATE_SEED = 1337;

var World = function () {
    this.date = new Date(gTwister.random() * 50000000000000 + 100000000000000);
}

const gTwister = new MersenneTwister(GENERATE_SEED);

const gWorld = new World();

const gSubmap = new Submap(5, 8);
// GenerateDungeon(GENERATE_SEED);

const gPlayer = new Entity("WORLDDESTROYER IV");

var enemy = new Entity("ENEMY");

gSubmap.getTile(6, 3).setCreature(gPlayer);
gSubmap.getTile(2, 3).setCreature(enemy);
gSubmap.getTile(0, 0).setPass(false);
gSubmap.getTile(1, 0).setPass(false);
gSubmap.getTile(2, 0).setPass(false);
gSubmap.getTile(3, 0).setPass(false);
gSubmap.getTile(4, 0).setPass(false);
gSubmap.getTile(5, 0).setPass(false);
gSubmap.getTile(0, 1).setPass(false);
gSubmap.getTile(0, 2).setPass(false);
gSubmap.getTile(0, 3).setPass(false);
gSubmap.getTile(0, 4).setPass(false);
gSubmap.getTile(1, 2).setPass(false);
gSubmap.getTile(2, 2).setPass(false);
gSubmap.getTile(3, 2).setPass(false);

var tile = gSubmap.getTile(gPlayer.subX, gPlayer.subY);

var item = itemGenerate("sword");
tile.items.push(item);
gPlayer.inventory.itemPickup(item);
gPlayer.inventory.itemEquip(item);
item = itemGenerate("sword");
tile.items.push(item);
gPlayer.inventory.itemPickup(item);
gPlayer.inventory.itemEquip(item);

// item = itemGenerate("bow");
// gPlayer.inventory.itemPickup(item);
// gPlayer.inventory.itemEquip(item);
// item = itemGenerate("ammo");
// gPlayer.inventory.itemPickup(item);
// gPlayer.inventory.itemEquip(item);
// item = itemGenerate("helmet");
// gPlayer.inventory.itemPickup(item);
// gPlayer.inventory.itemEquip(item);
// item = itemGenerate("armor");
// gPlayer.inventory.itemPickup(item);
// gPlayer.inventory.itemEquip(item);

tile = gSubmap.getTile(enemy.subX, enemy.subY);

item = itemGenerate("sword");
tile.items.push(item);
enemy.inventory.itemPickup(item);
enemy.inventory.itemEquip(item);
item = itemGenerate("armor");
tile.items.push(item);
enemy.inventory.itemPickup(item);
enemy.inventory.itemEquip(item);
item = itemGenerate("helmet");
tile.items.push(item);
enemy.inventory.itemPickup(item);
enemy.inventory.itemEquip(item);
