//------ CONSTANTES ------//
const umbral = 0.65; //Proporción alto/ancho de los labios
const APERTURA_MIN = 90; //Diagonal de los labios cuando la boca esta poco abierta
const APERTURA_MAX = 130; //Diagonal con la boca muy abierta
const maxOpa = 127; //Opacidad máxima del filtro
const velocidadOpa = 4; //Velocidad de la opacidad

//------ CÁMARA Y DETECCIÓN ------//
let faceMesh;
let video;
let faces = [];
let options = { maxFaces: 1, refineLandmarks: false, flipped: true };
let camaraActiva = false;

//------ MEDIA ------//
let imagenes = [];
let sonido;
let sonidoActivo = false;

//------ INTERFAZ ------//
let boton = [];
let textoAyuda;

//------ FILTRO DE COLOR ------//
let R = 75;
let G = 56;
let B = 0;
let opacidad = 0;

//------ PARTÍCULAS ------//
let sistema = [];
let monstruos = [];
let liberarMonstruos = null;

//Preparamos la interfaz y esperamos a que el usuario pulse el botón de empezar
function setup() {
  //Creamos los botones, el texto y el lienzo
  crearBotones();
  crearTexto();
  createCanvas(windowWidth, windowHeight).parent("juego");
  select("#btnEmpezar").mousePressed(iniciar);
}

//Cuando el tamaño de la ventana cambia, adaptamos el lienzo
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

//Se llama al pulsar el botón empezar, mostrando el texto "cargando..." y carga todo, encendiendo la cámara
async function iniciar() {
  select("#btnEmpezar").hide();
  select("#cargaInfo").removeClass("oculta");
  await cargarMedia();
  // Cargamos faceMesh de manera asíncrona
  faceMesh = await ml5.faceMesh(options);
  // Creamos el video de la webcam y lo ocultamos
  video = createCapture(VIDEO, { flipped: false });
  video.size(640, 480);
  video.hide();
  //La cámara empieza activada
  activarCamara();
  //Llamamos a esta función para ocultar la pantalla de carga hecha mediante html
  ocultarPanCarga();
}

function draw() {
  background(26, 11, 46);
  //Mostramos el texto de ayuda según el estado de la cámara
  actualizarTexto();
  //Debemos llenar toda la pantalla con el video de manera proporcionada
  const escala = max(width / 640, height / 480);
  const diferenciaX = (width - 640 * escala) / 2;
  const diferenciaY = (height - 480 * escala) / 2;

  //Empleamos los cambios antes de mostrar la imagen
  push();
  translate(diferenciaX, diferenciaY);
  scale(escala);
  // Si la cámara está activa, dibujamos el video sobre el fondo negro.
  if (camaraActiva) {
    push();
    //Reflejamos la imagen para que simule un espejo
    translate(640, 0);
    scale(-1, 1);
    image(video, 0, 0, 640, 480);
    pop();
  }
  pop();
  /*Obtenemos labios mediante la función obtenerLabios y lo que nos
      devuelva lo empleamos en el resto de funciones. El filtro tiñe la
      pantalla. Mientras que bocaCerrada y bocaAbierta crean y dibujan las 
      partículas de cada estado*/
  const labios = obtenerLabios();
  filtro(labios);
  //Realizamos el mismo cambio para las particulas y monstruos
  push();
  translate(diferenciaX, diferenciaY);
  scale(escala);
  bocaCerrada(labios);
  bocaAbierta(labios);
  pop();
}

//------ FUNCIONES INICIALES ------//

//Función para crear el texto que se muestra con la cámara apagada
function crearTexto() {
  textoAyuda = createP("Activa la cámara y libera los monstruos");
  textoAyuda.id("instrucciones");
  textoAyuda.parent("juego");
}

//Mostramos el texto según el estado de la cámara
function actualizarTexto() {
  //Comprobamos la cámara esta activa y el video ya tiene imagen
  if (camaraActiva && video && video.elt.readyState >= 2) {
    textoAyuda.hide();
  } else {
    textoAyuda.html(camaraActiva ? "Cargando cámara..." : "Activa la cámara y libera los monstruos");
    textoAyuda.show();
  }
}

//Funcion para crear botones
function crearBotones() {
  //Creamos un contenedor en HTML para los botones, dandole una ID y un padre (quien lo contiene)
  const controles = createDiv();
  controles.id("controles");
  controles.parent("juego");
  //A cada botón le ponemos un texto, una clase y un padre
  boton[0] = createButton("SONIDO OFF");
  boton[1] = createButton("CÁMARA OFF");
  boton[2] = createButton("COLORES");
  for (let i = 0; i < boton.length; i++) {
    boton[i].addClass("boton");
    boton[i].parent(controles);
  }
  //Hacemos que cada botón llame a una función distinta
  boton[0].mousePressed(() => activarSonido());
  boton[1].mousePressed(() => activarCamara());
  boton[2].mousePressed(() => cambiarColor());
}
//Función asíncrona para cargar las imagenes y sonido para la aplicación
async function cargarMedia() {
  imagenes[0] = await loadImage("media/image/img1.png");
  imagenes[1] = await loadImage("media/image/img2.png");

  //Sound Effect by Bomb Sound from Pixabay
  sonido = await loadSound("media/sound/music.mp3");
  sonido.amp(0.6);
}
//Función que se activa al final de iniciar, oculta la pantalla de carga del html, posteriormente eliminándola
function ocultarPanCarga() {
  const pantalla = document.getElementById("pantallaCarga");
  if (pantalla) {
    pantalla.classList.add("oculta");
    setTimeout(() => pantalla.remove(), 700);
  }
}
//Alternamos la cámara entre activa y apagada, cambiamos el texto del botón
function activarCamara() {
  camaraActiva = !camaraActiva;
  boton[1].html(camaraActiva ? "CÁMARA ON" : "CÁMARA OFF");
  if (camaraActiva) {
    //Si la cámara está activa, empezamos a mostrar la imagen y reconocemos las caras
    video.elt.play();
    faceMesh.detectStart(video, gotFaces);
  } else {
    //Si no, pausamos la imagen, detenemos la detección de caras y vaciamos los arrays para que dejen de aparecer
    video.elt.pause();
    faces = [];
    sistema = [];
    monstruos = [];
    liberarMonstruos = null;
  }
}
//Alternamos el sonido entre encendido y apagado, también cambia el texto del botón.
function activarSonido() {
  // Si el sonido no ha terminado de cargar, no hacemos nada
  if (!sonido) return;
  //En caso contrario, alternamos entre encender y apagar, cambiando el texto del botón
  sonidoActivo = !sonidoActivo;
  boton[0].html(sonidoActivo ? "SONIDO ON" : "SONIDO OFF");
  //Desbloqueamos el sonido del navegador, el sonido se reproduce después de abrir la boca
  if (sonidoActivo) {
    userStartAudio();
  } else {
    if (sonido.isPlaying()) sonido.stop();
    userStopAudio();
  }
}
//Función que se activa pulsando un botón, al pulsar el botón generamos de manera aleatoria tres valores para cambiar el color del filtro
function cambiarColor() {
  R = random(0, 255);
  G = random(0, 255);
  B = random(0, 255);
}

