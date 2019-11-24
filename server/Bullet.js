var Util = require('./Util');
 
Bullet.VELOCITY = 20;
Bullet.DEFAULT_DAMAGE = 1;
Bullet.MAX_TRAVEL_DISTANCE = 1000;
Bullet.HITBOX_SIZE = 10;

// constructor
function Bullet(x, y, direction, firedBy) {
	this.x = x;
	this.y = y;
	this.direction = direction;
	this.firedBy = firedBy;
	this.damage = Bullet.DEFAULT_DAMAGE;
	this.distanceTraveled = 0;
	this.hitboxSize = Bullet.HITBOX_SIZE;
	this.shouldExist = true;
	return this;
};

// determines collision
Bullet.prototype.isCollidedWith = function(x, y, hitboxSize) {
	var minDistance = this.hitboxSize + hitboxSize;
	return Util.getEuclideanDistance2(this.x, this.y, x, y) < (minDistance * minDistance);
};

// updates bullet and checks for collision with other objects
Bullet.prototype.update = function(clients, obstacles, powerups) {
	this.x += Bullet.VELOCITY * Math.sin(this.direction);
	this.y -= Bullet.VELOCITY * Math.cos(this.direction);
	this.distanceTraveled += Bullet.VELOCITY;

	if (this.distanceTraveled > Bullet.MAX_TRAVEL_DISTANCE || !Util.inWorld(this.x, this.y)) {
		this.shouldExist = false;
		return;
	}

	for (var i = 0; i < clients.length; ++i) {
		if (this.firedBy != clients[i].id && clients[i].isCollidedWith(this.x, this.y, Bullet.HITBOX_SIZE)) {
			clients[i].damage(1);
			if (clients[i].isDead()) {
				clients[i].respawn();
				var killingPlayer = clients.get(this.firedBy);
				killingPlayer.score++;
			}
			this.shouldExist = false;
			return;
		}
	}
	
	for (var i = 0; i < obstacles.length; ++i) {
		if (obstacles[i].isCollidedWith(this.x, this.y, Bullet.HITBOX_SIZE)) {
			this.shouldExist = false;
			return;
		}
	}
	
	for (var i = 0; i < powerups.length; ++i) {
		if (powerups[i].isCollidedWith(this.x, this.y, Bullet.HITBOX_SIZE)) {
			this.shouldExist = false;
			return;
		}
	}
};

module.exports = Bullet;
