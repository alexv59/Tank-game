Drawing.NAME_FONT = '16px Arial';
Drawing.NAME_COLOR = 'cyan';
Drawing.HP_COLOR = 'cyan';
Drawing.HP_MISSING_COLOR = 'red';
Drawing.SELF_TANK_SRC = '../img/player_tank.png';
Drawing.SELF_TURRET_SRC = '../img/player_turret.png';
Drawing.OTHER_TANK_SRC = '../img/enemy_tank.png';
Drawing.OTHER_TURRET_SRC = '../img/enemy_turret.png';
Drawing.BULLET_SRC = '../img/bullet.png';
Drawing.OBSTACLE_SRC = '../img/obstacle.png';
Drawing.TILE_SRC = '../img/tile.png';
Drawing.TILE_SIZE = 100;

// class constructor
function Drawing(context) {
	this.context = context;
};

// draws a tank on the canvas
Drawing.prototype.drawTank = function(isSelf, coords, orientation,
                                      turretAngle, name, health,
                                      hasShield) {
	this.context.save();
	this.context.translate(coords[0], coords[1]);
	this.context.textAlign = 'center';
	this.context.font = Drawing.NAME_FONT;
	this.context.fillStyle = Drawing.NAME_COLOR;
	this.context.fillText(name, 0, -50);
	this.context.restore();

	this.context.save();
	this.context.translate(coords[0], coords[1]);
	for (var i = 0; i < 10; i++) {
		if (i < health) {
			this.context.fillStyle = Drawing.HP_COLOR;
			this.context.fillRect(-25 + 5 * i, -42, 5, 4);
		} else {
			this.context.fillStyle = Drawing.HP_MISSING_COLOR;
			this.context.fillRect(-25 + 5 * i, -42, 5, 4);
		}
	}     
	this.context.restore();

	this.context.save();
	this.context.translate(coords[0], coords[1]);
	this.context.rotate(orientation);
	var tank = new Image();
	if (isSelf) {
		tank.src = Drawing.SELF_TANK_SRC;
	} else {
		tank.src = Drawing.OTHER_TANK_SRC;
	}
	this.context.drawImage(tank, -tank.width / 2, -tank.height / 2);
	this.context.restore();

	this.context.save();
	this.context.translate(coords[0], coords[1]);
	this.context.rotate(turretAngle);
	var turret = new Image();
	if (isSelf) {
		turret.src = Drawing.SELF_TURRET_SRC;
	} else {
		turret.src = Drawing.OTHER_TURRET_SRC;
	}
	this.context.drawImage(turret, -turret.width / 2, -turret.height / 2);
	this.context.restore();
};

// draws a bullet on the canvas
Drawing.prototype.drawBullet = function(coords, direction) {
	this.context.save();
	this.context.translate(coords[0], coords[1]);
	this.context.rotate(direction);
	var bullet = new Image();
	bullet.src = Drawing.BULLET_SRC;
	this.context.drawImage(bullet, -bullet.width / 2, -bullet.height / 2);
	this.context.restore();
}

// draws a powerup on the canvas
Drawing.prototype.drawPowerup = function(coords, name) {
	this.context.save();
	this.context.translate(coords[0], coords[1]);
	var powerup = new Image();
	powerup.src = '../img/' + name + '.png';
	this.context.drawImage(powerup, -powerup.width / 2, -powerup.height / 2);
	this.context.restore();
}

// draws an obstacle on the canvas
Drawing.prototype.drawObstacle = function(coords) {
	this.context.save();
	this.context.translate(coords[0], coords[1]);
	var obstacle = new Image();
	obstacle.src = Drawing.OBSTACLE_SRC;
	this.context.drawImage(obstacle, -obstacle.width / 2, -obstacle.height / 2);
	this.context.restore();
}

// draws the background tiles on the canvas
Drawing.prototype.drawTiles = function(topLeft, bottomRight) {
	this.context.save();
	var tile = new Image();
	tile.src = Drawing.TILE_SRC;
	for (var x = topLeft[0]; x < bottomRight[0]; x += Drawing.TILE_SIZE) {
		for (var y = topLeft[1]; y < bottomRight[1]; y += Drawing.TILE_SIZE) {
			this.context.drawImage(tile, x, y);
		}
	}
	this.context.restore();
}
