
function GenerateDungeon(seed){
  
  
  const MAX_HEIGHT = 50
  const MAX_WIDTH = 50
  const GEN_CLEAR_THRESHOLD = 0.4
  const CHECK_PERCENTAGE = 0.9
  const NUMBER_OF_PASSAGES = 2
  const ROOM_SIZE_PERCENTAGE = 0.3

  //dist(a)(b) = curried function, returns distance^2 from a to b, assuming a and b formatted as [x, y]
  const dist = point1 => point2 => ((point1[0]-point2[0])*(point1[0]-point2[0]) + (point1[1]-point2[1])*(point1[1]-point2[1]))
  //this is a surprise tool that will help us later
  
  var height = MAX_HEIGHT
  var width = MAX_WIDTH
  var gen = new MersenneTwister(seed)
  
  const ROOM_MAX_HEIGHT = Math.floor(MAX_HEIGHT * ROOM_SIZE_PERCENTAGE)
  const ROOM_MAX_WIDTH = Math.floor(MAX_WIDTH * ROOM_SIZE_PERCENTAGE)
  
  
  var dungeon = new Array(height)
  for (let index = 0; index < dungeon.length; index++) {
      dungeon[index] = new Array(width).fill(1);
  }
  
  var rooms = [];
  while(CheckGeneration(dungeon)<GEN_CLEAR_THRESHOLD){
    //generate room, respect boundaries
    //a room is a 4-tuple [top, left, bottom, right]
    var dim = [Math.floor(gen.random()*ROOM_MAX_HEIGHT-1)+2, Math.floor(gen.random()*ROOM_MAX_WIDTH-1)+2]
    var room = [Math.floor(gen.random()*(height-2))+1, Math.floor(gen.random()*(width-2))+1]
    //that describes the topleft corner; add the bottom and right coordinates
    room.push(Math.min(room[0]+dim[0], height-2))
    room.push(Math.min(room[1]+dim[1], width-2))
    
    //ensure it does not intersect with other rooms, with a 1-C_P chance to overlook
    var f = false;
    for (let index = 0; index < rooms.length; index++){
      if (CheckIntersect(rooms[index], room) && (gen.random()<CHECK_PERCENTAGE)){
        f = true;
        break;
      }
    }
    //discard the room if it does, return to beginning
    if (f) continue;
    
    //clear out the space
    for (let y = room[0]; y <= room[2]; y++){
      for (let x = room[1]; x <= room[3]; x++){
        dungeon[y][x] = 0;
      }
    }
    //commit room to memory
    rooms.push(room)
    //go anew until enough of the dungeon is cleared out
  }
  
  //rooms cleared! make passages if needed
  
  if (NUMBER_OF_PASSAGES <= 0) return dungeon
  
  for(var index = 0; index < rooms.length; index++){
	rooms[index] = [rooms[index][0] + Math.floor(Math.abs(rooms[index][0]-rooms[index][2])/2), rooms[index][1] + Math.floor(Math.abs(rooms[index][1]-rooms[index][3])/2)]
    //now rooms are [y, x]
  
  }
  
  
  
  //for each room - discard it from the list
  while(rooms.length > 0){
    var thisRoom = rooms.pop()
    //pull NUMBER_OF_PASSAGES nearest rooms
    //remember dist?
    let distToThis = dist(thisRoom) //distToThis(otherRoom) = dist(thisRoom)(otherRoom)
    let compare = function(a, b){return Math.sign(distToThis(b) - distToThis(a))} 
    //^ returns -1/0/1 based on which point is closer
    //-1 - b is closer; 0 - equal; 1 - a is closer
    var nearest = [...rooms].sort(compare).slice(-NUMBER_OF_PASSAGES) 
    //^copy rooms; sort !the copy! by distance in descending order; pick out the last NUMBER_OF_PASSAGES ones 
    
    //make passages
    nearest.forEach(function(thatRoom){
      if (thisRoom[0] == thatRoom[0]){ //if the rooms are aligned vertically, just make a vertical passage
        for (var y = Math.min(thisRoom[1], thatRoom[1]);
            y <= Math.max(thisRoom[1], thatRoom[1]);
            y++) {
              dungeon[thisRoom[0]][y] = 0;
            }
      }
      else {
        //starting x: the one corresponding to lower Y
        var x1 = thisRoom[0] < thatRoom[0] ? thisRoom[1] : thatRoom[1];
		//ending x: to higher Y
		var x2 = thisRoom[0] < thatRoom[0] ? thatRoom[1] : thisRoom[1];
		var y1 = Math.min(thisRoom[0], thatRoom[0]);
		var y2 = Math.max(thisRoom[0], thatRoom[0])
		
		if (gen.random() > 0.5){
			for (var index = y1; index <= y2; index ++) {
				dungeon[index][x1] = 0
			}
			for (var index = x1; index <= x2; index ++){
				dungeon[y2][index] = 0
			}
		}
		else{
			for (var index = x1; index <= x2; index ++){
				dungeon[y1][index] = 0
			}
			for (var index = y1; index <= y2; index ++) {
				dungeon[index][x2] = 0
			}
		}
      }
    })
  }
  return dungeon
  
}


function CheckGeneration(dungeon) { //returns percentage of free space 
    var free = 0;
    dungeon.forEach(function (row) {
        row.forEach(function (tile) {
            if (tile === 0) free++;
        })
    })

    return free / (dungeon.length * dungeon[0].length);
}

function CheckIntersect(room1, room2) {
  //assuming room is a 4-tuple [top, left, bottom, right]
  
	var a = ((room1[1]<=room2[3]+1) && (room1[1] >= room2[1]-1)) || ((room2[1]<=room1[3]+1) && (room2[1] >= room1[1]-1))
	var b = ((room1[0]<=room2[2]+1) && (room1[0] >= room2[0]-1)) || ((room2[0]<=room1[2]+1) && (room2[0] >= room1[0]-1))
	return a&&b;
  //returns true IF THEY INTERSECT
}