<?php
$config = require(__DIR__ . "/../../config.php");
$api_manifest = [
    "hostname" => $config->application_domain,
    "devmode" => !$config->session_secure, // there's ought to be a better way to measure this but still
];
header('Content-type: application/json');
ob_start();
ob_clean();
http_response_code(200);
echo json_encode($api_manifest);
ob_flush();
?>