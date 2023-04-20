
let height = 600;
let width = 700;


let x = 10, y = 10, radius = 10;
let easyTank1, brickCage , playerTank1, playerTank2;
let brickCageDiameter = 75;
let COMPUTER_PLAYER_COUNT = 3;

let playerTankDiameter = 50;
let computerTankDiameter = 50;
let BULLETSIZE = {x: 5, y: 5};

let tankStartXGap = 10, tankLowerEndXGap;
let tankStartYGap = playerTankDiameter/2, tankLowerEndYGap = playerTankDiameter/2;


let mouseXValue, mouseYValue;

let playerType = 'player1';

let computerPlayers = [];

let bullets = {player1: [], player2: [], computer: []}

function setup() {
    createCanvas(width, height);
    brickCage = new BrickCage(width/2, height - brickCageDiameter, brickCageDiameter);
    playerTank1 = new PlayerTank((width/2  - x) / 2, height - playerTankDiameter - tankStartYGap, playerTankDiameter);
    let player2XPos = (width - ((width/2  - x) / 2 + playerTankDiameter));
      console.log(player2XPos );
    playerTank2 = new PlayerTank(player2XPos, height - playerTankDiameter - tankStartYGap, playerTankDiameter);
    computerPlayers.push(new EasyTank((width/2  - x) / 2, playerTankDiameter + tankStartYGap, playerTankDiameter, fireComputerBullet.bind(this)));
    computerPlayers.push(new EasyTank(width/2 - computerTankDiameter, computerTankDiameter + tankStartYGap, computerTankDiameter, fireComputerBullet.bind(this)));
    computerPlayers.push(new EasyTank(width - computerTankDiameter, computerTankDiameter + tankStartYGap, computerTankDiameter, fireComputerBullet.bind(this)));
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
    renderBullets();
    for(let compPlayer of computerPlayers) {
      compPlayer.draw();
    }
    actForIntersectionOfBullets();
}

function renderBullets() {
    if(bullets.player1.length > 0) {
        renderBulletsArray(bullets.player1);
    }
    if(bullets.player2.length > 0) {
        renderBulletsArray(bullets.player2);
    }
    if(bullets.computer.length > 0) {
        renderBulletsArray(bullets.computer);

    }
}

function renderBulletsArray(bullets) {
    for(let i = 0; i < bullets.length; i++) {
            let bullet = bullets[i];
            let isSpliceNeeded = false;
            if(bullet.direction === 'left') {
                bullet.x -= (bullet.defaultBulletSpeed * 2);
                if(bullet.x < 0) {
                    isSpliceNeeded = true;
                }
            } else if(bullet.direction === 'right') {
                bullet.x += (bullet.defaultBulletSpeed * 2);
                if(bullet.x > width) {
                    isSpliceNeeded = true;
                }
            } else if(bullet.direction === 'up') {
                bullet.y -= (bullet.defaultBulletSpeed * 2); 
                if(bullet.y < 0) {
                    isSpliceNeeded = true;
                }
            } else if(bullet.direction === 'down') {
                bullet.y += (bullet.defaultBulletSpeed * 2); 
                if(bullet.y > height) {
                    isSpliceNeeded = true;
                }
            }
            if(isSpliceNeeded) {
                bullets.splice(i, 1);
            }
        }
       for(let bullet of bullets) {
            bullet.draw();
       }
}


function mouseClicked() {
    //console.log(mouseX + ' '+mouseY);
    fireBullet();
}

function fireBullet() {
    let playerTypeCopy = playerType;
    let player = getCurrentPlayerRef();
    let playerBullets = bullets[playerTypeCopy];
    playerBullets.push(new Bullet(playerTypeCopy, player.direction, player.firingX, player.firingY, TANK_COLORS[playerTypeCopy]));
   // bullets = {player1: [], player2: [], computer: []}
}

function fireComputerBullet(computerTank) {
    let playerType = 'computer';
    let computerBullets = bullets['computer'];
    computerBullets.push(new Bullet(playerType, computerTank.direction, computerTank.firingX, computerTank.firingY, TANK_COLORS[playerType]));
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
    return playerTank1;
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
    // cancelPlayersGotHit();
    // cancelComputersGotHit();
}

function cancelBulletsGotHit() {
    let player1Bullets = bullets.player1;
    let player2Bullets = bullets.player2;
    let computerBullets = bullets.computer;
    for(let i = 0; i < player1Bullets.length; i++) {
        for(let j = 0; j < computerBullets.length; j++) {
            if(isBulletIntersected(player1Bullets[i], computerBullets[j])) {
                player1Bullets.splice(i, 1);
                computerBullets.splice(j, 1);
            }
        }
    }
    for(let i = 0; i < player2Bullets.length; i++) {
        for(let j = 0; j < computerBullets.length; j++) {
            if(isBulletIntersected(player2Bullets[i], computerBullets[j])) {
                player2Bullets.splice(i, 1);
                computerBullets.splice(j, 1);
            }
        }
    }
}

function isBulletIntersected(bullet1, bullet2) {
    let isTrue = false;
    let bullet1MinX = bullet1.x, bullet1MinY = bullet1.y, bullet1MaxX = bullet1.x + bullet1.bulletSize , bullet1MaxY = bullet1.y + bullet1.bulletSize;
    let bullet2MinX  = bullet2.x, bullet2MinY = bullet2.y, bullet2MaxX = bullet2.x + bullet2.bulletSize, bullet2MaxY = bullet2.y + bullet2.bulletSize;
   
   // boolean aLeftOfB = maxAx < minBx;
   // boolean aRightOfB = minAx > maxBx;
   // boolean aAboveB = minAy > maxBy;
  //  boolean aBelowB = maxAy < minBy;
  //  return maxAx >= minBx && minAx <= maxBx && minAy <= maxBy && maxAy >= minBy
   // console.log(bullet1);
   // console.log(bullet2);
   
    return isTrue;
}


/*

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
} */