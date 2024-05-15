// Crear elemento video
const video = document.createElement("video");

// Nuestro canvas
const canvasElement = document.getElementById("qr-canvas");
const canvas = canvasElement.getContext("2d");

// Div donde llegará nuestro canvas
const btnScanQR = document.getElementById("btn-scan-qr");

// Definir el tamaño del canvas
const canvasWidth = 320; // Ancho del canvas
const canvasHeight = 240; // Alto del canvas

// Lectura desactivada
let scanning = false;

// Función para encender la cámara
const encenderCamara = () => {
  navigator.mediaDevices
    .getUserMedia({ video: { facingMode: "environment" } })
    .then(function (stream) {
      scanning = true;
      btnScanQR.hidden = true;
      canvasElement.hidden = false;
      video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
      video.srcObject = stream;
      video.play();
      tick();
      scan();
    })
    .catch(function (error) {
      console.error("Error al acceder a la cámara:", error);
    });
};

// Funciones para levantar las funciones de encendido de la cámara
function tick() {
  canvasElement.width = canvasWidth;
  canvasElement.height = canvasHeight;
  canvas.drawImage(video, 0, 0, canvasWidth, canvasHeight);

  scanning && requestAnimationFrame(tick);
}

function scan() {
  try {
    // Escalar temporalmente la imagen capturada a una resolución mayor
    canvas.drawImage(video, 0, 0, canvasWidth, canvasHeight);

    // Decodificar la imagen escalada
    qrcode.decode();
  } catch (e) {
    setTimeout(scan, 300);
  }
}

// Función para apagar la cámara
const cerrarCamara = () => {
  video.srcObject.getTracks().forEach((track) => {
    track.stop();
  });
  canvasElement.hidden = true;
  btnScanQR.hidden = false;
};

// Callback cuando termina de leer el código QR
qrcode.callback = (respuesta) => {
  if (respuesta) {
    Swal.fire(respuesta);
    activarSonido();
    cerrarCamara();
  }
};

// Evento para mostrar la cámara sin el botón 
window.addEventListener('load', (e) => {
  encenderCamara();
});
