<?php
// config.php
session_start();

define('DATA_FILE', __DIR__ . '/data/data.json');
define('SITE_NAME', 'Светлые Сны');

// Функция для загрузки данных
function loadData() {
    if (file_exists(DATA_FILE)) {
        $json = file_get_contents(DATA_FILE);
        return json_decode($json, true);
    }
    return ['rooms' => [], 'bookings' => []];
}

// Функция для сохранения данных
function saveData($data) {
    $json = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    file_put_contents(DATA_FILE, $json);
}

// Инициализация данных при первом запуске
function initializeData() {
    $data = loadData();
    if (empty($data['rooms'])) {
        $data['rooms'] = [
            [
                "id" => 1,
                "category" => "Стандарт",
                "price" => 10000,
                "img" => "img/standart.png",
                "features" => ["Включен завтрак", "Душ + Ванна"]
            ],
            [
                "id" => 2,
                "category" => "Студия",
                "price" => 8000,
                "img" => "img/studio.jpg",
                "features" => ["Включен завтрак, обед", "Душ + Ванна", "Кондиционер"]
            ],
            [
                "id" => 3,
                "category" => "Люкс",
                "price" => 19000,
                "img" => "img/lux.png",
                "features" => ["Включен завтрак, обед, ужин", "Душ + Ванна", "Кондиционер", "Телевизор", "Мини-бар", "Вид на город"]
            ]
        ];
        $data['bookings'] = [
            [
                "id" => 1,
                "room_id" => 1,
                "name" => "Иван",
                "last_name" => "Петров",
                "phone" => "+7(800)555-35-35",
                "email" => "ivan@example.com",
                "check_in" => "2026-02-19",
                "check_out" => "2026-02-21",
                "status" => "pending",
                "created_at" => date('Y-m-d H:i:s')
            ]
        ];
        saveData($data);
    }
}

initializeData();

/**
 * Проверяет, авторизован ли пользователь как администратор
 */
function isAdmin() {
    return isset($_SESSION['user']) && $_SESSION['user'] === 'admin';
}

/**
 * Перенаправляет на страницу входа, если пользователь не авторизован
 */
function requireAdmin() {
    if (!isAdmin()) {
        $_SESSION['flash'] = ['type' => 'danger', 'message' => 'Для доступа к этой странице необходимо войти как администратор.'];
        header('Location: login.html');
        exit;
    }
}

/**
 * Устанавливает flash-сообщение
 */
function setFlash($message, $type = 'success') {
    $_SESSION['flash'] = ['type' => $type, 'message' => $message];
}

/**
 * Получает и удаляет flash-сообщение
 */
function getFlash() {
    if (isset($_SESSION['flash'])) {
        $flash = $_SESSION['flash'];
        unset($_SESSION['flash']);
        return $flash;
    }
    return null;
}

/**
 * Валидация данных бронирования
 */
function validateBooking($data) {
    $errors = [];
    
    if (empty($data['name'])) $errors['name'] = 'Имя обязательно для заполнения.';
    if (empty($data['last_name'])) $errors['last_name'] = 'Фамилия обязательна для заполнения.';
    if (empty($data['phone'])) $errors['phone'] = 'Телефон обязателен для заполнения.';
    if (empty($data['email'])) $errors['email'] = 'Email обязателен для заполнения.';
    if (empty($data['check_in'])) $errors['check_in'] = 'Дата заезда обязательна для заполнения.';
    if (empty($data['check_out'])) $errors['check_out'] = 'Дата выезда обязательна для заполнения.';
    
    if (!empty($data['email']) && !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = 'Некорректный формат email.';
    }
    
    if (!empty($data['check_in']) && !empty($data['check_out'])) {
        $check_in = DateTime::createFromFormat('Y-m-d', $data['check_in']);
        $check_out = DateTime::createFromFormat('Y-m-d', $data['check_out']);
        
        if ($check_in && $check_out) {
            if ($check_out <= $check_in) {
                $errors['check_out'] = 'Дата выезда должна быть позже даты заезда.';
            }
        } else {
            $errors['check_in'] = 'Неверный формат даты.';
        }
    }
    
    return $errors;
}

/**
 * Экранирует HTML для безопасного вывода
 */
function h($str) {
    return htmlspecialchars($str, ENT_QUOTES, 'UTF-8');
}
