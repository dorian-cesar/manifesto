<?php

// Permitir solicitudes desde cualquier origen
header("Access-Control-Allow-Origin: *");

// Permitir los métodos de solicitud que se utilizarán
header("Access-Control-Allow-Methods: POST, OPTIONS");

// Permitir ciertos encabezados en las solicitudes preflight OPTIONS, incluido Content-Type
header("Access-Control-Allow-Headers: Content-Type");


$host = "ls-8ce02ad0b7ea586d393e375c25caa3488acb80a5.cylsiewx0zgx.us-east-1.rds.amazonaws.com";
$user = "dbmasteruser";
$pass = ':&T``E~r:r!$1c6d:m143lzzvGJ$NuP;';
$db = "interurbano"; // Nombre de la base de datos

try {
    // Conexión a la base de datos usando PDO
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    // Configura PDO para lanzar excepciones en caso de error
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Obtener la fecha actual
    $hoy = date('Y-m-d');

    // Verifica si el parámetro 'patente' está presente en la solicitud GET
    if (isset($_GET['patente'])) {
        $patente = $_GET['patente'];
        // Prepara una consulta con el parámetro 'patente' y filtra por la fecha actual
        $stmt = $pdo->prepare('SELECT fecha, rut, patente FROM manifesto WHERE patente = :patente AND DATE(fecha) = :hoy');
        $stmt->bindParam(':patente', $patente, PDO::PARAM_STR);
        $stmt->bindParam(':hoy', $hoy, PDO::PARAM_STR);
    } else {
        // Consulta sin filtro si no se proporciona el parámetro 'patente'
        $stmt = $pdo->prepare('SELECT fecha, rut, patente FROM registros WHERE DATE(fecha) = :hoy');
        $stmt->bindParam(':hoy', $hoy, PDO::PARAM_STR);
    }

    // Ejecuta la consulta
    if (isset($stmt)) {
        $stmt->execute();
        $registros = $stmt->fetchAll(PDO::FETCH_ASSOC);
    } else {
        $registros = [];
    }

    // Configura la cabecera para devolver JSON
    header('Content-Type: application/json');
    echo json_encode($registros);

} catch (PDOException $e) {
    // Manejo de errores
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>