
let height = 600;
let width = 700;


let x = 10, y = 10, radius = 10;
let easyTank1, brickCage , playerTank1, playerTank2;
let brickCageDiameter = 75;

let playerTankDiameter = 50;
let computerTankDiameter = 50;
let BULLETSIZE = {x: 5, y: 5};

let tankStartXGap = 10, tankLowerEndXGap;
let tankStartYGap = playerTankDiameter/2, tankLowerEndYGap = playerTankDiameter/2;


let mouseXValue, mouseYValue;

let playerType = 'player1';

let computerPlayers = [];


function setup() {
    createCanvas(width, height);
    brickCage = new BrickCage(width/2, height - brickCageDiameter, brickCageDiameter);
    playerTank1 = new PlayerTank((width/2  - x) / 2, height - playerTankDiameter - tankStartYGap, playerTankDiameter);
    let player2XPos = (width - ((width/2  - x) / 2 + playerTankDiameter));
      console.log(player2XPos );
    playerTank2 = new PlayerTank(player2XPos, height - playerTankDiameter - tankStartYGap, playerTankDiameter);
    computerPlayers.push(new EasyTank((width/2  - x) / 2, playerTankDiameter + tankStartYGap, playerTankDiameter));
    //computerPlayers.push(new EasyTank(playerTankDiameter, playerTankDiameter + tankStartYGap, playerTankDiameter));
    computerPlayers.push(new EasyTank(width/2 - computerTankDiameter, computerTankDiameter + tankStartYGap, computerTankDiameter));
    computerPlayers.push(new EasyTank(width - computerTankDiameter, computerTankDiameter + tankStartYGap, computerTankDiameter));
    frameRate(20);
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
    actForIntersectionOfBullets();
}


function mouseClicked() {
    //console.log(mouseX + ' '+mouseY);
    let player = getCurrentPlayerRef();
    player.fireBullet();
}

function stopGame() {
    noLoop();
}


function keyPressed() {
    //console.log('keypressed');
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
    //console.log('moveCharacter keycode '+keyCodeRecieved);
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
    return playerTank2;
}

function getCurrentPlayerRefByName(playerName) {
    if(playerName === 'player1') {
        return playerTank1;
    } else if(playerName === 'player2') {
        return playerTank2;
    }
}


function turnPlayer(player, direction) {
    if(player.direction !== direction) {
        player.changeDirection(direction);
    } else {
      player.movePlayer();
    }
}

function actForIntersectionOfBullets() {
    let playerRef = getCurrentPlayerRefByName('player1');
    cancelBulletsGotHit();
    //cancelPlayersGotHit();
    //cancelComputersGotHit();
}

function cancelBulletsGotHit() {
    let player1Ref = getCurrentPlayerRefByName('player1');
    let player2Ref = getCurrentPlayerRefByName('player2');
    this.cancelBulletsGotHitHelper(player1Ref);
    this.cancelBulletsGotHitHelper(player2Ref);
}

function cancelBulletsGotHitHelper(playerRef) {
    //console.log('cancelBulletsGotHitHelper')
    for(let playerBulletIndex in playerRef.bullets) {
        for(let computerIndex in computerPlayers) {
            playerCompBulletsHitHelper(playerRef, computerPlayers[computerIndex]);
        }
    }
}

function playerCompBulletsHitHelper(playerRef, computerRef) {
   // console.log('playerCompBulletsHitHelper')

    removeIntersectingBulletsHelper(playerRef.bullets, computerRef.bullets);
}

function removeIntersectingBulletsHelper(playerBullets, computerBullets) {
   // console.log('removeIntersectingBulletsHelper')

    for(let playerBulletIndex = 0; playerBulletIndex < playerBullets.length; ) {
        let isSpliced = false;
        let currentPlayerBullet = playerBullets[playerBulletIndex];
        for(let computerBulletIndex = 0; computerBulletIndex < computerBullets.length; computerBulletIndex++) {
            let currentComputerBullet = computerBullets[computerBulletIndex];
            if(checkIfBulletIntersect(currentPlayerBullet, currentComputerBullet)) {
                isSpliced = true;
                computerBullets.splice(computerBulletIndex, 1);
                break;
            }
        }
        if(isSpliced) {
            playerBullets.splice(playerBulletIndex, 1);
        } else {
            playerBulletIndex++;
        }
    }
}

function checkIfBulletIntersect(bullet1, bullet2) {
    console.log('bullet1.x '+bullet1.x + '  bullet1.y '+bullet1.y +' bullet2.x '+bullet2.x +'  bullet2.y '+ bullet2.y);

    if(checkForBulletXCordinate(bullet1, bullet2) && checkForBulletYCordinate(bullet1, bullet2)) {
        return true
    }
    return false;
}


function checkForBulletYCordinate(bullet1, bullet2) {
    if( (bullet1.y === bullet2.y) 
                || (bullet1.y < bullet2.y && (bullet1.y + BULLETSIZE.y > bullet2.y))
                || (bullet1.y > bullet2.y && (bullet2.y + BULLETSIZE.y  > bullet1.y))
        ) {
            return true;
    }
    return false;
}


function checkForBulletXCordinate(bullet1, bullet2) {
    //checks if bullet1.x is equal to bullet2.x
    //if bullet1.x is less and bullet2.x is inside bullet1's width
    //if bullet2.x is less and bullet1.x is inside bullet2's width
    if( (bullet1.x === bullet2.x) 
                || (bullet1.x < bullet2.x && bullet1.x + BULLETSIZE.x > bullet2.x)
                || (bullet1.x > bullet2.x && bullet2.x + BULLETSIZE.x > bullet1.x )
        ) {
            return true;
    }
    return false;
}


function cancelPlayersGotHit() {
    let playerRef = getCurrentPlayerRefByName('player1');
}