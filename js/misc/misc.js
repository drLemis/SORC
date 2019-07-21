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