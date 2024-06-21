<?php
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $topic = $input['topic'];
    $grade = $input['grade'];

    // Set up the API call to Google Generative AI
    $api_key = 'AIzaSyB0g-pRbdtVx111FHYlLxkcqQjsIdgsI6E';
    $url = 'https://generativelanguage.googleapis.com';

    // The API request payload
    $postData = [
        'prompt' => "Generate an assessment for topic: $topic, grade: $grade."
    ];

    // Setup cURL
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $api_key
    ]);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($postData));

    // Execute cURL and get the response
    $response = curl_exec($ch);
    if (curl_errno($ch)) {
        echo json_encode(['error' => 'Request Error:' . curl_error($ch)]);
        curl_close($ch);
        exit();
    }

    $responseData = json_decode($response, true);
    curl_close($ch);

    // Handle the API response and return the assessment
    if (isset($responseData['data'])) {
        echo json_encode(['assessment' => $responseData['data']]);
    } else {
        echo json_encode(['error' => 'Error generating assessment. Please try again.']);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
}
?>
