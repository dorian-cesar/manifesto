/*const sidebarToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');

sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
    sidebarToggle.classList.toggle('active');
});*/

// Repite el caracter 29 veces para crear un divisor
const divider = toCenter("—".repeat(29));

const signDiv = "\n\n\n" + divider + toCenter("Firma") + "\n";

// Imprime texto en columna izquiera y derecha, calculando el espaciado
// Si uno de los textos supera los 14 caracteres, se corta
function toColumn(left,right){
    if(!left||!right) {
        return "\n";
    }
    if(left.length>18){
        left = left.substring(0,18);
    }
    if(right.length>10){
        right = right.substring(0,10);
    }
    const space = 29-(left.length+right.length);
    return left + " ".repeat(space) + right + "\n";
}

// Imprime a la izquierda y agrega nueva linea
function toLeft(input){
    if(!input) {
        return "\n";
    }
    console.log('left');
    return input + "<br>";
   
}

// Imprime a la derecha calculando el espacio
function toRight(input){
    if(!input) {
        return "\n";
    }
    const space = 29-(input.length);
    return " ".repeat(space) + input + "\n";
}

function toCenter(input){
    if(!input) {
        return "\n";
    }
    const space = (29-input.length)/2;
    return " ".repeat(space) + input + "\n";
}

// Convierte un string a una referencia valida de RawBT
function toBT(input) {
    var output = "rawbt:" + input;
    output = output.replaceAll(" ", "%20");
    output = output.replaceAll("\n", "%0A");
    return output;
}