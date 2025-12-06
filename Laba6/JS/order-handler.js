
// Делаем переменную глобально доступной
window.selectedDishes = {
    soup: null,
    main_course: null, 
    beverage: null,
    salad: null,
    dessert: null
};

// Функция для поиска блюда по keyword
function findDishByKeyword(keyword) {
    return dishes.find(dish => dish.keyword === keyword);
}

// Функция для обработки клика по карточке блюда
function handleDishClick(event) {
    // Находим ближайшую карточку с data-атрибутом
    const dishCard = event.target.closest('[data-dish]');
    
    if (!dishCard) return;
    
    const dishKeyword = dishCard.getAttribute('data-dish');
    const dish = findDishByKeyword(dishKeyword);
    
    if (dish) {
        // Убираем подсветку со всех карточек этой категории
        removeSelectionFromCategory(dish.category);
        // Добавляем подсветку выбранной карточке (используем ваш существующий hover-эффект)
        dishCard.style.border = '2px solid tomato';
        dishCard.style.backgroundColor = '#fff8f8';
        // Меняем цвет кнопки
        const button = dishCard.querySelector('button');
        if (button) {
            button.style.backgroundColor = 'tomato';
            button.style.color = 'white';
        }
        
        // Сохраняем выбранное блюдо
        selectedDishes[dish.category] = dish;
        // Обновляем отображение формы заказа
        updateOrderForm();
    }
}

// Функция для снятия подсветки со всех карточек категории
function removeSelectionFromCategory(category) {
    const allCards = document.querySelectorAll('.dish-card');
    allCards.forEach(card => {
        const cardKeyword = card.getAttribute('data-dish');
        const cardDish = findDishByKeyword(cardKeyword);
        if (cardDish && cardDish.category === category) {
            // Возвращаем оригинальные стили
            card.style.border = '';
            card.style.backgroundColor = '';
            const button = card.querySelector('button');
            if (button) {
                button.style.backgroundColor = '';
                button.style.color = '';
            }
        }
    });
}

// Функция для обновления отображения формы заказа
function updateOrderForm() {
    const orderContainer = document.getElementById('dynamic-order');
    
    // Проверяем, есть ли выбранные блюда
    const hasSelectedDishes = Object.values(selectedDishes).some(dish => dish !== null);
    const totalPrice = calculateTotalPrice();
    
    if (!hasSelectedDishes) {
        orderContainer.innerHTML = '<p>Ничего не выбрано</p>';
    } else {
        let orderHTML = '';
        orderHTML += createOrderDisplay('soup', 'Суп');
        orderHTML += createOrderDisplay('main_course', 'Главное блюдо'); 
        orderHTML += createOrderDisplay('salad', 'Салат или стартер');
        orderHTML += createOrderDisplay('beverage', 'Напиток');
        orderHTML += createOrderDisplay('dessert', 'Десерт');
        orderHTML += `
            <p><strong>Стоимость заказа</strong></p>
            <p>${totalPrice} руб</p>
        `;
        
        orderContainer.innerHTML = orderHTML;
    }
}

// Функция для создания отображения одной категории заказа
function createOrderDisplay(category, categoryName) {
    const dish = selectedDishes[category];
    
    if (dish) {
        // Если блюдо выбрано - показываем название и цену в нужном формате
        return `
            <p><strong>${categoryName}</strong></p>
            <p>${dish.name} ${dish.price} руб.</p>
        `;
    } else {
        // Если блюдо не выбрано - показываем сообщение
        return `
            <p><strong>${categoryName}</strong></p>
            <p>${getNotSelectedText(categoryName)}</p>
        `;
    }
}

// Функция для получения текста "не выбрано"
function getNotSelectedText(categoryName) {
    switch(categoryName) {
        case 'Суп': return 'Суп не выбран';
        case 'Главное блюдо': return 'Основное блюдо не выбрано';
        case 'Салат или стартер': return 'Салат или стартер не выбран';
        case 'Напиток': return 'Напиток не выбран';
        case 'Десерт': return 'Десерт не выбран';
        default: return 'Блюдо не выбрано';
    }
}

// Функция для подсчета общей стоимости заказа
function calculateTotalPrice() {
    let total = 0;
    for (const category in selectedDishes) {
        if (selectedDishes[category]) {
            total += selectedDishes[category].price;
        }
    }
    return total;
}

// Функция для полного сброса заказа
function resetOrder() {
    // Сбрасываем выбранные блюда
    selectedDishes = {
        soup: null,
        main_course: null, 
        beverage: null,
        salad: null,
        dessert: null
    };
    
    // Убираем подсветку со всех карточек
    const allCards = document.querySelectorAll('.dish-card');
    allCards.forEach(card => {
        card.style.border = '';
        card.style.backgroundColor = '';
        const button = card.querySelector('button');
        if (button) {
            button.style.backgroundColor = '';
            button.style.color = '';
        }
    });
    
    // Обновляем отображение формы
    updateOrderForm();
}

// Функция для инициализации обработчиков событий
function initOrderHandlers() {
    // Добавляем обработчик клика на все карточки блюд
    document.addEventListener('click', function(event) {
        if (event.target.closest('.dish-card')) {
            handleDishClick(event);
        }
    });
    
    // Добавляем обработчик кнопки "Сбросить"
    const resetButton = document.querySelector('button[type="reset"]');
    if (resetButton) {
        resetButton.addEventListener('click', resetOrder);
    }
    
    // Инициализируем первоначальное отображение формы
    updateOrderForm();
}

// Запускаем когда DOM загружен
document.addEventListener('DOMContentLoaded', initOrderHandlers);