'use strict';

const canvas = document.getElementById("graphCanvas");
const ctx = canvas.getContext("2d");

var renderlastFrameTime = 0;

const width = 800;
const height = 600;

// Palette presets
const gPalettes = [
	{
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
	},
	// C64 style
	{
		BLACK: "#000000",
		BLUE: "#3B5DC9",
		GREEN: "#5ABE6E",
		CYAN: "#59DFFC",
		RED: "#B95E51",
		MAGENTA: "#C76C71",
		BROWN: "#A97D53",
		LIGHTGRAY: "#C0C0C0",
		DARKGRAY: "#606060",
		LIGHTBLUE: "#6C9DE8",
		LIGHTGREEN: "#B6F97F",
		LIGHTCYAN: "#B6FFFF",
		LIGHTRED: "#FFB6B6",
		LIGHTMAGENTA: "#FFB6FF",
		YELLOW: "#FFFFB6",
		WHITE: "#FFFFFF",
	},
	// Sepia
	{
		BLACK: "#2E1F13",
		BLUE: "#4B3B2A",
		GREEN: "#6B5B3A",
		CYAN: "#8B7B5A",
		RED: "#8B5B3A",
		MAGENTA: "#8B6B5A",
		BROWN: "#A97D53",
		LIGHTGRAY: "#C0B090",
		DARKGRAY: "#7B6B5A",
		LIGHTBLUE: "#A0A0C0",
		LIGHTGREEN: "#B6B67F",
		LIGHTCYAN: "#B6B6A0",
		LIGHTRED: "#FFC0A0",
		LIGHTMAGENTA: "#FFC0B0",
		YELLOW: "#FFFFB6",
		WHITE: "#FFF8E7",
	},
	// Pronounced contrast/cyber palette
	{
		BLACK: "AA00AA", // magenta
		BLUE: "#FF00FF",  // cyan
		GREEN: "#00FF00",
		CYAN: "#00FFFF",
		RED: "#FF0000",
		MAGENTA: "#FF00FF",
		BROWN: "#FF8800",
		LIGHTGRAY: "#00FFEA",
		DARKGRAY: "#008888",
		LIGHTBLUE: "#00BFFF",
		LIGHTGREEN: "#BFFF00",
		LIGHTCYAN: "#BFFFFF",
		LIGHTRED: "#FFB6B6",
		LIGHTMAGENTA: "#FFB6FF",
		YELLOW: "#FFFF00",
		WHITE: "#AA00AA", // magenta
	},
];

function getCurrentPalette() {
	return gPalettes[gPaletteIndex % gPalettes.length];
}

function initDraw() {
	canvas.width = width;
	canvas.height = height;
	draw();
}

function draw() {
	ctx.clearRect(0, 0, width, height);

	ctx.fillStyle = getCurrentPalette().BLACK;
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
		case eGameStates.TOWN_STORE:
			drawMenuTownStore();
			break;
		case eGameStates.TOWN_STORE_SELL:
			drawMenuTownStoreSell();
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

function drawPauseMenu(selectedIndex = 0) {
	ctx.save();
	ctx.globalAlpha = 0.95;
	ctx.fillStyle = getCurrentPalette().BLACK;
	ctx.fillRect(width * 0.15, height * 0.15, width * 0.7, height * 0.7);
	ctx.globalAlpha = 1.0;

	ctx.strokeStyle = getCurrentPalette().WHITE;
	ctx.lineWidth = 4;
	ctx.strokeRect(width * 0.15, height * 0.15, width * 0.7, height * 0.7);

	ctx.textAlign = "center";
	ctx.font = "28px Consolas";
	ctx.fillStyle = getCurrentPalette().WHITE;
	ctx.fillText("PAUSE / SETTINGS", width / 2, height * 0.22);

	ctx.font = "20px Consolas";
	let opts = [
		"Wall Detail: " + (gWallDetailMode === "detailed" ? "Detailed" : "Simple"),
		"Palette: " + (gPaletteIndex + 1) + " / " + gPalettes.length,
		"Resume Game"
	];
	for (let i = 0; i < opts.length; i++) {
		ctx.fillStyle = (i === selectedIndex) ? getCurrentPalette().YELLOW : getCurrentPalette().WHITE;
		ctx.fillText(opts[i], width / 2, height * 0.32 + i * 40);
	}

	ctx.font = "16px Consolas";
	ctx.fillStyle = getCurrentPalette().LIGHTGRAY;
	ctx.fillText("Use UP/DOWN to select, LEFT/RIGHT or ENTER to change, P to resume", width / 2, height * 0.65);
	ctx.restore();
}