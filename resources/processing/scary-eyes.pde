// pew! pew! pew!
// the wondering eyes are staring at you!

color[] eyeColors = {#863D10, #3C5FD6, #77983C, #C4B72A};
AnimatedEye[] eyes = new AnimatedEye[6];


void setup() {
  size(1050, 720);
  background(#FFFFFF);
  smooth();
  for (int i = 0; i < 2; i++) {
    for (int j = 0; j < 3; j++) {
      eyes[i*3+j] = getRandomEye(300+i*450, 200+j*200);
    }
  }
}

void draw() {
  background(#FFFFFF);
  //println(mouseX + ", " + mouseY);
  noFill();
  
  for (AnimatedEye e : eyes) {
    e.display();
  }
  
  for (AnimatedEye e : eyes) {
    e.displayHyperBeam();
  }
}

void mousePressed() {
  for (AnimatedEye e : eyes) {
    e.blink();
  }
}

void keyTyped() {
  if (key == 'h') {
    for (AnimatedEye e : eyes) {
      e.flipHelix();
    }
  }
}

AnimatedEye getRandomEye(float x, float y) {
  float r1 = rand(15, 3);
  float r2 = rand(35, 5);
  float l1 = rand(70, 10);
  float l2 = rand(70, 10);
  float h0 = rand(5, 10);
  float h1 = rand(5, 10);
  float h2 = rand(30, 10);
  float h3 = rand(30, 10);;
  float h4 = rand(30, 10);
  float h5 = rand(30, 10);
  float h6 = rand(5, 5);
  float h7 = rand(5, 5);
  float h8 = rand(5, 5);
  float h9 = rand(5, 5);
  color pupilColor = eyeColors[int(random(eyeColors.length))];
  float blinkSpeed = rand(0.3, 0.25);
  
  return new AnimatedEye(x, y, r1, r2, l1, l2, h0, h1, h2, h3, h4, h5, h6, h7, h8, h9, pupilColor, blinkSpeed);
}

float rand(float x, float dx) {
  return x + random(-dx, dx);
}

class AnimatedEye {
  private float x, y, r1, r2, l1, l2;
  private float h0, h1, h2, h3, h4, h5, h6, h7, h8, h9;
  private float l0 = 20;
  private color pupilColor;
  private float boundRadius;
  private int coverEyeBallOverflow;
  private float blinkSpeed;
  private float blinkProgress = 1;
  
  private int eyeState;
  private final int STARE = 0;
  private final int OPEN_EYE = 1;
  private final int SHUT_EYE = 2;
  
  private boolean helixMode = false;
  private final color HELIX_COLOR = #C9E5DE;
  private boolean helixHyperMode = false;
  
  AnimatedEye(float x, float y, float r1, float r2, float l1, float l2,
    float h0, float h1, float h2, float h3, float h4, float h5, float h6, float h7, float h8, float h9,
    color pupilColor, float blinkSpeed) {
    this.x = x;
    this.y = y;
    this.r1 = r1;
    this.r2 = r2;
    this.l1 = l1;
    this.l2 = l2; 
    this.h0 = h0;
    this.h1 = h1;
    this.h2 = h2;
    this.h3 = h3;
    this.h4 = h4;
    this.h5 = h5;
    this.h6 = h6;
    this.h7 = h7;
    this.h8 = h8;
    this.h9 = h9;
    this.pupilColor = pupilColor;
    this.blinkSpeed = blinkSpeed;
    
    eyeState = STARE;
    boundRadius = max(new float[]{h2,h3,h4,h5});
    coverEyeBallOverflow = round((3.5-blinkProgress) * boundRadius);
  }
  
  public void display() {
    animate();
    strokeWeight(3);
    displayEyeBall();
    displayEyeLids();
  }
  
  public void blink() {
    if (eyeState != STARE || helixMode) {
      return;
    }
    
    eyeState = SHUT_EYE;
  }
  
  public void flipHelix() {
    if (helixMode) {
      helixMode = false;
      helixHyperMode = false;
    } else {
      helixMode = true;
    }
  }
  
  private void animate() {
    if (helixMode && random(1) > 0.99) {
      helixHyperMode = true;
    }
    
    switch (eyeState) {
      case STARE:
        return;
      case SHUT_EYE:
        blinkProgress -= blinkSpeed;
        if (blinkProgress <= 0.0) {
          eyeState = OPEN_EYE;
        }
        break;
      case OPEN_EYE:
        blinkProgress += blinkSpeed;
        if (blinkProgress >= 1.0) {
          eyeState = STARE;
          blinkProgress = 1.0;
        }
        break;
    } 
  }
  
  private void displayEyeBall() {
    if (helixMode) {
      fill(HELIX_COLOR);
    } else {
      fill(pupilColor);
    }
    
    float[] xy = eyePosition();
    ellipse(xy[0], xy[1], r2*2, r2*2);
    fill(0);
    ellipse(xy[0], xy[1], r1*2, r1*2);
  }
  
  private void displayEyeLids() {
    noFill();
    stroke(#FFFFFF);
    coverOverflow();
    
    stroke(0);
    displayUpperUpperEyeLid();
    displayUpperEyeLid(0);
    displayLowerEyeLid(0);
  }
  
  private void coverOverflow() {
    for (int i = 1; i < coverEyeBallOverflow; i++) {
      displayUpperEyeLid(-i);
      displayLowerEyeLid(i);
    }
    
    fill(#FFFFFF);
    rect(x-l1-coverEyeBallOverflow, y-boundRadius, coverEyeBallOverflow, 2*boundRadius);
    rect(x+l2, y-boundRadius, coverEyeBallOverflow, 2*boundRadius);
    noFill();
  }
  
  private void displayUpperUpperEyeLid() {
    beginShape();
    curveVertex(x-l1-l0, y+h0-h6);
    curveVertex(x-l1, y+h0-h6);
    curveVertex(x-l1/2, y-h2*blinkProgress-h7);
    curveVertex(x+l2/2, y-h3*blinkProgress-h8);
    curveVertex(x+l2, y+h1-h9);
    curveVertex(x+l2+l0, y+h1-h9);
    endShape();
  }
  
  private void displayUpperEyeLid(float h) {
    beginShape();
    curveVertex(x-l1-l0, y+h0+h);
    curveVertex(x-l1, y+h0+h);
    curveVertex(x-l1/2, y-h2*blinkProgress+h);
    curveVertex(x+l2/2, y-h3*blinkProgress+h);
    curveVertex(x+l2, y+h1+h);
    curveVertex(x+l2+l0, y+h1+h);
    endShape();
  }
   
  private void displayLowerEyeLid(float h) {
    beginShape();
    curveVertex(x-l1-l0, y+h0+h);
    curveVertex(x-l1, y+h0+h);
    curveVertex(x-l1/2, y+h4*blinkProgress+h);
    curveVertex(x+l2/2, y+h5*blinkProgress+h);
    curveVertex(x+l2, y+h1+h);
    curveVertex(x+l2+l0, y+h1+h);
    endShape();
  }
  
  public void displayHyperBeam() {
    if (helixHyperMode) {
      float[] xy = eyePosition();
      stroke(HELIX_COLOR);
      strokeWeight(20);
      line(xy[0], xy[1], mouseX, mouseY);
      strokeWeight(5);
    }
  }
  
  private float[] eyePosition() {
    float eX = mouseX;
    float eY = mouseY;
    
    if (eX == 0 && eY == 0) {
      return new float[]{x, y};
    }
    
    float distanceToCenter = sqrt(sq(eX-x) + sq(eY-y));
    if (distanceToCenter <= boundRadius) {
      return new float[]{eX, eY};
    }
    
    return new float[]{x+(eX-x)/distanceToCenter*boundRadius, 
                       y+(eY-y)/distanceToCenter*boundRadius};
  }
}
