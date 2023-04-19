class Bullet {
    direction = 'up';
    bulletSize = 5;
    playerType;
    defaultBulletSpeed = 1; //must be 2 or more
    direction;
    color;
    constructor(playerType, direction, x , y, color ) {
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.playerType = playerType;
        this.color = color
    }

    draw() {
        fill(this.color);
        rect(this.x, this.y, this.bulletSize, this.bulletSize);
    }
}