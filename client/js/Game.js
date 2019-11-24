Game.WIDTH = 800;
Game.HEIGHT = 600;
Game.SHOOTING_INTERVAL = 800;

// constructor
function Game(canvas, socket) {
	this.canvas = canvas;
	this.canvas.width = Game.WIDTH;
	this.canvas.height = Game.HEIGHT;
	this.canvasContext = this.canvas.getContext('2d');
	this.socket = socket;
	this.drawing = new Drawing(this.canvasContext);
	this.viewPort = new ViewPort();
	this.environment = new Environment(this.viewPort, this.drawing);
	this.id = null;
	this.players = [];
	this.projectiles = [];
	this.powerups = [];
	this.obstacles = [];
};

// stores client's socket ID
Game.prototype.setID = function(id) {
	this.id = id;
	this.viewPort.setID(id);
};

// returns object representing player instance
Game.prototype.findSelf = function() {
	for (var i = 0; i < this.players.length; ++i) {
		if (this.players[i].id == this.id) {
			return this.players[i];
		}
	}
	return null;
};

// updates storage of all players
Game.prototype.receivePlayers = function(players) {
	this.players = players;
};

// updates storage of all projectiles
Game.prototype.receiveProjectiles = function(projectiles) {
	this.projectiles = projectiles;
};

// updates storage of all powerups
Game.prototype.receivePowerups = function(powerups) {
	this.powerups = powerups;
};

// updates storage of all powerups
Game.prototype.receiveObstacles = function(obstacles) {
	this.obstacles = obstacles;
};

// updates game-state client-side and emits inputs to the server
Game.prototype.update = function() {
	var self = this.findSelf();
	this.viewPort.update(self.x, self.y);

	var turretAngle = Math.atan2(
		Input.MOUSE[1] - Game.HEIGHT / 2,
		Input.MOUSE[0] - Game.WIDTH / 2) + Math.PI / 2;

	// emits player wanting to move to the server
	this.socket.emit('move-player', {
		keyboardState: {
			up: Input.UP,
			right: Input.RIGHT,
			down: Input.DOWN,
			left: Input.LEFT
		},
		turretAngle: turretAngle
	});

	// emits player wanting to shoot to the server
	if (Input.LEFT_CLICK) {
		var self = this.findSelf();
		this.socket.emit('fire-bullet');
	}

	// updates leaderboard
	this.players.sort(function(o1, o2) {
		return o2.score > o1.score;
	});
	$('#leaderboard').empty();
	for (var i = 0; i < Math.min(this.players.length, 10); ++i) {
		$('#leaderboard').append($('<li>').text(
			this.players[i].name + ": " + this.players[i].score))
	};
};

// draws game-state on the canvas
Game.prototype.draw = function() {
	this.canvasContext.clearRect(0, 0, Game.WIDTH, Game.HEIGHT);

	this.environment.draw();

	for (var i = 0; i < this.projectiles.length; ++i) {
		this.drawing.drawBullet(
			this.viewPort.toCanvasCoords(this.projectiles[i]),
			this.projectiles[i].direction);
	}
	
	for (var i = 0; i < this.obstacles.length; ++i) {
		this.drawing.drawObstacle(this.viewPort.toCanvasCoords(this.obstacles[i]));
	}

	var visiblePowerups = this.viewPort.getVisibleObjects(this.powerups);
	for (var i = 0; i < visiblePowerups.length; ++i) {
		this.drawing.drawPowerup(
			this.viewPort.toCanvasCoords(visiblePowerups[i]),
			visiblePowerups[i].name);
	}
  
	var visiblePlayers = this.viewPort.getVisibleObjects(this.players);
	for (var i = 0; i < visiblePlayers.length; ++i) {
		this.drawing.drawTank(
			visiblePlayers[i].id == this.id,
			this.viewPort.toCanvasCoords(visiblePlayers[i]),
			visiblePlayers[i].orientation,
			visiblePlayers[i].turretAngle,
			visiblePlayers[i].name,
			visiblePlayers[i].health,
			visiblePlayers[i].powerups['shield_powerup']);
	}
};
