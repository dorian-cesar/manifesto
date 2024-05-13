
<?php
// Obtener el número de ticket enviado desde el cliente
$numTicket = $_GET['numTicket'];

// Realizar la consulta SQL para obtener los detalles del ticket con ese número de ticket
$host = "localhost";
$username = "root";
$password = "";
$database = "tickets";

// Crear conexión
$conn = new mysqli($host, $username, $password, $database);

// Verificar la conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}





