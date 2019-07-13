'use strict';

var GENERATE_SEED = 1337;

var World = function () {
    this.date = new Date(gTwister.random() * 50000000000000 + 100000000000000);
}

const gTwister = new MersenneTwister(GENERATE_SEED);

const gWorld = new World();

// const gSubmap = new Submap(5, 8);
const gGlobalmap = new Globalmap(30, 30);

var submap = SubmapFromArray(GenerateDungeon(Math.random() * 50000000000000));
var gSubmap = submap;

gGlobalmap.getTile(getRandomInt(0, gGlobalmap.width), getRandomInt(0, gGlobalmap.height)).submap = submap;

var eGamePositions = {
    GLOBALMAP: 1,
    SUBMAP: 2
};
var eGameStates = {
    MENU: 1,
    PLAYING: 2,
    INVENTORY: 3,
    STORE: 4,
    DIALOGUE: 5
};

var gGamePosition = eGamePositions.GLOBALMAP;
var gGameState = eGameStates.PLAYING;

const gPlayer = new Entity("WORLDDESTROYER IV");
gPlayer.globalX = 0;
gPlayer.globalY = 0;

for (let index = 0; index < Math.floor(Math.random() * 20 + 1); index++) {
    var enemy = new Entity("ENEMY");
    var x = Math.floor(Math.random() * gSubmap.width);
    var y = Math.floor(Math.random() * gSubmap.height);

    while (gSubmap.getTile(x, y) && (gSubmap.getTile(x, y).getPass() != true || gSubmap.getTile(x, y).creature != null)) {
        x = Math.floor(Math.random() * gSubmap.width);
        y = Math.floor(Math.random() * gSubmap.height);
    }

    tile = gSubmap.getTile(x, y);
    tile.setCreature(enemy);

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
}

var x = Math.floor(Math.random() * gSubmap.width);
var y = Math.floor(Math.random() * gSubmap.height);

while (gSubmap.getTile(x, y) && (gSubmap.getTile(x, y).getPass() != true || gSubmap.getTile(x, y).creature != null)) {
    x = Math.floor(Math.random() * gSubmap.width);
    y = Math.floor(Math.random() * gSubmap.height);
}

gSubmap.getTile(x, y).setCreature(gPlayer);
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

gSubmap = null;