Util.WORLD_MIN = 0;
Util.WORLD_MAX = 2500;
Util.WORLD_PADDING = 30;

// class constructor
function Util() {};

// returns distance between two points measured along axes at right angles
Util.getManhattanDistance = function(x1, y1, x2, y2) {
	return Math.abs(x1 - x2) + Math.abs(y1 - y2);
};

// returns squared Euclidean distance between two points
Util.getEuclideanDistance2 = function(x1, y1, x2, y2) {
	return ((x1 - x2) * (x1 - x2)) + ((y1 - y2) * (y1 - y2));
};

// returns Euclidean distance between two points
Util.getEuclideanDistance = function(x1, y1, x2, y2) {
	return Math.sqrt(Util.getEuclideanDistance2(x1, x2, y1, y2));
};

// checks if value is between min and max
Util.inBound = function(val, min, max) {
	if (min > max) {
		throw new Error('Error');
	}
	return val >= min && val <= max;
};

// bounds a number to given min and max
Util.bound = function(val, min, max) {
	if (min > max) {
		throw new Error('Error');
	}
	return Math.min(Math.max(val, min), max);
};

// determines if given point is inside the game world
Util.inWorld = function(x, y) {
	return Util.inBound(x, Util.WORLD_MIN, Util.WORLD_MAX) && Util.inBound(y, Util.WORLD_MIN, Util.WORLD_MAX);
};

// bounds a coordinate to world if it's outside of it
Util.boundWorld = function(x, y) {
	return [Util.bound(x, Util.WORLD_MIN, Util.WORLD_MAX), Util.bound(y, Util.WORLD_MIN, Util.WORLD_MAX)];
};

// returns a random point inside the game world
Util.getRandomWorldPoint = function(padding) {
	if (padding == null || padding == undefined) {
		padding = Util.WORLD_PADDING;
	}
	return [Util.randRange(Util.WORLD_MIN + padding, Util.WORLD_MAX - padding), Util.randRange(Util.WORLD_MIN + padding, Util.WORLD_MAX - padding)];
};

// returns a random float between two values
Util.randRange = function(min, max) {
	if (min >= max) {
		throw new Error('Error');
	}
	return (Math.random() * (max - min)) + min;
};

// returns a random integer between two values
Util.randRangeInt = function(min, max) {
	if (min >= max) {
		throw new Error('Error');
	}
	return Math.floor(Math.random() * (max - min)) + min;
};

// returns a random element of an array
Util.choiceArray = function(array) {
	return array[Util.randRangeInt(0, array.length)];
};

module.exports = Util;
