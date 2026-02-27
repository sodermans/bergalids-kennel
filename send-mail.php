<?php
// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Method not allowed');
}

// Collect and sanitize input
$name       = htmlspecialchars(trim($_POST['name'] ?? ''));
$email      = filter_var(trim($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL);
$phone      = htmlspecialchars(trim($_POST['phone'] ?? ''));
$preference = htmlspecialchars(trim($_POST['preference'] ?? ''));
$message    = htmlspecialchars(trim($_POST['message'] ?? ''));

// Basic validation
if (empty($name) || empty($email) || empty($message)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Fyll i alla obligatoriska fält.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Ogiltig e-postadress.']);
    exit;
}

// Simple honeypot spam check (add a hidden field named "website" in HTML)
if (!empty($_POST['website'])) {
    http_response_code(200);
    echo json_encode(['success' => true]); // Silently discard spam
    exit;
}

// Email settings
$to      = 'info@bergalidskennel.se';
$subject = 'Ny intresseanmälan från ' . $name;

$body  = "<h2>Ny intresseanmälan — Bergalids Kennel</h2>";
$body .= "<p><strong>Namn:</strong> {$name}</p>";
$body .= "<p><strong>E-post:</strong> {$email}</p>";
if ($phone)      $body .= "<p><strong>Telefon:</strong> {$phone}</p>";
if ($preference) $body .= "<p><strong>Preferens:</strong> {$preference}</p>";
$body .= "<p><strong>Meddelande:</strong><br>" . nl2br($message) . "</p>";

$headers = [
    'From'         => 'noreply@bergalidskennel.se',
    'Reply-To'     => $email,
    'MIME-Version' => '1.0',
    'Content-Type' => 'text/html; charset=utf-8',
];

$headerStr = '';
foreach ($headers as $key => $value) {
    $headerStr .= "{$key}: {$value}\r\n";
}

$sent = mail($to, $subject, $body, $headerStr);

header('Content-Type: application/json');
if ($sent) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Kunde inte skicka e-post. Försök igen eller kontakta oss direkt.']);
}
