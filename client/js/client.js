require('../css/styles.css')

const Constants = require('../../../lib/Constants')
const Entity = require('../../../lib/Entity')
const Vector = require('../../../lib/Vector')
const Util = require('../../../lib/Util')

const $ = require('jquery')
const io = require('socket.io-client')

class Chat {
	// class constructor
	constructor(socket, displayElement, inputElement) {
		this.socket = socket
		this.displayElement = displayElement
		this.inputElement = inputElement
	}

	// method to create a Chat class
	static create(socket, displayElementID, inputElementID) {
		const displayElement = document.getElementById(displayElementID)
		const inputElement = document.getElementById(inputElementID)
		const chat = new Chat(socket, displayElement, inputElement)
		chat.init()
		return chat
	}

	// binds event handlers to initialize class
	init() {
		this.inputElement.addEventListener('keydown', this.onInputKeyDown.bind(this))
		this.socket.on(Constants.SOCKET_CHAT_SERVER_CLIENT, this.onChatReceive.bind(this))
	}

	// event handler for a key down element on the input chat element
	onInputKeyDown(event) {
		if (event.keyCode === 13) {
		const text = this.inputElement.value
		this.inputElement.value = ''
		this.socket.emit(Constants.SOCKET_CHAT_CLIENT_SERVER, text)
		}
	}

	// event handler for a socket message received for a chat message
	onChatReceive(data) {
		const element = document.createElement('li')
		if (data.isNotification) {
		element.setAttribute('class', 'notification')
		}
		element.appendChild(
		document.createTextNode(`${data.name}: ${data.message}`))
		this.displayElement.appendChild(element)
	}
}

class Drawing {
	// class constructor
	constructor(context, images, viewport) {
		this.context = context
		this.images = images
		this.viewport = viewport
		this.width = context.canvas.width
		this.height = context.canvas.height
	}

	// method for creating a Drawing object
	static create(canvas, viewport) {
		const context = canvas.getContext('2d')
		const images = {}
		for (const key of Constants.DRAWING_IMG_KEYS) {
		images[key] = new Image()
		images[key].src = `${Constants.DRAWING_IMG_BASE_PATH}/${key}.png`
		}
		for (const type of Constants.POWERUP_KEYS) {
		images[type] = new Image()
		images[type].src =
			`${Constants.DRAWING_IMG_BASE_PATH}/${type}_pup.png`
		}
		return new Drawing(context, images, viewport)
	}

	// convert an angle to canvas coordinates
	static translateAngle(angle) {
		return Util.normalizeAngle(angle + Math.PI / 2)
	}

	// draws an image on the canvas at the center of the origin
	drawCenteredImage(image) {
		this.context.drawImage(image, -image.width / 2, -image.height / 2)
	}

	// clears the canvas
	clear() {
		this.context.clearRect(0, 0, this.width, this.height)
	}

	// draws a player on the canvas as a tank
	drawTank(isSelf, player) {
		this.context.save()
		const canvasCoords = this.viewport.toCanvas(player.position)
		this.context.translate(canvasCoords.x, canvasCoords.y)

		this.context.textAlign = 'center'
		this.context.font = Constants.DRAWING_NAME_FONT
		this.context.fillStyle = Constants.DRAWING_NAME_COLOR
		this.context.fillText(player.name, 0, -50)

		for (let i = 0; i < 10; ++i) {
			if (i < player.health) {
			this.context.fillStyle = Constants.DRAWING_HP_COLOR
			} else {
			this.context.fillStyle = Constants.DRAWING_HP_MISSING_COLOR
			}
			this.context.fillRect(-25 + 5 * i, -40, 5, 4)
		}

		this.context.rotate(Drawing.translateAngle(player.tankAngle))
		this.drawCenteredImage(this.images[isSelf ? Constants.DRAWING_IMG_PLAYER_TANK : Constants.DRAWING_IMG_ENEMY_TANK])
		this.context.rotate(-Drawing.translateAngle(player.tankAngle))

		this.context.rotate(Drawing.translateAngle(player.turretAngle))
		this.drawCenteredImage(this.images[isSelf ? Constants.DRAWING_IMG_PLAYER_TURRET : Constants.DRAWING_IMG_ENEMY_TURRET])

		if (player.powerups[Constants.POWERUP_SHIELD]) {
			this.context.rotate(-Drawing.translateAngle(-player.turretAngle))
			this.drawCenteredImage(this.images[Constants.DRAWING_IMG_SHIELD])
		}

		this.context.restore()
	}

