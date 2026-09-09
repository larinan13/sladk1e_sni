<?php require_once 'config.php'; ?>
<?php
$data = loadData();
$room_id = isset($_GET['room_id']) ? (int)$_GET['room_id'] : 0;

// Находим номер
$room = null;
foreach ($data['rooms'] as $r) {
    if ($r['id'] === $room_id) {
        $room = $r;
        break;
    }
}

if (!$room) {
    setFlash('Номер не найден.', 'danger');
    header('Location: index.html');
    exit;
}

$errors = [];
$formData = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $formData = [
        'name' => $_POST['name'] ?? '',
        'last_name' => $_POST['last_name'] ?? '',
        'phone' => $_POST['phone'] ?? '',
        'email' => $_POST['email'] ?? '',
        'check_in' => $_POST['check_in'] ?? '',
        'check_out' => $_POST['check_out'] ?? ''
    ];
    
    $errors = validateBooking($formData);
    
    if (empty($errors)) {
        // Создаем новую заявку
        $newBooking = [
            'id' => count($data['bookings']) + 1,
            'room_id' => $room_id,
            'name' => trim($formData['name']),
            'last_name' => trim($formData['last_name']),
            'phone' => trim($formData['phone']),
            'email' => trim($formData['email']),
            'check_in' => $formData['check_in'],
            'check_out' => $formData['check_out'],
            'status' => 'pending',
            'created_at' => date('Y-m-d H:i:s')
        ];
        
        $data['bookings'][] = $newBooking;
        saveData($data);
        
        setFlash('Ваша заявка успешно отправлена на рассмотрение!', 'success');
        header('Location: index.html');
        exit;
    }
}

$flash = getFlash();
?>
<!doctype html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="css/bootstrap.min.css">
    <link rel="stylesheet" href="css/index.css">
    <title>Бронирование - <?= SITE_NAME ?></title>
</head>
<body class="container">
<header class="d-flex flex-wrap justify-content-center py-3">
    <a href="index.html"
       class="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none">
        <span class="fs-4 mx-2 fw-medium"><?= SITE_NAME ?></span>
    </a>
    <ul class="nav">
        <li class="nav-item"><a href="#" class="nav-link">Приезжайте как гости, уезжайте как друзья!</a></li>
    </ul>
</header>

<!-- Flash-сообщения -->
<?php if ($flash): ?>
    <div class="alert alert-<?= $flash['type'] == 'danger' ? 'danger' : 'success' ?> alert-dismissible fade show my-2" role="alert">
        <?= h($flash['message']) ?>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
<?php endif; ?>

<?php if (!empty($errors)): ?>
    <div class="alert alert-danger alert-dismissible fade show my-2" role="alert">
        <ul class="mb-0">
            <?php foreach ($errors as $error): ?>
                <li><?= h($error) ?></li>
            <?php endforeach; ?>
        </ul>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
<?php endif; ?>

<div class="alert alert-success text-center" role="alert">
    Заявка успешно отправлена!
</div>
<!--Форма бронирования-->
<main>
    <div class="d-flex justify-content-between flex-wrap align-items-center">
        <h1>Бронирование номера</h1>
        <span class="fs-4">Категория: <?= h($room['category']) ?></span>
    </div>

    <form class="row g-3 needs-validation my-2" novalidate method="post" action="order.html?room_id=<?= $room_id ?>">
        <div class="col-md-4">
            <label for="validationCustom01" class="form-label">Имя</label>
            <input type="text" class="form-control <?= isset($errors['name']) ? 'is-invalid' : '' ?>" id="validationCustom01" name="name" value="<?= h($formData['name'] ?? '') ?>" required>
            <div class="invalid-feedback">
                Пожалуйста, введите имя
            </div>
        </div>
        <div class="col-md-4">
            <label for="validationCustom02" class="form-label">Фамилия</label>
            <input type="text" class="form-control <?= isset($errors['last_name']) ? 'is-invalid' : '' ?>" id="validationCustom02" name="last_name" value="<?= h($formData['last_name'] ?? '') ?>" required>
            <div class="invalid-feedback">
                Пожалуйста, введите фамилию
            </div>
        </div>
        <div class="col-md-4">
            <label for="validationCustomPhone" class="form-label">Телефон</label>
            <input type="text" class="form-control <?= isset($errors['phone']) ? 'is-invalid' : '' ?>" id="validationCustomPhone"
                   aria-describedby="inputGroupPrepend" name="phone" value="<?= h($formData['phone'] ?? '') ?>" required>
            <div class="invalid-feedback">
                Пожалуйста, введите номер телефона
            </div>
        </div>
        <div class="col-md-6">
            <label for="validationCustom03" class="form-label">Почта</label>
            <input type="text" class="form-control <?= isset($errors['email']) ? 'is-invalid' : '' ?>" id="validationCustom03" name="email" value="<?= h($formData['email'] ?? '') ?>" required>
            <div class="invalid-feedback">
                Пожалуйста, введите email
            </div>
        </div>
        <div class="col-md-3">
            <label for="validationCustom04" class="form-label">Дата заезда</label>
            <input type="date" class="form-control <?= isset($errors['check_in']) ? 'is-invalid' : '' ?>" id="validationCustom04" name="check_in" value="<?= h($formData['check_in'] ?? '') ?>" required>
            <div class="invalid-feedback">
                Пожалуйста, введите дату заезда
            </div>
        </div>
        <div class="col-md-3">
            <label for="validationCustom05" class="form-label">Дата выезда</label>
            <input type="date" class="form-control <?= isset($errors['check_out']) ? 'is-invalid' : '' ?>" id="validationCustom05" name="check_out" value="<?= h($formData['check_out'] ?? '') ?>" required>
            <div class="invalid-feedback">
                Пожалуйста, введите дату выезда
            </div>
        </div>
        <div class="d-grid gap-2">
            <button class="btn btn-primary">Отправить заявку</button>
        </div>
    </form>
</main>
<!--Контактная информация-->
<footer class="py-2 my-2">
    <ul class="nav justify-content-between align-items-center">
        <li class="nav-item"><a href="#" class="nav-link text-body-secondary">ул. г.Москва, ул. Ивовая, 48</a></li>
        <li class="nav-item"><a href="#" class="nav-link text-body-secondary">Время работы: Пн-Пт, с 8:00-17:00</a></li>
        <li class="nav-item"><a href="tel:88005553535" class="nav-link text-body-secondary">тел. 8 (800) 555 - 35 -
            35</a></li>
        <li class="nav-item"><a href="mailto:обращения@СветлыеСны.рф" class="nav-link text-body-secondary">Email: обращения@СветлыеСны.рф</a>
        </li>
    </ul>
</footer>
<script src="js/bootstrap.bundle.min.js"></script>
<script src="js/jquery-3.7.1.slim.min.js"></script>
<script src="js/jquery.inputmask.min.js"></script>
<script src="js/index.js"></script>
</body>
</html>
