var tankPlayer = new TankPLayer();
var image = new Image();
image.src = "tank.png";
var getTime = function(){
    return (new Date()).getTime();
};

function TankPLayer(){
    this.x = 0; //player's x coordinate
	this.y = 0; //player's y coordinate
	this.vx = 0; //his x velocity
	this.vy = 0; //y velocity
    this.mod = 0; //new
    this.speed = 2; 
	this.angle = 0;
    this.lastShootTime = 0;
    this.shootDelayMs=600;
    //this.stats = {maxV:100,dAngle:0.03,acc:10,shootDelayMs:600};
    this.width = 50;
    this.height = 50;
    this.camX1 = 960;
    this.CamY;

    this.checkBounds = function(){ //function checks if the tank is within the map's bounds
        if(this.x  < 25 || this.x > (width - 25)){
            if ((this.x ) < 25){
            this.x = 25 ;
            }else {
                this.x = width -25;
            }
        }
        if (this.y < 25 || this.y > (height -25)){
            if(this.y <25){
            this.y=25;
            }else{
                this.y = height -25;
            }
        };
    };
    this.update = function(dt){
        
        if(keyChecker.keyStatus.up){ // check if w key is pressed
            this.mod = 1;     
        }
        if(keyChecker.keyStatus.down){ //s key 
            this.mod = -1;
        }
        if(keyChecker.keyStatus.right){//d-key    
            this.angle = (((this.angle+1) % 360) + 360) % 360;
        }
        if(keyChecker.keyStatus.left){//a-key   
            this.angle = (((this.angle-1) % 360) + 360) % 360;
        }
        if(keyChecker.keyStatus.up || keyChecker.keyStatus.down) {
            window.scrollTo((this.x -window.innerWidth /2), (this.y - window.innerHeight /2)); //keps the user in the  center of the map so he doesn't run outside of the screen
            console.log("angle " + this.angle);
            this.x += (this.speed*this.mod) * Math.cos(Math.PI/180 * (this.angle-90));
            this.y += (this.speed*this.mod) * Math.sin(Math.PI/180 * (this.angle-90));
            console.log("this is y "+ this.y);
            console.log("this is x "+ this.x);
            this.mod = 0;
        }

        var time = getTime();
        if(keyChecker.keyStatus.fire &&   //bullet shoot
			time - this.lastShootTime >= this.shootDelayMs){
                angleToRadian = Math.PI / 180 * this.angle;
			bullets.push({
				x:this.x,
				y:this.y-5,
				angle:angleToRadian-(Math.PI/2),
				v:250
			});
			this.lastShootTime = time;
        }
        this.checkBounds();// check if we're within bounds
    }
    
    this.render = function(ctx){
        ctx.save()
        ctx.translate(this.x, this.y);
        ctx.rotate(Math.PI/180 * this.angle);
        ctx.drawImage(image, -(this.width/2), -(this.height/2), this.width, this.height); 
        ctx.restore();
    }
}