class Monstruos {
  //Creamos un constructor que recibe las coordenadas de posición y el array de imagenes
  constructor(x, y, imagen) {
    this.pos = createVector(x, y);
    //La velocidad y la aceleración son aleatorias
    this.vel = createVector(random(-0.1, 0.1), random(-0.1, 0.1));
    this.acc = createVector(random(-1, 1), random(-1, 1));
    this.acc.mult(0.05);
    //Ángulo inicial aleatorio y la velocidad de rotación
    this.angulo = random(TWO_PI);
    this.velocidadRotacion = random(-radians(10), radians(10));
    //Elegimos al azar la imagen y su tamaño
    this.img = random(imagen);
    this.tamano = random(40, 60);
    //Vida del monstruo y su estado (vivo o muerto)
    this.vida = 500;
    this.acabado = false;
  }
  update() {
    //Comprobamos si el monstruo ha terminado
    this.finish();
    //Actualizamos la velocidad, la posición y el ángulo
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.angulo += this.velocidadRotacion;
    //Reducimos aleatoriamente la vida del monstruo
    this.vida -= random(5, 7);
  }
  display() {
    //Mostramos la imagen, haciendo que tenga un efecto de desaparición mediante el canal alfa global
    push();
    imageMode(CENTER);
    translate(this.pos.x, this.pos.y);
    rotate(this.angulo);
    drawingContext.globalAlpha = constrain(this.vida / 255, 0, 1);
    image(this.img, 0, 0, this.tamano, this.tamano);
    pop();
  }
  finish() {
    //El monstruo muere cuando su vida baja a 0
    this.acabado = this.vida < 0;
  }
}
