function CheckGeneration(dungeon) { //returns percentage of free space 
    var free = 0;
    dungeon.forEach(function (row) {
        row.forEach(function (tile) {
            if (tile === 0) free++;
        })
    })

    return free / (dungeon.length * dungeon[0].length);
}

function GenerateDungeon(seed) {
    const MAX_HEIGHT = 50
    const MAX_WIDTH = 50
    const GEN_CLEAR_THRESHOLD = 0.3

    const ROOM_MAX_HEIGHT = Math.floor(MAX_HEIGHT * 0.15)
    const ROOM_MAX_WIDTH = Math.floor(MAX_WIDTH * 0.15)

    var gen = new MersenneTwister(seed)
    var height = MAX_HEIGHT //<- protect from 0-size errors
    var width = MAX_WIDTH

    var dungeon = new Array(height);

    for (let index = 0; index < dungeon.length; index++) {
        dungeon[index] = new Array(width).fill(1);
    }

    var anchor = [Math.floor(gen.random() * height), Math.floor(gen.random() * width)]

    while (CheckGeneration(dungeon) < GEN_CLEAR_THRESHOLD) {
        //generate room 
        var roomHeight = Math.floor(gen.random() * ROOM_MAX_HEIGHT) + 1
        var roomWidth = Math.floor(gen.random() * ROOM_MAX_WIDTH) + 1

        //generate relative anchor
        var rel_anchor = [Math.floor(gen.random() * roomHeight), Math.floor(gen.random() * roomWidth)]
        //clear out room
        for (var i = 0; i < roomHeight; i++) {
            for (var j = 0; j < roomWidth; j++) {
                //clear out a block sized [roomHeight, roomWidth], with the upper left corner being (anchor - rel_anchor), check bounds
                if (anchor[0] - rel_anchor[0] + i >= 0 && anchor[0] - rel_anchor[0] + i < height && anchor[1] - rel_anchor[1] + j >= 0 && anchor[1] - rel_anchor[1] + j < width) {
                    dungeon[anchor[0] - rel_anchor[0] + i][anchor[1] - rel_anchor[1] + j] = 0;
                }
            }
        }
        //choose random free tile as anchor (not sure if rational?)
        do {
            var anchor = [Math.floor(gen.random() * height), Math.floor(gen.random() * width)]
        }
        while (dungeon[anchor[0]][anchor[1]] == 1)

        //choose direction (as [-1/0/1, -1/0/1])
        switch (Math.floor(gen.random() * 2)) {
            case 0:
                var dir = [Math.floor(gen.random() * 3) - 1, 0]
                break;
            case 1:
                var dir = [0, Math.floor(gen.random() * 3) - 1]
                break;
        }

        //choose length of corridor
        var vert;
        switch (dir[0]) {
            case -1:
                vert = anchor[0];
                break;
            case 0:
                vert = MAX_HEIGHT;
                break;
            case 1:
                vert = height - anchor[0];
                break;
        }
        var hor;
        switch (dir[1]) {
            case -1:
                hor = anchor[1];
                break;
            case 0:
                hor = MAX_WIDTH;
                break;
            case 1:
                hor = width - anchor[1];
                break;
        }
        var len = Math.floor(gen.random() * (Math.min(vert, hor)))
        //clear out corridor and move anchor to end of corridor
        for (var i = 0; i < len; i++) {
            anchor = [anchor[0] + dir[0], anchor[1] + dir[1]]
            dungeon[anchor[0]][anchor[1]] = 0
        }
    }
    return dungeon
}