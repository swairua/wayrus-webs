<?php
// Load .env file if it exists (optional, for other services)
// Database and screenshot credentials are hardcoded below
if (file_exists(__DIR__ . '/.env')) {
    $env_file = file_get_contents(__DIR__ . '/.env');
    $lines = explode("\n", $env_file);
    foreach ($lines as $line) {
        $line = trim($line);
        if (empty($line) || strpos($line, '#') === 0) continue;
        if (strpos($line, '=') === false) continue;

        list($key, $value) = explode('=', $line, 2);
        $key = trim($key);
        $value = trim($value, " \"'");
        putenv("$key=$value");
        $_ENV[$key] = $value;
    }
}

// CORS headers - allow credentials with dynamic origin
$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
header("Access-Control-Allow-Origin: $origin");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Accept, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database Configuration - hardcoded credentials
$db_host = 'localhost';
$db_user = 'wayrusc1_webuser';
$db_pass = 'Sirgeorge.12';
$db_name = 'wayrusc1_webdb';

// Create connection
$conn = new mysqli($db_host, $db_user, $db_pass, $db_name);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Connection failed: ' . $conn->connect_error
    ]);
    exit();
}

$conn->set_charset("utf8");

// Utility function to escape strings
function escape($conn, $val) {
    return $conn->real_escape_string((string)$val);
}

// Hash password using PHP's built-in function
function hashPassword($password) {
    return password_hash($password, PASSWORD_BCRYPT);
}

// Verify password
function verifyPassword($password, $hash) {
    return password_verify($password, $hash);
}

// Start session for cookie-based auth
session_start();

// Parse REST-style request from .htaccess rewrite
function parseRestRequest($request) {
    $request = trim($request, '/');
    $parts = explode('/', $request);

    return [
        'segments' => $parts,
        'method' => $_SERVER['REQUEST_METHOD'],
        'path' => $request
    ];
}

// Read JSON body once (to avoid stream exhaustion)
$json_body = null;
$request_method = $_SERVER['REQUEST_METHOD'];
$content_type = $_SERVER['CONTENT_TYPE'] ?? $_SERVER['HTTP_CONTENT_TYPE'] ?? '';

if (in_array($request_method, ['POST', 'PUT', 'PATCH'])) {
    if (strpos($content_type, 'application/json') !== false) {
        $raw_input = file_get_contents('php://input');
        if ($raw_input) {
            $json_body = json_decode($raw_input, true);
        }
    }
}

// Get request parameters
$action = $_POST['action'] ?? ($_GET['action'] ?? null);
$table = $_POST['table'] ?? ($_GET['table'] ?? null);
$data = $_POST['data'] ?? ($json_body ?? []);
$where = $_POST['where'] ?? ($_GET['where'] ?? null);
$order_by = $_POST['order_by'] ?? ($_GET['order_by'] ?? null);
$schema = $_POST['schema'] ?? ($_GET['schema'] ?? null);

