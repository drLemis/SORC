'use strict';

var Entity = function (name) {
    this.name = name;
    
    this.inventory = new Inventory(this);
    this.stats = new Stats(this);
}