	// draws a bullet on the canvas
	drawBullet(bullet) {
		this.context.save()
		const canvasCoords = this.viewport.toCanvas(bullet.position)
		this.context.translate(canvasCoords.x, canvasCoords.y)
		this.context.rotate(Drawing.translateAngle(bullet.angle))
		this.drawCenteredImage(this.images[Constants.DRAWING_IMG_BULLET])
		this.context.restore()
	}

	// draws a power-up on the canvas
	drawPowerup(powerup) {
		this.context.save()
		const canvasCoords = this.viewport.toCanvas(powerup.position)
		this.context.translate(canvasCoords.x, canvasCoords.y)
		this.drawCenteredImage(this.images[powerup.type])
		this.context.restore()
	}

	// draws background tiles on the canvas
	drawTiles() {
		const start = this.viewport.toCanvas({ x: Constants.WORLD_MIN, y: Constants.WORLD_MIN })
		const end = this.viewport.toCanvas({ x: Constants.WORLD_MAX, y: Constants.WORLD_MAX })
		for (let x = start.x; x < end.x; x += Constants.DRAWING_TILE_SIZE) {
			for (let y = start.y; y < end.y; y += Constants.DRAWING_TILE_SIZE) {
				this.context.drawImage(this.images[Constants.DRAWING_IMG_TILE], x, y)
			}
		}
	}
}

class Input {
  // class constructor
	constructor() {
		this.up = false
		this.down = false
		this.left = false
		this.right = false
		this.mouseDown = false
		this.mouseCoords = [0, 0]
	}

	// method for creating an Input class
	static create(keyElement, mouseMoveElement) {
		const input = new Input()
		input.applyEventHandlers(keyElement, keyElement, mouseMoveElement)
		return input
	}

	// key down event handler
	onKeyDown(event) {
		switch (event.keyCode) {
		case 37:
		case 65:
		case 97:
			this.left = true
			break
		case 38:
		case 87:
		case 199:
		  this.up = true
		  break
		case 39:
		case 68:
		case 100:
		  this.right = true
		  break
		case 40:
		case 83:
		case 115:
		  this.down = true
		default:
		  break
		}
	}

	// key up event handler
	onKeyUp(event) {
		switch (event.keyCode) {
		case 37:
		case 65:
		case 97:
		  this.left = false
		  break
		case 38:
		case 87:
		case 199:
		  this.up = false
		  break
		case 39:
		case 68:
		case 100:
		  this.right = false
		  break
		case 40:
		case 83:
		case 115:
		  this.down = false
		default:
		  break
		}
	}

	// mouse down event handler
	onMouseDown(event) {
		if (event.which === 1) {
		this.mouseDown = true
		}
	}

	// mouse up event handler
	onMouseUp(event) {
		if (event.which === 1) {
		this.mouseDown = false
		}
	}

	// mouse move event handler
	onMouseMove(event) {
		this.mouseCoords = [event.offsetX, event.offsetY]
	}

	// applies event handlers to elements in the DOM
	applyEventHandlers(keyElement, mouseClickElement, mouseMoveElement) {
		keyElement.addEventListener('keydown', this.onKeyDown.bind(this))
		keyElement.addEventListener('keyup', this.onKeyUp.bind(this))
		mouseClickElement.addEventListener('mousedown', this.onMouseDown.bind(this))
		mouseClickElement.addEventListener('mouseup', this.onMouseUp.bind(this))
		mouseMoveElement.setAttribute('tabindex', 1)
		mouseMoveElement.addEventListener('mousemove', this.onMouseMove.bind(this))
	}
}

class Leaderboard {
	// class constructor
	constructor(container) {
		this.container = container
	}

	// method for creating a leaderboard object
	static create(containerElementID) {
		return new Leaderboard(document.getElementById(containerElementID))
	}

	// updates the leaderboard with the list of the current players
	update(players) {
		while (this.container.firstChild) {
			this.container.removeChild(this.container.firstChild)
		}
		players.sort((a, b) => { return b.kills - a.kills })
		players.slice(0, 10).forEach(player => {
			const containercontainer = document.createElement('li')
			const text = `${player.name} - Kills: ${player.kills} Deaths: ${player.deaths}`
			containercontainer.appendChild(document.createTextNode(text))
			this.container.appendChild(containercontainer)
		})
	}
}

class Viewport extends Entity {
	// class constructor
	constructor(position, velocity, canvasWidth, canvasHeight) {
		super(position, velocity)
		this.playerPosition = null
		this.canvasOffset = new Vector(canvasWidth / 2, canvasHeight / 2)
	}

	// create a Viewport object
	static create(canvas) {
		return new Viewport(Vector.zero(), Vector.zero(), canvas.width, canvas.height)
	}

