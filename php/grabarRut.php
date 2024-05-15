<?php
header("Access-Control-Allow-Origin: *"); // Permite el acceso desde cualquier origen
header("Access-Control-Allow-Methods: POST"); // Permite solo solicitudes POST
header("Access-Control-Allow-Headers: Content-Type"); // Permite el encabezado Content-Type


// Verificar si se recibió un JSON válido
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if ($data === null) {
    // JSON inválido, responder con un error
    http_response_code(400);
    echo json_encode(array("message" => "JSON inválido."));
    exit;
}

// Verificar si el JSON contiene el rut y la patente
if (!isset($data['rut']) || !isset($data['patente'])) {
    // Datos incompletos, responder con un error
    http_response_code(400);
    echo json_encode(array("message" => "Datos incompletos."));
    exit;
}

// Conexión a la base de datos (asumiendo que ya está configurada)
$servername = "localhost";
$username = "usuario";
$password = "contraseña";
$database = "interurbano";

$conn = new mysqli($servername, $username, $password, $database);

// Verificar la conexión
if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

// Preparar la consulta SQL para insertar datos en la tabla manifesto
$sql = "INSERT INTO manifesto (rut, patente) VALUES (?, ?)";
$stmt = $conn->prepare($sql);

// Vincular parámetros
$stmt->bind_param("ss", $rut, $patente);

// Asignar valores a los parámetros
$rut = $data['rut'];
$patente = $data['patente'];

// Ejecutar la consulta
if ($stmt->execute()) {
    // Éxito al insertar, responder con un mensaje de éxito
    http_response_code(201);
    echo json_encode(array("message" => "Datos insertados correctamente."));
} else {
    // Error al insertar, responder con un mensaje de error
    http_response_code(500);
    echo json_encode(array("message" => "Error al insertar datos: " . $conn->error));
}

// Cerrar la conexión
$stmt->close();
$conn->close();

?>
