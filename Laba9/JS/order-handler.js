// order-handler.js - ОБНОВЛЕННАЯ ВЕРСИЯ

// Объект для хранения выбранных блюд
let selectedDishes = {
    soup: null,
    main_course: null, 
    beverage: null,
    salad: null,
    dessert: null
};

// ===== ФУНКЦИИ ДЛЯ LOCALSTORAGE =====

function saveSelectedDishesToLocalStorage() {
    const dishesToSave = {};
    
    for (const category in selectedDishes) {
        if (selectedDishes[category]) {
            dishesToSave[category] = selectedDishes[category].keyword;
        }
    }
    
    localStorage.setItem('selectedDishes', JSON.stringify(dishesToSave));
    console.log('Сохранено в localStorage:', dishesToSave);
}

function loadSelectedDishesFromLocalStorage() {
    const saved = localStorage.getItem('selectedDishes');
    if (!saved) {
        console.log('В localStorage нет сохраненных блюд');
        return selectedDishes;
    }
    
    try {
        const savedDishes = JSON.parse(saved);
        console.log('Загружаем из localStorage:', savedDishes);
        
        // Восстанавливаем выбранные блюда
        for (const category in savedDishes) {
            const dishKeyword = savedDishes[category];
            if (dishKeyword) {
                const dish = findDishByKeyword(dishKeyword);
                if (dish) {
                    selectedDishes[category] = dish;
                    console.log('Восстановлено блюдо:', dish.name, 'в категории', category);
                } else {
                    console.warn('Блюдо не найдено по keyword:', dishKeyword);
                }
            }
        }
        
        console.log('Загружено из localStorage:', selectedDishes);
        return selectedDishes;
    } catch (e) {
        console.error('Ошибка загрузки из localStorage:', e);
        return selectedDishes;
    }
}

function removeDishFromLocalStorage(category) {
    const saved = localStorage.getItem('selectedDishes');
    if (!saved) return;
    
    const savedDishes = JSON.parse(saved);
    delete savedDishes[category];
    
    localStorage.setItem('selectedDishes', JSON.stringify(savedDishes));
}

function clearOrderFromLocalStorage() {
    localStorage.removeItem('selectedDishes');
}

// ===== ОСНОВНЫЕ ФУНКЦИИ =====

function findDishByKeyword(keyword) {
    if (!window.dishes || window.dishes.length === 0) {
        console.warn('Массив dishes пуст или не загружен');
        return null;
    }
    
    const dish = window.dishes.find(dish => dish.keyword === keyword);
    
    if (dish) {
        console.log('Найдено блюдо с ID:', dish.id, 'Название:', dish.name);
        
        // Убедись что возвращается ВЕСЬ объект с ID
        return {
            id: dish.id,           // ВАЖНО: добавляем ID
            keyword: dish.keyword,
            name: dish.name,
            price: dish.price,
            category: dish.category,
            kind: dish.kind,
            count: dish.count,
            image: dish.image
        };
    }
    
    return null;
}

function handleDishClick(event) {
    const dishCard = event.target.closest('[data-dish]');
    if (!dishCard) return;
    
    const dishKeyword = dishCard.getAttribute('data-dish');
    console.log('Кликнули на блюдо с keyword:', dishKeyword);
    
    const dish = findDishByKeyword(dishKeyword);
    
    if (dish) {
        console.log('Найдено блюдо:', dish.name, 'категория:', dish.category);
        
        removeSelectionFromCategory(dish.category);
        dishCard.style.border = '2px solid tomato';
        dishCard.style.backgroundColor = '#fff8f8';
        const button = dishCard.querySelector('button');
        if (button) {
            button.style.backgroundColor = 'tomato';
            button.style.color = 'white';
        }
        
        selectedDishes[dish.category] = dish;
        updateOrderForm();
        saveSelectedDishesToLocalStorage();
        
        // Обновляем панель
        if (typeof updateOrderPanel === 'function') {
            updateOrderPanel();
        }
        
        // Обновляем подсветку других блюд
        highlightSelectedDishes();
    } else {
        console.error('Блюдо не найдено по keyword:', dishKeyword);
    }
}

