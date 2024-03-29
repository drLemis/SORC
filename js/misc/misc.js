'use strict';

function setPadding(text, padLeft = 0, padright = 0, separator = "") {
	text = [text.toString(), ""];
	var result = "";

	if (separator && text[0].includes(separator)) {
		text = text[0].split(separator);

		result = text[0].toString().padStart(padLeft, ' ');

		result += separator + text[1].toString().padEnd(padright, ' ');
	} else {
		result = text[0].toString().padStart(padLeft, ' ').padEnd(padright + padLeft + 1, ' ');
	}

	return result;
}

function padText(pad, str, padLeft) {
	if (typeof str === 'undefined')
		return pad;
	if (padLeft) {
		return (pad + str).slice(-pad.length);
	} else {
		return (str + pad).substring(0, pad.length);
	}
}

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function dateToYMD(date) {
	// var strArray=['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	var strArray = ['Oin', 'Dai', 'Het', 'Ket', 'Sar', 'End', 'Ter', 'Mai', 'Kel', 'Ter', 'Nei', 'Ott'];
	var d = date.getDate();
	var m = strArray[date.getMonth()];
	var y = date.getFullYear();
	return '' + (d <= 9 ? '0' + d : d) + ' ' + m + ' ' + y;
}

function getRandomWord(type = "noun") {
	var nouns = ["cross", "whack", "gadget", "thing", "finger", "voice", "fire"];
	var adjectives = ["glory", "black", "unholy", "powerful", "atomic", "sole", "mercy", "fatal", "main"];
	var middle = [" ", " ", " ", " ", " ", " of ", "ish "];

	switch (type) {
		case "adjective":
			return (adjectives[getRandomInt(0, adjectives.length - 1)])
		case "middle":
			return (middle[getRandomInt(0, middle.length - 1)])
		default:
			return (nouns[getRandomInt(0, nouns.length - 1)])
	}

}

function getRandomItemName() {
	return getRandomWord("adjective") + getRandomWord("middle") + getRandomWord("noun");
}

function getStatusColor(stat, colors) {
	if (stat.MAX > stat.MIN && stat.CURRENT >= stat.MIN && stat.MAX >= stat.CURRENT && colors.length > 1) {
		var index = Math.floor((stat.CURRENT - stat.MIN) / (stat.MAX - stat.MIN) * colors.length);
		if (index == colors.length)
			index--;

		return colors[index];
	} else {
		return null;
	}
}

function keyCodeToIndexFromA(keyCode) {
	var result = -1;

	if (keyCode >= 65 && keyCode <= 90)
		result = keyCode - 65;
	else if (keyCode == 186) // ;
		result = 26;
	else if (keyCode == 188) // ,
		result = 27;
	else if (keyCode == 190) // .
		result = 28;

	return result;
}

function toBetterLetter(char) {
	if (char == 91) // ;
		char = ";";
	else if (char == 92) // ,
		char = ",";
	else if (char == 93) // .
		char = ".";
	else
		char = String.fromCodePoint(char);

	return char;
}

function makeEnum(list) {
	var obj = {},
		sequence = 0,
		current;
	for (var i = 0; i < list.length; i++) {
		current = i;
		if (typeof list[i + 1] === "number") {
			sequence = list[i + 1];
			i++;
		}
		obj[list[current]] = sequence++;
	}
	return (obj);
}

function getCurrentGlobalTile(entity) {
	if (!entity)
		entity = gPlayer
	return gWorld.mapGlobal.getTile(entity.globalX, entity.globalY)
}

function getCurrentLocalTile(entity) {
	if (!entity)
		entity = gPlayer
	return gWorld.mapLocal.getTile(entity.localX, entity.localY)
}

function varFromArray(input) {
	var result;

	if (Array.isArray(input) && input.length > 1)
		result = getRandomInt(input[0], input[1]);
	else if (Array.isArray(input) && input.length == 1)
		result = input[0];
	else
		result = input;

	return result;
}

Math.getDistance = function (x1, y1, x2, y2) {
	var xs = x2 - x1,
		ys = y2 - y1;

	xs *= xs;
	ys *= ys;

	return Math.sqrt(xs + ys);
}

function getMillArray(array, index, getIndex = false) {
	while (index < 0 || index >= array.length) {
		if (index < 0)
			index += array.length
		else
			index -= array.length
	}

	if (getIndex)
		return index;
	else
		return array[index];
}

function rotateArrayClockwise(array) {
	var result = [];
	array.forEach(function (a, i, aa) {
		a.forEach(function (b, j, bb) {
			result[j] = result[j] || [];
			result[j][aa.length - i - 1] = b;
		});
	});
	return result;
}

function rotateArrayCounterclockwise(array) {
	var result = [];
	array.forEach(function (a, i, aa) {
		a.forEach(function (b, j, bb) {
			result[bb.length - j - 1] = result[bb.length - j - 1] || [];
			result[bb.length - j - 1][i] = b;
		});
	});
	return result;
}

function saveGame() {
	//saves the game state in a cookie, returns true/false based on if it succeeded
	//zeroth step - check if we can save it at all
	if (!navigator.cookieEnabled) {
		alert("Cannot save game - please enable cookies for this site.");
		return false;
	}
	//first, kill the previous cookie
	document.cookie = "SORCdata=;Max-Age=-99999999999;path=/;"
	//second, save the new data

	var save_data = [
		gPlayer.toJSON(),
		gWorld.seed,
		gTown.saveItems()
	]
	save_data = JSON.stringify(save_data)
	// console.log("SORCdata='" + save_data + "'; path=/; expires=" + new Date(new Date().getTime() + 60 * 1000).toUTCString())
	document.cookie = "SORCdata=" + save_data + "; path=/; expires=" + new Date(new Date().getTime() + 60 * 1000).toUTCString();
	return true;
}

function loadGame() {
	//loads the game from a cookie, reutrns true/false based on if it succeeded
	//check if cookies are enabled
	if (!navigator.cookieEnabled) {
		alert("Cannot load game - please enable cookies for this site.");
		return false;
	}

	var save_data = null;
	//load the cookie, break it down by the semicolon
	var cookie_array = document.cookie.split(';')
	for (var i = 0; i < cookie_array.length; i++) {
		var c = cookie_array[i];
		while (c.charAt(0) == ' ') c = c.substring(1, c.length);
		if (c.indexOf("SORCdata=") == 0) save_data = c.substring("SORCdata=".length, c.length);
	}
	if (save_data === null) {
		alert("Failed to load save data!")
		return false;
	}
	//parse its contents back into the game - REDO THIS PART SO IT ACTUALLY WORKS
	save_data = JSON.parse(save_data)
	gWorld = generateWorld(save_data[1])
	gPlayer.fromJSON(save_data[0])
	gTown.loadItems(save_data[2])
}