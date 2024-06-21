<?php
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Clear history logic (example: delete history from database or a file)
    echo json_encode(['status' => 'History cleared']);
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
}
?>
