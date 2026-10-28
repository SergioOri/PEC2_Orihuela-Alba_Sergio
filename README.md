# PEC2_Orihuela-Alba_Sergio
Aplicación de escritorio empleando p5.js y Tauri que detecta la apertura de la boca con la cámara del ordenador, generando efectos visuales con temática de Halloween sobre el video. Busca ayudar a los infantes a abrir la boca mientras se cepillan los dientes.
## Funcionamiento
Al abrir la aplicación, aparecerá la pantalla de inicio con un botón para empezar. La cámara no se activará hasta que el usuario lo pulse.
Tras pulsarlo, se cargan los recursos y modelos de detección facial, mientras aparece una pantalla de carga. Al terminar, la cámara se encenderá.
Al tener la boca cerrada, se emiten partículas desde las comisuras de la boca.
Con la boca abierta salen monstruos desde el centro de la boca, suena música y la pantalla se tiñe de color. Cuanto más abierta esté la boca, más monstruos aparecen.
Tres botones en la parte inferior de la pantalla:
- **Sonido ON/OFF**: Activa o desactiva el sonido (OFF por defecto)
- **Cámara ON/OFF**: Enciende y apaga la cámara
- **Colores**: Cambia de manera aleatoria el color del filtro
La app se ejecuta en modo kiosk, para salir de ella es necesario pulsar la secuencia **ALT + F4**.

## Requisitos

- Se ha probado en la última versión de **Windows 10**. Para usar el proyecto se necesita:
- **Node.js**: Versión 18 o superior y npm. Para comprobar si tiene el programa en su ordenador en la terminal del ordenador escriba “node --version” y “npm --version”.
- **Rust**: Es necesario instalarlo desde su página web (https://rust-lang.org/es/) . Para comprobarlo requiere escribir “rustc --version” y “cargo --version”.
- **Microsoft C++ Build Tools**: Al instalarlo se requiere seleccionar la casilla “Desarrollo para el escritorio con C++”. Rust lo requiere.
- **WebView2**: Está incluido en los sistemas Windows 10/11.
- Se requiere internet (el primer inicio)

## Instalación y ejecución
En la carpeta del proyecto, con la terminal hay que escribir:

``` 
npm install
``` 
``` 
npm run tauri dev
``` 
Al principio tardará por la compilación, pero tras eso la aplicación se abrirá. 

## Tecnologías
- **Tauri 2**: Para empaquetar la aplicación de escritorio (https://v2.tauri.app/es/)
- **p5.js**: Para crear la interfaz y gráficos (https://p5js.org/)
- **p5.sound**: Para el audio (https://p5js.org/)
- **ml5.js**: Para detectar la cara al usar la cámara (https://ml5js.org/)

Tras instalarlas, hay que cerrar y abrir la terminal para que los detecte.

## Créditos y licencias
**Música del filtro**: Sound Effect by _Bomb Sound_ from _Pixabay_.
**Fuentes**: _Jolly Lodger_ y _Rubik Wet Paint_ de _Google Fonts_

## Autor
_Sergio Orihuela Alba_
