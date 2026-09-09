<?php
require_once 'config.php';

session_destroy();
setFlash('Вы вышли из системы.', 'info');
header('Location: index.html');
exit;
