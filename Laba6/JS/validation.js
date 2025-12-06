// Определяем допустимые комбинации ланча
const validCombinations = [
    ['soup', 'main_course', 'salad', 'beverage'],
    ['soup', 'main_course', 'beverage'],
    ['soup', 'salad', 'beverage'],
    ['main_course', 'salad', 'beverage'],
    ['main_course', 'beverage']
];

// Функция проверки комбинации
function validateLunchCombination(selectedDishes) {
    const selectedCategories = Object.keys(selectedDishes).filter(
        category => selectedDishes[category] !== null
    );
    
    // Убираем десерт из проверки, так как он опциональный
    const categoriesWithoutDessert = selectedCategories.filter(cat => cat !== 'dessert');
    
    // Если ничего не выбрано
    if (categoriesWithoutDessert.length === 0) {
        return {
            isValid: false,
            type: 'nothing'
        };
    }
    
    // Проверяем соответствие комбинациям
    for (const combo of validCombinations) {
        if (arraysEqual(categoriesWithoutDessert.sort(), combo.sort())) {
            return { isValid: true };
        }
    }
    
    // Определяем тип ошибки
    return determineErrorType(categoriesWithoutDessert);
}

// Функция сравнения массивов
function arraysEqual(a, b) {
    if (a.length !== b.length) return false;
    return a.every((val, index) => val === b[index]);
}

// Функция определения типа ошибки
function determineErrorType(categories) {
    const hasSoup = categories.includes('soup');
    const hasMain = categories.includes('main_course');
    const hasSalad = categories.includes('salad');
    const hasBeverage = categories.includes('beverage');
    
    // Проверяем условия из задания
    if (hasSoup && hasMain && hasSalad && !hasBeverage) {
        return { isValid: false, type: 'no_drink' };
    }
    
    if (hasSoup && !hasMain && !hasSalad) {
        return { isValid: false, type: 'no_main_salad' };
    }
    
    if (hasSalad && !hasSoup && !hasMain) {
        return { isValid: false, type: 'no_soup_main' };
    }
    
    if ((hasBeverage || categories.includes('dessert')) && !hasMain && !hasSoup && !hasSalad) {
        return { isValid: false, type: 'no_main' };
    }
    
    return { isValid: false, type: 'invalid' };
}

// Функция создания уведомления
function createNotification(type) {
    // Удаляем старое уведомление если есть
    const oldNotification = document.getElementById('lunch-notification');
    if (oldNotification) {
        oldNotification.remove();
    }
    
    // Определяем текст и изображение
    let message, image;
    switch(type) {
        case 'nothing':
            message = 'Ничего не выбрано. Выберите блюда для заказа';
            image = 'pictures/notifications/nothing_selected.jpg';
            break;
        case 'no_drink':
            message = 'Выберите напиток';
            image = 'pictures/notifications/choose_drink.jpg';
            break;
        case 'no_main_salad':
            message = 'Выберите главное блюдо/салат/стартер';
            image = 'pictures/notifications/choose_main_or_salad.jpg';
            break;
        case 'no_soup_main':
            message = 'Выберите суп или главное блюдо';
            image = 'pictures/notifications/choose_soup_or_main.jpg';
            break;
        case 'no_main':
            message = 'Выберите главное блюдо';
            image = 'pictures/notifications/choose_main.jpg';
            break;
        default:
            message = 'Выбранные блюда не соответствуют ни одному варианту ланча';
            image = 'pictures/notifications/nothing_selected.jpg';
    }
    
    // Создаем HTML уведомления
    const notificationHTML = `
        <div id="lunch-notification" class="notification">
            <div class="notification-content">
                <h3>Внимание!</h3>
                <img src="${image}" alt="Уведомление">
                <p>${message}</p>
                <button class="notification-btn">Окей</button>
            </div>
        </div>
    `;
    
    // Добавляем на страницу
    document.body.insertAdjacentHTML('beforeend', notificationHTML);
    
    // Обработчик для кнопки
    document.querySelector('.notification-btn').addEventListener('click', function() {
        document.getElementById('lunch-notification').remove();
    });
}

// Функция валидации формы
function setupFormValidation() {
    const form = document.querySelector('.order-form');
    
    form.addEventListener('submit', function(event) {
        // Проверяем комбинацию
        const validation = validateLunchCombination(window.selectedDishes);
        
        if (!validation.isValid) {
            event.preventDefault(); // Останавливаем отправку формы
            createNotification(validation.type);
            return false;
        }
        
        // Если все ок, форма отправится
        return true;
    });
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', setupFormValidation);