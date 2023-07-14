<?php
$configGlobal = require( __DIR__ . '/../../config.php');
global $configGlobal;
$location = $configGlobal->application_path . $pageNamePlusQueryString;
header("Location: " . $location);
?>