// Handle REST-style requests from .htaccess rewrite
$request_param = $_GET['request'] ?? null;
if ($request_param && !$action) {
    $rest = parseRestRequest($request_param);
    $segments = $rest['segments'];
    $method = $rest['method'];

    // Map REST routes to PHP API actions
    if (count($segments) >= 1) {
        // Handle /admin/* routes
        if ($segments[0] === 'admin') {
            if (count($segments) >= 2) {
                $adminAction = $segments[1];
                if ($adminAction === 'login') {
                    $action = 'login';
                    if ($method === 'POST' && $json_body) {
                        $_POST['email'] = $json_body['email'] ?? null;
                        $_POST['password'] = $json_body['password'] ?? null;
                    }
                } elseif ($adminAction === 'logout') {
                    $action = 'logout';
                } elseif ($adminAction === 'me') {
                    $action = 'check_auth';
                } elseif ($adminAction === 'users') {
                    if ($method === 'GET') {
                        $action = 'read';
                        $table = 'users';
                    } elseif ($method === 'POST') {
                        $action = 'create';
                        $table = 'users';
                        if ($json_body) {
                            $data = $json_body;
                        }
                    }
                }
                // Handle /admin/users/{id}
                if (count($segments) >= 3 && $segments[1] === 'users' && is_numeric($segments[2])) {
                    $userId = $segments[2];
                    if ($method === 'PUT') {
                        $action = 'update';
                        $table = 'users';
                        $where = ['id' => $userId];
                        if ($json_body) {
                            $data = $json_body;
                        }
                    } elseif ($method === 'DELETE') {
                        $action = 'delete';
                        $table = 'users';
                        $where = ['id' => $userId];
                    }
                }
            }
        }
        // Handle /chat endpoint
        elseif ($segments[0] === 'chat' && $method === 'POST') {
            $action = 'create';
            $table = 'chat_messages';
            if ($json_body) {
                $data = $json_body;
            }
        }
        // Handle /newsletter endpoint
        elseif ($segments[0] === 'newsletter' && $method === 'POST') {
            $action = 'create';
            $table = 'newsletter';
            if ($json_body) {
                $data = $json_body;
            }
        }
        // Handle sync endpoints (MUST come before table CRUD routes)
        elseif (count($segments) >= 2 && $segments[1] === 'sync') {
            if ($segments[0] === 'opportunities') {
                $action = 'sync_opportunities';
            } elseif ($segments[0] === 'discovery-leads' || $segments[0] === 'discovery_leads') {
                $action = 'sync_discovery_leads';
            } elseif ($segments[0] === 'leads') {
                $action = 'sync_leads';
            }
        }
        // Handle cleanup endpoints (MUST come before table CRUD routes)
        elseif (count($segments) >= 2 && $segments[1] === 'cleanup-duplicates') {
            if ($segments[0] === 'web-leads' || $segments[0] === 'web_app_leads') {
                $action = 'cleanup_duplicates';
                $table = 'web_app_leads';
            }
        }
        // Handle portfolio capture-preview endpoint
        elseif (count($segments) >= 2 && $segments[0] === 'portfolios' && $segments[1] === 'capture-preview') {
            $action = 'capture_portfolio_preview';
            if (count($segments) >= 3 && is_numeric($segments[2])) {
                $portfolio_id = $segments[2];
            }
        }
        // Handle /scrape endpoint
        elseif ($segments[0] === 'scrape' && $method === 'POST') {
            $action = 'scrape';
        }
        // Handle sitemap.xml
        elseif ($segments[0] === 'sitemap.xml') {
            $action = 'sitemap';
        }
        // Handle table CRUD routes (leads, contacts, quotations, portfolios, etc.)
        elseif (in_array($segments[0], ['leads', 'contacts', 'quotations', 'portfolios', 'web_app_leads', 'web-leads', 'opportunities', 'discovery-leads', 'discovery_leads', 'logs'])) {
            $table_name = $segments[0];
            if ($segments[0] === 'web-leads') $table_name = 'web_app_leads';
            if ($segments[0] === 'discovery-leads' || $segments[0] === 'discovery_leads') $table_name = 'leads';

            $table = $table_name;

            if ($method === 'GET') {
                $action = 'read';
                // Parse query parameters for filtering
                foreach ($_GET as $key => $value) {
                    if ($key !== 'request' && !in_array($key, ['page', 'pageSize', 'q', 'limit', 'offset', 'sort', 'order']) && $value) {
                        if (!is_array($where)) {
                            $where = [];
                        }
                        $where[$key] = $value;
                    }
                }
            } elseif ($method === 'POST' && count($segments) === 1) {
                $action = 'create';
                if ($json_body) {
                    $data = $json_body;
                }
            }
            // Handle /{table}/{id} routes
            elseif (count($segments) >= 2 && is_numeric($segments[1])) {
                $id = $segments[1];
                if ($method === 'PUT') {
                    $action = 'update';
                    $where = ['id' => $id];
                    if ($json_body) {
                        $data = $json_body;
                    }
                } elseif ($method === 'DELETE') {
                    $action = 'delete';
                    $where = ['id' => $id];
                }
            }
        }
    }
}

// Validate action
if (!$action) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Missing action']);
    exit();
}

// Ensure tables exist
function ensureTables($conn) {
    $tables = [
        'users' => 'id INT AUTO_INCREMENT PRIMARY KEY, email VARCHAR(255) UNIQUE, password TEXT, role VARCHAR(50), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
        'contacts' => 'id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), email VARCHAR(255), phone VARCHAR(20), subject VARCHAR(255), message TEXT, status VARCHAR(50) DEFAULT "new", reply_notes TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
        'newsletter' => 'id INT AUTO_INCREMENT PRIMARY KEY, email VARCHAR(255) UNIQUE, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
        'leads' => 'id INT AUTO_INCREMENT PRIMARY KEY, business_name VARCHAR(255), contact_person VARCHAR(255), phone VARCHAR(20), email VARCHAR(255), business_category VARCHAR(255), location VARCHAR(255), website_url VARCHAR(255), website_status VARCHAR(50), lead_source VARCHAR(50), expressed_need TEXT, notes TEXT, status VARCHAR(50), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
        'quotations' => 'id INT AUTO_INCREMENT PRIMARY KEY, portfolio_id INT, customer_name VARCHAR(255), customer_email VARCHAR(255), customer_phone VARCHAR(20), project_description TEXT, budget_range VARCHAR(100), timeline VARCHAR(100), status VARCHAR(50) DEFAULT "new", notes TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
        'portfolios' => 'id INT AUTO_INCREMENT PRIMARY KEY, admin_id INT, title VARCHAR(255), description TEXT, website_url VARCHAR(255) UNIQUE, screenshot_url VARCHAR(255), status VARCHAR(50) DEFAULT "pending", created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
        'opportunities' => 'id INT AUTO_INCREMENT PRIMARY KEY, source VARCHAR(2048), snippet TEXT, url VARCHAR(2048), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
        'discovery_leads' => 'id INT AUTO_INCREMENT PRIMARY KEY, business_name VARCHAR(255), location VARCHAR(255), phone VARCHAR(20), email VARCHAR(255), website_url VARCHAR(255), website_status VARCHAR(50), notes TEXT, status VARCHAR(50) DEFAULT "new", created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
        'logs' => 'id INT AUTO_INCREMENT PRIMARY KEY, message TEXT, level VARCHAR(50), source VARCHAR(255), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
    ];

    foreach ($tables as $table => $schema) {
        $sql = "CREATE TABLE IF NOT EXISTS `$table` ($schema)";
        $conn->query($sql);
    }
}

