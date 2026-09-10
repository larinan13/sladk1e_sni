// app.js

// ===== КОНСТАНТЫ =====
const STORAGE_KEYS = {
    ROOMS: 'sweet_dreams_rooms',
    BOOKINGS: 'sweet_dreams_bookings',
    USERS: 'sweet_dreams_users',
    CURRENT_USER: 'sweet_dreams_current_user'
};

// Данные о номерах (создаются один раз)
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

// ===== ИНИЦИАЛИЗАЦИЯ ДАННЫХ =====
function initStorage() {
    if (!localStorage.getItem(STORAGE_KEYS.ROOMS)) {
        localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(DEFAULT_ROOMS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
        localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
        const defaultUsers = [
            { username: 'admin', password: 'admin', role: 'admin' }
        ];
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaultUsers));
    }
}

initStorage();

// ===== ФУНКЦИИ РАБОТЫ С ДАННЫМИ =====
function getRooms() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ROOMS) || '[]');
}

function saveRooms(rooms) {
    localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(rooms));
}

function getBookings() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]');
}

function saveBookings(bookings) {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
}

function getUsers() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
}

function saveUsers(users) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

function getCurrentUser() {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
}

function setCurrentUser(user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
}

function logout() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
}

function isAdmin() {
    const user = getCurrentUser();
    return user && user.role === 'admin';
}

function isAuthenticated() {
    return getCurrentUser() !== null;
}

// ===== FLASH-СООБЩЕНИЯ =====
function showFlash(message, type = 'success') {
    let container = document.getElementById('flashContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'flashContainer';
        const main = document.querySelector('main');
        if (main) {
            main.parentNode.insertBefore(container, main);
        } else {
            document.body.appendChild(container);
        }
    }
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show my-2`;
    alert.role = 'alert';
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    container.appendChild(alert);
    
    setTimeout(() => {
        if (alert.parentNode) alert.remove();
    }, 5000);
}

// ===== РЕНДЕРИНГ НОМЕРОВ =====
function renderRooms(rooms) {
    const container = document.getElementById('roomsContainer');
    if (!container) return;
    
    if (!rooms || rooms.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center my-5">
                <h3>Нет номеров, соответствующих вашему запросу.</h3>
            </div>
        `;
        return;
    }
    
    container.innerHTML = rooms.map(room => `
        <div class="card">
            <img src="${room.img}" class="card-img-top" alt="${room.category}" onerror="this.style.display='none'">
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

// ===== РЕНДЕРИНГ ЗАЯВОК (АДМИН) =====
function renderBookings(bookings) {
    const container = document.getElementById('bookingsContainer');
    if (!container) return;
    
    if (!bookings || bookings.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center my-5">
                <h3>Нет заявок на бронирование.</h3>
            </div>
        `;
        return;
    }
    
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
                    <h5>Заявка #${booking.id}</h5>
                    <h5>От пользователя: ${booking.user || 'guest'}</h5>
                    <h5>Фамилия: ${booking.last_name}</h5>
                    <h5>Имя: ${booking.name}</h5>
                    <h5>Телефон: ${booking.phone}</h5>
                    <h5>Email: ${booking.email}</h5>
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

