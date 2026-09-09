// app.js

// ===== ХРАНИЛИЩЕ ДАННЫХ =====

// Ключи для localStorage
const STORAGE_KEYS = {
    ROOMS: 'sweet_dreams_rooms',
    BOOKINGS: 'sweet_dreams_bookings',
    USER: 'sweet_dreams_user'
};

// Данные по умолчанию
const DEFAULT_ROOMS = [
    {
        "id": 1,
        "category": "Стандарт",
        "price": 10000,
        "img": "img/standart.png",
        "features": ["Включен завтрак", "Душ + Ванна"]
    },
    {
        "id": 2,
        "category": "Студия",
        "price": 8000,
        "img": "img/studio.jpg",
        "features": ["Включен завтрак, обед", "Душ + Ванна", "Кондиционер"]
    },
    {
        "id": 3,
        "category": "Люкс",
        "price": 19000,
        "img": "img/lux.png",
        "features": ["Включен завтрак, обед, ужин", "Душ + Ванна", "Кондиционер", "Телевизор", "Мини-бар", "Вид на город"]
    }
];

// ===== ФУНКЦИИ РАБОТЫ С ДАННЫМИ =====

function getRooms() {
    const data = localStorage.getItem(STORAGE_KEYS.ROOMS);
    if (data) {
        return JSON.parse(data);
    }
    return DEFAULT_ROOMS;
}

function saveRooms(rooms) {
    localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(rooms));
}

function getBookings() {
    const data = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    if (data) {
        return JSON.parse(data);
    }
    return [];
}

function saveBookings(bookings) {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
}

function isAdmin() {
    return localStorage.getItem(STORAGE_KEYS.USER) === 'admin';
}

function login(username, password) {
    if (username === 'admin' && password === 'admin') {
        localStorage.setItem(STORAGE_KEYS.USER, 'admin');
        return true;
    }
    return false;
}

function logout() {
    localStorage.removeItem(STORAGE_KEYS.USER);
}

// ===== FLASH-СООБЩЕНИЯ =====

function showFlash(message, type = 'success') {
    const container = document.getElementById('flashContainer');
    if (!container) return;
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show my-2`;
    alert.role = 'alert';
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    container.appendChild(alert);
    
    // Автоматическое исчезновение через 5 секунд
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

// ===== ОТОБРАЖЕНИЕ НОМЕРОВ =====

function renderRooms(rooms) {
    const container = document.getElementById('roomsContainer');
    if (!container) return;
    
    if (rooms.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center my-5">
                <h3>Нет номеров, соответствующих вашему запросу.</h3>
            </div>
        `;
        return;
    }
    
    container.innerHTML = rooms.map(room => `
        <div class="card">
            <img src="${room.img}" class="card-img-top" alt="${room.category}">
            <div class="card-body">
                <h3>Категория: ${room.category}</h3>
                <h5>Цена: ${room.price} ₽ / чел</h5>
                <h5>Характеристики:</h5>
                <ul class="list-group">
                    ${room.features.map(f => `<li class="list-group-item">${f}</li>`).join('')}
                </ul>
            </div>
            <div class="d-grid gap-2">
                <a href="order.html?room_id=${room.id}" class="btn btn-success">Забронировать</a>
            </div>
        </div>
    `).join('');
}

// ===== ФИЛЬТРАЦИЯ =====

function filterRooms(category) {
    const rooms = getRooms();
    if (category) {
        return rooms.filter(room => room.category === category);
    }
    return rooms;
}

// ===== ОТОБРАЖЕНИЕ ЗАЯВОК (АДМИН) =====

