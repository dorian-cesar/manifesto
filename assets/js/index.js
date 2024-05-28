// Crear elemento video
const video = document.createElement("video");

// Nuestro canvas
const canvasElement = document.getElementById("qr-canvas");
const canvas = canvasElement.getContext("2d");

// Div donde llegará nuestro canvas
const btnScanQRLink = document.getElementById("btn-scan-qr-link");
const btnScanQRBtn = document.getElementById("btn-scan-qr-btn");
const btnIngresar = document.getElementById('btn-ingresar-rut');
// Lectura desactivada
let scanning = false;

var Patente = getParameterByName('patente');
console.log(Patente);
$('#idPatente').text(Patente);



// Función para encender la cámara con zoom máximo
const encenderCamara = () => {
  navigator.mediaDevices
    .getUserMedia({ video: { facingMode: "environment" } })
    .then(function (stream) {
      scanning = true;
      btnScanQRLink.style.display = "none";
      btnScanQRBtn.style.display = "none";
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
    // Calcular un zoom ligeramente menor al máximo
    const zoomDeseado = zoomMaximo * 0.8; // Por ejemplo, el 90% del máximo
    track.applyConstraints({ advanced: [{ zoom: zoomDeseado }] });
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
  
// Función para mostrar el input y botón para ingresar el RUT manualmente
const mostrarInputRut = () => {
  btnIngresar.style.display="none";
  btnScanQRLink.style.display = "none";
  btnScanQRBtn.style.display = "none";
  canvasElement.hidden = true;
  document.getElementById("rut-input").style.display = "block";
};

// Función para restaurar la visibilidad del botón de escanear QR y del canvas
const restaurarVisibilidad = () => {
  btnIngresar.style.display="block";
  btnScanQRLink.style.display = "block";
  btnScanQRBtn.style.display = "block";
  document.getElementById("rut-input").style.display = "none";
  document.getElementById("rut-manuel").value = ""; // Limpiar el valor del input
};

// Callback cuando termina de leer el código QR
qrcode.callback = (respuesta) => {
  if (respuesta) {
    const runRegex = /RUN=(\d+-\d+)/i; // Expresión regular para extraer el RUN
    const match = respuesta.match(runRegex);
    if (match) {
      const run = match[1]; // Extraer el RUN del enlace
      var Patente = getParameterByName('patente');
      //const patente = "FFFF46"; // La patente que deseas enviar, podrías obtenerla de algún otro lugar si es necesario
      const datos = {
        rut: run,
        patente: Patente
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
        // Si se envían correctamente, mostrar una alerta normal
        console.log('Los datos se han enviado correctamente al servidor.');
        // Mostrar el RUT ingresado manualmente en la alerta
        console.log(`RUT ingresado manualmente: ${rutManual} y enlazado a la patente: ${patente}`);
        return response.json();
      })
      .then(data => {
        // Manejar la respuesta del servidor si es necesario
        console.log(data);
        restaurarVisibilidad(); // Restaurar la visibilidad de los elementos después de completar la operación
      })
      .catch(error => {
        // Si ocurre un error al enviar los datos al servidor, mostrar una alerta con JavaScript
        console.log('No se pudieron enviar los datos al servidor.');
        console.error('Error:', error);
        restaurarVisibilidad(); // Restaurar la visibilidad de los elementos después de completar la operación
      });
      Swal.fire({
        html: `<span style="font-size: 1.5em;">Se Ingresó el Siguiente RUT</span><br><span style="font-size: 1.4em;">${run}</span>`,
      });
    activarSonido();
    cerrarCamara();
    } else {
      Swal.fire("No se pudo encontrar el RUN en el enlace del QR.");
    }
  }
};



// Función para agregar el RUT manualmente al servidor
const agregarRutManual = () => {
  const rutManual = document.getElementById("rut-manuel").value;
  
  if (rutManual) {
    const patente = document.getElementById("idPatente").textContent;
    console.log("Patente a enviar:", patente); // Agrega este console.log para verificar el valor de patente 
    const datos = {
      rut: rutManual,
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
        // Si se envían correctamente, mostrar una alerta normal
        console.log('Los datos se han enviado correctamente al servidor.');
        // Mostrar el RUT ingresado manualmente en la alerta
        console.log(`RUT ingresado manualmente: ${rutManual} y enlazado a la patente: ${patente}`);
        return response.json();
      })
      .then(data => {
        // Manejar la respuesta del servidor si es necesario
        console.log(data);
        restaurarVisibilidad(); // Restaurar la visibilidad de los elementos después de completar la operación
      })
      .catch(error => {
        // Si ocurre un error al enviar los datos al servidor, mostrar una alerta con JavaScript
        console.log('No se pudieron enviar los datos al servidor.');
        console.error('Error:', error);
        restaurarVisibilidad(); // Restaurar la visibilidad de los elementos después de completar la operación
      });
      Swal.fire({
        html: `<span style="font-size: 1.5em;">Se Ingresó el Siguiente RUT</span><br><span style="font-size: 1.4em;">${rutManual}</span>`,
      });
    activarSonido();
    cerrarCamara();
  } else {
    alert("Por favor ingrese un RUT manual válido.");
  }
};

// Evento para mostrar la cámara sin el botón 
window.addEventListener('load', (e) => {
  encenderCamara();
});

function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}