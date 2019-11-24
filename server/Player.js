Player.TURN_RATE = Math.PI / 45;
Player.DEFAULT_VELOCITY = 4;
Player.DEFAULT_SHOT_COOLDOWN = 800;
Player.DEFAULT_HITBOX_SIZE = 20;
Player.MAX_HEALTH = 10;
Player.MINIMUM_RESPAWN_BUFFER = 10;

var Bullet = require('./Bullet');
var Powerup = require('./Powerup');
var Util = require('./Util');

// constructor
function Player(x, y, orientation, name, id) {
	this.x = x;
	this.y = y;
	this.orientation = orientation;
	this.turretAngle = orientation;
	this.name = name;
	this.id = id;
	this.velocity = Player.DEFAULT_VELOCITY;
	this.shotCooldown = Player.DEFAULT_SHOT_COOLDOWN;
	this.health = Player.MAX_HEALTH;
	this.powerups = {};
	this.hitboxSize = Player.DEFAULT_HITBOX_SIZE;
	this.score = 0;
	this.lastShotTime = 0;
	return this;
};

// returns a new Player object
Player.generateNewPlayer = function(name, id) {
	var point = Util.getRandomWorldPoint();
	var orientation = Util.randRange(0, 2 * Math.PI);
	return new Player(point[0], point[1], orientation, name, id);
};

// updates player given keyboard state and mouse angle
Player.prototype.updateOnInput = function(keyboardState, turretAngle) {
	if (keyboardState.up) {
		this.x += this.velocity * Math.sin(this.orientation);
		this.y -= this.velocity * Math.cos(this.orientation);
	}
	if (keyboardState.down) {
		this.x -= this.velocity * Math.sin(this.orientation);
		this.y += this.velocity * Math.cos(this.orientation);
	}
	if (keyboardState.right) {
		this.orientation = this.orientation + Player.TURN_RATE;
	}
	if (keyboardState.left) {
		this.orientation = this.orientation - Player.TURN_RATE;
	}

	var boundedCoord = Util.boundWorld(this.x, this.y);
	this.x = boundedCoord[0];
	this.y = boundedCoord[1];
	this.turretAngle = turretAngle;
};

// updates player's powerup states
Player.prototype.update = function() {
	for (var powerup in this.powerups) {
		switch (powerup) {
			case Powerup.HEALTHPACK:
				this.health = Math.min(this.health + this.powerups[powerup].data, Player.MAX_HEALTH);
				delete this.powerups[powerup];
				continue;
			case Powerup.SHOTGUN:
				break;
			case Powerup.RAPIDFIRE:
				this.shotCooldown = Player.DEFAULT_SHOT_COOLDOWN / this.powerups[powerup].data;
				break;
			case Powerup.SPEEDBOOST:
				this.velocity = Player.DEFAULT_VELOCITY * this.powerups[powerup].data;
				break;
		}
		if ((new Date()).getTime() > this.powerups[powerup].expirationTime) {
			switch (powerup) {
				case Powerup.HEALTHPACK:
					break;
				case Powerup.SHOTGUN:
					break;
				case Powerup.RAPIDFIRE:
					this.shotCooldown = Player.DEFAULT_SHOT_COOLDOWN;
					break;
				case Powerup.SPEEDBOOST:
					this.velocity = Player.DEFAULT_VELOCITY;
					break;
			}
			delete this.powerups[powerup];    
		}
	}
};

// applies a powerup
Player.prototype.applyPowerup = function(name, powerup) {
	this.powerups[name] = powerup;
};

// returns bool indicating if player can shoot
Player.prototype.canShoot = function() {
	return (new Date()).getTime() > this.lastShotTime + this.shotCooldown;
};

// returns projectiles fired by the player
Player.prototype.getProjectilesShot = function() {
	bullets = [new Bullet(this.x, this.y, this.turretAngle, this.id)];
	if (this.powerups[Powerup.SHOTGUN] != null && this.powerups[Powerup.SHOTGUN] != undefined) {
		for (var i = 1; i < this.powerups[Powerup.SHOTGUN].data + 1; ++i) {
			bullets.push(new Bullet(this.x, this.y, this.turretAngle - (i * Math.PI / 9), this.id));
			bullets.push(new Bullet(this.x, this.y, this.turretAngle + (i * Math.PI / 9), this.id));
		}
	}
	this.lastShotTime = (new Date()).getTime();
	return bullets;
};

// determines collision
Player.prototype.isCollidedWith = function(x, y, hitboxSize) {
	var minDistance = this.hitboxSize + hitboxSize;
	return Util.getEuclideanDistance2(this.x, this.y, x, y) < (minDistance * minDistance);
};

// determines if player is dead
Player.prototype.isDead = function() {
	return this.health <= 0;
};

// damages the player
Player.prototype.damage = function(amount) {
	this.health -= amount;
};

// respawns if player is killed
Player.prototype.respawn = function(players) {
	var point = Util.getRandomWorldPoint();
	var isValidSpawn = false;
	var iter = 0;
	while (!isValidSpawn || iter < 15) {
		isValidSpawn = true;
		for (var i = 0; i < players; ++i) {
			if (Util.getEuclideanDistance2(point[0], point[1], players[i].x, players[i].y) < Player.MINIMUM_RESPAWN_BUFFER * Player.MINIMUM_RESPAWN_BUFFER) {
				isValidSpawn = false;
				continue;
			}
		}
		point = Util.getRandomWorldPoint();
		iter++;
	}

	this.x = point[0];
	this.y = point[1];
	this.score--;
	this.health = Player.MAX_HEALTH;
};

module.exports = Player;
