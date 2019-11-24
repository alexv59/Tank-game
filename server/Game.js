Game.MAX_MAP_POWERUPS = 25;
Game.MAP_OBSTACLES = 25;
var HashMap = require('hashmap');
var Player = require('./Player');
var Bullet = require('./Bullet');
var Powerup = require('./Powerup');
var Obstacle = require('./Obstacle');

// constructor
function Game() {
	this.clients = new HashMap();
	this.projectiles = [];
	this.powerups = [];
	this.obstacles = [];
	return this;
};

// creates a new player
Game.prototype.addNewPlayer = function(name, id) {
	this.clients.set(id, Player.generateNewPlayer(name, id));
};

// removes a player
Game.prototype.removePlayer = function(id) {
	if (this.clients.has(id)) {
		this.clients.remove(id);
	}
};

// updates a player according to received input
Game.prototype.updatePlayer = function(id, keyboardState, turretAngle) {
	var player = this.clients.get(id);
	if (player != undefined && player != null) {
		player.updateOnInput(keyboardState, turretAngle);
	}
};

// returns currently active players
Game.prototype.getPlayers = function() {
	return this.clients.values();
};

// adds a projectile
Game.prototype.addProjectile = function(id) {
	var player = this.clients.get(id);
	if (player != undefined && player != null && player.canShoot()) {
		this.projectiles = this.projectiles.concat(player.getProjectilesShot());
	}
};

// returns currently existing projectiles
Game.prototype.getProjectiles = function() {
	return this.projectiles;
};

// returns currently existing powerups
Game.prototype.getPowerups = function() {
	return this.powerups;
};

// returns currently existing obstacles
Game.prototype.getObstacles = function() {
	return this.obstacles;
};

// updates the state of all objects, checks for collision between objects and sends data to connected clients
Game.prototype.update = function(io) {
	var players = this.getPlayers();
	for (var i = 0; i < players.length; ++i) {
		players[i].update();
		var obstacles = this.getObstacles();
		for (var j = 0; j < obstacles.length; ++j) {
			if (obstacles[j].isCollidedWith(players[i].x, players[i].y, players[i].hitboxSize)) {
				players[i].damage(10);
				if (players[i].isDead) {
					players[i].respawn();
				}
			}
		}
		for (var k = 0; k < players.length; ++k){
			if (players[i].name != players[k].name) {
				if (players[k].isCollidedWith(players[i].x, players[i].y, players[i].hitboxSize)){
					players[i].damage(1);
					players[i].orientation = -1 * players[i].orientation;
					if (players[i].isDead) {
						players[i].respawn();
					}
				}
			}
		}
	}
  
	for (var i = 0; i < this.projectiles.length; ++i) {
		if (this.projectiles[i].shouldExist) {
			this.projectiles[i].update(this.clients, this.obstacles, this.powerups);
		} else {
			io.sockets.emit('update-projectiles', this.projectiles.splice(i, 1));
			i--;
		}
	}

	while (this.obstacles.length < Game.MAP_OBSTACLES) {
		this.obstacles.push(Obstacle.generateRandomObstacle());
	}

	while (this.powerups.length < Game.MAX_MAP_POWERUPS) {
		this.powerups.push(Powerup.generateRandomPowerup());
	}
	
	for (var i = 0; i < this.powerups.length; ++i) {
		if (this.powerups[i].shouldExist) {
			this.powerups[i].update(this.getPlayers(), this.getProjectiles(), this.getObstacles());
		} else {
			this.powerups.splice(i, 1);
			i--;
		}
	}
  
	io.sockets.emit('update-players', players);
	io.sockets.emit('update-projectiles', this.getProjectiles());
	io.sockets.emit('update-powerups', this.getPowerups());
	io.sockets.emit('update-obstacles', this.getObstacles());
};

module.exports = Game;
