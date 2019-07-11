'use strict';

const LOADER_SCRIPTFILES = [
    "js/misc.js",

    "js/actors/item.js",
    "js/actors/inventory.js",
    "js/actors/stats.js",
    "js/actors/entity.js",
    
    "js/render/draw.js",
    "js/render/interface.js",
    
    "js/world/world.js",
];

var scriptsLoadedTotal = 0;
loadAllScripts();

function loadAllScripts() {
    LOADER_SCRIPTFILES.forEach(element => {
        var script = document.createElement("script");
        script.onload = function () {
            // попадаем сюда когда файл загружен и добавлен
            scriptsLoadedTotal++;
            if (scriptsLoadedTotal >= LOADER_SCRIPTFILES.length)
                initializeAllScripts();
        }
        script.src = element;
        document.head.appendChild(script);
    });
}

//попадаем сюда только если загрузили все файлы
//стартовая инициализация параметров игры
function initializeAllScripts() {
    itemGenerate("sword");
    itemGenerate("sword");
    itemGenerate("sword");
    itemGenerate("sword");
    itemGenerate("sword");

    itemGenerate("sword");
    itemGenerate("bow");
    itemGenerate("ammo");
    itemGenerate("helmet");
    itemGenerate("armor");

    // начало рендера
    initDraw();
}
