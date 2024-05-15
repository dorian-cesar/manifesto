// Crear elemento video
const video = document.createElement("video");

// Nuestro canvas
const canvasElement = document.getElementById("qr-canvas");
const canvas = canvasElement.getContext("2d");

// Div donde llegará nuestro canvas
const btnScanQR = document.getElementById("btn-scan-qr");

// Lectura desactivada
let scanning = false;

// Inicializar variables de zoom
let zoom = 1; // Zoom inicial
const zoomIncrement = 0.1; // Incremento de zoom

// Función para encender la cámara con zoom
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
    });
};

// Funciones para levantar las funciones de encendido de la cámara
function tick() {
  canvasElement.height = video.videoHeight;
  canvasElement.width = video.videoWidth;
  canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

  scanning && requestAnimationFrame(tick);
}

function scan() {
  try {
    qrcode.decode();
  } catch (e) {
    setTimeout(scan, 300);
  }
}

// Función para aplicar zoom a la cámara
const aplicarZoom = (factor) => {
  const track = video.srcObject.getVideoTracks()[0];
  const capabilities = track.getCapabilities();
  if (capabilities.zoom) {
    zoom = Math.max(capabilities.zoom.min, Math.min(capabilities.zoom.max, zoom + factor));
    track.applyConstraints({ advanced: [{ zoom: zoom }] });
  }
};

// Función para reducir el zoom
const reducirZoom = () => {
  aplicarZoom(-1 * zoomIncrement); // Invertimos el incremento para reducir el zoom
};

// Función para aumentar el zoom
const aumentarZoom = () => {
  aplicarZoom(zoomIncrement);
};

// Apagar la cámara
const cerrarCamara = () => {
  video.srcObject.getTracks().forEach((track) => {
    track.stop();
  });
  canvasElement.hidden = true;
  btnScanQR.hidden = false;
};

const activarSonido = () => {
  var audio = document.getElementById('audioScaner');
  audio.play();
}

// Callback cuando termina de leer el código QR
qrcode.callback = (respuesta) => {
  if (respuesta) {
    Swal.fire(respuesta)
    activarSonido();
    cerrarCamara();
  }
};

// Evento para mostrar la cámara sin el botón 
window.addEventListener('load', (e) => {
  encenderCamara();
});

// Event listeners para el zoom
document.getElementById('zoomIn').addEventListener('click', aumentarZoom);
document.getElementById('zoomOut').addEventListener('click', reducirZoom);
