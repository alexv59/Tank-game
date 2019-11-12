var canvas,
	ctx,
	width,
	height;

    function init(){
	
	canvas = document.getElementById("canvas");
    ctx = canvas.getContext('2d');
    width = canvas.width;
	height = canvas.height;
    canvas.style.border = "1px solid black";
    window.onkeydown = keyChecker.keyDownListener;
	window.onkeyup = keyChecker.keyUpListener;


    tankPlayer.x = width/2;
    tankPlayer.y = height/2;

    
//comment


    setInterval(function(){ 
        updateGame(0.01);
        renderGame();
        
      

       
      
    }, 10);



    function updateGame(dt){
        bullets.update(dt);
        tankPlayer.update(dt);
    }
    function renderGame(){
        renderBackground();
        tankPlayer.render(ctx);
        bullets.render(ctx);
        

    }
    function renderBackground(){
        ctx.fillStyle = "#c6c6c6";
        ctx.fillRect(0,0,width,height);

    }
    
}