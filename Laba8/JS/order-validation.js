// order-validation.js - ПРОВЕРКА ТОЛЬКО ПРИ ОТПРАВКЕ ФОРМЫ

// Функция для проверки соответствия выбранных блюд вариантам ланча
function validateOrder() {
    console.log('Проверяем заказ при отправке...');
    
    const selected = selectedDishes;
    
    // Проверяем, выбрано ли хоть одно блюдо
    const hasAnyDish = Object.values(selected).some(dish => dish !== null);
    
    if (!hasAnyDish) {
        showNotification("Ничего не выбрано. Выберите блюда для заказа");
        return false;
    }
    
    // Варианты ланча из таблицы задания
    const lunchVariants = [
        { soup: true, main: true, salad: true, beverage: true },
        { soup: true, main: true, salad: false, beverage: true },
        { soup: true, main: false, salad: true, beverage: true },
        { soup: false, main: true, salad: true, beverage: true },
        { soup: false, main: true, salad: false, beverage: true }
    ];
    
    // Преобразуем выбранные блюда в логическую структуру
    const userSelection = {
        soup: selected.soup !== null,
        main: selected.main_course !== null,
        salad: selected.salad !== null,
        beverage: selected.beverage !== null,
        dessert: selected.dessert !== null
    };
    
    // Проверяем, соответствует ли выбор одному из вариантов
    const isValidVariant = lunchVariants.some(variant => {
        return variant.soup === userSelection.soup &&
               variant.main === userSelection.main &&
               variant.salad === userSelection.salad &&
               variant.beverage === userSelection.beverage;
    });
    
    if (isValidVariant) {
        return true;
    }
    
    // Если не соответствует, показываем уведомление
    showAppropriateNotification(userSelection);
    return false;
}

function showAppropriateNotification(selection) {
    const { soup, main, salad, beverage, dessert } = selection;
    
    if (!beverage) {
        showNotification("Выберите напиток");
    } else if (soup && !main && !salad) {
        showNotification("Выберите главное блюдо/салат/стартер");
    } else if (salad && !soup && !main) {
        showNotification("Выберите суп или главное блюдо");
    } else if (dessert && !main && !soup && !salad) {
        showNotification("Выберите главное блюдо");
    } else if (beverage && !main && !soup && !salad) {
        showNotification("Выберите главное блюдо");
    } else {
        if (soup && main && !beverage) {
            showNotification("Выберите напиток");
        } else if (soup && salad && !beverage) {
            showNotification("Выберите напиток");
        } else if (main && salad && !beverage) {
            showNotification("Выберите напиток");
        } else if (main && !beverage) {
            showNotification("Выберите напиток");
        } else {
            showNotification("Выбранные блюда не соответствуют ни одному из вариантов ланча");
        }
    }
}

function showNotification(message) {
    // Сначала удаляем существующее уведомление, если есть
    const existingNotification = document.querySelector('.notification-overlay');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Создаем оверлей
    const overlay = document.createElement('div');
    overlay.className = 'notification-overlay';
    
    // Создаем уведомление
    const notification = document.createElement('div');
    notification.className = 'notification';
    
    // Содержимое уведомления
    notification.innerHTML = `
        <p>${message}</p>
        <button class="notification-button">Окей</button>
    `;
    
    // Добавляем уведомление в оверлей
    overlay.appendChild(notification);
    
    // Добавляем оверлей на страницу
    document.body.appendChild(overlay);
    
    // Обработчик для кнопки "Окей"
    const okButton = notification.querySelector('.notification-button');
    okButton.addEventListener('click', function() {
        overlay.remove();
    });
    
    // Обработчик для закрытия при клике вне уведомления
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            overlay.remove();
        }
    });
}

// Инициализация валидации формы - ТОЛЬКО на order.html
// Инициализация валидации формы - ТОЛЬКО на order.html
function initOrderValidation() {
    console.log('Инициализация валидации формы...');
    
    // Находим форму на текущей странице
    const orderForm = document.getElementById('order-form');
    
    if (orderForm) {
        console.log('✅ Форма найдена на order.html');
        
        // Удаляем ВСЕ существующие обработчики submit
        orderForm.removeEventListener('submit', handleFormSubmit);
        
        // Создаем новую функцию обработчика
        function handleFormSubmit(e) {
            console.log('--- ФОРМА ПЫТАЕТСЯ ОТПРАВИТЬСЯ ---');
            
            // Всегда останавливаем стандартное поведение
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            
            // Проверяем валидность заказа
            const isValid = validateOrder();
            console.log('Результат валидации:', isValid);
            
            // Если заказ НЕ валиден - не отправляем
            if (!isValid) {
                console.log('❌ Заказ невалиден: не отправляем форму');
                return false;
            }
            
            console.log('✅ Заказ валиден: спрашиваем подтверждение');
            
            // Если заказ валиден - показываем подтверждение
            if (confirm('Подтвердить заказ?')) {
                console.log('Пользователь подтвердил заказ');
                
                // Очищаем заказ и переходим на главную
                alert('Заказ отправлен!');
                clearOrderFromLocalStorage();
                setTimeout(() => {
                    window.location.href = 'lunch.html';
                }, 1000);
            } else {
                console.log('Пользователь отменил заказ');
            }
            
            return false;
        }
        
        // Добавляем наш обработчик
        orderForm.addEventListener('submit', handleFormSubmit);
        
        // Также перехватываем кнопку отправки на всякий случай
        const submitButton = orderForm.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.addEventListener('click', function(e) {
                console.log('Кнопка "Отправить заказ" нажата');
                // Даем основному обработчику сработать
            });
        }
        
        console.log('✅ Обработчик формы установлен');
    } else {
        console.log('❌ Форма .order-form не найдена (это нормально для lunch.html)');
    }
}
// Запускаем инициализацию при загрузке DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('order-validation.js: DOM загружен');
    
    // Даем время на загрузку других скриптов
    setTimeout(initOrderValidation, 1000);
});

// Экспортируем для использования в других файлах
window.validateOrder = validateOrder;
window.showNotification = showNotification;