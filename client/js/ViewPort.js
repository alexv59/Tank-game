ViewPort.VISIBILITY_THRESHOLD = 50;

// constructor
function ViewPort() {
	this.selfCoords = [];
	this.selfId = null;
};

// stores this client's socket ID
ViewPort.prototype.setID = function(id) {
	this.selfId = id;
};

// updates viewport
ViewPort.prototype.update = function(x, y) {
	this.selfCoords = [x, y];
};

// returns objects visible within player's viewport
ViewPort.prototype.getVisibleObjects = function(objects) {
	var onScreen = [];
	for (var i = 0; i < objects.length; i++) {
		if (Math.abs(objects[i].x - this.selfCoords[0]) <
			Game.WIDTH / 2 + ViewPort.VISIBILITY_THRESHOLD &&
			Math.abs(objects[i].y - this.selfCoords[1]) <
			Game.HEIGHT / 2 + ViewPort.VISIBILITY_THRESHOLD) {
			onScreen.push(objects[i]);
		}
	}
	return onScreen;
};

// returns an array containing object's coordinates converted from absolute to viewport's
ViewPort.prototype.toCanvasCoords = function(object) {
	if (object.x == null || object.x == undefined ||
		object.y == null || object.y == undefined) {
		throw new Error('Invalid object');
	}
	if (object.id == this.selfId) {
		return [Game.WIDTH / 2, Game.HEIGHT / 2];
	} else {
		var translateX = this.selfCoords[0] - Game.WIDTH / 2;
		var translateY = this.selfCoords[1] - Game.HEIGHT / 2;
		return [object.x - translateX,
				object.y - translateY];
	}
};