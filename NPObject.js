var NPObjects = new NPObjects();

function NPObjects(){
    this.objects = [];
    this.max= 0;
    var counter = 0;
    this.initialise = function(object){

    }
    this.update = function (){
        
        if (counter < 1){
            this.x = Math.random()*width;
            this.y = Math.random()*height;
            counter += 1;
        }



    }
    this.rect = function(){
        ctx.fillStyle = "red";
        ctx.fillRect(this.x,this.y,30,30);
    }
    this.render = function(){
              this.rect();
              
    }



}