function removeSelectionFromCategory(category) {
    const allCards = document.querySelectorAll('.dish-card');
    allCards.forEach(card => {
        const cardKeyword = card.getAttribute('data-dish');
        const cardDish = findDishByKeyword(cardKeyword);
        if (cardDish && cardDish.category === category) {
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

// Подсветка ВСЕХ выбранных блюд (для восстановления)
function highlightSelectedDishes() {
    // Ждем немного, чтобы DOM полностью загрузился
    setTimeout(() => {
        console.log('Подсветка выбранных блюд...');
        
        let highlightedCount = 0;
        for (const category in selectedDishes) {
            const dish = selectedDishes[category];
            if (dish) {
                const card = document.querySelector(`.dish-card[data-dish="${dish.keyword}"]`);
                if (card) {
                    card.style.border = '2px solid tomato';
                    card.style.backgroundColor = '#fff8f8';
                    const button = card.querySelector('button');
                    if (button) {
                        button.style.backgroundColor = 'tomato';
                        button.style.color = 'white';
                    }
                    highlightedCount++;
                } else {
                    console.warn('Карточка блюда не найдена в DOM:', dish.keyword);
                }
            }
        }
        console.log('Подсвечено блюд:', highlightedCount);
    }, 500);
}

function updateOrderForm() {
    const orderContainer = document.getElementById('dynamic-order');
    if (!orderContainer) return;
    
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

function createOrderDisplay(category, categoryName) {
    const dish = selectedDishes[category];
    
    if (dish) {
        return `
            <p><strong>${categoryName}</strong></p>
            <p>${dish.name} ${dish.price} руб.</p>
        `;
    } else {
        return `
            <p><strong>${categoryName}</strong></p>
            <p>${getNotSelectedText(categoryName)}</p>
        `;
    }
}

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

function calculateTotalPrice() {
    let total = 0;
    for (const category in selectedDishes) {
        if (selectedDishes[category]) {
            total += Number(selectedDishes[category].price);
        }
    }
    return total;
}

function resetOrder() {
    selectedDishes = {
        soup: null,
        main_course: null, 
        beverage: null,
        salad: null,
        dessert: null
    };
    
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
    
    updateOrderForm();
    clearOrderFromLocalStorage();
    
    if (typeof updateOrderPanel === 'function') {
        updateOrderPanel();
    }
}

function initOrderHandlers() {
    console.log('Инициализация обработчиков order-handler.js...');
    
    // Сначала загружаем блюда из localStorage
    loadSelectedDishesFromLocalStorage();
    
    // Обработчик кликов на блюда
    document.addEventListener('click', function(event) {
        if (event.target.closest('.dish-card')) {
            handleDishClick(event);
        }
    });
    
    // Обработчик для ссылки в навигации
    const navOrderLink = document.getElementById('nav-go-to-order');
    if (navOrderLink) {
        navOrderLink.addEventListener('click', function(e) {
            // Ссылка в навигации ВСЕГДА активна - не проверяем
            return true;
        });
    }
    
    const resetButton = document.querySelector('button[type="reset"]');
    if (resetButton) {
        resetButton.addEventListener('click', resetOrder);
    }
    
    updateOrderForm();
    
    // Подсвечиваем выбранные блюда при загрузке
    setTimeout(() => {
        highlightSelectedDishes();
    }, 1000);
}

// Запускаем при загрузке
document.addEventListener('DOMContentLoaded', function() {
    console.log('order-handler.js: DOM загружен');
    
    // Инициализируем обработчики
    initOrderHandlers();
    
    // Если мы на странице order.html, обновляем форму
    if (document.getElementById('order-form')) {
        updateOrderForm();
    }
});