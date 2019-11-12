var tankPlayer = new TankPLayer();
var image = new Image();
image.src = "tank.png";
var getTime = function(){
    return (new Date()).getTime();
};


function TankPLayer(){
    this.x = 0;
	this.y = 0;
	this.vx = 0;
	this.vy = 0;
    this.v = 0;
    this.mod = 0; //new
    this.speed = 1;
	this.angle = 0;
    this.lastShootTime = 0;
    this.stats = {maxV:100,dAngle:0.03,acc:10,shootDelayMs:600};
    this.width = 50;
    this.height = 50;
   // this.rotationAngle = Math.PI/180 * this.angle;
   // this.rotate = false;
    
    this.update = function(dt){
        //this.y -= 0.1;
        if(keyChecker.keyStatus.up){
            //this.y -=0.5;
            console.log("pressing w");
            this.mod = 1;
       /*  this.v += this.stats.acc;
		    if(this.v > this.stats.maxV)
			this.v = this.stats.maxV; */
            
            
        }
        if(keyChecker.keyStatus.down){
            console.log("pressing s" + this.mod);
           // this.y += 0.5;
            this.mod = -1;
        }
        if(keyChecker.keyStatus.right){//d-key

            //this.x += 0.5;
            this.angle += 1;
        }
        if(keyChecker.keyStatus.left){//a-key
            //this.x -=0.5;
            this.angle -= 1;
        }

        //if(!(keyChecker.keyStatus.up || keyChecker.keyStatus.down)) {
            //console.log("keycheker !");
           // this.y += (this.speed * this.mod) * Math.sin(Math.PI / 180 * this.angle);
            /* this.v *= 0.99;

            this.vy = this.v * Math.sin(this.angle);
            this.y += this.vy * dt; */
           
        //}
        if(keyChecker.keyStatus.up || keyChecker.keyStatus.down) {
            console.log("keycheker wiuthoiut !");
            this.x += (this.speed*this.mod) * Math.cos(Math.PI/180 * (this.angle-90));
            this.y += (this.speed*this.mod) * Math.sin(Math.PI/180 * (this.angle-90));
            //this.rotationAngle = Math.PI/180 * this.angle
            this.mod = 0;
        }

        var time = getTime();
        if(keyChecker.keyStatus.fire &&   //bullet shoot i think
			time - this.lastShootTime >= this.stats.shootDelayMs){
                angleToRadian = Math.PI / 180 * this.angle;
			bullets.push({
				x:this.x,
				y:this.y-5,
				angle:angleToRadian-(Math.PI/2),
				v:250
			});
			this.lastShootTime = time;
        }
        
    
    }
    
    this.render = function(ctx){
       
        //console.log(mouse.x);
        //ctx.rotate(Math.PI / 180 * 50);
        //ctx.drawImage(image, this.x ,this.y, 50,50);
        ctx.save()
        ctx.translate(this.x, this.y);
        ctx.rotate(Math.PI/180 * this.angle);
        ctx.drawImage(image, -(this.width/2), -(this.height/2), this.width, this.height); 
        //ctx.drawImage(image, (this.x/2),(this.y/2));
        ctx.restore();
        
       
        
    }
}