'use strict';

const LOADER_SCRIPTFILES = [
	"js/misc/misc.js",
	"js/misc/twister.js",

	"js/database/database_enemies.js",

	"js/actors/item.js",
	"js/actors/inventory.js",
	"js/actors/stats.js",
	"js/actors/entity.js",

	"js/render/draw.js",
	"js/render/interface.js",
	"js/render/screen.js",
	"js/render/menu_inventory.js",
	"js/render/menu_town.js",

	"js/map/map_local.js",
	"js/map/map_local_generate.js",

	"js/map/map_global.js",

	"js/world/world.js",

	"js/input/input.js",
];

var scriptsLoadedTotal = 0;
loadAllScripts();

function loadAllScripts() {
	var script = document.createElement("script");
	script.onload = function () {
		// попадаем сюда когда файл загружен и добавлен
		scriptsLoadedTotal++;
		if (scriptsLoadedTotal >= LOADER_SCRIPTFILES.length)
			initializeAllScripts();
		else
			loadAllScripts();
	}
	script.src = LOADER_SCRIPTFILES[scriptsLoadedTotal];
	document.head.appendChild(script);
}

//попадаем сюда только если загрузили все файлы
//стартовая инициализация параметров игры
function initializeAllScripts() {
	// начало рендера
	initGame();
}