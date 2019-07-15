'use strict';

var gWorld;

var gGamePosition;
var gGameState;

var gPlayer;

function initGame() {
    gWorld = generateWorld("1234");

    initDraw();
}

var World = function (newSeed) {
    this.seed = newSeed;
    this.gTwister = new MersenneTwister(newSeed);
    this.date = new Date(this.gTwister.random() * 50000000000000 + 100000000000000);
    this.mapGlobal = new MapGlobal(Math.floor(this.gTwister.random() * 50 + 1), Math.floor(this.gTwister.random() * 50 + 1));
    this.mapLocal = null;
}


var eGamePositions = {
    GLOBALMAP: 1,
    SUBMAP: 2
};
var eGameStates = {
    MENU: 1,
    PLAYING: 2,
    INVENTORY: 3,
    INVENTORY_DROP: 4,
    INVENTORY_USE: 5,
};

var generateWorld = function (seed) {
    var newWorld = new World(seed);

    gGamePosition = eGamePositions.GLOBALMAP;
    gGameState = eGameStates.PLAYING;

    gPlayer = new Entity("WORLDDESTROYER IV");

    gPlayer.globalX = Math.floor(newWorld.gTwister.random() * newWorld.mapGlobal.height);
    gPlayer.globalY = Math.floor(newWorld.gTwister.random() * newWorld.mapGlobal.width);

    var item = itemGenerate("sword");
    gPlayer.inventory.bag.push(item);
    gPlayer.inventory.itemEquip(item);
    item = itemGenerate("bow");
    gPlayer.inventory.bag.push(item);
    gPlayer.inventory.itemEquip(item);
    item = itemGenerate("ammo");
    gPlayer.inventory.bag.push(item);
    gPlayer.inventory.itemEquip(item);
    item = itemGenerate("helmet");
    gPlayer.inventory.bag.push(item);
    gPlayer.inventory.itemEquip(item);
    item = itemGenerate("armor");
    gPlayer.inventory.bag.push(item);
    gPlayer.inventory.itemEquip(item);

    for (let index = 0; index < 70; index++) {
        item = itemGenerate("armor");
        gPlayer.inventory.bag.push(item);
    }

    for (let index = 0; index < 20; index++) {
        // creating and placing submap on globalmap
        var tile = null;
        do {
            tile = newWorld.mapGlobal.getTile(Math.floor(newWorld.gTwister.random() * newWorld.mapGlobal.width), Math.floor(newWorld.gTwister.random() * newWorld.mapGlobal.height));
        }
        while (tile == null || tile.submapSeed != null)

        tile.submapSeed = Math.floor(newWorld.gTwister.random() * 50000000000000);
    }

    return newWorld;
}