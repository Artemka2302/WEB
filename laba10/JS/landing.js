// landing.js - JavaScript для лендинга BusinessLunch Pro

document.addEventListener('DOMContentLoaded', function() {
    console.log('Лендинг BusinessLunch Pro загружен');
    
    // Инициализация формы обратной связи
    initContactForm();
    
    // Инициализация плавной прокрутки
    initSmoothScroll();
    
    // Инициализация валидации формы
    initFormValidation();
    
    // Добавление анимаций при прокрутке
    initScrollAnimations();
});

/**
 * Инициализация формы обратной связи
 */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            event.stopPropagation();
            
            if (this.checkValidity()) {
                // Имитация отправки формы
                submitContactForm();
            } else {
                // Показываем ошибки валидации
                this.classList.add('was-validated');
            }
        }, false);
    }
}

/**
 * Отправка формы обратной связи (имитация)
 */
function submitContactForm() {
    const form = document.getElementById('contactForm');
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Показываем состояние загрузки
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Отправка...';
    
    // Имитация AJAX-запроса
    setTimeout(() => {
        // В реальном проекте здесь был бы fetch/axios запрос
        
        // Показываем сообщение об успехе
        showAlert('success', 'Сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.');
        
        // Сбрасываем форму
        form.reset();
        form.classList.remove('was-validated');
        
        // Восстанавливаем кнопку
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        
        // Прокручиваем к началу формы
        form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
    }, 1500);
}

/**
 * Показ уведомления
 */
function showAlert(type, message) {
    // Создаем элемент алерта
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top: 100px; right: 20px; z-index: 1050; max-width: 400px;';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Добавляем на страницу
    document.body.appendChild(alertDiv);
    
    // Автоматическое скрытие через 5 секунд
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

/**
 * Инициализация плавной прокрутки
 */
function initSmoothScroll() {
    // Плавная прокрутка для якорных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Пропускаем ссылки без якоря
            if (href === '#') return;
            
            const targetElement = document.querySelector(href);
            
            if (targetElement) {
                e.preventDefault();
                
                // Закрываем мобильное меню если открыто
                const navbarCollapse = document.querySelector('.navbar-collapse.show');
                if (navbarCollapse) {
                    const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                    if (bsCollapse) {
                        bsCollapse.hide();
                    }
                }
                
                // Плавная прокрутка
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Инициализация валидации формы
 */
function initFormValidation() {
    // Валидация Bootstrap уже работает через классы
    // Добавим кастомную валидацию для телефона
    const phoneInput = document.getElementById('phone');
    
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            const phoneRegex = /^[\d\s\-\+\(\)]+$/;
            
            if (this.value && !phoneRegex.test(this.value)) {
                this.setCustomValidity('Введите корректный номер телефона');
            } else {
                this.setCustomValidity('');
            }
        });
    }
}

/**
 * Инициализация анимаций при прокрутке
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Наблюдаем за элементами для анимации
    document.querySelectorAll('.feature-card, .hero-section img, .cta-section .btn').forEach(el => {
        observer.observe(el);
    });
    
    // Добавляем класс анимации для элементов при загрузке
    setTimeout(() => {
        document.querySelector('.hero-section h1')?.classList.add('fade-in-up');
        document.querySelector('.hero-section .lead')?.classList.add('fade-in-up');
    }, 300);
}