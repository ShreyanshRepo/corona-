var START=0;
var PLAY=1;
var END=2;

var gameState = START;

var box;
var virus,virusImg,virusGroup;

var backGround,backgroundImg;
var welcomeAnim, welcomeSprite,welcomeMessage,msg;
var user,useImg;
var inj,injImg, shootInjGroup;
var safety1,safety2,safety3,safety4,safetyGroup;

var lifeSpan;
var dieSound,killSound,pistolSound;
var injCount;
var arrow,arrowImg,arrowSprite;
var mask,maskImg,maskSprite;
var sanitizer,sanitizerImg,sanitizerSprite;
var shield,shieldImg,shieldSprite;

var restart,restartImg,restartSprite;

function preload(){
  virusImg = loadImage("images/virus.png");
  backgroundImg = loadImage("images/coroBG.jpg");
  welcomeAnim = loadImage ("images/welcome.jpg");
  welcomeMessage = loadImage("images/MESSAGE.jpg");
  
  userImg = loadAnimation("images/1st part.png","images/2nd part.png",
  "images/3rd part.png","images/4th part.png","images/5th part.png"
  ,"images/6th part.png","images/7th part.png","images/8th part.png",
  "images/9th part.png");
  injImg = loadImage("images/injection.png");


  dieSound = loadSound("sounds/die.mp3");
  killSound = loadSound("sounds/kill.wav");
  pistolSound = loadSound("sounds/pistol.mp3");

  safety1 = loadImage("images/safety1.png");
  safety2 = loadImage("images/safety2.jpg");
  safety3 = loadImage("images/safety3.png");
  safety4 = loadImage("images/safety4.jpg");

  maskImg = loadImage("images/mask.jpg");
  sanitizerImg = loadImage("images/SANITIZER.jpg");
  shieldImg = loadImage("images/SHIELD.jpg");
  arrowImg = loadImage("images/arrow.png");

  restartImg = loadImage("images/restart.png");
}
function setup() {
  createCanvas(windowWidth-30,windowHeight-100);
  //console.log(windowWidth);
  
   welcomeSprite = createSprite(width/2-70,height/4-50);
    welcomeSprite.addImage("welcome", welcomeAnim);
    
   maskSprite = createSprite(width/7,height/2-100);
   maskSprite.addImage("mask",maskImg);
   maskSprite.scale = 0.4;

   sanitizerSprite = createSprite(width/2 + 400,height/2-100);
   sanitizerSprite.addImage("sanitizer",sanitizerImg);
   sanitizerSprite.scale = 0.2;

   shieldSprite = createSprite(width/2-50,height/2);
   shieldSprite.addImage("shield",shieldImg);
   shieldSprite.scale = 0.4;

   arrowSprite = createSprite(width/2-70,height-100);
   arrowSprite.addImage("arrow",arrowImg);
   arrowSprite.scale = 0.3;
  
  bgSprite = createSprite(0, 0, windowWidth+100, windowHeight);
  
  bgSprite.addImage("backGround",backgroundImg);
  bgSprite.scale = 3.5;
  bgSprite.x = bgSprite.width/2;
  bgSprite.visible = false;
  
  user =createSprite(50,windowHeight-200,20,70);
  user.addAnimation("walking",userImg);
  user.scale = 2;
  user.visible = false;
  
  lifeSpan = 0;

  injCount = 10;
  
  virusGroup = new Group();
  shootInjGroup = new Group();
  safetyGroup = new Group();
}

