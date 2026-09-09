<?php require_once 'config.php'; ?>
<?php
if (isAdmin()) {
    header('Location: admin.html');
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';
    
    // Простая проверка. В реальном проекте используйте хеширование!
    if ($username === 'admin' && $password === 'admin') {
        $_SESSION['user'] = 'admin';
        setFlash('Вы успешно вошли как администратор.', 'success');
        header('Location: admin.html');
        exit;
    } else {
        setFlash('Неверный логин или пароль.', 'danger');
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
    <title>Вход - <?= SITE_NAME ?></title>
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

<!--Форма авторизации-->
<main>
    <div class="d-flex justify-content-between flex-wrap align-items-center">
        <h1>Вход</h1>
    </div>

    <form class="my-2" novalidate method="post" action="login.html">
        <div class="my-2">
            <label for="username" class="form-label">Логин</label>
            <input type="text" class="form-control" id="username" name="username" required>
        </div>
        <div class="my-2">
            <label for="password" class="form-label">Пароль</label>
            <input type="password" class="form-control" id="password" name="password" required>
        </div>
        <div class="d-grid gap-2">
            <button class="btn btn-primary">Войти</button>
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
