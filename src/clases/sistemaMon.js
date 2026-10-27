class SistemaMon {
  //Creamos un constructor que recibe únicamente las coordenadas
  constructor(x, y) {
    this.x = x;
    this.y = y;
    //Creamos un array vacío que contendra los monstruos 
    this.grupoMonstruo = [];
    //Indicamos la cantidad máxima de monstruos
    this.maxMonstruos = 4;
    //Creamos un intervalo entre tandas de monstruos
    this.intervalo = 50;
    //Contador de fotogramas (está lleno para que aparezca al momento de abrir la boca)
    this.contador = this.intervalo;
    //Indicamos diferentes estados
    this.activo = true;
    this.acabado = false;
    //Guardamos el momento en que se abre la boca
    this.inicio = millis();
  }
  //Actualizamos la posición del emisor y el intervalo entre tandas de monstruos
  actualizarEmisor(x, y, intervalo) {
    this.x = x;
    this.y = y;
    this.intervalo = intervalo;
  }

  update() {
    //Comprobamos si el sistema ha terminado
    this.finish();
    //Comprobamos si está activo, en tal caso aumentamos el contador
    if (this.activo) {
      this.contador++;
      if (this.contador >= this.intervalo) {
        this.contador = 0;
        //Contamos los segundos que lleva la boca abierta
        const segundos = (millis() - this.inicio) / 1000;
        //Durante el primer segundo solo salen murciélagos
        const imgs = segundos < 1 ? [imagenes[0]] : imagenes;
        //Creamos una tanda de monstruos en la posición actual de la boca
        for (let i = 0; i < this.maxMonstruos; i++) {
          this.grupoMonstruo.push(new Monstruos(this.x, this.y, imgs));
        }
      }
    }
    //Recorremos el array de manera inversa para comprobar el estado de cada monstruo
    for (let i = this.grupoMonstruo.length - 1; i >= 0; i--) {
      this.grupoMonstruo[i].update();
      //Si un monstruo ha terminado, se borra del array
      if (this.grupoMonstruo[i].acabado) {
        this.grupoMonstruo.splice(i, 1);
      }
    }
  }
  display() {
    //Mostramos cada monstruo del array
    for (let i = 0; i < this.grupoMonstruo.length; i++) {
      this.grupoMonstruo[i].display();
    }
  }
  finish() {
    //Acaba cuando deja de emitir y no hay monstruos
    this.acabado = !this.activo && this.grupoMonstruo.length === 0;
  }
}
