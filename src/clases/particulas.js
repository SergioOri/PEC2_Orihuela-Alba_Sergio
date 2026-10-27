class Particulas {
  //Creamos un constructor que recibe las coordenadas X e Y
  constructor(x, y) {
    //Especificamos un ángulo de salida para la partícula
    let anguloCentral = HALF_PI;
    let apertura = radians(10);
    let anguloAleatorio = random(
      anguloCentral - apertura / 2,
      anguloCentral + apertura / 2
    );

    //Indicamos la posición, velocidad y aceleración mediante vectores
    this.pos = createVector(x, y);
    this.vel = p5.Vector.fromAngle(anguloAleatorio);
    this.acc = createVector(random(-1, 1), random(-1, 1));
    this.acc.mult(0.05);

    //Vida de la partícula y su estado (viva o muerta)
    this.vida = 255;
    this.acabado = false;
  }
  update() {
    //Comprobamos el estado anterior de la partícula
    this.finish();
    //Cambiamos la velocidad y posición, mientras le restamos vida a la partícula
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.vida -= 5;
  }
  display() {
    //Mostramos la partícula
    noStroke();
    fill(255, 0, 0, this.vida);
    ellipse(this.pos.x, this.pos.y, random(7, 10), random(7, 10));
  }
  finish() {
    //La partícula muere cuando el contador baja a 0
    this.acabado = this.vida < 0;
  }
}
