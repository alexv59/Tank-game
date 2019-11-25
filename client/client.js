var socket = io();
var game = new Game(document.getElementById('canvas'), socket);

$(document).ready(function() {
	$('#name-input').focus();
});;

// creates and sends an instance of player
function send_name() {
	name = $('#name-input').val();
	if (name && name.length <= 20) {
		socket.emit('new-player', { name: name });
		$('#name-prompt-container').empty();
		$('#name-prompt-container').append( $('<span>').addClass('fa fa-2x fa-spinner fa-pulse'));
	} else {
		window.alert('Your name cannot be blank or over 20 characters.');
	}
	return false;
};

$('#name-form').submit(send_name);
$('#name-submit').click(send_name);

// initializes the game when server receives an instance of player
socket.on('send-id', function(data) {
	game.setID(data.id);
	game.receivePlayers(data.players);
	$('#name-prompt-overlay').fadeOut(500);
	init();
	animate();
});

// updates objects when data is received from the server
socket.on('update-players', function(data) {
	game.receivePlayers(data);
});

socket.on('update-projectiles', function(data) {
	game.receiveProjectiles(data);
});

socket.on('update-powerups', function(data) {
	game.receivePowerups(data);
});

socket.on('update-obstacles', function(data) {
	game.receiveObstacles(data);
});

window.requestAnimFrame = (function() {
	return  window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function(callback, element) {
				window.setTimeout(callback, 1000 / 60);
			};
})();

function init() {
	Input.applyEventHandlers();
};

function animate() {
	game.update();
	game.draw();
	window.requestAnimFrame(animate);
};
