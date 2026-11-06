<?php

header('Content-Type: application/json; charset=utf-8');

$allowed_origins = [
    'http://localhost:5173',
    'https://ellascafe.com',
    'https://www.ellascafe.com',
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? null;

if ($origin !== null && in_array($origin, $allowed_origins, true)) {
    header("Access-Control-Allow-Origin: $origin");
    header('Vary: Origin');
} elseif ($origin !== null) {
    http_response_code(403);
    echo json_encode([
        'success' => false,
        'message' => 'Origin not allowed.',
    ]);
    exit;
}

header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    header('Allow: GET, OPTIONS');
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'GET is required.',
    ]);
    exit;
}

$config = parse_ini_file(__DIR__ . '/../.env', false, INI_SCANNER_RAW);

if ($config === false) {
    error_log('menu_get.php: Failed to parse .env file');
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server configuration error.',
    ]);
    exit;
}

$dbHost     = $config['DB_HOST'] ?? '';
$dbName     = $config['DB_NAME'] ?? '';
$dbUser     = $config['DB_USER'] ?? '';
$dbPassword = $config['DB_PASSWORD'] ?? '';

if ($dbHost === '' || $dbName === '' || $dbUser === '') {
    error_log('menu_get.php: Database settings are missing from .env');
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server configuration error.',
    ]);
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

    $productStatement = $pdo->query(
        'SELECT
            id,
            name,
            description,
            ingredients,
            price,
            category,
            image_path,
            created_at,
            updated_at
         FROM products
         ORDER BY category, name'
    );

    $products = $productStatement->fetchAll();

    $productsById = [];

    foreach ($products as &$product) {
        $product['id']           = (int) $product['id'];
        $product['price']        = (string) $product['price'];
        $product['dietary_tags'] = [];

        $productsById[$product['id']] = &$product;
    }

    unset($product);

    $tagStatement = $pdo->query(
        'SELECT
            pdt.product_id,
            dt.name
         FROM product_dietary_tags AS pdt
         INNER JOIN dietary_tags AS dt
            ON dt.id = pdt.dietary_tag_id
         ORDER BY pdt.product_id, dt.name'
    );

    foreach ($tagStatement->fetchAll() as $tagRow) {
        $productId = (int) $tagRow['product_id'];

        if (isset($productsById[$productId])) {
            $productsById[$productId]['dietary_tags'][] = $tagRow['name'];
        }
    }

    unset($productsById);

    echo json_encode(
        [
            'success'  => true,
            'products' => $products,
        ],
        JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
    );
} catch (Throwable $error) {

    error_log('menu_get.php: ' . $error->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Could not load menu products.',
    ]);
}
