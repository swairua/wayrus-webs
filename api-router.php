<?php
/**
 * Router for PHP built-in server
 * Routes /api/* requests to api.php using REST parameter format
 */

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Handle direct /api.php calls (from client via REST routing)
// The query string parameter 'request' is already set by PHP
if ($uri === '/api.php' || $uri === '/api.php/') {
    include 'api.php';
    return true;
}

// Route other /api/* requests to api.php
if (strpos($uri, '/api') === 0) {
    // Extract the request path after /api prefix
    $request_path = substr($uri, 4); // Remove '/api' prefix

    // Set the request parameter so api.php can use REST routing
    // This converts /api/discovery-leads/sync to ?request=/discovery-leads/sync
    if (!isset($_GET['request']) && !empty($request_path)) {
        $_GET['request'] = $request_path;
    }

    include 'api.php';
    return true;
}

// Serve static files normally
if (is_file($_SERVER["DOCUMENT_ROOT"] . $uri)) {
    return false;
}

// For non-API routes in dev, don't serve (let Vite handle SPA)
// Return false so PHP serves the file or returns 404
return false;
?>