//------ FUNCIONES ESENCIALES ------//

//Actualizamos y dibujamos cada elemento de la lista, eliminando los que ya han terminado
function actualizarLista(lista) {
  //Recorremos de final a principio del array para poder eliminar elementos sin saltarnos ninguno
  for (let i = lista.length - 1; i >= 0; i--) {
    lista[i].update();
    lista[i].display();
    //Cuando acaban, los eliminamos del array
    if (lista[i].acabado) {
      lista.splice(i, 1);
    }
  }
}
//Devuelve los labios detectados, si no hay cara devuelve "null"
function obtenerLabios() {
  if (!camaraActiva) return null;
  return faces.length > 0 && faces[0].lips ? faces[0].lips : null;
}
//Devuelve "true" si el alto de los labios supera una proporción de su ancho
function bocaEstaAbierta(labios) {
  return labios.height >= labios.width * umbral;
}
//Reproduce el sonido si esta activado, ya se ha cargado y no se esta reproduciendo (para no solaparse)
function reproducirSonido() {
  if (sonidoActivo && sonido && !sonido.isPlaying()) sonido.play();
}
//Detenemos el sonido si se esta reproduciendo
function detenerSonido() {
  if (sonido && sonido.isPlaying()) sonido.stop();
}

//------ FUNCIONAMIENTO DE LA CÁMARA ------//

//Comprobamos si la boca esta cerrada 
function bocaCerrada(labios) {
  //Cada 4 fotogramas creamos un sistema de particulas en cada extremo de la boca
  if (labios && !bocaEstaAbierta(labios) && frameCount % 4 === 0) {
    sistema.push(new SistemaPar(labios.x, labios.centerY));
    sistema.push(new SistemaPar(labios.x + labios.width, labios.centerY));
  }
  //Actualizamos y mostramos el sistema de particulas
  actualizarLista(sistema);
}

//Función para comprobar que la boca esta abierta.
function bocaAbierta(labios) {
  if (labios && bocaEstaAbierta(labios)) {
    //Si cumple con el umbral, se emiten los monstruos y el sonido
    emitirMonstruos(labios);
    reproducirSonido();
  } else {
    //En caso contrario, se deja de emitir y se detiene el sonido
    noMonstruos();
  }
  //Actualizamos el array de monstruos
  actualizarLista(monstruos);
}
//Creamos un sistema de monstruos si no existe y actualizamos su posición e intervalo
function emitirMonstruos(labios) {
  //Calculamos el centro de la boca
  const cx = labios.x + labios.width / 2;
  const cy = labios.y + labios.height / 2;
  //Calculamos la diagonal del rectángulo que forman los labios
  const apertura = dist(0, 0, labios.width, labios.height);
  //Cuanto más abierta esté la boca, más tandas de monstruos salen
  const intervalo = round(
    map(apertura, APERTURA_MIN, APERTURA_MAX, 50, 5, true)
  );
  //Si no existe el sistema de monstruos, se crea uno en el centro de la boca
  if (!liberarMonstruos) {
    liberarMonstruos = new SistemaMon(cx, cy);
    monstruos.push(liberarMonstruos);
  }
  //Actualizamos el emisor de monstruos, empleando el centro y el tiempo entre emisiones
  liberarMonstruos.actualizarEmisor(cx, cy, intervalo);
}

//Desactivamos la emisión de monstruos cuando la boca se cierra, también se detiene el sonido
function noMonstruos() {
  if (liberarMonstruos) {
    liberarMonstruos.activo = false;
    liberarMonstruos = null;
  }
  detenerSonido();
}

//Al detectar la boca abierta, tintamos la pantalla con un color
function filtro(labios) {
  const abierta = labios && bocaEstaAbierta(labios);
  //Mientras que la boca esté abierta, la opacidad subirá paulatinamente hasta llegar a su máximo. Cuando se cierre la boca, bajará hasta 0
  opacidad = constrain(
    opacidad + (abierta ? velocidadOpa : -velocidadOpa),
    0,
    maxOpa
  );

  if (opacidad > 0) {
    noStroke();
    fill(R, G, B, opacidad);
    rect(0, 0, width, height);
  }
}

//Callback que ml5 llama cada vez que detecta una cara
function gotFaces(results) {
  faces = camaraActiva ? results : [];
}