function draw() {
  background(0);

  drawSprites();

  if(gameState!== START){
    textSize(30);
    strokeWeight(7);
    fill("yellow");
    text("Life line : " + lifeSpan, width-250, 150);
    text("INJECTIONS : " + injCount,width/15,150)
  }
  
 

  if(gameState === START){
    textSize(30);
    fill("white");
    text("Press SPACE to start the game", windowWidth/2 + 200, windowHeight/2);
    text("USE",width/2-230,height-90);
    text("TO PLAY THE GAME",width/2 + 20,height-90);
    if(keyDown("space")){
      fill("green");
       gameState = PLAY;
       
      }
  }
  else if(gameState === PLAY){
    welcomeSprite.visible = false;
    maskSprite.visible = false;
    sanitizerSprite.visible = false;
    shieldSprite.visible = false;
    
    bgSprite.visible = true;
    bgSprite.velocityX = -1;

    if(bgSprite.x<0){
      bgSprite.x = bgSprite.width/2;
    }

    // Score board
    lifeSpan = lifeSpan + Math.round((getFrameRate()/60));
    user.visible = true;
    spawnVirus();
    spawnShield();

    if(keyDown(UP_ARROW)){
      user.y = user.y -5;
    }
    if(keyDown(DOWN_ARROW)){
      user.y = user.y +5;
    }
    
    if(keyDown(LEFT_ARROW)){
      user.x = user.x -5;
    }
    
    if(keyDown(RIGHT_ARROW)){
      user.x = user.x + 5;
    }

    if (safetyGroup.isTouching(user)){
      for(var i=0; i <safetyGroup.length;i++){
        //safetyGroup.get(i).destroy();
        safetyGroup.x = user.x;
        safetyGroup.y = user.y;
      }
      

    }


    if(keyWentDown("space")){
      pistolSound.play();
      shootVirus();
      injCount = injCount - 1;
      if(injCount <= 0 ){
        shootInjGroup.destroyEach(0);
      }
    }
    
    if(virusGroup.isTouching(user)){
      gameState = END;
      
      dieSound.play();
    }
    if(virusGroup.isTouching(shootInjGroup)){
      //gameState = END;
      console.log(virusGroup.length);
      for(var i=0; i <virusGroup.length;i++){
        virusGroup.get(i).destroy();
      }

      for(var i=0; i <shootInjGroup.length;i++){
        shootInjGroup.get(i).destroy();
      }
      
      killSound.play();
      injCount = injCount + 1;
    }
    
    
  }
  else{
    textSize(30);
    text("GAME OVER", width/2-50,height/2-100);
    text("PRESS SPACE TO RESTART GAME",width/2-200,height/2);
    virusGroup.setVelocityXEach(0);
    shootInjGroup.setVelocityXEach(0);
    safetyGroup.setVelocityXEach(0);
    bgSprite.velocityX = 0;
    
    if(keyDown("space")){
      virusGroup.destroyEach();
      shootInjGroup.destroyEach();
      safetyGroup.destroyEach();
      injCount = 10;
      lifeSpan = 0;
      user.x = 50;
      user.y = windowHeight-200;
      gameState = PLAY;
     
    }
      
    
  }
  
  createEdgeSprites();
}

function spawnVirus(){
  if (frameCount % 200 === 0){
    var yPos = windowHeight - 150;
    
    var randomNum = Math.round(random(yPos-500,yPos));
    
    virus = createSprite(windowWidth-30, randomNum );
    virus.addImage("corona",virusImg);
    virus.scale = 0.1;
    
    virus.velocityX = -(6 + 3*lifeSpan/100);
    virus.lifetime = width/4;
    
    virusGroup.add(virus);
  }
}



function shootVirus(){
  var shootInj = createSprite(user.x,user.y);
  shootInj.addImage(injImg);
  //shootInj.x = 360;
  //shootInj.y=user.y;
  shootInj.velocityX = 4;
  shootInj.lifetime = width/4;
  shootInj.scale = 0.2;
  shootInjGroup.add(shootInj);
  
}

function spawnShield(){
  
  if(frameCount % 500 === 0){
    var yPos = windowHeight - 150;
    
    var randomNum = Math.round(random(yPos-500,yPos));
    var selectSafety = Math.round(random(1,3));
    
    shield = createSprite(windowWidth-30, randomNum );
    
   
    
    switch(selectSafety){
      case 1: shield.addImage("mask",safety1);
      if(virusGroup.isTouching(shield)){
        for(var i=0; i <virusGroup.length;i++){
          virusGroup.get(i).destroy();
        }
      }
      break;
      case 2: shield.addImage("sanitizer",safety2);
      if(virusGroup.isTouching(shield)){
        injCount = injCount + 2;
      }
      break;
      case 3: shield.addImage("shield",safety3);
      
      break; 
      default:break;                
    }
    shield.scale = 0.1;
    shield.velocityX = -4;
    shield.lifetime = width/4;
    
    safetyGroup.add(shield);
    
  }
 
}