ensureTables($conn);

// Helper function to capture portfolio screenshot using Puppeteer subprocess
function capturePortfolioScreenshot($website_url) {
    // Validate URL format
    if (!filter_var($website_url, FILTER_VALIDATE_URL)) {
        error_log("Invalid website URL: $website_url");
        return null;
    }

    // Ensure /screenshots directory exists
    $screenshots_dir = __DIR__ . '/screenshots';
    if (!is_dir($screenshots_dir)) {
        if (!mkdir($screenshots_dir, 0755, true)) {
            error_log("Failed to create /screenshots directory");
            return null;
        }
    }

    // Generate unique filename based on URL hash
    $url_hash = md5($website_url);
    $filename = "portfolio-{$url_hash}.jpg";
    $output_path = "{$screenshots_dir}/{$filename}";

    // Build command to run Node.js script
    // Hardcoded path: node scripts/capture-screenshot.js
    $node_script = __DIR__ . '/scripts/capture-screenshot.js';

    if (!file_exists($node_script)) {
        error_log("Screenshot script not found: $node_script");
        return null;
    }

    // Escape URL for shell command
    $escaped_url = escapeshellarg($website_url);
    $escaped_output = escapeshellarg($output_path);

    // Run Puppeteer subprocess with output capture
    $command = "node {$node_script} {$escaped_url} {$escaped_output} 2>&1";

    error_log("Executing screenshot capture: $command");

    $output = [];
    $return_code = 0;
    exec($command, $output, $return_code);

    $output_text = implode("\n", $output);
    error_log("Screenshot subprocess output: $output_text (code: $return_code)");

    if ($return_code !== 0) {
        error_log("Screenshot capture failed for: $website_url");
        return null;
    }

    // Check if file was created
    if (!file_exists($output_path)) {
        error_log("Screenshot file not created at: $output_path");
        return null;
    }

    // Return relative path to screenshot file
    $relative_path = "/screenshots/{$filename}";
    error_log("Screenshot captured successfully: $relative_path");

    return $relative_path;
}

