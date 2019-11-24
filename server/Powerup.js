Powerup.HITBOX_SIZE = 9;
Powerup.HEALTHPACK = 'healthpack';
Powerup.HEALTHPACK_MIN_HEAL = 1;
Powerup.HEALTHPACK_MAX_HEAL = 5;
Powerup.SHOTGUN = 'shotgun';
Powerup.SHOTGUN_MIN_BONUS_SHELLS = 1;
Powerup.SHOTGUN_MAX_BONUS_SHELLS = 4;
Powerup.RAPIDFIRE = 'rapidfire';
Powerup.RAPIDFIRE_MIN_MULTIPLIER = 1.1;
Powerup.RAPIDFIRE_MAX_MULTIPLIER = 4.0;
Powerup.SPEEDBOOST = 'speedboost';
Powerup.SPEEDBOOST_MIN_MULTIPLIER = 1.2;
Powerup.SPEEDBOOST_MAX_MULTIPLIER = 1.8;
Powerup.POWERUPS = [Powerup.HEALTHPACK,
                    Powerup.SHOTGUN,
                    Powerup.RAPIDFIRE,
                    Powerup.SPEEDBOOST];
Powerup.MIN_DURATION = 10000;
Powerup.MAX_DURATION = 20000;

var Util = require('./Util');

// constructor
function Powerup(x, y, name, data, duration) {
	this.x = x;
	this.y = y;
	this.name = name;
	this.data = data;
	this.duration = duration;
	this.hitboxSize = Powerup.HITBOX_SIZE;
	this.shouldExist = true;
	return this;
};

// generates a random powerup
Powerup.generateRandomPowerup = function() {
	var point = Util.getRandomWorldPoint();
	var name = Util.choiceArray(Powerup.POWERUPS);
	var data = null;
	switch (name) {
		case Powerup.HEALTHPACK:
			data = Util.randRangeInt(Powerup.HEALTHPACK_MIN_HEAL, Powerup.HEALTHPACK_MAX_HEAL + 1);
			break;
		case Powerup.SHOTGUN:
			data = Util.randRangeInt(Powerup.SHOTGUN_MIN_BONUS_SHELLS, Powerup.SHOTGUN_MAX_BONUS_SHELLS + 1);
			break;
		case Powerup.RAPIDFIRE:
			data = Util.randRange(Powerup.RAPIDFIRE_MIN_MULTIPLIER, Powerup.RAPIDFIRE_MAX_MULTIPLIER);
			break;
		case Powerup.SPEEDBOOST:
			data = Util.randRange(Powerup.SPEEDBOOST_MIN_MULTIPLIER, Powerup.SPEEDBOOST_MAX_MULTIPLIER);
			break;
	}
	var duration = Util.randRange(Powerup.MIN_DURATION, Powerup.MAX_DURATION);
	return new Powerup(point[0], point[1], name, data, duration);
};

// returns an object to apply to a player
Powerup.prototype.getAppliedObject = function() {
	return {
		name: this.name,
		data: this.data,
		expirationTime: (new Date()).getTime() + this.duration
	};
};

// determines collision
Powerup.prototype.isCollidedWith = function(x, y, hitboxSize) {
	var minDistance = this.hitboxSize + hitboxSize;
	return Util.getEuclideanDistance2(this.x, this.y, x, y) < (minDistance * minDistance);
};

// removes the powerup if collected, hit by a bullet or generated inside the obstacle
Powerup.prototype.update = function(players, projectiles, obstacles) {
	for (var i = 0; i < players.length; ++i) {
		if (players[i].isCollidedWith(this.x, this.y, Powerup.HITBOX_SIZE)) {
			players[i].applyPowerup(this.name, this.getAppliedObject());
			this.shouldExist = false;
			return;
		}
	}
	
	for (var i = 0; i < projectiles.length; ++i) {
		if (projectiles[i].isCollidedWith(this.x, this.y, Powerup.HITBOX_SIZE)) {
			this.shouldExist = false;
			return;
		}
	}
	
	for (var i = 0; i < obstacles.length; ++i) {
		if (obstacles[i].isCollidedWith(this.x, this.y, Powerup.HITBOX_SIZE)) {
			this.shouldExist = false;
			return;
		}
	}
};

module.exports = Powerup;
