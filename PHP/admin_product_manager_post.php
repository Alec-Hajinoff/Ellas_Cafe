<?php
require_once __DIR__ . '/session_config.php';

header('Content-Type: application/json; charset=utf-8');

$allowed_origins = [
    'http://localhost:5173',
    'https://rasalstudio.com',
    'https://www.rasalstudio.com',
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? null;

if ($origin !== null && in_array($origin, $allowed_origins, true)) {
    header("Access-Control-Allow-Origin: $origin");
} elseif ($origin !== null) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Origin not allowed.']);
    exit;
}

header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'POST is required.']);
    exit;
}

if (empty($_SESSION['id']) || ($_SESSION['role'] ?? '') !== 'admin') {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Admin sign-in is required.']);
    exit;
}

$input     = json_decode(file_get_contents('php://input'), true);
$productId = $input['product_id'] ?? null;

if (! is_int($productId) || $productId < 1) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'A valid product ID is required.']);
    exit;
}

$config = parse_ini_file(__DIR__ . '/../.env', false, INI_SCANNER_RAW);
if ($config === false) {
    error_log('admin_product_manager_post.php: Failed to parse .env file');
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server configuration error.']);
    exit;
}

$dbHost     = $config['DB_HOST'] ?? '';
$dbName     = $config['DB_NAME'] ?? '';
$dbUser     = $config['DB_USER'] ?? '';
$dbPassword = $config['DB_PASSWORD'] ?? '';

if ($dbHost === '' || $dbName === '' || $dbUser === '') {
    error_log('admin_product_manager_post.php: Database settings are missing from .env');
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server configuration error.']);
    exit;
}

try {
    $pdo = new PDO(
        "mysql:host=$dbHost;dbname=$dbName;charset=utf8mb4",
        $dbUser,
        $dbPassword,
        [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]
    );

    $pdo->beginTransaction();

    $findStatement = $pdo->prepare(
        'SELECT image_path FROM products WHERE id = :id FOR UPDATE'
    );
    $findStatement->execute([':id' => $productId]);
    $product = $findStatement->fetch();

    if (! $product) {
        $pdo->rollBack();
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Product was not found.']);
        exit;
    }

    $linksStatement = $pdo->prepare(
        'DELETE FROM product_dietary_tags WHERE product_id = :product_id'
    );
    $linksStatement->execute([':product_id' => $productId]);

    $deleteStatement = $pdo->prepare('DELETE FROM products WHERE id = :id');
    $deleteStatement->execute([':id' => $productId]);

    $pdo->commit();

    $imagePath   = $product['image_path'] ?? '';
    $imagePrefix = 'Uploads/Product_Images/';
    if (
        is_string($imagePath) &&
        str_starts_with($imagePath, $imagePrefix) &&
        basename($imagePath) === substr($imagePath, strlen($imagePrefix))
    ) {
        $imageFile = __DIR__ . '/../Uploads/Product_Images/' . basename($imagePath);

        if (is_file($imageFile) && ! @unlink($imageFile)) {
            error_log('admin_product_manager_post.php: Could not delete product image for product ID ' . $productId);
        }
    }

    echo json_encode(['success' => true, 'message' => 'Product deleted successfully.']);
} catch (Throwable $error) {
    if (isset($pdo) && $pdo instanceof PDO && $pdo->inTransaction()) {
        $pdo->rollBack();
    }

    error_log('admin_product_manager_post.php: ' . $error->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Could not delete the product.']);
}
