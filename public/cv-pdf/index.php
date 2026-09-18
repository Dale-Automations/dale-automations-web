<?php
// Proxy de descarga del CV optimizado (herramienta /cv).
// Sirve el PDF desde daleautomations.com en vez de exponer la URL de n8n.
// Solo reenvia a un destino fijo y valida el id (uuid). Errores del backend se pasan tal cual.
declare(strict_types=1);

$id = isset($_GET['id']) ? trim((string) $_GET['id']) : '';
if (!preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i', $id)) {
    http_response_code(400);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode(['ok' => false, 'error' => 'peticion_invalida', 'message' => 'Falta el identificador del análisis.'], JSON_UNESCAPED_UNICODE);
    exit;
}

$url = 'https://n8n.daleautomations.com/webhook/cv-download?job_id=' . rawurlencode(strtolower($id));
$ch = curl_init($url);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => false,
    CURLOPT_CONNECTTIMEOUT => 10,
    CURLOPT_TIMEOUT => 60,
    CURLOPT_HTTPHEADER => ['Accept: application/pdf, application/json'],
    CURLOPT_USERAGENT => 'daleautomations-cv-pdf/1.0',
]);
$body = curl_exec($ch);
$status = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
$ctype = (string) curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
curl_close($ch);

header('Cache-Control: private, no-store');
header('X-Content-Type-Options: nosniff');

$generico = ['ok' => false, 'error' => 'red', 'message' => 'No pudimos obtener el PDF en este momento. Probá de nuevo en un rato.'];

if ($body === false || $status === 0) {
    http_response_code(502);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($generico, JSON_UNESCAPED_UNICODE);
    exit;
}

if ($status === 200 && stripos($ctype, 'application/pdf') !== false && substr($body, 0, 4) === '%PDF') {
    http_response_code(200);
    header('Content-Type: application/pdf');
    header('Content-Disposition: inline; filename="CV-optimizado-ATS.pdf"');
    header('Content-Length: ' . strlen($body));
    echo $body;
    exit;
}

// 402 sin pago, 404 no encontrado, 409 no listo: mismo codigo y mismo JSON que el backend.
http_response_code(($status >= 400 && $status < 600) ? $status : 502);
header('Content-Type: application/json; charset=utf-8');
$decoded = json_decode($body, true);
echo json_encode((is_array($decoded) && isset($decoded['error'])) ? $decoded : $generico, JSON_UNESCAPED_UNICODE);
