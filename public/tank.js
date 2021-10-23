class Tank {
    direction = 'up';
    bullets = [];
    firingX;
    firingY;
    defaultBulletSpeed = 1; //must be 2 or more
    nonStopRunSoFar = 0;
    movementSpeed = 0.5;

    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius  = radius;
        this.fireTriggerChanceValue = 1; // how many times u might fire every 10seconds
        this.moveStopChanceValue = 1;
        this.changeDirectionChanceValue = 1;

    }

    changeDirection(newDirection) {
        this.direction = newDirection;
    }

    canRandomFire() {
        let isTrue = Math.floor(random(0, 1) * this.fireTriggerChanceValue) === this.fireTriggerChanceValue - 1;
       // console.log('in random fire called '+isTrue);
        return isTrue;
    }

    randomStopEvent() {
        let isTrue = false;
        if(this.nonStopRunSoFar == this.moveStopChanceValue) {
            if(Math.floor(random(0, 1) * 2) === 1) {
                isTrue = true;
                this.nonStopRunSoFar = 0;
            }

        } else if(this.nonStopRunSoFar < this.moveStopChanceValue) {
            this.nonStopRunSoFar++;
        }
        return isTrue;
    }

    canChangeDirection() {
        return Math.floor(random(0, 1) * this.changeDirectionChanceValue) === this.changeDirectionChanceValue - 1;
    }
    
    move() {
      
    }
    
    intersects(obj) {
      
    }

    fireBullet() {
        this.bullets.push({direction: this.direction, x: this.firingX, y: this.firingY});
    }

    getRandomDirection() {
        let directions = ['left', 'right','down', 'up'];
        return random(directions);
    }
  }
  
  class PlayerTank extends Tank {
    
    constructor(x, y, radius) {
        super(x,y, radius);
        //since its up , the firingX, firingY default is unaffected
        this.setFiringValuesForDirection(x, y);
    }
  
    movePlayer() {
        if(this.direction === 'left') {
            this.x -= (this.movementSpeed * 8) // this.radius / 4;
        } else if(this.direction === 'right') {
            this.x += (this.movementSpeed * 8) // this.radius / 4;
        } else if(this.direction === 'up') {
            this.y -= (this.movementSpeed * 8) //this.radius / 4;
        } else if(this.direction === 'down') {
            this.y += (this.movementSpeed * 8) //this.radius / 4;
        }
        this.fetchEdgesDetailForDirection();
    }
    
    
    intersects(other) {
        let d = dist(this.x, this.y, other.x, other.y);
        return (d < this.r + other.r);
    }
    
  
    fetchEdgesDetailForDirection() {
        let firingX, firingY, widthSize, heightSize;
        let obj = {};
        if(this.direction === 'left') {
            firingX = this.x - this.radius / 2;
            firingY = this.y + this.radius / 2;
            widthSize = this.radius / 2;
            heightSize = 2;
        } else if(this.direction === 'right') {
            firingX = this.x + this.radius;
            firingY = this.y + this.radius / 2;
            widthSize = this.radius / 2;
            heightSize = 2;
        } else if(this.direction === 'up') {
            firingX = this.x + this.radius / 2;
            firingY = this.y - this.radius / 2;
            widthSize = 2;
            heightSize = this.radius / 2;
        } else if(this.direction === 'down') {
            firingX = this.x + this.radius / 2;
            firingY = this.y + this.radius;
            widthSize = 2;
            heightSize = this.radius / 2;
        }
        obj.firingX = firingX;
        obj.firingY = firingY;
        obj.widthSize = widthSize;
        obj.heightSize = heightSize;
        return obj;
    }

    setFiringValuesForDirection(firingX, firingY) {
      //need this setup becz when rect is draw , the right end of rect is x+radius..here radius or width is radius/2
        if(this.direction === 'right') {
            firingX += this.radius / 2;
        }
        if(this.direction === 'down') {
            firingY += (this.radius / 2);
        }
        this.firingX = firingX;
        this.firingY = firingY;
    }

    draw() {
        noStroke();
        let tankHittingObj  = this.fetchEdgesDetailForDirection();
        //here widthSize is half of radius
        rect(tankHittingObj.firingX, tankHittingObj.firingY, tankHittingObj.widthSize, tankHittingObj.heightSize);
        //this is done so that fire bullets are fired from right spot, first rect and then setfiring
        this.setFiringValuesForDirection(tankHittingObj.firingX, tankHittingObj.firingY);
        
        rect(this.x, this.y, this.radius, this.radius);
        for(let i = 0; i < this.bullets.length; i++) {
            let bullet = this.bullets[i];
            let isSpliceNeeded = false;
            rect(bullet.x, bullet.y, 5, 5);
            if(bullet.direction === 'left') {
                bullet.x -= (this.defaultBulletSpeed * 2);
                if(bullet.x < 0) {
                    isSpliceNeeded = true;
                }
            } else if(bullet.direction === 'right') {
                bullet.x += (this.defaultBulletSpeed * 2);
                if(bullet.x > width) {
                    isSpliceNeeded = true;
                }
            } else if(bullet.direction === 'up') {
                bullet.y -= (this.defaultBulletSpeed * 2); 
                if(bullet.y > width) {
                    isSpliceNeeded = true;
                }
            } else if(bullet.direction === 'down') {
                bullet.y += (this.defaultBulletSpeed * 2); 
                if(bullet.y > height) {
                    isSpliceNeeded = true;
                }
            }
            if(isSpliceNeeded) {
                this.bullets.splice(i, 1);
            }
        }
    }
  }
  
  class EasyTank extends Tank {
    level = 3;
    directionX = 1;
    directionY = 1;
    
  
    constructor(x, y, radius) {
        super(x,y, radius);
        this.direction = 'down';
        this.fireTriggerChanceValue = 15; // means can fire every 6 second chance
        this.moveStopChanceValue = 10; // means can stop move anytime 1 out of 6 second chance
        this.changePositionChanceValue = 25; // means can stop move anytime 1 out of 6 second chance
        this.setFiringValuesForDirection(x, y + radius/2);
    }
    
    move() {
        if(this.direction === 'left') {
            this.x -= this.movementSpeed;
        } else if(this.direction === 'right') {
            this.x += this.movementSpeed;
        } else if(this.direction === 'up') {
            this.y -= this.movementSpeed;

        } else if(this.direction === 'down') {
            this.y += this.movementSpeed;
        }
    }
    
    intersects(other) {
        let d = dist(this.x, this.y, other.x, other.y);
        return (d < this.r + other.r);
    }

    setFiringValuesForDirection(firingX, firingY) {
        if(this.direction === 'right') {
            firingX += this.radius / 2;
        }
        if(this.direction === 'down') {
            firingY += this.radius / 2;
        }
        this.firingX = firingX;
        this.firingY = firingY;
    }

    fetchEdgesDetailForDirection() {
        let firingX, firingY, widthSize, heightSize;
        let obj = {};
        if(this.direction === 'left') {
            firingX = this.x - this.radius / 2 - this.radius / 2;
            firingY = this.y;
            widthSize = this.radius / 2;
            heightSize = 2;
        } else if(this.direction === 'right') {
            firingX = this.x + this.radius / 2;
            firingY = this.y;
            widthSize = this.radius / 2;
            heightSize = 2;
        } else if(this.direction === 'up') {
            firingX = this.x;
            //one - is to reach till the circle's center end point, other is to have the right start point for rect
            firingY = this.y - this.radius / 2 - this.radius / 2;
            widthSize = 2;
            heightSize = this.radius / 2;
        } else if(this.direction === 'down') {
            firingX = this.x;
            firingY = this.y + this.radius / 2;
            widthSize = 2;
            heightSize = this.radius / 2;
        }
        obj.firingX = firingX;
        obj.firingY = firingY;
        obj.widthSize = widthSize;
        obj.heightSize = heightSize;
        return obj;
    }

    changeWallHitDirection() {
        let newDirection;
        console.log('in changeWallHitDirection '+width);
        if(this.direction === 'left' && this.firingX <= 0) {
            newDirection = 'up';
        } else if(this.direction === 'right' && this.firingX >= width) {
            newDirection = 'down';
        } else if(this.direction === 'up' && this.firingY >= height) {
            newDirection = 'right';
        } else if(this.direction === 'down' && this.firingY <= 0) {
            newDirection = 'left';
        }

        //anonymous checks
        if(this.y < 0 - this.movementSpeed) {
            if(this.x < 0) {
                this.x = 0;
            } else if(this.x > width) {
                this.x = width;
            }
            this.y = 0;
            newDirection = 'down';
        } else if (this.y + this.movementSpeed > height) {
            if(this.x < 0) {
                this.x = 0;
            } else if(this.x > width) {
                this.x = width;
            }
            newDirection = 'up';
        } else if (this.x - this.movementSpeed < 0) {
            if(this.y < 0) {
                this.y = 0;
            } else if(this.y > height) {
                this.y = height;
            }
            newDirection = 'right';
        } else if(this.x + this.movementSpeed > width) {
            if(this.y < 0) {
                this.y = 0;
            } else if(this.y > height) {
                this.y = height;
            }
            newDirection = 'left';
        }

        if(newDirection) {
            this.direction = newDirection;
            //need to set the new firingX, firingY
        }
    }

    isMovePossible() {
        let isMovePresent = true;
        if(this.direction === 'right') {
            this.firingX += this.radius / 2;
        }
        if(this.direction === 'down') {
            this.firingY += this.radius / 2;
        }

        if(this.direction === 'left' && this.firingX - this.movementSpeed <= 0) {
            isMovePresent = false;
        } else if(this.direction === 'right' && this.firingX + this.movementSpeed >= width) {
            isMovePresent = false;
        } else if(this.direction === 'up' && this.firingY - this.movementSpeed <= 0) {
            isMovePresent = false;
        } else if(this.direction === 'down' && this.firingY + this.movementSpeed >= height) {
            isMovePresent = false;
        }
        return isMovePresent;
    }
    
    draw() {
        fill('#00ff00');
        //console.log('frameCount % 10' + frameCount % 10);
        
        if(frameCount % 30 === 0 && this.canChangeDirection()) {
            //this.changeDirection(this.getRandomDirection());
        }
        if(this.randomStopEvent()) {

        } else {
            //move only if possible
            if(this.isMovePossible()) {
                this.move();
            } else {
                this.changeWallHitDirection();
            }
        }
        ellipse(this.x, this.y, this.radius, this.radius);
        let obj  = this.fetchEdgesDetailForDirection();
        rect(obj.firingX, obj.firingY, obj.widthSize, obj.heightSize);
        this.setFiringValuesForDirection(obj.firingX, obj.firingY);
        if(this.canRandomFire()) {
            this.fireBullet();
        }
        for(let i = 0; i < this.bullets.length; ) {
            let bullet = this.bullets[i];
            let isSpliceNeeded = false;
            rect(bullet.x, bullet.y, 5, 5);
            if(bullet.direction === 'left') {
                bullet.x -= (this.defaultBulletSpeed * 2);
                if(bullet.x < 0) {
                    isSpliceNeeded = true;
                }
            } else if(bullet.direction === 'right') {
                bullet.x += (this.defaultBulletSpeed * 2);
                if(bullet.x > width) {
                    isSpliceNeeded = true;
                }
            } else if(bullet.direction === 'up') {
                bullet.y -= (this.defaultBulletSpeed * 2); 
                if(bullet.y > width) {
                    isSpliceNeeded = true;
                }
            } else if(bullet.direction === 'down') {
                bullet.y += (this.defaultBulletSpeed * 2); 
                if(bullet.y > height) {
                    isSpliceNeeded = true;
                }
            }
            if(isSpliceNeeded) {
                this.bullets.splice(i, 1);
            } else {
                i++;
            }
        }
        
    }
    
  }