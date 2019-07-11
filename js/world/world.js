'use strict';

var World = function () {
    this.date = new Date(getRandomInt(100000000000000, 150000000000000));
}

const gWorld = new World();
const gPlayer = new Entity("WORLDDESTROYER IV");