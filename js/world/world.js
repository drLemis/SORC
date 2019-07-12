'use strict';

var World = function () {
    this.date = new Date(getRandomInt(100000000000000, 150000000000000));
}

const gWorld = new World();
const gPlayer = new Entity("WORLDDESTROYER IV");

const gSubmap = new Submap(5, 8);

gSubmap.getTile(1, 3).setCreature(gPlayer);
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
