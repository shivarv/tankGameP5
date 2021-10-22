class BrickCage {
  
    constructor(x, y, radius) {
        this.x = x  - radius;
        this.y = y;
        this.radius = radius;
    }
    
    draw() {
          // A design for a simple flower
        rect(this.x, this.y, this.radius * 2, this.radius);
        fill("#FF00FF");
        circle(this.x + this.radius, this.y + this.radius/2 , this.radius/2);
        rect(this.x + this.radius, this.y + this.radius/2 , this.radius / 2, 2);
        rect(this.x + this.radius/2, this.y + this.radius/2 , this.radius / 2, 2);
        rect(this.x + this.radius ,  this.y + this.radius / 2, 2, this.radius / 2);
        rect(this.x + this.radius, this.y, 2, this.radius / 2);

    }
  }