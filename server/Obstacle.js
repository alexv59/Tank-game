Obstacle.HITBOX_SIZE = 25;

var Util = require('./Util');

// constructor
function Obstacle(x, y) {
	this.x = x;
	this.y = y;
	this.hitboxSize = Obstacle.HITBOX_SIZE;
	this.shouldExist = true;
	return this;
};

// determines collision
Obstacle.prototype.isCollidedWith = function(x, y, hitboxSize) {
	var minDistance = this.hitboxSize + hitboxSize;
	return Util.getEuclideanDistance2(this.x, this.y, x, y) < (minDistance * minDistance);
};

// generates a random obstacle
Obstacle.generateRandomObstacle = function() {
	var point = Util.getRandomWorldPoint();
	return new Obstacle(point[0], point[1]);
};

module.exports = Obstacle;
