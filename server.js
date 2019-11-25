var PORT_NUMBER = process.env.PORT || 5000;
var FRAME_RATE = 1000.0 / 60.0;

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Game = require('./server/Game');

var game = new Game();

app.set('port', PORT_NUMBER);

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/client/index.html');
});

app.get('/*', function(req, res) {
	res.sendFile(__dirname + '/client' + req.path);
});

// server-side input handler
io.on('connection', function(socket) {
	socket.on('new-player', function(data) {
		game.addNewPlayer(data.name, socket.id);
		socket.emit('send-id', {
			id: socket.id,
			players: game.getPlayers()
		});
	});

	socket.on('move-player', function(data) {
		game.updatePlayer(socket.id, data.keyboardState, data.turretAngle);
	});

	socket.on('fire-bullet', function() {
		game.addProjectile(socket.id);
	});

	socket.on('disconnect', function() {
		game.removePlayer(socket.id);
	});
});

// server-side loop trying to run at 60Hz
setInterval(function() {
	game.update(io);
}, FRAME_RATE);

http.listen(PORT_NUMBER, function() {
	console.log('Server started on port ' + PORT_NUMBER);
});
