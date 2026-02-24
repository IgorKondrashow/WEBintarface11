// search.js - Функционал поиска врачей

// База данных врачей
const doctorsDatabase = [
    {
        id: 1,
        name: "Иванов Иван Иванович",
        specialty: "Терапевт",
        specialization: "Главный врач, терапевт",
        experience: "15 лет",
        category: "Высшая категория",
        degree: "Кандидат медицинских наук",
        procedures: ["Терапия", "Диагностика", "Профилактика", "Лечение ОРВИ", "Медосмотры"],
        image: "images/doctor-1.jpg",
        price: "2500 ₽",
        rating: 4.9,
        reviews: 127
    },
    {
        id: 2,
        name: "Петрова Елена Сергеевна",
        specialty: "Кардиолог",
        specialization: "Кардиолог",
        experience: "12 лет",
        category: "Первая категория",
        degree: "Специалист по УЗИ",
        procedures: ["Кардиология", "УЗИ сердца", "ЭКГ", "Холтер", "Лечение гипертонии", "ВСД"],
        image: "images/doctor-2.jpg",
        price: "2800 ₽",
        rating: 4.8,
        reviews: 98
    },
    {
        id: 3,
        name: "Сидоров Алексей Петрович",
        specialty: "Невролог",
        specialization: "Невролог, вертебролог",
        experience: "10 лет",
        category: "Высшая категория",
        degree: "Вертебролог",
        procedures: ["Неврология", "Остеохондроз", "Мигрень", "Невралгия", "Грыжи дисков", "Реабилитация"],
        image: "images/doctor-3.jpg",
        price: "2700 ₽",
        rating: 4.9,
        reviews: 112
    },
    {
        id: 4,
        name: "Соколова Анна Викторовна",
        specialty: "Гинеколог",
        specialization: "Гинеколог, репродуктолог",
        experience: "8 лет",
        category: "Вторая категория",
        degree: "Специалист по УЗИ",
        procedures: ["Гинекология", "УЗИ малого таза", "Беременность", "Кольпоскопия", "Лечение бесплодия"],
        image: "images/doctor-4.jpg",
        price: "2600 ₽",
        rating: 4.7,
        reviews: 84
    },
    {
        id: 5,
        name: "Козлов Дмитрий Николаевич",
        specialty: "Хирург",
        specialization: "Хирург, травматолог",
        experience: "18 лет",
        category: "Высшая категория",
        degree: "Доктор медицинских наук",
        procedures: ["Хирургия", "Травматология", "Операции", "Лечение ран", "Удаление новообразований"],
        image: "images/doctor-5.jpg",
        price: "3200 ₽",
        rating: 5.0,
        reviews: 156
    },
    {
        id: 6,
        name: "Михайлова Татьяна Игоревна",
        specialty: "Дерматолог",
        specialization: "Дерматолог, косметолог",
        experience: "7 лет",
        category: "Первая категория",
        degree: "Косметолог",
        procedures: ["Дерматология", "Косметология", "Лечение акне", "Удаление родинок", "Диагностика кожи"],
        image: "images/doctor-1.jpg", // Используем существующее фото для демо
        price: "2400 ₽",
        rating: 4.6,
        reviews: 67
    }
];

// Состояние поиска
let searchState = {
    query: '',
    filters: {
        specialty: 'all',
        priceRange: 'all',
        experience: 'all'
    },
    results: []
};

// Инициализация поиска при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initializeSearch();
    displayAllDoctors();
});

// Функция инициализации поиска
function initializeSearch() {
    const searchInput = document.getElementById('doctorSearch');
    const searchButton = document.getElementById('searchButton');
    const specialtyFilter = document.getElementById('specialtyFilter');
    const priceFilter = document.getElementById('priceFilter');
    const experienceFilter = document.getElementById('experienceFilter');
    const clearButton = document.getElementById('clearSearch');
    
    if (searchInput) {
        // Поиск при вводе (с задержкой)
        searchInput.addEventListener('input', debounce(function(e) {
            searchState.query = e.target.value.toLowerCase();
            performSearch();
        }, 300));
    }
    
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            if (searchInput) searchState.query = searchInput.value.toLowerCase();
            performSearch();
        });
    }
    
    // Фильтры
    if (specialtyFilter) {
        specialtyFilter.addEventListener('change', function() {
            searchState.filters.specialty = this.value;
            performSearch();
        });
    }
    
    if (priceFilter) {
        priceFilter.addEventListener('change', function() {
            searchState.filters.priceRange = this.value;
            performSearch();
        });
    }
    
    if (experienceFilter) {
        experienceFilter.addEventListener('change', function() {
            searchState.filters.experience = this.value;
            performSearch();
        });
    }
    
    // Кнопка очистки
    if (clearButton) {
        clearButton.addEventListener('click', clearSearch);
    }
}

