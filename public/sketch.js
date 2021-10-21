
let height = 600;
let width = 700;
let x = 10, y = 10, radius = 10;
let easyTank1, brickCage , playerTank1, playerTank2;
let playerTankRadius = 50;

let mouseXValue, mouseYValue;

let playerType = 'player1';

let computerPlayers = [];

function setup() {
    createCanvas(width, height);
    brickCage = new BrickCage(width/2, height - playerTankRadius, playerTankRadius);
    playerTank1 = new PlayerTank(brickCage.x/2, height - playerTankRadius, playerTankRadius/2);
    let player2XPos = (width/2 + (width - (width/2 - playerTankRadius + playerTankRadius * 2))/2 + playerTankRadius);
      console.log(player2XPos );
    playerTank2 = new PlayerTank(player2XPos, height - playerTankRadius, 25);
    computerPlayers.push(new EasyTank(playerTankRadius, playerTankRadius, playerTankRadius));
    computerPlayers.push(new EasyTank(width/2 - playerTankRadius / 2, playerTankRadius, playerTankRadius));
    computerPlayers.push(new EasyTank(width - playerTankRadius, playerTankRadius, playerTankRadius));
    frameRate(5);
}
function draw(){

    background(50);
    fill('#FFFFFF');
    brickCage.draw();
    fill('#FF0000');
    playerTank1.draw();
    fill('#0000FF');
    playerTank2.draw();
    for(let compPlayer of computerPlayers) {
      compPlayer.draw();
    }
}


function mouseClicked() {
  console.log(mouseX + ' '+mouseY);
  let player = getCurrentPlayerRef();
  player.fireBullet();
}

function stopGame() {
  noLoop();
}


function keyPressed() {
  console.log('keypressed');
  if(!isGameStarted()) {
    return;
  }
  try{
    moveCharacterType(playerType, keyCode, true);

  } catch(e) {
      console.log('exception ');
      console.log(e);
  }
}

function isGameStarted() {
  return true;
}


function moveCharacterType(playerType, keyCodeRecieved, isPublishEvent) {
    console.log('moveCharacter keycode '+keyCodeRecieved);
    let player = getCurrentPlayerRef();
    if (keyCodeRecieved === LEFT_ARROW) {
        turnPlayer(player, 'left');
    } else if (keyCodeRecieved === RIGHT_ARROW) {
        turnPlayer(player, 'right');
    } else if (keyCodeRecieved === UP_ARROW) {
        turnPlayer(player, 'up');
    } else if (keyCodeRecieved === DOWN_ARROW) {
        turnPlayer(player, 'down');
    }
}


function getCurrentPlayerRef() {
  return playerTank1;
}
function turnPlayer(player, direction) {
    if(player.direction !== direction) {
        player.changeDirection(direction);
    } else {
      player.movePlayer();
    }
}