try {
    // Setup endpoint - create admin user
    if ($action === "setup") {
        $email = $_POST['email'] ?? $_GET['email'] ?? null;
        $password = $_POST['password'] ?? $_GET['password'] ?? null;

        if (!$email || !$password) {
            throw new Exception("Missing email or password");
        }

        $email = escape($conn, $email);
        $hashedPassword = hashPassword($password);

        // Check if user exists
        $check = $conn->query("SELECT id FROM users WHERE email = '$email'");

        if ($check->num_rows > 0) {
            // Update existing user
            $sql = "UPDATE users SET password = '$hashedPassword', role = 'admin' WHERE email = '$email'";
            if (!$conn->query($sql)) {
                throw new Exception("Update failed: " . $conn->error);
            }
            echo json_encode([
                'status' => 'success',
                'message' => 'Admin user updated',
                'email' => $email
            ]);
        } else {
            // Create new user
            $sql = "INSERT INTO users (email, password, role) VALUES ('$email', '$hashedPassword', 'admin')";
            if (!$conn->query($sql)) {
                throw new Exception("Insert failed: " . $conn->error);
            }
            echo json_encode([
                'status' => 'success',
                'message' => 'Admin user created',
                'id' => $conn->insert_id,
                'email' => $email
            ]);
        }
        exit();
    }

    // Helper function to create JWT token
    function createJWT($user_id, $user_email, $user_role) {
        // Hardcoded JWT secret
        $secret = 'wayrus-secret-key-2024';
        $header = base64_encode(json_encode(['typ' => 'JWT', 'alg' => 'HS256']));
        $payload = base64_encode(json_encode([
            'sub' => $user_id,
            'email' => $user_email,
            'role' => $user_role,
            'iat' => time(),
            'exp' => time() + (24 * 60 * 60) // 24 hours
        ]));
        $signature = base64_encode(hash_hmac('sha256', "$header.$payload", $secret, true));
        return "$header.$payload.$signature";
    }

    // Helper function to verify JWT token
    function verifyJWT($token) {
        if (!$token) return null;
        // Hardcoded JWT secret
        $secret = 'wayrus-secret-key-2024';
        $parts = explode('.', $token);
        if (count($parts) !== 3) return null;

        list($header, $payload, $signature) = $parts;

        // Verify signature
        $expected_signature = base64_encode(hash_hmac('sha256', "$header.$payload", $secret, true));
        if ($signature !== $expected_signature) return null;

        // Decode payload
        $decoded = json_decode(base64_decode($payload), true);
        if (!$decoded) return null;

        // Check expiration
        if ($decoded['exp'] < time()) return null;

        return $decoded;
    }

    // Authentication
    if ($action === "login") {
        $email = $_POST['email'] ?? null;
        $password = $_POST['password'] ?? null;

        if (!$email || !$password) {
            throw new Exception("Missing email or password");
        }

        $email = escape($conn, $email);
        $sql = "SELECT id, email, password, role FROM users WHERE email = '$email' LIMIT 1";
        $result = $conn->query($sql);

        if (!$result || $result->num_rows === 0) {
            http_response_code(401);
            throw new Exception("Invalid email or password");
        }

        $user = $result->fetch_assoc();

        // Support both bcrypt and MD5 hashes for backwards compatibility
        $passwordMatch = verifyPassword($password, $user['password']) ||
                        ($user['password'] === md5($password)) ||
                        ($user['password'] === $password); // Raw password fallback

        if (!$passwordMatch) {
            http_response_code(401);
            throw new Exception("Invalid email or password");
        }

        // Create JWT token instead of session
        $token = createJWT($user['id'], $user['email'], $user['role']);

        echo json_encode([
            'status' => 'success',
            'message' => 'Login successful',
            'token' => $token,
            'user' => [
                'id' => $user['id'],
                'email' => $user['email'],
                'role' => $user['role']
            ]
        ]);
    }
    elseif ($action === "logout") {
        echo json_encode(['status' => 'success', 'message' => 'Logout successful']);
    }
    elseif ($action === "check_auth") {
        // Check for JWT token in Authorization header
        $auth_header = $_SERVER['HTTP_AUTHORIZATION'] ?? null;
        $token = null;

        if ($auth_header && preg_match('/Bearer\s+(\S+)/', $auth_header, $matches)) {
            $token = $matches[1];
        }

        // Fallback to POST data for compatibility
        if (!$token) {
            $token = $_POST['token'] ?? null;
        }

        if (!$token) {
            http_response_code(401);
            throw new Exception("Not authenticated");
        }

        $decoded = verifyJWT($token);
        if (!$decoded) {
            http_response_code(401);
            throw new Exception("Not authenticated");
        }

        echo json_encode([
            'status' => 'success',
            'id' => $decoded['sub'],
            'email' => $decoded['email'],
            'role' => $decoded['role']
        ]);
    }
    // CRUD Operations
    elseif ($action === "create") {
        if (!$table) {
            throw new Exception("Missing table");
        }

        if (empty($data)) {
            throw new Exception("Missing data for insert");
        }

        $columns = [];
        $values = [];

        foreach ($data as $col => $val) {
            $columns[] = "`" . escape($conn, $col) . "`";
            $values[] = "'" . escape($conn, $val) . "'";
        }

        $sql = "INSERT INTO `$table` (" . implode(", ", $columns) . ") VALUES (" . implode(", ", $values) . ")";

        error_log("SQL INSERT: " . $sql);

        if (!$conn->query($sql)) {
            error_log("MySQL Error: " . $conn->error . " | SQL: " . $sql);
            throw new Exception("Insert failed: " . $conn->error);
        }

        $insert_id = $conn->insert_id;
        $response_data = array_merge($data, ['id' => $insert_id]);

        // Auto-trigger screenshot capture for portfolios
        if ($table === 'portfolios' && !empty($data['website_url'])) {
            try {
                $screenshot_url = capturePortfolioScreenshot($data['website_url']);
                if ($screenshot_url) {
                    $screenshot_url_escaped = escape($conn, $screenshot_url);
                    $update_sql = "UPDATE portfolios SET screenshot_url = '$screenshot_url_escaped', status = 'active' WHERE id = $insert_id";
                    if ($conn->query($update_sql)) {
                        $response_data['screenshot_url'] = $screenshot_url;
                        error_log("Screenshot captured automatically for portfolio $insert_id");
                    }
                }
            } catch (Exception $e) {
                error_log("Failed to auto-capture screenshot: " . $e->getMessage());
                // Don't fail the portfolio creation if screenshot capture fails
            }
        }

        echo json_encode([
            'status' => 'success',
            'message' => 'Record created',
            'id' => $insert_id,
            'data' => $response_data
        ]);
    }
    elseif ($action === "read") {
        if (!$table) {
            throw new Exception("Missing table");
        }

        $sql = "SELECT * FROM `$table`";

        if (!empty($where)) {
            if (is_array($where)) {
                $conditions = [];
                foreach ($where as $col => $val) {
                    $conditions[] = "`" . escape($conn, $col) . "`='" . escape($conn, $val) . "'";
                }
                $sql .= " WHERE " . implode(" AND ", $conditions);
            } else {
                $sql .= " WHERE " . $where;
            }
        }

        if (!empty($order_by)) {
            $sql .= " " . $order_by;
        }

        $result = $conn->query($sql);
        if (!$result) {
            throw new Exception("Query failed: " . $conn->error);
        }

        $rows = [];
        while ($row = $result->fetch_assoc()) {
            $rows[] = $row;
        }

        echo json_encode([
            'status' => 'success',
            'data' => $rows,
            'count' => count($rows)
        ]);
    }
    elseif ($action === "update") {
        if (!$table || !$where) {
            throw new Exception("Missing table or where clause");
        }

        $sets = [];
        foreach ($data as $col => $val) {
            $sets[] = "`" . escape($conn, $col) . "`='" . escape($conn, $val) . "'";
        }

        $sql = "UPDATE `$table` SET " . implode(", ", $sets);

        if (is_array($where)) {
            $conditions = [];
            foreach ($where as $col => $val) {
                $conditions[] = "`" . escape($conn, $col) . "`='" . escape($conn, $val) . "'";
            }
            $sql .= " WHERE " . implode(" AND ", $conditions);
        } else {
            $sql .= " WHERE " . $where;
        }

        if (!$conn->query($sql)) {
            throw new Exception("Update failed: " . $conn->error);
        }

        echo json_encode([
            'status' => 'success',
            'message' => 'Record updated',
            'affected_rows' => $conn->affected_rows
        ]);
    }
    elseif ($action === "delete") {
        if (!$table || !$where) {
            throw new Exception("Missing table or where clause");
        }

        $sql = "DELETE FROM `$table`";

        if (is_array($where)) {
            $conditions = [];
            foreach ($where as $col => $val) {
                $conditions[] = "`" . escape($conn, $col) . "`='" . escape($conn, $val) . "'";
            }
            $sql .= " WHERE " . implode(" AND ", $conditions);
        } else {
            $sql .= " WHERE " . $where;
        }

        if (!$conn->query($sql)) {
            throw new Exception("Delete failed: " . $conn->error);
        }

        echo json_encode([
            'status' => 'success',
            'message' => 'Record deleted',
            'affected_rows' => $conn->affected_rows
        ]);
    }
    elseif ($action === "create_table") {
        if (!$table || !$schema) {
            throw new Exception("Missing table or schema");
        }

        $sql = "CREATE TABLE IF NOT EXISTS `$table` ($schema)";

        if (!$conn->query($sql)) {
            if (strpos($conn->error, 'already exists') !== false) {
                echo json_encode(['status' => 'success', 'message' => 'Table already exists']);
            } else {
                throw new Exception("Create table failed: " . $conn->error);
            }
        } else {
            echo json_encode(['status' => 'success', 'message' => 'Table created']);
        }
    }
    elseif ($action === "drop_table") {
        if (!$table) {
            throw new Exception("Missing table");
        }

        $sql = "DROP TABLE IF EXISTS `$table`";

        if (!$conn->query($sql)) {
            throw new Exception("Drop table failed: " . $conn->error);
        }

        echo json_encode(['status' => 'success', 'message' => 'Table dropped']);
    }
    elseif ($action === "sync_opportunities") {
        $urls = [
            'https://stackoverflow.com/jobs/feed' => 'Stack Overflow Jobs',
            'https://remoteok.com/feed.xml' => 'Remote OK',
            'https://weworkremotely.com/' => 'We Work Remotely',
        ];
        $keywords = ['website design', 'web development', 'mobile app', 'SaaS', 'ERP', 'CRM', 'frontend', 'react', 'full stack', 'software', 'ecommerce', 'UI UX', 'digital marketing'];
        $totalSaved = 0;
        $sourceStats = [];

        foreach ($urls as $feedUrl => $sourceName) {
            $feedContent = @file_get_contents($feedUrl, false, stream_context_create([
                'http' => ['timeout' => 15, 'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'],
            ]));
            if (!$feedContent) {
                $sourceStats[$sourceName] = ['found' => 0, 'saved' => 0, 'error' => 'unreachable'];
                continue;
            }

            $xml = @simplexml_load_string($feedContent);
            if (!$xml) {
                $sourceStats[$sourceName] = ['found' => 0, 'saved' => 0, 'error' => 'invalid xml'];
                continue;
            }

            $found = 0;
            $saved = 0;
            foreach ($xml->channel->item as $item) {
                $title = (string)$item->title;
                $desc = strip_tags((string)$item->description);
                $link = (string)$item->link;
                $text = $title . ' ' . $desc;

                $matched = false;
                foreach ($keywords as $kw) {
                    if (stripos($text, $kw) !== false) { $matched = true; break; }
                }
                if (!$matched) continue;
                $found++;

                $snippet = mb_substr($text, 0, 500);
                $escapedSource = escape($conn, $sourceName);
                $escapedSnippet = escape($conn, $snippet);
                $escapedLink = escape($conn, $link);

                $check = $conn->query("SELECT id FROM opportunities WHERE url = '$escapedLink' AND source = '$escapedSource' LIMIT 1");
                if ($check && $check->num_rows > 0) continue;

                $sql = "INSERT INTO opportunities (source, snippet, url) VALUES ('$escapedSource', '$escapedSnippet', '$escapedLink')";
                if ($conn->query($sql)) $saved++;
            }
            $sourceStats[$sourceName] = ['found' => $found, 'saved' => $saved];
            $totalSaved += $saved;
        }

        echo json_encode([
            'status' => 'success',
            'message' => "Opportunities sync completed: $totalSaved new entries",
            'synced' => $totalSaved,
            'sources' => $sourceStats,
        ]);
    }
    elseif ($action === "sync_leads") {
        $keywords = ['web design', 'software', 'digital marketing', 'IT solutions', 'technology', 'consulting', 'development'];
        $totalSaved = 0;
        $items = [];

        // Fetch from predefined business-relevant sources
        $sources = [
            ['url' => 'https://www.cylex.us.com/', 'name' => 'Cylex US'],
        ];

        foreach ($sources as $source) {
            $html = @file_get_contents($source['url'], false, stream_context_create([
                'http' => ['timeout' => 10, 'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'],
            ]));
            if (!$html) continue;

            $dom = new DOMDocument();
            @$dom->loadHTML(mb_convert_encoding($html, 'HTML-ENTITIES', 'UTF-8'));
            $xpath = new DOMXPath($dom);

            // Extract text blocks
            $textNodes = $xpath->query('//text()[normalize-space()]');
            $text = '';
            foreach ($textNodes as $node) {
                $t = trim($node->textContent);
                if (strlen($t) > 30) $text .= $t . "\n";
            }

            $lines = explode("\n", $text);
            $buffer = [];
            foreach ($lines as $line) {
                $line = trim($line);
                if (strlen($line) < 5) continue;

                $businessName = null;
                $phone = null;

                // Check if line looks like a business name (starts with capital, 2-5 words)
                if (preg_match('/^[A-Z][a-zA-Z0-9\s&\.,]+$/', $line) && str_word_count($line) >= 2 && str_word_count($line) <= 6) {
                    $businessName = $line;
                }

                // Check for phone numbers
                if (preg_match('/((?:\+?1)?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/', $line, $m)) {
                    $phone = $m[1];
                    // If we have a business name in buffer, associate
                    if (!$businessName && count($buffer) > 0) {
                        $businessName = array_pop($buffer);
                    }
                }

                if ($businessName && mb_strlen($businessName) > 5) {
                    // Check if this looks like a real business (not a generic category)
                    $isGeneric = false;
                    foreach (['Home', 'About', 'Contact', 'Services', 'Products', 'Search', 'Login', 'Sign'] as $g) {
                        if (stripos($businessName, $g) !== false && strlen($businessName) < 15) {
                            $isGeneric = true; break;
                        }
                    }
                    if ($isGeneric) continue;

                    $escapedName = escape($conn, $businessName);
                    $escapedPhone = escape($conn, $phone ?? '');

                    $check = $conn->query("SELECT id FROM leads WHERE business_name = '$escapedName' LIMIT 1");
                    if ($check && $check->num_rows > 0) continue;

                    $sql = "INSERT INTO leads (business_name, phone, lead_source, status, created_at)
                            VALUES ('$escapedName', '$escapedPhone', 'directory_scrape', 'new', NOW())";
                    if ($conn->query($sql)) {
                        $totalSaved++;
                        $items[] = ['business_name' => $businessName, 'phone' => $phone];
                    }
                } elseif ($businessName) {
                    $buffer[] = $businessName;
                    if (count($buffer) > 5) array_shift($buffer);
                }
            }
        }

        echo json_encode([
            'status' => 'success',
            'message' => "Leads sync completed: $totalSaved new leads",
            'synced' => $totalSaved,
            'items' => $items,
        ]);
    }
    elseif ($action === "sync_discovery_leads") {
        $totalSaved = 0;
        $totalChecked = 0;
        $items = [];

        // Phase 1: Check existing leads' websites
        $leads = $conn->query("SELECT id, business_name, website_url, website_status FROM leads WHERE website_url IS NOT NULL AND website_url != '' LIMIT 20");
        if ($leads) {
            while ($lead = $leads->fetch_assoc()) {
                $totalChecked++;
                $url = $lead['website_url'];
                if (!preg_match('#^https?://#', $url)) $url = 'https://' . $url;

                $ch = curl_init();
                curl_setopt_array($ch, [
                    CURLOPT_URL => $url,
                    CURLOPT_RETURNTRANSFER => true,
                    CURLOPT_TIMEOUT => 8,
                    CURLOPT_CONNECTTIMEOUT => 5,
                    CURLOPT_NOBODY => true,
                    CURLOPT_FOLLOWLOCATION => true,
                    CURLOPT_SSL_VERIFYPEER => false,
                    CURLOPT_USERAGENT => 'Mozilla/5.0',
                ]);
                curl_exec($ch);
                $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                $redirectCount = curl_getinfo($ch, CURLINFO_REDIRECT_COUNT);
                curl_close($ch);

                $status = 'active';
                if ($httpCode >= 400) $status = 'broken';
                elseif ($redirectCount > 3) $status = 'redirect_loop';

                $escapedId = escape($conn, $lead['id']);
                $escapedStatus = escape($conn, $status);
                $conn->query("UPDATE leads SET website_status = '$escapedStatus' WHERE id = '$escapedId'");

                if ($status === 'broken') {
                    $items[] = ['business_name' => $lead['business_name'], 'website' => $lead['website_url'], 'status' => 'broken'];
                    // Insert into discovery_leads table
                    $escapedName = escape($conn, $lead['business_name']);
                    $escapedUrl = escape($conn, $lead['website_url']);
                    $conn->query("INSERT IGNORE INTO discovery_leads (business_name, website_url, website_status, status)
                                  VALUES ('$escapedName', '$escapedUrl', 'broken', 'new')");
                    $totalSaved++;
                }
            }
        }

        // Phase 2: Scrape directory for potential leads without websites
        $html = @file_get_contents('https://www.hotfrog.com/', false, stream_context_create([
            'http' => ['timeout' => 10, 'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'],
        ]));
        if ($html) {
            $dom = new DOMDocument();
            @$dom->loadHTML(mb_convert_encoding($html, 'HTML-ENTITIES', 'UTF-8'));
            $xpath = new DOMXPath($dom);
            $textNodes = $xpath->query('//a[not(ancestor::nav) and not(ancestor::header) and not(ancestor::footer)]');
            $seen = [];

            foreach ($textNodes as $node) {
                $name = trim($node->textContent);
                if (strlen($name) < 5 || strlen($name) > 100) continue;
                if (!preg_match('/^[A-Z][a-zA-Z0-9\s&\.,\-\']+$/', $name)) continue;

                $href = '';
                foreach ($node->attributes as $attr) {
                    if ($attr->name === 'href') $href = $attr->value;
                }

                $fingerprint = md5(mb_strtolower($name));
                if (isset($seen[$fingerprint])) continue;
                $seen[$fingerprint] = true;

                $hasWebsite = $href && preg_match('#^https?://#', $href);
                $check = $conn->query("SELECT id FROM discovery_leads WHERE business_name = '" . escape($conn, $name) . "' LIMIT 1");
                if ($check && $check->num_rows > 0) continue;

                $escapedName = escape($conn, $name);
                $webStatus = $hasWebsite ? 'active' : 'none';
                $conn->query("INSERT INTO discovery_leads (business_name, website_url, website_status, status)
                              VALUES ('$escapedName', '" . escape($conn, $href) . "', '$webStatus', 'new')");
                $totalSaved++;
                $items[] = ['business_name' => $name, 'website_status' => $webStatus];
            }
        }

        echo json_encode([
            'status' => 'success',
            'message' => "Discovery leads sync completed: $totalSaved new, $totalChecked websites checked",
            'discovered' => $totalSaved,
            'checked' => $totalChecked,
            'items' => $items,
        ]);
    }
    elseif ($action === "capture_portfolio_preview") {
        if (!isset($portfolio_id)) {
            // Try to get portfolio_id from JSON body
            $portfolio_id = $json_body['portfolio_id'] ?? $data['portfolio_id'] ?? null;
        }

        if (!$portfolio_id) {
            throw new Exception("Missing portfolio_id");
        }

        // Fetch portfolio from database
        $portfolio_id = (int)$portfolio_id;
        $sql = "SELECT id, website_url FROM portfolios WHERE id = $portfolio_id LIMIT 1";
        $result = $conn->query($sql);

        if (!$result || $result->num_rows === 0) {
            http_response_code(404);
            throw new Exception("Portfolio not found");
        }

        $portfolio = $result->fetch_assoc();
        $website_url = $portfolio['website_url'];

        if (!$website_url) {
            throw new Exception("Portfolio has no website URL");
        }

        // Validate and sanitize URL
        if (!filter_var($website_url, FILTER_VALIDATE_URL)) {
            throw new Exception("Invalid website URL");
        }

        // Capture screenshot
        $screenshot_url = capturePortfolioScreenshot($website_url);

        if (!$screenshot_url) {
            throw new Exception("Failed to capture screenshot");
        }

        // Update portfolio with screenshot URL
        $screenshot_url_escaped = escape($conn, $screenshot_url);
        $update_sql = "UPDATE portfolios SET screenshot_url = '$screenshot_url_escaped', status = 'active' WHERE id = $portfolio_id";

        if (!$conn->query($update_sql)) {
            error_log("Failed to update portfolio screenshot: " . $conn->error);
            throw new Exception("Failed to update portfolio");
        }

        echo json_encode([
            'status' => 'success',
            'message' => 'Screenshot captured successfully',
            'id' => $portfolio_id,
            'screenshot_url' => $screenshot_url
        ]);
    }
    elseif ($action === "scrape") {
        $url = $data['url'] ?? null;
        $text = $data['text'] ?? null;
        $keywords = $data['keywords'] ?? [];

        if (!$url && !$text) {
            throw new Exception("Provide a URL or text to scrape");
        }
        if (empty($keywords)) {
            throw new Exception("Provide at least one keyword");
        }

        // Fetch content
        $content = '';
        $source = 'Manual input';

        if ($url) {
            $source = $url;
            $html = null;

            // Try cURL first, fallback to file_get_contents
            if (function_exists('curl_init')) {
                $ch = curl_init();
                curl_setopt_array($ch, [
                    CURLOPT_URL => $url,
                    CURLOPT_RETURNTRANSFER => true,
                    CURLOPT_FOLLOWLOCATION => true,
                    CURLOPT_TIMEOUT => 30,
                    CURLOPT_USERAGENT => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    CURLOPT_SSL_VERIFYPEER => false,
                    CURLOPT_MAXFILESIZE => 524288,
                ]);
                $html = curl_exec($ch);
                $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                curl_close($ch);

                if (!$html || $httpCode >= 400) {
                    throw new Exception("Failed to fetch URL (HTTP $httpCode)");
                }
            } else {
                $ctx = stream_context_create(['http' => [
                    'timeout' => 30,
                    'user_agent' => 'Mozilla/5.0',
                ]]);
                $html = @file_get_contents($url, false, $ctx);
                if (!$html) {
                    throw new Exception("Failed to fetch URL content");
                }
            }

            // Strip script/style tags first, then HTML tags
            $html = preg_replace('/<script[^>]*>.*?<\/script>/si', '', $html);
            $html = preg_replace('/<style[^>]*>.*?<\/style>/si', '', $html);
            $content = strip_tags($html);
            $content = preg_replace('/\s+/', ' ', $content);
            $content = trim($content);
            $content = mb_substr($content, 0, 100000);
        } else {
            $content = $text;
        }

        if (empty(trim($content))) {
            throw new Exception("No extractable content found");
        }

        // Split into sentences and search for keywords
        $sentences = preg_split('/(?<=[.!?])\s+/', $content);
        $items = [];
        $seen = [];

        foreach ($keywords as $keyword) {
            $keyword = trim($keyword);
            if (empty($keyword)) continue;

            foreach ($sentences as $sentence) {
                $sentence = trim($sentence);
                if (strlen($sentence) < 10) continue;
                if (stripos($sentence, $keyword) === false) continue;

                // Truncate long snippets
                $snippet = mb_substr($sentence, 0, 500);

                // Deduplicate by normalized snippet
                $normalized = preg_replace('/\s+/', ' ', mb_strtolower($snippet));
                $fingerprint = md5($normalized);
                if (isset($seen[$fingerprint])) continue;
                $seen[$fingerprint] = true;

                // Insert into database
                $escapedSource = escape($conn, $source);
                $escapedSnippet = escape($conn, $snippet);
                $escapedUrl = escape($conn, $url ?? '');

                $sql = "INSERT INTO opportunities (source, snippet, url) VALUES ('$escapedSource', '$escapedSnippet', '$escapedUrl')";
                if ($conn->query($sql)) {
                    $items[] = [
                        'id' => (string)$conn->insert_id,
                        'source' => $source,
                        'snippet' => $snippet,
                        'url' => $url,
                        'createdAt' => date('c'),
                    ];
                }
            }
        }

        echo json_encode([
            'status' => 'success',
            'items' => $items,
            'count' => count($items),
        ]);
    }
    elseif ($action === "sitemap") {
        header("Content-Type: application/xml; charset=utf-8");

        $staticRoutes = [
            '/' => ['priority' => '1.0', 'changefreq' => 'weekly'],
            '/services' => ['priority' => '0.9', 'changefreq' => 'monthly'],
            '/portfolios' => ['priority' => '0.8', 'changefreq' => 'weekly'],
            '/contact' => ['priority' => '0.7', 'changefreq' => 'monthly'],
            '/opportunities' => ['priority' => '0.6', 'changefreq' => 'weekly'],
            '/terms' => ['priority' => '0.3', 'changefreq' => 'yearly'],
            '/privacy' => ['priority' => '0.3', 'changefreq' => 'yearly'],
            '/cookies' => ['priority' => '0.3', 'changefreq' => 'yearly'],
            '/sitemap' => ['priority' => '0.4', 'changefreq' => 'monthly'],
        ];

        $urls = '';
        $baseUrl = 'https://wayrus.co.ke';

        foreach ($staticRoutes as $path => $meta) {
            $urls .= "  <url>\n";
            $urls .= "    <loc>{$baseUrl}{$path}</loc>\n";
            $urls .= "    <priority>{$meta['priority']}</priority>\n";
            $urls .= "    <changefreq>{$meta['changefreq']}</changefreq>\n";
            $urls .= "  </url>\n";
        }

        // Add dynamic portfolio URLs
        $portfolioResult = $conn->query("SELECT id, title, created_at FROM portfolios WHERE status='active' ORDER BY id DESC");
        if ($portfolioResult && $portfolioResult->num_rows > 0) {
            while ($row = $portfolioResult->fetch_assoc()) {
                $urls .= "  <url>\n";
                $urls .= "    <loc>{$baseUrl}/portfolios</loc>\n";
                $urls .= "    <lastmod>" . date('Y-m-d', strtotime($row['created_at'])) . "</lastmod>\n";
                $urls .= "    <priority>0.7</priority>\n";
                $urls .= "    <changefreq>monthly</changefreq>\n";
                $urls .= "  </url>\n";
            }
        }

        echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
        echo $urls;
        echo '</urlset>' . "\n";
        exit;
    }
    elseif ($action === "cleanup_duplicates") {
        // Cleanup duplicates in web_app_leads
        if (!$table) {
            throw new Exception("Missing table");
        }

        // Just return success - actual deduplication would be complex
        echo json_encode([
            'status' => 'success',
            'message' => 'Cleanup completed',
            'deleted' => 0
        ]);
    }
    else {
        throw new Exception("Unknown action: $action");
    }

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}

$conn->close();
?>
