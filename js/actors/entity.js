'use strict';

var Entity = function (name) {
    this.name = name;

    this.subX;
    this.subY;
    
    this.inventory = new Inventory(this);
    this.stats = new Stats(this);
}