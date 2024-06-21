<?php
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    // Fetch history logic (example: fetch history from database or a file)
    $history = [
        // Example data structure
        ['topic' => 'Math', 'grade' => '5th Grade', 'duration' => 45, 'deliveryType' => 'Lecture'],
        ['topic' => 'Science', 'grade' => '6th Grade', 'duration' => 60, 'deliveryType' => 'Activity'],
    ];

    echo json_encode(['history' => $history]);
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
}
?>
