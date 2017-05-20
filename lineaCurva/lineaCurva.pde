float xoff = random(-300, 300); 
float theta  = 0.0; 
/*
Guardado automatico a partir dle setup
 se ejcuta una vez la imagen adn
 inmediatamente se guarda y se cierra.
 */

void setup() {
  //fullScreen(2); 
  size(displayWidth, displayHeight);
  background(0);
  adn();
  save("output.png");
  exit();
}

/*
void draw() {
 background(0);
 adn();
 }
 
 */

void adn() {
  theta += 0.02; 
  float angle = xoff; 
  colorMode(HSB);
  stroke(map(noise(xoff), 0, 1, 100, 360), 80, 360);
  strokeWeight(2);
  //dibujando(); 
  noFill();
  beginShape(); 
  for (int i = 0; i < width+30; i+=30) {
    //float h = map(sin(angle), -1, 1, map(noise(angle), 0, 1, -100, 0), map(noise(angle), 0, 1, 0, 100));
    float h = map(sin(angle), -1, 1, -50, 50);
    point(i, height/2 + (h*-1)+40);
    point(i, height/2 - ((h)+40));
    point(i, height/2 + ((h)+40));
    point(i, height/2 - ((h*-1)+40));
    line(i, height/2 + (h *-1), i, height/2 +h);
    vertex(i, height/2 +h);
    angle+=xoff;
  }
  endShape();
  xoff+=0.02;
}