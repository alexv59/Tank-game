var canvas,
	ctx,
	width,
    height,
    camX;

    function init(){
        
	canvas = document.getElementById("canvas");
    ctx = canvas.getContext('2d');
    width = canvas.width;
    height = canvas.height;
    camX = window.innerWidth/2;
    canvas.style.border = "1px solid black";
    window.onkeydown = keyChecker.keyDownListener;
    window.onkeyup = keyChecker.keyUpListener;
    canvas1 = document.getElementById("minicanvas");
    ctx1 = canvas1.getContext('2d');
    w1=canvas1.width;
    h1 = canvas1.height;
    var img = new Image();
    img.src='grass.png';
    tankPlayer.x = window.innerWidth /2;
    tankPlayer.y = height/2;
    var counter = 0;
    //comments
    
      
    

    setInterval(function(){ 
        updateGame(0.01);
        renderGame();
        rBackground();


        
    }, 10);
    


    function updateGame(dt){
        bullets.update(dt);
        NPObjects.update(dt);
        tankPlayer.update(dt);
        
    }
    function renderGame(){
        renderBackground();
        tankPlayer.render(ctx);
        bullets.render(ctx);
        NPObjects.render(ctx);
        

    }
    function renderBackground(){
        //ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
    //ctx.fillRect(0,0,width,height);
     //var pattern = ctx1.createPattern(img, 'repeat');
      //ctx.fillStyle = pattern;
       //ctx.fillStyle = pattern;
   //    ctx.drawImage(img,500,0);
   ctx.clearRect(0,0,width,height);
       //rBackground();
   
     
       

    }

    function rBackground(){
        console.log("calling back");
        
        
        if (counter < 1){
            console.log(counter);
        var pattern = ctx1.createPattern(img, 'repeat');
        ctx1.fillStyle = pattern;
        ctx1.fillRect(0, 0,width,height);
        counter =1;
        } 
       
    }
    
    
}