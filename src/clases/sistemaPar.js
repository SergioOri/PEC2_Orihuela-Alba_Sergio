class SistemaPar {
  //Creamos un constructor que recibe las coordenadas
  constructor(x, y) {
    this.x = x;
    this.y = y;
    //Creamos un array vacío que contendrá las partículas
    this.grupoParticulas = [];
    //Número máximo de partículas creadas
    this.maxParticulas = 20;

    this.acabado = false;
    //Creamos el máximo de partículas en la misma posición
    for (let i = 0; i < this.maxParticulas; i++) {
      this.grupoParticulas.push(new Particulas(this.x, this.y));
    }
  }
  update() {
    //Comprobamos el estado anterior de actualizar
    this.finish();
    //Recorremos de final a principio del array para poder eliminar elementos sin saltarnos ninguno
    for (let i = this.grupoParticulas.length - 1; i >= 0; i--) {
      this.grupoParticulas[i].update();
      //Si la partícula ha terminado, la eliminamos del array
      if (this.grupoParticulas[i].acabado) {
        this.grupoParticulas.splice(i, 1);
      }
    }
  }
  display() {
    //Mostramos cada partícula del array
    for (let i = 0; i < this.grupoParticulas.length; i++) {
      this.grupoParticulas[i].display();
    }
  }
  finish() {
    //Si la longitud del array es 0, se considera como acabado
    this.acabado = this.grupoParticulas.length === 0;
  }
}
