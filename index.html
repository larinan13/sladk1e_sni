<?php require_once 'config.php'; ?>
<?php
$data = loadData();
$rooms = $data['rooms'];

// Фильтрация на стороне сервера
$categoryFilter = isset($_GET['category']) ? $_GET['category'] : '';
if ($categoryFilter) {
    $rooms = array_filter($rooms, function($room) use ($categoryFilter) {
        return $room['category'] === $categoryFilter;
    });
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
    <title>Каталог номеров - <?= SITE_NAME ?></title>
</head>
<body class="container">
<header class="d-flex flex-wrap justify-content-center py-3">
    <a href="index.html"
       class="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none">
        <span class="fs-4 mx-2 fw-medium"><?= SITE_NAME ?></span>
    </a>

    <ul class="nav">
        <li class="nav-item"><a href="#" class="nav-link">Приезжайте как гости, уезжайте как друзья!</a></li>
        <?php if (isAdmin()): ?>
            <li class="nav-item">
                <a href="admin.html" class="nav-link text-primary fw-bold">Панель администратора</a>
            </li>
        <?php endif; ?>
    </ul>
</header>

<!-- Flash-сообщения -->
<?php if ($flash): ?>
    <div class="alert alert-<?= $flash['type'] == 'danger' ? 'danger' : ($flash['type'] == 'warning' ? 'warning' : 'success') ?> alert-dismissible fade show my-2" role="alert">
        <?= h($flash['message']) ?>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
<?php endif; ?>

<!--описание номеров-->
<main>
    <div class="d-flex justify-content-between flex-wrap">
        <h1>Каталог номеров</h1>
        <div class="dropdown">
            <form action="index.html" method="get" class="d-flex gap-2 align-items-center">
                <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown"
                        aria-expanded="false">
                    Категории
                </button>
                <ul class="dropdown-menu">
                    <li><button class="dropdown-item" type="submit" name="category" value="Стандарт">Стандартный</button></li>
                    <li><button class="dropdown-item" type="submit" name="category" value="Студия">Студия</button></li>
                    <li><button class="dropdown-item" type="submit" name="category" value="Люкс">Люкс</button></li>
                </ul>
                <button class="btn btn-primary my-1" type="submit">Применить</button>
                <a href="index.html" class="btn btn-danger my-1">Сбросить фильтр</a>
            </form>
        </div>
    </div>
    <div class="d-flex justify-content-around flex-wrap align-items-center">
        <?php if (empty($rooms)): ?>
            <div class="col-12 text-center my-5">
                <h3>Нет номеров, соответствующих вашему запросу.</h3>
            </div>
        <?php else: ?>
            <?php foreach ($rooms as $room): ?>
                <div class="card">
                    <img src="<?= h($room['img']) ?>" class="card-img-top" alt="<?= h($room['category']) ?>">
                    <div class="card-body">
                        <h3>Категория: <?= h($room['category']) ?></h3>
                        <h5>Цена: <?= h($room['price']) ?> ₽ / чел</h5>
                        <h5>Характеристики:</h5>
                        <ul class="list-group">
                            <?php foreach ($room['features'] as $feature): ?>
                                <li class="list-group-item"><?= h($feature) ?></li>
                            <?php endforeach; ?>
                        </ul>
                    </div>
                    <div class="d-grid gap-2">
                        <a href="order.html?room_id=<?= $room['id'] ?>" class="btn btn-success">Забронировать</a>
                    </div>
                </div>
            <?php endforeach; ?>
        <?php endif; ?>
    </div>

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
</body>
</html>
