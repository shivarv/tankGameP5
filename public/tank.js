
class Tank {
    direction = 'up';
    bullets = [];

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
      console.log('in random fire called '+isTrue);
      return isTrue;
    }

    canStopMove() {
      return Math.floor(random(0, 1) * this.moveStopChanceValue) === this.moveStopChanceValue - 1;
    }

    canChangeDirection() {
       return Math.floor(random(0, 1) * this.changeDirectionChanceValue) === this.changeDirectionChanceValue - 1;
    }
    
    move() {
      
    }
    
    intersects(obj) {
      
    }

    fireBullet() {

    }

    getRandomDirection() {
      let directions = ['left', 'right','down', 'up'];
      return random(directions);
    }
  }
  
  class PlayerTank extends Tank {
    
    firingX;
    firingY;
    constructor(x, y, radius) {
        super(x,y, radius);
    }
  
    movePlayer() {
       if(this.direction === 'left') {
         this.x -= this.radius / 4;
       } else if(this.direction === 'right') {
          this.x += this.radius / 4;
  
       } else if(this.direction === 'up') {
          this.y -= this.radius / 4;
  
       } else if(this.direction === 'down') {
          this.y += this.radius / 4;
       }
      this.fetchEdgesDetailForDirection();
    }
    
    fireBullet() {
      this.bullets.push({direction: this.direction, x: this.firingX, y: this.firingY});
    }
    intersects(other) {
        let d = dist(this.x, this.y, other.x, other.y);
        return (d < this.r + other.r);
    }
    
  
    fetchEdgesDetailForDirection() {
      let firingX, firingY, widthSize, heightSize;
      let obj = {};
      if(this.direction === 'left') {
        firingX = this.x - this.radius;
        firingY = this.y + this.radius - 1;
        widthSize = this.radius;
        heightSize = 2;
      } else if(this.direction === 'right') {
        firingX = this.x + this.radius * 2;
        firingY = this.y + this.radius - 1;
        widthSize = this.radius;
        heightSize = 2;
      } else if(this.direction === 'up') {
        firingX = this.x + this.radius - 1;
        firingY = this.y - this.radius;
        widthSize = 2;
        heightSize = this.radius;
      } else if(this.direction === 'down') {
        firingX = this.x + this.radius - 1;
        firingY = this.y + this.radius * 2;
        widthSize = 2;
        heightSize = this.radius;
      }
      obj.firingX = firingX;
      obj.firingY = firingY;
      obj.widthSize = widthSize;
      obj.heightSize = heightSize;
      return obj;
    }

    setFiringValuesForDirection(firingX, firingY) {
      if(this.direction === 'right') {
        firingX += this.radius;
      }
      if(this.direction === 'down') {
        firingY += this.radius;
      }
      this.firingX = firingX;
      this.firingY = firingY;
    }

    draw() {
      noStroke();
      let obj  = this.fetchEdgesDetailForDirection();
      
     rect(obj.firingX, obj.firingY, obj.widthSize, obj.heightSize);
      this.setFiringValuesForDirection(obj.firingX, obj.firingY);
      
      rect(this.x, this.y, this.radius * 2, this.radius * 2);
      for(let i = 0; i < this.bullets.length; i++) {
        let bullet = this.bullets[i];
        let isSpliceNeeded = false;
        rect(bullet.x, bullet.y, 5, 5);
          if(bullet.direction === 'left') {
             bullet.x -= 1;
             if(bullet.x < 0) {
               isSpliceNeeded = true;
             }
           } else if(bullet.direction === 'right') {
             bullet.x += 1;
             if(bullet.x > width) {
               isSpliceNeeded = true;
             }
           } else if(bullet.direction === 'up') {
             bullet.y -= 1; 
             if(bullet.y > width) {
               isSpliceNeeded = true;
             }
           } else if(bullet.direction === 'down') {
             bullet.y += 1; 
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
    movementSpeed = 3;
  
    constructor(x, y, radius) {
        super(x,y, radius);
        this.direction = 'down';
        this.fireTriggerChanceValue = 10; // means can fire every 6 second chance
        this.moveStopChanceValue = 10; // means can stop move anytime 1 out of 6 second chance
        this.changePositionChanceValue = 18; // means can stop move anytime 1 out of 6 second chance
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
    
    draw() {
      fill('#00ff00');
      if(this.canChangeDirection()) {
          this.changeDirection(this.getRandomDirection());
      }
      if(this.canRandomFire()) {
        this.fireBullet();
      }
      if(this.canStopMove()) {

      } else {
         this.move();
      }
      ellipse(this.x, this.y, this.radius, this.radius);
      for(let i = 0; i < this.bullets.length; i++) {
        let bullet = this.bullets[i];
        let isSpliceNeeded = false;
        rect(bullet.x, bullet.y, 5, 5);
          if(bullet.direction === 'left') {
             bullet.x -= 1;
             if(bullet.x < 0) {
               isSpliceNeeded = true;
             }
           } else if(bullet.direction === 'right') {
             bullet.x += 1;
             if(bullet.x > width) {
               isSpliceNeeded = true;
             }
           } else if(bullet.direction === 'up') {
             bullet.y -= 1; 
             if(bullet.y > width) {
               isSpliceNeeded = true;
             }
           } else if(bullet.direction === 'down') {
             bullet.y += 1; 
             if(bullet.y > height) {
               isSpliceNeeded = true;
             }
           }
          if(isSpliceNeeded) {
              this.bullets.splice(i, 1);
          }
      }
    }
    fireBullet() {
      this.bullets.push({direction: this.direction, x: this.x, y: this.y});
    }
  }