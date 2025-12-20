// Функция для проверки соответствия выбранных блюд вариантам ланча
function validateOrder() {
    console.log('Проверяем заказ...');
    console.log('selectedDishes:', selectedDishes);
    
    const selected = selectedDishes;
    
    // Проверяем, выбрано ли хоть одно блюдо
    const hasAnyDish = Object.values(selected).some(dish => dish !== null);
    console.log('hasAnyDish:', hasAnyDish);
    
    if (!hasAnyDish) {
        showNotification("Ничего не выбрано. Выберите блюда для заказа");
        return false;
    }
    
    // Варианты ланча из таблицы задания
    const lunchVariants = [
        // Вариант 1: Суп + Главное + Салат + Напиток
        { soup: true, main: true, salad: true, beverage: true },
        // Вариант 2: Суп + Главное + Напиток
        { soup: true, main: true, salad: false, beverage: true },
        // Вариант 3: Суп + Салат + Напиток
        { soup: true, main: false, salad: true, beverage: true },
        // Вариант 4: Главное + Салат + Напиток
        { soup: false, main: true, salad: true, beverage: true },
        // Вариант 5: Главное + Напиток
        { soup: false, main: true, salad: false, beverage: true }
    ];
    
    // Преобразуем выбранные блюда в логическую структуру
    const userSelection = {
        soup: selected.soup !== null,
        main: selected.main_course !== null,
        salad: selected.salad !== null,
        beverage: selected.beverage !== null,
        dessert: selected.dessert !== null // Десерт необязательный
    };
    
    console.log('userSelection:', userSelection);
    
    // Проверяем, соответствует ли выбор одному из вариантов
    const isValidVariant = lunchVariants.some(variant => {
        return variant.soup === userSelection.soup &&
               variant.main === userSelection.main &&
               variant.salad === userSelection.salad &&
               variant.beverage === userSelection.beverage;
    });
    
    console.log('isValidVariant:', isValidVariant);
    
    if (isValidVariant) {
        return true; // Заказ валиден - форма отправляется
    }
    
    // Если не соответствует ни одному варианту, показываем соответствующее уведомление
    showAppropriateNotification(userSelection);
    return false;
}

// Функция для определения и показа соответствующего уведомления
function showAppropriateNotification(selection) {
    console.log('showAppropriateNotification:', selection);
    const { soup, main, salad, beverage, dessert } = selection;
    
    // Определяем тип уведомления по правилам из задания
    if (!beverage) {
        // Нет напитка
        showNotification("Выберите напиток");
    } else if (soup && !main && !salad) {
        // Только суп
        showNotification("Выберите главное блюдо/салат/стартер");
    } else if (salad && !soup && !main) {
        // Только салат
        showNotification("Выберите суп или главное блюдо");
    } else if (dessert && !main && !soup && !salad) {
        // Только десерт
        showNotification("Выберите главное блюдо");
    } else if (beverage && !main && !soup && !salad) {
        // Только напиток
        showNotification("Выберите главное блюдо");
    } else {
        // Другие невалидные комбинации
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

// Функция для создания и показа уведомления
function showNotification(message) {
    console.log('Показываем уведомление:', message);
    
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
    
    // Добавляем обработчик наведения на кнопку
    okButton.addEventListener('mouseenter', function() {
        this.style.backgroundColor = '#c0392b';
        this.style.color = '#fff';
    });
    
    okButton.addEventListener('mouseleave', function() {
        this.style.backgroundColor = '#e74c3c';
        this.style.color = '#fff';
    });
}

// Функция для инициализации валидации формы
// Функция для инициализации валидации формы
function initOrderValidation() {
    console.log('Инициализация валидации формы...');
    
    const orderForm = document.querySelector('.order-form');
    
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            console.log('--- ФОРМА ПЫТАЕТСЯ ОТПРАВИТЬСЯ ---');
            
            // Проверяем валидность заказа
            const isValid = validateOrder();
            console.log('Результат валидации:', isValid);
            
            // ВАЖНО: если заказ НЕ валиден - ПРЕДОТВРАЩАЕМ отправку
            if (!isValid) {
                console.log('❌ Заказ невалиден: ПРЕДОТВРАЩАЕМ отправку формы');
                e.preventDefault(); // Это ОСТАНАВЛИВАЕТ отправку формы
                e.stopPropagation(); // Это ОСТАНАВЛИВАЕТ всплытие события
                return false; // Это ОСТАНАВЛИВАЕТ обработку по умолчанию
            }
            
            console.log('✅ Заказ валиден: форма будет отправлена');
            // Если заказ валиден - форма отправляется как обычно
            return true;
        });
        
        console.log('Обработчик submit добавлен к форме');
    } else {
        console.error('Форма .order-form не найдена!');
    }
}
// Запускаем инициализацию валидации при загрузке DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен, запускаем валидацию...');
    // Даем время на загрузку других скриптов
    setTimeout(initOrderValidation, 1000);
});