function renderBookings(bookings) {
    const container = document.getElementById('bookingsContainer');
    if (!container) return;
    
    if (bookings.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center my-5">
                <h3>Нет заявок на бронирование.</h3>
            </div>
        `;
        return;
    }
    
    // Сортировка: сначала новые
    bookings.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    container.innerHTML = bookings.map(booking => {
        const statusMap = {
            pending: { class: 'warning', text: 'На рассмотрении' },
            approved: { class: 'success', text: 'Одобрена' },
            rejected: { class: 'danger', text: 'Отклонена' }
        };
        const status = statusMap[booking.status] || statusMap.pending;
        
        return `
            <div class="card">
                <div class="card-body">
                    <h5>Фамилия: ${booking.last_name}</h5>
                    <h5>Имя: ${booking.name}</h5>
                    <h5>Телефон: ${booking.phone}</h5>
                    <ul class="list-group">
                        <li class="list-group-item">Дата заезда: ${booking.check_in}</li>
                        <li class="list-group-item">Дата выезда: ${booking.check_out}</li>
                    </ul>
                    <span class="badge bg-${status.class} mt-2">${status.text}</span>
                </div>
                ${booking.status === 'pending' ? `
                    <div class="d-grid gap-2">
                        <button class="btn btn-success w-100" onclick="approveBooking(${booking.id})">Одобрить</button>
                        <button class="btn btn-danger w-100" onclick="rejectBooking(${booking.id})">Отклонить</button>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
}

// ===== ДЕЙСТВИЯ С ЗАЯВКАМИ =====

function approveBooking(id) {
    const bookings = getBookings();
    const booking = bookings.find(b => b.id === id);
    if (booking) {
        booking.status = 'approved';
        saveBookings(bookings);
        showFlash(`Заявка #${id} одобрена.`, 'success');
        renderBookings(bookings);
    }
}

function rejectBooking(id) {
    const bookings = getBookings();
    const booking = bookings.find(b => b.id === id);
    if (booking) {
        booking.status = 'rejected';
        saveBookings(bookings);
        showFlash(`Заявка #${id} отклонена.`, 'warning');
        renderBookings(bookings);
    }
}

// ===== ИНИЦИАЛИЗАЦИЯ СТРАНИЦ =====

// Главная страница
if (document.getElementById('roomsContainer')) {
    const rooms = getRooms();
    renderRooms(rooms);
    
    // Фильтрация
    document.querySelectorAll('.dropdown-item[data-category]').forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.dataset.category;
            document.getElementById('applyFilter').dataset.category = category;
        });
    });
    
    document.getElementById('applyFilter').addEventListener('click', function() {
        const category = this.dataset.category;
        const filtered = filterRooms(category);
        renderRooms(filtered);
    });
    
    // Проверка авторизации для ссылки в админку
    const adminLink = document.getElementById('adminLink');
    if (adminLink && !isAdmin()) {
        adminLink.href = 'login.html';
        adminLink.textContent = 'Войти как администратор';
    }
}

// Страница бронирования
if (document.getElementById('bookingForm')) {
    // Получаем ID номера из URL
    const urlParams = new URLSearchParams(window.location.search);
    const roomId = parseInt(urlParams.get('room_id'));
    document.getElementById('roomId').value = roomId;
    
    // Находим номер и отображаем категорию
    const rooms = getRooms();
    const room = rooms.find(r => r.id === roomId);
    if (room) {
        document.getElementById('roomCategory').textContent = `Категория: ${room.category}`;
    }
    
    // Настройка маски для телефона
    if (typeof $.fn.inputmask !== 'undefined') {
        $('#validationCustomPhone').inputmask({"mask": "+7(999)999-99-99"});
    }
    
    // Обработка формы
    document.getElementById('bookingForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const data = {
            name: formData.get('name'),
            last_name: formData.get('last_name'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            check_in: formData.get('check_in'),
            check_out: formData.get('check_out')
        };
        
        // Валидация
        let errors = [];
        if (!data.name) errors.push('Имя обязательно для заполнения.');
        if (!data.last_name) errors.push('Фамилия обязательна для заполнения.');
        if (!data.phone) errors.push('Телефон обязателен для заполнения.');
        if (!data.email) errors.push('Email обязателен для заполнения.');
        if (!data.check_in) errors.push('Дата заезда обязательна для заполнения.');
        if (!data.check_out) errors.push('Дата выезда обязательна для заполнения.');
        
        if (data.email && !data.email.includes('@')) {
            errors.push('Некорректный формат email.');
        }
        
        if (data.check_in && data.check_out) {
            const checkIn = new Date(data.check_in);
            const checkOut = new Date(data.check_out);
            if (checkOut <= checkIn) {
                errors.push('Дата выезда должна быть позже даты заезда.');
            }
        }
        
        if (errors.length > 0) {
            showFlash(errors.join('<br>'), 'danger');
            return;
        }
        
        // Сохраняем заявку
        const bookings = getBookings();
        const newBooking = {
            id: bookings.length > 0 ? Math.max(...bookings.map(b => b.id)) + 1 : 1,
            room_id: parseInt(document.getElementById('roomId').value),
            name: data.name.trim(),
            last_name: data.last_name.trim(),
            phone: data.phone.trim(),
            email: data.email.trim(),
            check_in: data.check_in,
            check_out: data.check_out,
            status: 'pending',
            created_at: new Date().toISOString()
        };
        bookings.push(newBooking);
        saveBookings(bookings);
        
        showFlash('Ваша заявка успешно отправлена на рассмотрение!', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    });
}

// Страница входа
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (login(username, password)) {
            showFlash('Вы успешно вошли как администратор.', 'success');
            setTimeout(() => {
                window.location.href = 'admin.html';
            }, 1000);
        } else {
            showFlash('Неверный логин или пароль.', 'danger');
        }
    });
}

// Страница администратора
if (document.getElementById('bookingsContainer')) {
    // Проверка авторизации
    if (!isAdmin()) {
        showFlash('Для доступа к этой странице необходимо войти как администратор.', 'danger');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return;
    }
    
    const bookings = getBookings();
    renderBookings(bookings);
    
    // Выход
    document.getElementById('logoutBtn').addEventListener('click', function(e) {
        e.preventDefault();
        logout();
        showFlash('Вы вышли из системы.', 'info');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    });
}