// Debounce функция для задержки поиска
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Основная функция поиска
function performSearch() {
    let results = [...doctorsDatabase];
    
    // Поиск по тексту (имя или процедуры)
    if (searchState.query) {
        results = results.filter(doctor => {
            // Поиск по имени
            const nameMatch = doctor.name.toLowerCase().includes(searchState.query);
            
            // Поиск по процедурам
            const procedureMatch = doctor.procedures.some(proc => 
                proc.toLowerCase().includes(searchState.query)
            );
            
            // Поиск по специальности
            const specialtyMatch = doctor.specialty.toLowerCase().includes(searchState.query);
            
            return nameMatch || procedureMatch || specialtyMatch;
        });
    }
    
    // Фильтр по специальности
    if (searchState.filters.specialty !== 'all') {
        results = results.filter(doctor => 
            doctor.specialty === searchState.filters.specialty
        );
    }
    
    // Фильтр по цене
    if (searchState.filters.priceRange !== 'all') {
        results = results.filter(doctor => {
            const price = parseInt(doctor.price);
            switch(searchState.filters.priceRange) {
                case 'low': return price < 2500;
                case 'medium': return price >= 2500 && price <= 2800;
                case 'high': return price > 2800;
                default: return true;
            }
        });
    }
    
    // Фильтр по опыту
    if (searchState.filters.experience !== 'all') {
        results = results.filter(doctor => {
            const exp = parseInt(doctor.experience);
            switch(searchState.filters.experience) {
                case 'junior': return exp < 5;
                case 'middle': return exp >= 5 && exp <= 10;
                case 'senior': return exp > 10;
                default: return true;
            }
        });
    }
    
    searchState.results = results;
    displaySearchResults(results);
    updateResultsCount(results.length);
}

// Отображение результатов поиска
function displaySearchResults(results) {
    const container = document.getElementById('doctorsContainer');
    const noResults = document.getElementById('noResults');
    
    if (!container) return;
    
    if (results.length === 0) {
        // Показать сообщение "ничего не найдено"
        container.innerHTML = `
            <div class="no-results">
                <div class="no-results-icon">🔍</div>
                <h3>Ничего не найдено</h3>
                <p>По вашему запросу "${searchState.query}" ничего не найдено</p>
                <p>Попробуйте изменить поисковый запрос или сбросить фильтры</p>
                <button onclick="clearSearch()" class="btn">Сбросить поиск</button>
            </div>
        `;
        if (noResults) noResults.style.display = 'block';
        return;
    }
    
    if (noResults) noResults.style.display = 'none';
    
    // Отобразить найденных врачей
    container.innerHTML = results.map(doctor => createDoctorCard(doctor)).join('');
}

// Отображение всех врачей
function displayAllDoctors() {
    displaySearchResults(doctorsDatabase);
    updateResultsCount(doctorsDatabase.length);
}

// Обновление счетчика результатов
function updateResultsCount(count) {
    const counter = document.getElementById('resultsCount');
    if (counter) {
        counter.textContent = `Найдено врачей: ${count}`;
    }
}

