'use strict';

const canvas = document.getElementById("graphCanvas");
const ctx = canvas.getContext("2d");

var renderlastFrameTime = 0;

const width = 800;
const height = 600;

function initDraw() {
	canvas.width = width;
	canvas.height = height;
	draw();
}

var gColorsCGA = {
	BLACK: "#000000",
	BLUE: "#0000AA",
	GREEN: "#00AA00",
	CYAN: "#00AAAA",
	RED: "#AA0000",
	MAGENTA: "#AA00AA",
	BROWN: "#AA5500",
	LIGHTGRAY: "#AAAAAA",
	DARKGRAY: "#555555",
	LIGHTBLUE: "#5555FF",
	LIGHTGREEN: "#55FF55",
	LIGHTCYAN: "#55FFFF",
	LIGHTRED: "#FF5555",
	LIGHTMAGENTA: "#FF55FF",
	YELLOW: "#FFFF55",
	WHITE: "#FFFFFF",
};

function draw() {
	ctx.clearRect(0, 0, width, height);

	ctx.fillStyle = gColorsCGA.BLACK;
	ctx.fillRect(0, 0, width, height);

	switch (gGameState) {
		case eGameStates.INVENTORY:
		case eGameStates.INVENTORY_DROP:
		case eGameStates.INVENTORY_USE:
			drawMenuInventory();
			break;
		case eGameStates.INVENTORY_GET:
			if (gGameStateLast == eGameStates.TOWN_TAVERN)
				drawMenuPickup(getCurrentGlobalTile().town.items);
			else
				drawMenuPickup(getCurrentLocalTile().items);
			break;
		case eGameStates.TOWN:
			drawMenuTown();
			break;
		case eGameStates.TOWN_TAVERN:
			drawMenuTownTavern();
			break;
		case eGameStates.TOWN_TAVERN_REST:
			drawMenuTownTavernRest();
			break;
		case eGameStates.TOWN_AUTHORITIES:
			drawMenuTownAuthorities();
			break;
		case eGameStates.TOWN_AUTHORITIES_LEARN:
			drawMenuTownAuthoritiesLearn();
			break;
		default:
			if (gGamePosition == eGamePositions.SUBMAP && gWorld.mapLocal)
				if (gDebug3D)
					drawScreenSubmap3DDebug(gWorld.mapLocal);
				else
					drawScreenSubmap2D(gWorld.mapLocal);
			else
				drawScreenGlobalmap2D(gWorld.mapGlobal);
			break;
	}


	drawInterfaceFrame();

	drawInterfaceStats();
	drawInterfaceStatus();
	drawInterfaceLogs();



	// рендер каждый возможный кадр
	// window.requestAnimationFrame(draw);

	//рендер 1 раз в секунду
	// setTimeout(() => {
	//     draw();
	// }, 1000 / 1);
}