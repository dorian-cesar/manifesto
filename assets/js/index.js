// Crear elemento video
const video = document.createElement("video");

// Nuestro canvas
const canvasElement = document.getElementById("qr-canvas");
const canvas = canvasElement.getContext("2d");

// Div donde llegará nuestro canvas
const btnScanQR = document.getElementById("btn-scan-qr");

// Lectura desactivada
let scanning = false;

// Función para encender la cámara con zoom máximo
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
      aplicarZoomMaximo();
      tick();
      scan();
    })
    .catch(function (error) {
      console.error("Error al acceder a la cámara:", error);
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
    // Escalar temporalmente la imagen capturada a una resolución mayor
    canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

    // Decodificar la imagen escalada
    qrcode.decode();
  } catch (e) {
    setTimeout(scan, 300);
  }
}

// Función para aplicar zoom máximo a la cámara
const aplicarZoomMaximo = () => {
  const track = video.srcObject.getVideoTracks()[0];
  const capabilities = track.getCapabilities();
  if (capabilities.zoom) {
    const zoomMaximo = capabilities.zoom.max;
    track.applyConstraints({ advanced: [{ zoom: zoomMaximo }] });
  }
};

// Apagar la cámara
const cerrarCamara = () => {
  video.srcObject.getTracks().forEach((track) => {
    track.stop();
  });
  canvasElement.hidden = true;
};

const activarSonido = () => {
  var audio = document.getElementById('audioScaner');
  audio.play();
}

// Callback cuando termina de leer el código QR
qrcode.callback = (respuesta) => {
  if (respuesta) {
    const runRegex = /RUN=(\d+-\d+)/i; // Expresión regular para extraer el RUN
    const match = respuesta.match(runRegex);
    if (match) {
      const run = match[1]; // Extraer el RUN del enlace
      const patente = "FFFF46"; // La patente que deseas enviar, podrías obtenerla de algún otro lugar si es necesario
      const datos = {
        rut: run,
        patente: patente
      };

      // Realizar la solicitud POST a la API
      fetch('https://interurbano.wit.la/mainfiesto/php/grabarManifesto.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al enviar los datos al servidor.');
        }
        return response.json();
      })
      .then(data => {
        // Manejar la respuesta del servidor si es necesario
        console.log(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });

      Swal.fire(run);
      activarSonido();
      cerrarCamara();
    } else {
      Swal.fire("No se pudo encontrar el RUN en el enlace del QR.");
    }
  }
};
// Evento para mostrar la cámara sin el botón 
window.addEventListener('load', (e) => {
  encenderCamara();
});
