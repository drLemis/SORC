'use strict';

var gWorld;

var gGamePosition;
var gGameState;

var gPlayer;

function initGame() {
    gWorld = generateWorld("1234");

    drawInterfaceLogs("I TO OPEN INVENTORY, G TO PICKUP, U TO USE/WEAR, D TO DROP/TAKE OFF");
    drawInterfaceLogs("O TO ENTER/LEAVE DUNGEONS AND TOWNS");
    drawInterfaceLogs("ARROWS TO WALK");
    drawInterfaceLogs("? TO GET HELP");

    initDraw();
}

var World = function (newSeed) {
    this.seed = newSeed;
    this.gTwister = new MersenneTwister(newSeed);
    this.date = new Date(this.gTwister.random() * 50000000000000 + 100000000000000);
    this.mapGlobal = new MapGlobal(Math.floor(this.gTwister.random() * 50 + 1), Math.floor(this.gTwister.random() * 50 + 1));
    this.mapLocal = null;
}

var eGamePositions = makeEnum([
    "GLOBALMAP",
    "SUBMAP"
]);

var eGameStates = makeEnum([
    "MENU",
    "PLAYING",
    "INVENTORY",
    "INVENTORY_DROP",
    "INVENTORY_USE",
    "INVENTORY_GET",
    "TOWN",
    "TOWN_TAVERN",
    "TOWN_TAVERN_REST",
    "TOWN_TAVERN_BAG_DROP",
    "TOWN_TAVERN_BAG_GET",
    "TOWN_STORE",
    "TOWN_STORE_BUY",
    "TOWN_STORE_BUY_CONFIRM",
    "TOWN_STORE_BUY_ERROR",
    "TOWN_STORE_SELL",
    "TOWN_STORE_SELL_CONFIRM",
    "TOWN_STORE_SELL_ERROR",
]);

var gGameStateLast = 0;

var generateWorld = function (seed) {
    var newWorld = new World(seed);

    gGamePosition = eGamePositions.GLOBALMAP;
    gGameState = eGameStates.PLAYING;

    gPlayer = new Entity("WORLDDESTROYER IV");


    gPlayer.globalX = Math.floor(newWorld.gTwister.random() * newWorld.mapGlobal.height);
    gPlayer.globalY = Math.floor(newWorld.gTwister.random() * newWorld.mapGlobal.width);

    new Town(newWorld.mapGlobal.getTile(gPlayer.globalX, gPlayer.globalY), "PLACEHOLDERNAME");

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
        while (tile == null || tile.submapSeed != null || tile.town != null)

        tile.submapSeed = Math.floor(newWorld.gTwister.random() * 50000000000000);
    }

    return newWorld;
}