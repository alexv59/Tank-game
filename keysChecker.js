var keyChecker = new KeyChecker();
function KeyChecker(){
    this.keyStatus = {up:false,down:false,left:false,right:false,fire:false};

    this.keyDownListener = function(e){
		var key = e.keyCode ? e.keyCode : e.which;
		switch(key){
		
		case 87:
		case 38:
		//Up
            keyChecker.keyStatus.up = true;
		break;
		case 83:
		case 40:
		//Down
            keyChecker.keyStatus.down = true;
		break;
		case 65:
		case 37:
		//Left
            keyChecker.keyStatus.left = true;
		break;
		case 68:
		case 39:
		//Rigth
            keyChecker.keyStatus.right = true;
		break;
		case 32:
		//Space
            keyChecker.keyStatus.fire = true;
		break;
		
		default:
			console.log("Key:" + key);
			return !false;
	}
	return !true;
	};
	this.keyUpListener = function(e){
		var key = e.keyCode ? e.keyCode : e.which;
		switch(key){
		
		case 87:
		case 38:
		//Up
        keyChecker.keyStatus.up = false;
		break;
		case 83:
		case 40:
		//Down
        keyChecker.keyStatus.down = false;
		break;
		case 65:
		case 37:
		//Left
        keyChecker.keyStatus.left = false;
		break;
		case 68:
		case 39:
		//Rigth
        keyChecker.keyStatus.right = false;
		break;
		case 32:
		//Space
        keyChecker.keyStatus.fire = false;
		break;
		default:
			console.log("Key:" + key);
			return !false;
	}
	return !true;
	};
}