// ===== РЕНДЕРИНГ ЗАЯВОК ПОЛЬЗОВАТЕЛЯ =====
function renderMyBookings(bookings) {
    const container = document.getElementById('myBookingsContainer');
    if (!container) return;
    
    if (!bookings || bookings.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center my-5">
                <h3>У вас пока нет заявок на бронирование.</h3>
                <a href="index.html" class="btn btn-primary mt-3">Перейти в каталог номеров</a>
            </div>
        `;
        return;
    }
    
    bookings.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    const rooms = getRooms();
    
    container.innerHTML = bookings.map(booking => {
        const statusMap = {
            pending: { class: 'warning', text: 'На рассмотрении' },
            approved: { class: 'success', text: 'Одобрена' },
            rejected: { class: 'danger', text: 'Отклонена' }
        };
        const status = statusMap[booking.status] || statusMap.pending;
        
        const room = rooms.find(r => r.id === booking.room_id);
        const roomInfo = room ? `Категория: ${room.category} (${room.price} ₽/чел)` : 'Номер недоступен';
        
        return `
            <div class="card">
                <div class="card-body">
                    <h5>Заявка #${booking.id}</h5>
                    <h5 class="text-body-secondary">${roomInfo}</h5>
                    <h5>Фамилия: ${booking.last_name}</h5>
                    <h5>Имя: ${booking.name}</h5>
                    <h5>Телефон: ${booking.phone}</h5>
                    <ul class="list-group">
                        <li class="list-group-item">Дата заезда: ${booking.check_in}</li>
                        <li class="list-group-item">Дата выезда: ${booking.check_out}</li>
                    </ul>
                    <span class="badge bg-${status.class} mt-2">${status.text}</span>
                </div>
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

// ===== ОБНОВЛЕНИЕ ШАПКИ =====
function updateHeader() {
    const user = getCurrentUser();
    const adminLink = document.getElementById('adminLink');
    const registerLink = document.getElementById('registerLink');
    
    if (user) {
        if (adminLink) {
            if (user.role === 'admin') {
                adminLink.href = 'admin.html';
                adminLink.textContent = 'Панель администратора';
            } else {
                adminLink.href = 'my-bookings.html';
                adminLink.textContent = `Мои заявки (${user.username})`;
            }
        }
        if (registerLink) {
            registerLink.style.display = 'none';
        }
    } else {
        if (adminLink) {
            adminLink.href = 'login.html';
            adminLink.textContent = 'Войти';
        }
        if (registerLink) {
            registerLink.style.display = '';
        }
    }
}

// ================================================
// ИНИЦИАЛИЗАЦИЯ СТРАНИЦ (при загрузке DOM)
// ================================================
document.addEventListener('DOMContentLoaded', function() {
    updateHeader();
    
    // ===== ГЛАВНАЯ СТРАНИЦА =====
    if (document.getElementById('roomsContainer')) {
        const rooms = getRooms();
        renderRooms(rooms);
        
        document.querySelectorAll('.dropdown-item[data-category]').forEach(btn => {
            btn.addEventListener('click', function() {
                const category = this.dataset.category;
                const filtered = getRooms().filter(r => r.category === category);
                renderRooms(filtered);
            });
        });
        
        const applyBtn = document.getElementById('applyFilter');
        if (applyBtn) {
            applyBtn.addEventListener('click', function() {
                renderRooms(getRooms());
            });
        }
    }
    
    // ===== СТРАНИЦА БРОНИРОВАНИЯ =====
    if (document.getElementById('bookingForm')) {
        const urlParams = new URLSearchParams(window.location.search);
        const roomId = parseInt(urlParams.get('room_id'));
        document.getElementById('roomId').value = roomId;
        
        const rooms = getRooms();
        const room = rooms.find(r => r.id === roomId);
        if (room) {
            document.getElementById('roomCategory').textContent = `Категория: ${room.category}`;
        }
        
        if (typeof $ !== 'undefined' && $.fn.inputmask) {
            $('#validationCustomPhone').inputmask({"mask": "+7(999)999-99-99"});
        }
        
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
                user: (getCurrentUser() || {}).username || 'guest',
                created_at: new Date().toISOString()
            };
            bookings.push(newBooking);
            saveBookings(bookings);
            
            showFlash('Ваша заявка успешно отправлена на рассмотрение!', 'success');
            setTimeout(() => window.location.href = 'index.html', 1500);
        });
    }
    
    // ===== СТРАНИЦА ВХОДА =====
    if (document.getElementById('loginForm')) {
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;
            
            const users = getUsers();
            const user = users.find(u => u.username === username && u.password === password);
            
            if (user) {
                setCurrentUser({ username: user.username, role: user.role });
                showFlash('Вы успешно вошли!', 'success');
                setTimeout(() => {
                    window.location.href = user.role === 'admin' ? 'admin.html' : 'index.html';
                }, 1000);
            } else {
                showFlash('Неверный логин или пароль.', 'danger');
            }
        });
    }
    
    // ===== СТРАНИЦА РЕГИСТРАЦИИ =====
    if (document.getElementById('registerForm')) {
        document.getElementById('registerForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('regUsername').value.trim();
            const password = document.getElementById('regPassword').value;
            const password2 = document.getElementById('regPassword2').value;
            
            let errors = [];
            if (!username) errors.push('Логин обязателен.');
            if (username.length < 3) errors.push('Логин должен содержать минимум 3 символа.');
            if (!password) errors.push('Пароль обязателен.');
            if (password.length < 4) errors.push('Пароль должен содержать минимум 4 символа.');
            if (password !== password2) errors.push('Пароли не совпадают.');
            
            const users = getUsers();
            if (users.find(u => u.username === username)) {
                errors.push('Пользователь с таким логином уже существует.');
            }
            
            if (errors.length > 0) {
                showFlash(errors.join('<br>'), 'danger');
                return;
            }
            
            users.push({ username, password, role: 'guest' });
            saveUsers(users);
            setCurrentUser({ username, role: 'guest' });
            
            showFlash('Регистрация успешна! Вы вошли в систему.', 'success');
            setTimeout(() => window.location.href = 'index.html', 1000);
        });
    }
    
    // ===== СТРАНИЦА АДМИНИСТРАТОРА =====
    if (document.getElementById('bookingsContainer')) {
        if (!isAdmin()) {
            showFlash('Для доступа к этой странице необходимо войти как администратор.', 'danger');
            setTimeout(() => window.location.href = 'login.html', 1500);
        } else {
            renderBookings(getBookings());
            
            const logoutBtn = document.getElementById('logoutBtn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    logout();
                    showFlash('Вы вышли из системы.', 'info');
                    setTimeout(() => window.location.href = 'index.html', 1000);
                });
            }
        }
    }
    
    // ===== СТРАНИЦА "МОИ ЗАЯВКИ" =====
    if (document.getElementById('myBookingsContainer')) {
        const user = getCurrentUser();
        
        if (!user) {
            showFlash('Для доступа к этой странице необходимо войти.', 'danger');
            setTimeout(() => window.location.href = 'login.html', 1500);
            return;
        }
        
        const greeting = document.getElementById('userGreeting');
        if (greeting) {
            greeting.textContent = `Вы вошли как: ${user.username}`;
        }
        
        const allBookings = getBookings();
        const myBookings = allBookings.filter(b => b.user === user.username);
        
        renderMyBookings(myBookings);
        
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                logout();
                showFlash('Вы вышли из системы.', 'info');
                setTimeout(() => window.location.href = 'index.html', 1000);
            });
        }
    }
});