	// update the viewport with the relative player position it should track
	updateTrackingPosition(player) {
		this.playerPosition = Vector.sub(player.position, this.canvasOffset)
	}

	// updates velocity and position of the viewport
	update(deltaTime) {
		this.velocity = Vector.sub(this.playerPosition, this.position).scale(Constants.VIEWPORT_STICKINESS * deltaTime)
		this.position.add(this.velocity)
	}

	// converts an absolute world coordinate to a position on the canvas in this viewport's FOV
	toCanvas(position) {
		return Vector.sub(position, this.position)
	}

	// converts a canvas coordinate to an absolute world coordinate in this viewport's FOV
	toWorld(position) {
		return Vector.add(position, this.position)
	}
}

class Game {
	// class constructor
	constructor(socket, viewport, drawing, input, leaderboard) {
		this.socket = socket

		this.viewport = viewport
		this.drawing = drawing
		this.input = input
		this.leaderboard = leaderboard

		this.self = null
		this.players = []
		this.projectiles = []
		this.powerups = []

		this.animationFrameId = null
		this.lastUpdateTime = 0
		this.deltaTime = 0
	}

	// method for creating a Game class
	static create(socket, canvasElementID, leaderboardElementID) {
		const canvas = document.getElementById(canvasElementID)
		canvas.width = Constants.CANVAS_WIDTH
		canvas.height = Constants.CANVAS_HEIGHT

		const viewport = Viewport.create(canvas)
		const drawing = Drawing.create(canvas, viewport)
		const input = Input.create(document, canvas)

		const leaderboard = Leaderboard.create(leaderboardElementID)

		const game = new Game(socket, viewport, drawing, input, leaderboard)
		game.init()
		return game
	}

	// initializes Game and binds the socket event listener
	init() {
		this.lastUpdateTime = Date.now()
		this.socket.on(Constants.SOCKET_UPDATE, this.onReceiveGameState.bind(this))
	}

	// socket event handler
	onReceiveGameState(state) {
		this.self = state.self
		this.players = state.players
		this.projectiles = state.projectiles
		this.powerups = state.powerups

		this.viewport.updateTrackingPosition(state.self)
		this.leaderboard.update(state.players)
	}

	// starts animation and update loop to run the game
	run() {
		const currentTime = Date.now()
		this.deltaTime = currentTime - this.lastUpdateTime
		this.lastUpdateTime = currentTime

		this.update()
		this.draw()
		this.animationFrameId = window.requestAnimationFrame(this.run.bind(this))
	}

	// stops animation and update loop
	stop() {
		window.cancelAnimationFrame(this.animationFrameId)
	}

	// updates the client state of the game, sends uset input to the server
	update() {
		if (this.self) {
			this.viewport.update(this.deltaTime)

			const absoluteMouseCoords = this.viewport.toWorld(Vector.fromArray(this.input.mouseCoords))
			const playerToMouseVector = Vector.sub(this.self.position,absoluteMouseCoords)

			this.socket.emit(Constants.SOCKET_PLAYER_ACTION, {
				up: this.input.up,
				down: this.input.down,
				left: this.input.left,
				right: this.input.right,
				shoot: this.input.mouseDown,
				turretAngle: Util.normalizeAngle(playerToMouseVector.angle + Math.PI)
			})
			}
	}

   // draws the state of the game on the canvas
	draw() {
		if (this.self) {
			this.drawing.clear()

			this.drawing.drawTiles()

			this.projectiles.forEach(this.drawing.drawBullet.bind(this.drawing))

			this.powerups.forEach(this.drawing.drawPowerup.bind(this.drawing))

			this.drawing.drawTank(true, this.self)
			this.players.forEach(tank => this.drawing.drawTank(false, tank))
		}
	}
}

$(document).ready(() => {
	const socket = io()
	const game = Game.create(socket, 'canvas', 'leaderboard')
	Chat.create(socket, 'chat-display', 'chat-input')

	$('#name-input').focus()

   // method to send the player name to the server
	const sendName = () => {
		const name = $('#name-input').val()
		if (name && name.length < 20) {
			$('#name-prompt-container').empty()
			$('#name-prompt-container').append($('<span>').addClass('fa fa-2x fa-spinner fa-pulse'))
			socket.emit('new-player', { name }, () => {
				$('#name-prompt-overlay').remove()
				$('#canvas').focus()
				game.run()
			})
		} else {
		window.alert('Your name cannot be blank or over 20 characters.')
		}
		return false
	}
	$('#name-form').submit(sendName)
	$('#name-submit').click(sendName)
})