// Создание HTML карточки врача
function createDoctorCard(doctor) {
    return `
        <div class="doctor-card" data-doctor-id="${doctor.id}">
            <div class="doctor-image">
                <img src="${doctor.image}" alt="${doctor.name}" onerror="this.src='images/avatar-default.jpg'">
                <div class="doctor-rating">
                    <span class="stars">${'★'.repeat(Math.floor(doctor.rating))}${doctor.rating % 1 ? '½' : ''}</span>
                    <span class="rating-value">${doctor.rating}</span>
                    <span class="reviews-count">(${doctor.reviews} отзывов)</span>
                </div>
            </div>
            <div class="doctor-info">
                <h3>${doctor.name}</h3>
                <p class="specialty">${doctor.specialization}</p>
                <p class="experience">Стаж: ${doctor.experience}</p>
                <p class="category">${doctor.category}</p>
                <p class="degree">${doctor.degree}</p>
                
                <div class="doctor-procedures">
                    <h4>Процедуры:</h4>
                    <div class="procedure-tags">
                        ${doctor.procedures.slice(0, 4).map(proc => 
                            `<span class="procedure-tag">${proc}</span>`
                        ).join('')}
                        ${doctor.procedures.length > 4 ? 
                            `<span class="procedure-tag more">+${doctor.procedures.length - 4}</span>` : 
                            ''}
                    </div>
                </div>
                
                <div class="doctor-footer">
                    <div class="doctor-price">
                        <span class="price-label">Прием:</span>
                        <span class="price-value">${doctor.price}</span>
                    </div>
                    <div class="doctor-actions">
                        <a href="#" onclick="openAppointmentForm(${doctor.id})" class="btn-small">Записаться</a>
                        <button onclick="showDoctorDetails(${doctor.id})" class="btn-small details">Подробнее</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Очистка поиска и фильтров
function clearSearch() {
    searchState = {
        query: '',
        filters: {
            specialty: 'all',
            priceRange: 'all',
            experience: 'all'
        },
        results: []
    };
    
    // Очистить поля ввода
    const searchInput = document.getElementById('doctorSearch');
    if (searchInput) searchInput.value = '';
    
    // Сбросить фильтры
    const specialtyFilter = document.getElementById('specialtyFilter');
    if (specialtyFilter) specialtyFilter.value = 'all';
    
    const priceFilter = document.getElementById('priceFilter');
    if (priceFilter) priceFilter.value = 'all';
    
    const experienceFilter = document.getElementById('experienceFilter');
    if (experienceFilter) experienceFilter.value = 'all';
    
    // Показать всех врачей
    displayAllDoctors();
}

// Открыть форму записи для конкретного врача
function openAppointmentForm(doctorId) {
    const doctor = doctorsDatabase.find(d => d.id === doctorId);
    if (!doctor) return;
    
    const appointmentForm = document.getElementById('appointmentForm');
    const doctorSelect = document.getElementById('doctorSelect');
    
    if (appointmentForm) {
        appointmentForm.scrollIntoView({ behavior: 'smooth' });
        
        if (doctorSelect) {
            // Найти опцию с этим врачом и выбрать её
            for (let option of doctorSelect.options) {
                if (option.text.includes(doctor.name.split(' ')[0])) {
                    option.selected = true;
                    break;
                }
            }
        }
    }
}

// Показать детальную информацию о враче
function showDoctorDetails(doctorId) {
    const doctor = doctorsDatabase.find(d => d.id === doctorId);
    if (!doctor) return;
    
    // Создать модальное окно с деталями
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>${doctor.name}</h2>
            <div class="modal-body">
                <div class="modal-image">
                    <img src="${doctor.image}" alt="${doctor.name}">
                </div>
                <div class="modal-info">
                    <p><strong>Специализация:</strong> ${doctor.specialization}</p>
                    <p><strong>Стаж:</strong> ${doctor.experience}</p>
                    <p><strong>Категория:</strong> ${doctor.category}</p>
                    <p><strong>Ученая степень:</strong> ${doctor.degree}</p>
                    <p><strong>Стоимость приема:</strong> ${doctor.price}</p>
                    <p><strong>Рейтинг:</strong> ${doctor.rating} (${doctor.reviews} отзывов)</p>
                    
                    <h3>Процедуры и услуги:</h3>
                    <ul class="procedures-list">
                        ${doctor.procedures.map(proc => `<li>${proc}</li>`).join('')}
                    </ul>
                    
                    <button onclick="openAppointmentForm(${doctor.id})" class="btn">Записаться на прием</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Закрытие модального окна
    modal.querySelector('.close-modal').onclick = () => modal.remove();
    window.onclick = (event) => {
        if (event.target === modal) modal.remove();
    };
}

// Поиск по процедуре (для быстрых ссылок)
function searchByProcedure(procedure) {
    const searchInput = document.getElementById('doctorSearch');
    if (searchInput) {
        searchInput.value = procedure;
        searchState.query = procedure.toLowerCase();
        performSearch();
    }
}

// Экспорт функций для использования в HTML
window.searchByProcedure = searchByProcedure;
window.clearSearch = clearSearch;
window.openAppointmentForm = openAppointmentForm;
window.showDoctorDetails = showDoctorDetails;