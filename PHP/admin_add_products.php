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

$config = parse_ini_file(__DIR__ . '/../.env', false, INI_SCANNER_RAW);
if ($config === false) {
    error_log('admin_add_products.php: Failed to parse .env file');
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server configuration error.']);
    exit;
}

$dbHost     = $config['DB_HOST'] ?? '';
$dbName     = $config['DB_NAME'] ?? '';
$dbUser     = $config['DB_USER'] ?? '';
$dbPassword = $config['DB_PASSWORD'] ?? '';

if ($dbHost === '' || $dbName === '' || $dbUser === '') {
    error_log('admin_add_products.php: Database settings are missing from .env');
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server configuration error.']);
    exit;
}

$name        = trim($_POST['name'] ?? '');
$description = trim($_POST['description'] ?? '');
$ingredients = trim($_POST['ingredients'] ?? '');
$price       = trim($_POST['price'] ?? '');
$category    = trim($_POST['category'] ?? '');

$allowedCategories = [
    'Hot drinks',
    'Cold drinks',
    'Breakfast & brunch',
    'Lunch & sandwiches',
    'Pastries & baked goods',
    'Cakes & desserts',
];

$allowedDietaryTags = [
    'Vegan',
    'Vegetarian',
    'Gluten-Free',
    'Dairy-Free',
    'Nut-Free',
];

if ($name === '' || mb_strlen($name) > 255) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Enter a product name (up to 255 characters).']);
    exit;
}

if (! in_array($category, $allowedCategories, true)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Choose a valid category.']);
    exit;
}

if (! is_numeric($price) || (float) $price <= 0 || (float) $price > 99999999.99) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Enter a valid positive price.']);
    exit;
}

$tags = json_decode($_POST['dietaryTags'] ?? '[]', true);
if (! is_array($tags)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Dietary tags are invalid.']);
    exit;
}
$tags = array_values(array_unique($tags));

foreach ($tags as $tag) {
    if (! is_string($tag) || ! in_array($tag, $allowedDietaryTags, true)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'A dietary tag is invalid.']);
        exit;
    }
}

$imagePath       = null;
$savedImage      = null;
$uploadDirectory = __DIR__ . '/../Uploads/Product_Images';

if (isset($_FILES['image']) && $_FILES['image']['error'] !== UPLOAD_ERR_NO_FILE) {
    $image = $_FILES['image'];

    if ($image['error'] !== UPLOAD_ERR_OK) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Image upload failed.']);
        exit;
    }

    if ($image['size'] > 2 * 1024 * 1024) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Image must be smaller than 2 MB.']);
        exit;
    }

    $finfo          = new finfo(FILEINFO_MIME_TYPE);
    $mimeType       = $finfo->file($image['tmp_name']);
    $mimeExtensions = [
        'image/png'  => 'png',
        'image/jpeg' => 'jpg',
        'image/webp' => 'webp',
    ];

    if (! isset($mimeExtensions[$mimeType]) || @getimagesize($image['tmp_name']) === false) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Upload a valid PNG, JPG, or WebP image.']);
        exit;
    }

    if (! is_dir($uploadDirectory) && ! mkdir($uploadDirectory, 0755, true)) {
        error_log('admin_add_products.php: Could not create product image directory');
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Image storage is unavailable.']);
        exit;
    }

    $filename   = bin2hex(random_bytes(16)) . '.' . $mimeExtensions[$mimeType];
    $savedImage = $uploadDirectory . DIRECTORY_SEPARATOR . $filename;

    if (! move_uploaded_file($image['tmp_name'], $savedImage)) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Could not save the product image.']);
        exit;
    }

    $imagePath = 'Uploads/Product_Images/' . $filename;
}

$pdo = null;

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

    $productStatement = $pdo->prepare(
        'INSERT INTO products (name, description, ingredients, price, category, image_path, created_at, updated_at)
         VALUES (:name, :description, :ingredients, :price, :category, :image_path, NOW(), NOW())'
    );
    $productStatement->execute([
        ':name'        => $name,
        ':description' => $description === '' ? null : $description,
        ':ingredients' => $ingredients === '' ? null : $ingredients,
        ':price'       => number_format((float) $price, 2, '.', ''),
        ':category'    => $category,
        ':image_path'  => $imagePath,
    ]);

    $productId = (int) $pdo->lastInsertId();

    $tagStatement = $pdo->prepare(
        'INSERT INTO dietary_tags (name, created_at, updated_at)
         VALUES (:name, NOW(), NOW())
         ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)'
    );
    $linkStatement = $pdo->prepare(
        'INSERT INTO product_dietary_tags (product_id, dietary_tag_id, created_at)
         VALUES (:product_id, :dietary_tag_id, NOW())'
    );

    foreach ($tags as $tagName) {
        $tagStatement->execute([':name' => $tagName]);
        $tagId = (int) $pdo->lastInsertId();

        $linkStatement->execute([
            ':product_id'     => $productId,
            ':dietary_tag_id' => $tagId,
        ]);
    }

    $pdo->commit();

    echo json_encode([
        'success'    => true,
        'message'    => 'Product added successfully.',
        'product_id' => $productId,
        'image_path' => $imagePath,
    ]);
} catch (Throwable $error) {
    if ($pdo instanceof PDO && $pdo->inTransaction()) {
        $pdo->rollBack();
    }

    if ($savedImage !== null && is_file($savedImage)) {
        @unlink($savedImage);
    }

    error_log('admin_add_products.php: ' . $error->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Could not save the product. Please try again.']);
}
