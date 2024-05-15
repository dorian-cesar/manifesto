<?php

// Permitir solicitudes desde cualquier origen
header("Access-Control-Allow-Origin: *");
// Permitir los métodos POST desde cualquier origen
header("Access-Control-Allow-Methods: POST");
// Datos de conexión a la base de datos


$servername = "ls-8ce02ad0b7ea586d393e375c25caa3488acb80a5.cylsiewx0zgx.us-east-1.rds.amazonaws.com";
$username = "dbmasteruser";
$password = ':&T``E~r:r!$1c6d:m143lzzvGJ$NuP;';
$dbname = "interurbano"; // Nombre de la base de datos

// Verificar si se recibió una solicitud POST con datos JSON
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if ($data !== null) {
    // Verificar si se recibieron datos de RUT y patente
    if (isset($data['rut']) && isset($data['patente'])) {
        // Datos recibidos
        $rut = $data['rut'];
        $patente = $data['patente'];

        // Crear una conexión a la base de datos
        $conn = new mysqli($servername, $username, $password, $dbname);

        // Verificar la conexión
        if ($conn->connect_error) {
            die("Error de conexión: " . $conn->connect_error);
        }
        date_default_timezone_set('America/Santiago');
        // Obtener la fecha y hora actual en formato de timestamp
        $fechaHora = date("Y-m-d H:i:s");

        // Sentencia SQL para insertar los datos en la tabla "manifesto"
        $sql = "INSERT INTO manifesto (fecha, rut, patente) VALUES ('$fechaHora', '$rut', '$patente')";

        if ($conn->query($sql) === TRUE) {
            echo "Los datos se han insertado correctamente en la base de datos.";
        } else {
            echo "Error al insertar datos: " . $conn->error;
        }

        // Cerrar la conexión a la base de datos
        $conn->close();
    } else {
        echo "Error: Falta el RUT o la patente en los datos JSON.";
    }
} else {
    echo "Error: No se recibieron datos JSON válidos en la solicitud.";
}
?>
