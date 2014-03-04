import ddf.minim.spi.*;
import ddf.minim.signals.*;
import ddf.minim.*;
import ddf.minim.analysis.*;
import ddf.minim.ugens.*;
import ddf.minim.effects.*;

// TODO: additional properties on a block such that disappearing, speed up, and extra bouncy

Controller controller;

void setup() {
  size(800, 720, OPENGL);
  frameRate(50);
  noStroke();
  
  Minim minim = new Minim(this);
  controller = new Controller(minim);
}

void draw() {
  lights();
  background(0);
  
  camera(width/2, height*0.15, 700,
         width/2, height/2, 0,
         0, 1, 0);
  
  controller.run();
}

void keyPressed() {
  switch(keyCode) {
    case 37: controller.toLeft(); break;
    case 39: controller.toRight(); break;
    case 32: controller.hop(); break; 
  }
}

void keyReleased() {
  switch(keyCode) {
    case 37:
    case 38: controller.toCenter(); break;
  }
}

void mouseMoved() {
  //println("x: " + mouseX + ", y: " + mouseY);
}
class Ball {
  private int x, y, z;
  private int speedX = 0;
  private int speedY = 5;
  private int radius = 50;
  
  Ball(int x, int y) {
    this.x = x;
    this.y = y;
    this.z = -100;
  }
  
  public int getx() { return x; }
  public int gety() { return y; }
  public int getz() { return z; }
  public int getRadius() {return radius; }
  
  public void run() {
    display();
    move();
    gravity();
  }
  
  public boolean outOfRange() {
    return y > height;
  }
  
  private void move() {
    x += speedX;
    y += speedY;
  }
  
  public void suspend() {
    speedY = 0;
  }
  
  private void gravity() {
    speedY += 1;
  }
  
  public void hop() {
    speedY = -20;
  }
  
  public void toLeft() {
    speedX = -10;
  }
  
  public void toRight() {
    speedX = 10;
  }
  
  public void toCenter() {
    speedX = 0;
  }
  
  private void display() {
    pushMatrix();
    translate(x, y, z);
    sphere(radius);
    popMatrix();
  }
} 
class Block {
  private int x, y, z, w, h, d;
  private int dz;
  
  Block(int x, int y, int z, int w, int h, int d, int dz) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    this.h = h;
    this.d = d;
    this.dz = dz;
  }
  
  public int getx() { return x; }
  public int gety() { return y; }
  public int getz() { return z; }
  
  public boolean isContact(Ball ball) {
    if (ball.getx()+ball.getRadius() < x-w/2 || ball.getx()-ball.getRadius() > x+w/2) { return false; }
    if (ball.gety()+ball.getRadius() < y-h/2 || ball.gety()+ball.getRadius() > y+h/2) { return false; }
    if (ball.getz() < z-d/2 || ball.getz() > z+d/2) { return false; }
    return true;
  }
  
  public float distanceTo(Block that) {
    return max(0, abs(z - that.z) - d - that.d);
  }
  
  public void run() {
    display();
    move();
  }
  
  public boolean outOfRange() {
    return z-d/2 > 400;
  }
  
  private void move() {
    z += dz;
  }
  
  private void display() {
    pushMatrix();
    translate(x, y, z);
    box(w, h, d);
    popMatrix();
  }
}
class Controller {
  private Ball ball;
  private ArrayList blocks;
  private Block lastBlock;
  private int zstart = -3000;
  private int startTime;
  private int score = 0;
  private int speed;
  private int initialSpeed = 15;
  private int topSpeed = 50;
  private int iterations = 0;
  
  private int gameState;
  private final int GAMEON = 1;
  private final int GAMEOVER = 2;
  
  private AudioSample player;
  
  Controller(Minim minim) {
    player = minim.loadSample("flyby-Conor-1500306612.mp3", 512);
    
    gameState = GAMEON;
    speed = initialSpeed;
    ball = new Ball(400, 200);
    
    blocks = new ArrayList();
    Block b = new Block(400, 400, -350, 100, 20, 3000-zstart, 20);
    lastBlock = b;
    blocks.add(b);
  }
  
  private void cleanUp() {
    for (int i = blocks.size()-1; i >= 0; i--) {
      Block block = (Block) blocks.get(i);
      if (block.outOfRange()) {
        blocks.remove(i);
        if (gameState == GAMEON) {
          player.trigger();
        }
      }
    }
  }
  
  public void run() {
    animateObjects();
    incrementScore();
    displayScore();
    accelerate();
    cleanUp();
    genBlock();
    gameOver();
  }
  
  private void animateObjects() {
    ball.run();
    if (isContact()) {
      ball.suspend();
    }
    
    for (int i = 0; i < blocks.size(); i++) {
      Block block = (Block) blocks.get(i); 
      block.run();
    }
  }
  
  private void incrementScore() {
    if (gameState == GAMEON) {
      iterations ++;
      score += speed;
    }
  }
  
  private void displayScore() {
    textAlign(CENTER);
    switch (gameState) {
      case GAMEON:
        text("Score: " + score + ", speed: " + speed, width/2, 100);
        break;
      case GAMEOVER:
        text("Score: " + score + ", speed: " + speed + "\nGame Over", width/2, 100);
        break;
    }
  }
  
  private void accelerate() {
    speed = round(initialSpeed + (topSpeed-initialSpeed)/(1+exp(-(iterations-700)/200)));
  }
  
  private void gameOver() {
    if (ball.outOfRange()) {
      gameState = GAMEOVER;
    }
  }
  
  private void genBlock() {
    if (lastBlock.getz() - zstart > 1000) {
      while (true) {
        Block b = getRandomBlock();
        blocks.add(b);
        if (lastBlock.distanceTo(b) < speed*5 && random(1) < 0.8) {
          lastBlock = b;
          break;
        }
      }
    }
  }
  
  private Block getRandomBlock() {
    int l = round(random(500, 1000));
    int x = round(random(200, 600));
    int w = round(random(50, 150));
    int h = round(random(20, 100));
    return new Block(x, 400, zstart, w, h, l, speed);
  } 
  
  private boolean isContact() {
    for (int i = 0; i < blocks.size(); i++) {
      Block block = (Block) blocks.get(i);
      if (block.isContact(ball)) {
        return true;
      }
    }
    
    return false;
  }
  
  public void toLeft() {
    ball.toLeft();
  }
  
  public void toRight() {
    ball.toRight();
  }
  
  public void toCenter() {
    ball.toCenter();
  }
  
  public void hop() {
    if (isContact()) {
      ball.hop();
    }
  }
}

