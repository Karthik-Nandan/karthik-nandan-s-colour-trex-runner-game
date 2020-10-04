var PLAY = 1;
var END = 0, gameState = PLAY, jump, die,
trex, trex_running, trex_collided, ground, invisibleGround, groundImage,
 cloudsGroup, cloudImage, obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, backgroundImg, score=0,collidedSound , highscore;

var gameOver, restart;

function preload(){
  
  backgroundImg = loadImage("backgroundImg.png")
  sunAnimation = loadImage("sun.png");
  
  trex_running = loadAnimation("trex_2.png","trex_1.png","trex_3.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  jump=loadSound("jump.mp3");
  die=loadSound("die.mp3");
}

function setup() {
 createCanvas(windowWidth, windowHeight);
  
  sun = createSprite(width-50,100,10,10);
  sun.addAnimation("sun", sunAnimation);
  sun.scale = 0.1
  
  trex = createSprite(50,height-70,20,50);
  
  
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.setCollider('circle',0,0,350)
  trex.scale = 0.08
  // trex.debug=true
  

  invisibleGround = createSprite(width/2,height-10,width,125);  
  //invisibleGround.visible = false;
  invisibleGround.depth=invisibleGround.depth+2;
  
    ground = createSprite(width/2,height,width,2);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  

   gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage(gameOverImg);
  
 
   restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.1;

  gameOver.visible = false;
  restart.visible = false;
  
 
  // invisibleGround.visible =false

  cloudsGroup = new Group();
  obstaclesGroup = new Group();

  
  score = 0;
}

function draw() {
  //trex.debug = true;
  background(backgroundImg);
  textSize(20);
  fill("black")
  text("Score: "+ score,30,50);
  
  if (gameState===PLAY){
    
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
    
    if((touches.length > 0 || keyDown("SPACE")) && trex.y  >= height-115){
      jump.play();
      trex.velocityY = -13;
     touches = [];
    }
    
    trex.velocityY = trex.velocityY + 0.8;
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    gameOver.visible=false;
    
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();   
     
    
    if(obstaclesGroup.isTouching(trex)){
      die.play();
        
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    if(mousePressedOver(restart)){
      obstaclesGroup.destroyEach();
      cloudsGroup.destroyEach();
      trex.changeAnimation("running",trex_running);
      score = 0;
      ground.velocityX=-(10+score*3/100);
      restart.visible=false; 
      gameOver.visible=true;
      gameState = PLAY;
        }
    
  }
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
   
    var cloud = createSprite(width+20,height-300,40,10);
    cloud.y = Math.round(random(100,220));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 350;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth+1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
     var obstacle = createSprite(600,height-95,20,30);
   obstacle.velocityX = -(6+score/125);
    // obstacle.debug = true
  
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.3;
    obstacle.lifetime = 350;
    obstacle.depth = trex.depth;
    trex.depth +=1;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  score = 0;
  
}

