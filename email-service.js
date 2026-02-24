// email-service.js - Отправка email через EmailJS

// Инициализация EmailJS с вашим Public Key
(function() {
    // ЗАМЕНИТЕ ЭТОТ КЛЮЧ НА ВАШ ИЗ ЛИЧНОГО КАБИНЕТА EMAILJS
    const PUBLIC_KEY = 'YOUR_PUBLIC_KEY_HERE'; // Вставьте ваш Public Key
    
    emailjs.init(PUBLIC_KEY);
})();

// Конфигурация EmailJS
const EMAILJS_CONFIG = {
    // ЗАМЕНИТЕ ЭТИ ЗНАЧЕНИЯ НА ВАШИ
    serviceId: 'default_service',      // Ваш Service ID
    templateId: 'template_your_id',     // Ваш Template ID
    adminEmail: 'admin@medcenter.ru',   // Email администратора
};

// Отправка заявки на email
async function sendAppointmentEmail(formData) {
    // Показываем индикатор загрузки
    showLoading(true);
    
    try {
        // Подготавливаем данные для отправки
        const templateParams = {
            // Данные пациента
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            
            // Детали записи
            doctor: formData.doctor,
            date: formatDate(formData.date),
            time: formData.time,
            service: formData.service || 'Не указано',
            
            // Дополнительно
            message: formData.message || 'Нет комментариев',
            submissionDate: formatCurrentDateTime(),
            
            // Email получателя (администратора)
            to_email: EMAILJS_CONFIG.adminEmail,
            
            // Email для копии пациенту
            to_patient: formData.email
        };
        
        // Отправляем email администратору
        const adminResponse = await emailjs.send(
            EMAILJS_CONFIG.serviceId,
            EMAILJS_CONFIG.templateId,
            {
                ...templateParams,
                to_email: EMAILJS_CONFIG.adminEmail,
                subject: `Новая запись: ${formData.name} к ${formData.doctor}`
            }
        );
        
        console.log('Email администратору отправлен:', adminResponse);
        
        // Отправляем подтверждение пациенту
        const patientResponse = await emailjs.send(
            EMAILJS_CONFIG.serviceId,
            EMAILJS_CONFIG.templateId,
            {
                ...templateParams,
                to_email: formData.email,
                subject: 'Подтверждение записи - МедЦентр',
                message: `Уважаемый(ая) ${formData.name}, ваша заявка на прием к ${formData.doctor} на ${formatDate(formData.date)} в ${formData.time} получена. Мы свяжемся с вами для подтверждения.`
            }
        );
        
        console.log('Подтверждение пациенту отправлено:', patientResponse);
        
        // Показываем сообщение об успехе
        showNotification('success', 'Заявка успешно отправлена! Проверьте вашу почту для подтверждения.');
        
        // Очищаем форму
        document.getElementById('bookingForm').reset();
        
        // Сохраняем в localStorage (для истории)
        saveToLocalStorage(formData);
        
        return true;
        
    } catch (error) {
        console.error('Ошибка при отправке email:', error);
        
        // Показываем сообщение об ошибке
        showNotification('error', 'Произошла ошибка при отправке. Пожалуйста, попробуйте позже или позвоните нам.');
        
        return false;
    } finally {
        // Скрываем индикатор загрузки
        showLoading(false);
    }
}

// Форматирование даты
function formatDate(dateString) {
    if (!dateString) return 'Не указано';
    
    const options = { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        weekday: 'long'
    };
    
    return new Date(dateString).toLocaleDateString('ru-RU', options);
}

// Форматирование текущей даты и времени
function formatCurrentDateTime() {
    const now = new Date();
    
    const date = now.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    
    const time = now.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    return `${date} ${time}`;
}

// Показать/скрыть индикатор загрузки
function showLoading(show) {
    const loading = document.getElementById('loadingIndicator');
    const submitBtn = document.getElementById('submitBtn');
    
    if (loading) {
        loading.style.display = show ? 'flex' : 'none';
    }
    
    if (submitBtn) {
        submitBtn.disabled = show;
        submitBtn.style.opacity = show ? '0.7' : '1';
    }
}

// Показать уведомление
function showNotification(type, message) {
    const notification = document.getElementById('notification');
    
    if (notification) {
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${type === 'success' ? '✅' : '❌'}</span>
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.style.display='none'">×</button>
            </div>
        `;
        notification.style.display = 'block';
        
        // Автоматически скрыть через 5 секунд
        setTimeout(() => {
            notification.style.display = 'none';
        }, 5000);
    } else {
        alert(message);
    }
}

// Сохранить в localStorage
function saveToLocalStorage(formData) {
    try {
        // Получаем существующие записи
        const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        
        // Добавляем новую запись
        appointments.push({
            ...formData,
            id: Date.now(),
            timestamp: new Date().toISOString(),
            status: 'pending'
        });
        
        // Сохраняем обратно
        localStorage.setItem('appointments', JSON.stringify(appointments));
        
        console.log('Запись сохранена в localStorage');
    } catch (error) {
        console.error('Ошибка при сохранении в localStorage:', error);
    }
}

// Обработчик отправки формы
document.addEventListener('DOMContentLoaded', function() {
    const bookingForm = document.getElementById('bookingForm');
    
    if (bookingForm) {
        bookingForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Валидация телефона
            const phone = document.getElementById('phone').value;
            if (!validatePhone(phone)) {
                showNotification('error', 'Пожалуйста, введите корректный номер телефона');
                return;
            }
            
            // Валидация email
            const email = document.getElementById('email').value;
            if (!validateEmail(email)) {
                showNotification('error', 'Пожалуйста, введите корректный email');
                return;
            }
            
            // Проверка выбора врача
            const doctor = document.getElementById('doctorSelect').value;
            if (!doctor) {
                showNotification('error', 'Пожалуйста, выберите врача');
                return;
            }
            
            // Проверка даты
            const date = document.getElementById('date').value;
            if (!validateDate(date)) {
                showNotification('error', 'Пожалуйста, выберите будущую дату');
                return;
            }
            
            // Собираем данные формы
            const formData = {
                name: document.getElementById('name').value,
                phone: phone,
                email: email,
                doctor: doctor,
                date: date,
                time: document.getElementById('time').value,
                service: document.getElementById('service')?.value || '',
                message: document.getElementById('message')?.value || ''
            };
            
            // Отправляем email
            await sendAppointmentEmail(formData);
        });
    }
});

// Валидация телефона
function validatePhone(phone) {
    const phoneRegex = /^(\+7|8)?[\s\-]?\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
}

// Валидация email
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Валидация даты (не прошлая)
function validateDate(dateString) {
    if (!dateString) return false;
    
    const selectedDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return selectedDate >= today;
}

// Экспортируем функции для использования в других скриптах
window.sendAppointmentEmail = sendAppointmentEmail;
window.showNotification = showNotification;