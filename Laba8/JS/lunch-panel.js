// lunch-panel.js - С ПРОВЕРКОЙ КОМБО НА КНОПКЕ В ПАНЕЛИ

// Обновление панели заказа
function updateOrderPanel() {
    const panel = document.getElementById('order-panel');
    const totalElement = document.getElementById('current-total');
    const linkElement = document.getElementById('panel-go-to-order');
    
    if (!panel || !totalElement || !linkElement) {
        console.log('Элементы панели не найдены');
        return;
    }
    
    const total = calculateTotalPrice();
    const hasSelectedDishes = Object.values(selectedDishes).some(dish => dish !== null);
    const isValidCombo = checkLunchCombo();
    
    totalElement.textContent = total;
    
    // ПАНЕЛЬ ПОКАЗЫВАЕТСЯ ПРИ ЛЮБОМ ВЫБРАННОМ БЛЮДЕ
    if (hasSelectedDishes) {
        panel.classList.remove('hidden');
        console.log('Панель показана (есть выбранные блюда)');
        
        // Проверяем комбо
        if (isValidCombo) {
            // ССЫЛКА В ПАНЕЛИ АКТИВНА (валидное комбо)
            linkElement.classList.remove('disabled');
            linkElement.style.pointerEvents = 'auto';
            linkElement.style.opacity = '1';
            linkElement.style.cursor = 'pointer';
            linkElement.title = "Перейти к оформлению заказа";
            linkElement.href = "order.html";
        } else {
            // ССЫЛКА В ПАНЕЛИ НЕАКТИВНА (невалидное комбо)
            linkElement.classList.add('disabled');
            linkElement.style.pointerEvents = 'none';
            linkElement.style.opacity = '0.7';
            linkElement.style.cursor = 'not-allowed';
            linkElement.title = "Выбранные блюда не соответствуют ни одному из вариантов ланча";
            linkElement.removeAttribute('href');
        }
        
        // Добавляем обработчик клика на ссылку в ПАНЕЛИ
        linkElement.onclick = function(e) {
            if (!isValidCombo) {
                e.preventDefault();
                showNotification("Выбранные блюда не соответствуют ни одному из вариантов ланча. Выберите один из доступных комбо-ланчей.");
                return false;
            }
            return true;
        };
        
    } else {
        panel.classList.add('hidden');
        console.log('Панель скрыта (нет выбранных блюд)');
        
        // ССЫЛКА В ПАНЕЛИ НЕАКТИВНА
        linkElement.classList.add('disabled');
        linkElement.style.pointerEvents = 'none';
        linkElement.style.opacity = '0.7';
        linkElement.style.cursor = 'not-allowed';
        linkElement.title = "Сначала выберите блюда";
        linkElement.removeAttribute('href');
    }
    
    // Обновляем ссылку в НАВИГАЦИИ (всегда активна)
    const navLinkElement = document.getElementById('nav-go-to-order');
    if (navLinkElement) {
        navLinkElement.classList.remove('disabled');
        navLinkElement.style.pointerEvents = 'auto';
        navLinkElement.style.opacity = '1';
        navLinkElement.style.cursor = 'pointer';
        navLinkElement.title = "Перейти к оформлению заказа";
        navLinkElement.href = "order.html";
    }
}

// Функция проверки комбо-ланча
function checkLunchCombo() {
    console.log('Проверка комбо-ланча...');
    
    const selected = selectedDishes;
    
    // Проверяем, выбрано ли хоть одно блюдо
    const hasAnyDish = Object.values(selected).some(dish => dish !== null);
    
    if (!hasAnyDish) {
        console.log('Нет выбранных блюд');
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
        beverage: selected.beverage !== null
    };
    
    console.log('Пользователь выбрал:', userSelection);
    
    // Проверяем, соответствует ли выбор одному из вариантов
    const isValidVariant = lunchVariants.some(variant => {
        return variant.soup === userSelection.soup &&
               variant.main === userSelection.main &&
               variant.salad === userSelection.salad &&
               variant.beverage === userSelection.beverage;
    });
    
    console.log('Результат проверки комбо:', isValidVariant);
    return isValidVariant;
}

// Инициализация панели
function initLunchPanel() {
    console.log('Инициализация панели заказа...');
    
    // Обновляем панель
    updateOrderPanel();
    
    // Подсвечиваем выбранные блюда
    highlightSelectedDishes();
}

// Подсветка выбранных блюд
function highlightSelectedDishes() {
    // Ждем загрузки DOM
    setTimeout(() => {
        console.log('Подсветка выбранных блюд...');
        
        // Сначала снимаем подсветку со всех
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
        
        // Потом подсвечиваем выбранные
        for (const category in selectedDishes) {
            const dish = selectedDishes[category];
            if (dish) {
                console.log('Подсвечиваем блюдо:', dish.keyword);
                const card = document.querySelector(`.dish-card[data-dish="${dish.keyword}"]`);
                if (card) {
                    card.style.border = '2px solid tomato';
                    card.style.backgroundColor = '#fff8f8';
                    const button = card.querySelector('button');
                    if (button) {
                        button.style.backgroundColor = 'tomato';
                        button.style.color = 'white';
                    }
                }
            }
        }
    }, 500);
}

// Запуск при загрузке
document.addEventListener('DOMContentLoaded', function() {
    console.log('lunch-panel.js: DOM загружен');
    
    // Ждем загрузки блюд
    setTimeout(function() {
        // Проверяем, что dishes загружены
        if (typeof dishes !== 'undefined' && dishes.length > 0) {
            console.log('Блюда загружены, инициализируем панель');
            
            // Загружаем выбранные блюда из localStorage
            if (typeof loadSelectedDishesFromLocalStorage === 'function') {
                console.log('Загружаем из localStorage...');
                loadSelectedDishesFromLocalStorage();
            }
            
            initLunchPanel();
        } else {
            console.log('Ждем загрузки блюд...');
            setTimeout(initLunchPanel, 1000);
        }
    }, 1000);
});

// Экспортируем функцию для использования в других файлах
window.updateOrderPanel = updateOrderPanel;
window.highlightSelectedDishes = highlightSelectedDishes;