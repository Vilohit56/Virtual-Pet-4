var dog, happyDog, database, foodS, foodStock;
var lastFed, fedTime;
var addFood, feedDog;
var foodObj;
var add, feed;
var gameState;
var readState;
var washroom, bedroom, garden;

function preload()
{
  dogimage1 = loadImage("images/dogImg.png");
  dogimage2 = loadImage("images/dogImg1.png");
  bedroom = loadImage("images/Bed Room.png");
  washroom = loadImage("images/Wash Room.png");
  garden = loadImage("images/Garden.png");
}

function setup() {
  database = firebase.database();
  createCanvas(1000, 500);

  fedTime = database.ref('FeedTime');
  fedTime.on("value", function(data){
    lastFed=data.val();
  });

  readState = database.ref('gameState');
  readState.on("value", function(data){
    gameState=data.val();
  });

  dog = createSprite (800,200,150,150);
  dog.addImage(dogimage1);
  dog.scale = 0.2;

  foodStock = database.ref('Food')
  foodStock.on("value", readStock);

  foodObj = new Food();
  
  feed = createButton("Press to feed the dog");
  feed.position(570,65);
  feed.mousePressed(feedDog);

  add = createButton("Press to add food");
  add.position(720,65);
  add.mousePressed(addFoods);
  
}

function draw() {  
  background(46, 139, 87);
  foodObj.display();

  currentTime=hour();
  if(currentTime==(lastFed+1)){
      update("Playing");
      foodObj.garden();
   }else if(currentTime==(lastFed+2)){
    update("Sleeping");
      foodObj.bedroom();
   }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
      foodObj.washroom();
   }else{
    update("Hungry")
    foodObj.display();
   }
   
   if(gameState!="Hungry"){
     feed.hide();
     add.hide();
     dog.remove();
   }else{
    feed.show();
    add.show();
    
   }
   
  fill(62,7,76);
  textSize(15);
  if(lastFed>12){
    text("Last Feed : "+ lastFed%12 +" PM"+50,30);
  }else if(lastFed==0){
  text("Last Feed : 12AM", 50,30)
  }else{
  text("Last Feed :" +lastFed + "AM", 50,30);
}


drawSprites();
}

function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog() {
  dog.addImage(dogimage2);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

function addFoods() {
foodS++;
database.ref('/').update({
  Food:foodS
})
}

function update(state){
  database.ref('/').update({
    gameState:state
  })
}