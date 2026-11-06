<?php

require_once 'session_config.php';

$config = parse_ini_file(__DIR__ . '/../.env', false, INI_SCANNER_RAW);

if ($config === false) {
    error_log('admin_exists.php: Failed to parse .env file');

    http_response_code(500);
    header('Content-Type: application/json');

    echo json_encode([
        'success' => false,
        'message' => 'Server configuration error',
    ]);

    exit;
}

$dbHost     = $config['DB_HOST'] ?? '';
$dbName     = $config['DB_NAME'] ?? '';
$dbUser     = $config['DB_USER'] ?? '';
$dbPassword = $config['DB_PASSWORD'] ?? '';

if ($dbHost === '' || $dbName === '' || $dbUser === '') {
    error_log('admin_exists.php: Database settings are missing from .env');

    http_response_code(500);
    header('Content-Type: application/json');

    echo json_encode([
        'success' => false,
        'message' => 'Server configuration error',
    ]);

    exit;
}

$allowed_origins = [
    'http://localhost:5173',
    'https://ellascafe.com',
    'https://www.ellascafe.com',
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? null;

if ($origin !== null && in_array($origin, $allowed_origins, true)) {
    header("Access-Control-Allow-Origin: $origin");
} elseif ($origin !== null) {
    http_response_code(403);
    exit;
}

header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    exit;
}

try {

    $conn = new PDO(
        "mysql:host=$dbHost;dbname=$dbName;charset=utf8mb4",
        $dbUser,
        $dbPassword
    );

    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

    $stmt = $conn->prepare(
        'SELECT 1 FROM users WHERE is_deleted = 0 LIMIT 1'
    );

    $stmt->execute();

    $adminExists = (bool) $stmt->fetchColumn();

    echo json_encode([
        'success'      => true,

        'admin_exists' => $adminExists,
    ]);
} catch (PDOException $e) {

    error_log('admin_exists.php: Database check failed: ' . $e->getMessage());

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'message' => 'Unable to check admin status.',
    ]);
} finally {

    $conn = null;
}
