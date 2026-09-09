<?php require_once 'config.php'; ?>
<?php
requireAdmin();

$data = loadData();
$bookings = $data['bookings'];

// Сортировка: сначала новые
usort($bookings, function($a, $b) {
    return strtotime($b['created_at']) - strtotime($a['created_at']);
});

// Обработка действий администратора
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $bookingId = isset($_POST['booking_id']) ? (int)$_POST['booking_id'] : 0;
    $action = $_POST['action'] ?? '';
    
    if ($bookingId > 0 && in_array($action, ['approve', 'reject'])) {
        foreach ($data['bookings'] as &$booking) {
            if ($booking['id'] === $bookingId) {
                if ($action === 'approve') {
                    $booking['status'] = 'approved';
                    setFlash("Заявка #{$bookingId} одобрена.", 'success');
                } else {
                    $booking['status'] = 'rejected';
                    setFlash("Заявка #{$bookingId} отклонена.", 'warning');
                }
                saveData($data);
                break;
            }
        }
        // Перезагружаем данные после обновления
        $data = loadData();
        $bookings = $data['bookings'];
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
    <title>Панель администратора - <?= SITE_NAME ?></title>
</head>
<body class="container">
<header class="d-flex flex-wrap justify-content-center py-3">
    <a href="index.html"
       class="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none">
        <span class="fs-4 mx-2 fw-medium"><?= SITE_NAME ?></span>
    </a>

    <ul class="nav">
        <li class="nav-item"><a href="index.html" class="nav-link">На главную</a></li>
        <li class="nav-item"><a href="logout.php" class="nav-link text-danger">Выйти</a></li>
    </ul>
</header>

<!-- Flash-сообщения -->
<?php if ($flash): ?>
    <div class="alert alert-<?= $flash['type'] == 'danger' ? 'danger' : ($flash['type'] == 'warning' ? 'warning' : 'success') ?> alert-dismissible fade show my-2" role="alert">
        <?= h($flash['message']) ?>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
<?php endif; ?>

<main>
    <div class="d-flex justify-content-between flex-wrap align-items-center">
        <h1>Панель администратора</h1>
    </div>
    <div class="d-flex justify-content-around flex-wrap align-items-center">
        <?php if (empty($bookings)): ?>
            <div class="col-12 text-center my-5">
                <h3>Нет заявок на бронирование.</h3>
            </div>
        <?php else: ?>
            <?php foreach ($bookings as $booking): ?>
                <div class="card">
                    <div class="card-body">
                        <h5>Фамилия: <?= h($booking['last_name']) ?></h5>
                        <h5>Имя: <?= h($booking['name']) ?></h5>
                        <h5>Телефон: <?= h($booking['phone']) ?></h5>
                        <ul class="list-group">
                            <li class="list-group-item">Дата заезда: <?= h($booking['check_in']) ?></li>
                            <li class="list-group-item">Дата выезда: <?= h($booking['check_out']) ?></li>
                        </ul>
                        <span class="badge bg-<?= $booking['status'] === 'pending' ? 'warning' : ($booking['status'] === 'approved' ? 'success' : 'danger') ?> mt-2">
                            <?= $booking['status'] === 'pending' ? 'На рассмотрении' : ($booking['status'] === 'approved' ? 'Одобрена' : 'Отклонена') ?>
                        </span>
                    </div>
                    <?php if ($booking['status'] === 'pending'): ?>
                        <div class="d-grid gap-2">
                            <form action="admin.html" method="post">
                                <input type="hidden" name="booking_id" value="<?= $booking['id'] ?>">
                                <button type="submit" name="action" value="approve" class="btn btn-success w-100">Одобрить</button>
                                <button type="submit" name="action" value="reject" class="btn btn-danger w-100">Отклонить</button>
                            </form>
                        </div>
                    <?php endif; ?>
                </div>
            <?php endforeach; ?>
        <?php endif; ?>
    </div>

</main>

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
