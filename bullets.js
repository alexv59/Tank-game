var bullets = new Bullets();

function Bullets(){
    this.objects = [];
    this.maxID=0;

    this.init = function(bullet){
		bullet.vx = bullet.v * Math.cos(bullet.angle); //speed x i think
        bullet.vy = bullet.v * Math.sin(bullet.angle); //speed y 
    }
    this.push = function(bullet){
		// temp comment
        this.init(bullet);
        var id = -1;
		//Search empty space
		while(this.objects[++id] != undefined);
		this.objects[id] = bullet;
		if(id > this.maxID) this.maxID = id;
    };
    this.update = function(dt){
		for(var i = 0;i <= this.maxID;i++){
			if(this.objects[i] == undefined) continue;
			
			var obj = this.objects[i];
			
			obj.x += obj.vx * dt;
			obj.y += obj.vy * dt;
			//Detect if on screen
			if(
				obj.x < 0 || obj.y < 0 ||
				obj.x > width || obj.y > height ||
				obj.remove)
			delete this.objects[i];
			
		}
    }
    
    this.render = function(ctx){
		ctx.fillStyle = "#000000";
		for(var i = 0;i < this.maxID;i++){
			if(this.objects[i] == undefined) continue;
			
			var obj = this.objects[i];
			ctx.beginPath();
			ctx.arc(obj.x,obj.y,4,0,6.28);
			ctx.fill();
			//console.log(obj.y);
		}
	};
}