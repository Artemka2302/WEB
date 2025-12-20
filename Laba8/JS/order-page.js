// order-page.js - УБИРАЕМ ОБРАБОТЧИК SUBMIT

// Инициализация страницы заказа
function initOrderPage() {
    console.log('Инициализация страницы заказа...');
    
    // Загружаем выбранные блюда
    loadSelectedDishesFromLocalStorage();
    
    // Отображаем блюда
    displayOrderItems();
    
    // Обновляем форму
    updateOrderForm();
    
    // Инициализируем обработчики
    initOrderPageHandlers();
    
    // ВСЕГДА добавляем кнопку "Выбрать блюда"
    addBackToLunchButton();
}

// Отображение выбранных блюд
function displayOrderItems() {
    const container = document.getElementById('order-items-container');
    if (!container) return;
    
    const hasSelectedDishes = Object.values(selectedDishes).some(dish => dish !== null);
    
    if (!hasSelectedDishes) {
        container.innerHTML = `
            <div class="empty-order-message">
                <p>Ничего не выбрано. Чтобы добавить блюда в заказ, перейдите на страницу</p>
                <p><a href="lunch.html" class="back-to-lunch-btn">Собрать ланч</a></p>
            </div>
        `;
        return;
    }
    
    let orderHTML = '<div class="order-items-grid">';
    
    const categories = [
        { key: 'soup', name: 'Суп' },
        { key: 'main_course', name: 'Главное блюдо' },
        { key: 'salad', name: 'Салат' },
        { key: 'beverage', name: 'Напиток' },
        { key: 'dessert', name: 'Десерт' }
    ];
    
    categories.forEach(category => {
        const dish = selectedDishes[category.key];
        if (dish) {
            let imageUrl = dish.image;
            if (imageUrl && !imageUrl.startsWith('http')) {
                if (!imageUrl.endsWith('.jpg')) {
                    imageUrl = `${imageUrl}.jpg`;
                }
            }
            
            orderHTML += `
                <div class="order-dish-card">
                    <img src="${imageUrl}" alt="${dish.name}" onerror="this.src='pictures/placeholder.jpg'">
                    <p class="price">${dish.price} руб.</p>
                    <p class="dish-name">${dish.name}</p>
                    <p>${dish.count}</p>
                    <span class="category">${category.name}</span>
                    <button class="remove-btn" data-category="${dish.category}">
                        Удалить из заказа
                    </button>
                </div>
            `;
        }
    });
    
    orderHTML += '</div>';
    container.innerHTML = orderHTML;
}

// Добавление кнопки "Выбрать блюда" (ВСЕГДА добавляем)
function addBackToLunchButton() {
    const formButtons = document.querySelector('.form-buttons');
    
    if (formButtons) {
        // Проверяем, есть ли уже такая кнопка
        const existingBackBtn = document.getElementById('back-to-lunch-btn');
        if (!existingBackBtn) {
            const backBtn = document.createElement('button');
            backBtn.id = 'back-to-lunch-btn';
            backBtn.type = 'button';
            backBtn.textContent = 'Выбрать блюда';
            
            backBtn.addEventListener('click', function() {
                window.location.href = 'lunch.html';
            });
            
            formButtons.insertBefore(backBtn, formButtons.firstChild);
        }
    }
}

// Обновление формы заказа
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

// Инициализация обработчиков - УБИРАЕМ ОБРАБОТЧИК SUBMIT
function initOrderPageHandlers() {
    // Удаление блюда
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('remove-btn')) {
            const category = event.target.getAttribute('data-category');
            removeDishFromOrder(category);
        }
    });
    
    // Очистка заказа
    const clearButton = document.getElementById('clear-order');
    if (clearButton) {
        clearButton.addEventListener('click', function() {
            if (confirm('Очистить весь заказ?')) {
                resetOrder();
                displayOrderItems();
                updateOrderForm();
                addBackToLunchButton();
            }
        });
    }
    
    // НЕ ДОБАВЛЯЕМ обработчик submit формы здесь!
    // Он уже есть в order-validation.js
    // УБЕРИТЕ ВЕСЬ ЭТОТ БЛОК КОДА:
    // const orderForm = document.getElementById('order-form');
    // if (orderForm) {
    //     orderForm.addEventListener('submit', function(e) {
    //         // ... этот код ...
    //     });
    // }
}

// Удаление блюда из заказа
function removeDishFromOrder(category) {
    selectedDishes[category] = null;
    removeDishFromLocalStorage(category);
    displayOrderItems();
    updateOrderForm();
}

// Запуск при загрузке
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        initOrderPage();
    }, 1500);
});
// Инициализация обработчиков - ДОБАВЛЯЕМ ПРОВЕРКУ НА КНОПКУ
function initOrderPageHandlers() {
    // Удаление блюда
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('remove-btn')) {
            const category = event.target.getAttribute('data-category');
            removeDishFromOrder(category);
        }
    });
    
    // Очистка заказа
    const clearButton = document.getElementById('clear-order');
    if (clearButton) {
        clearButton.addEventListener('click', function() {
            if (confirm('Очистить весь заказ?')) {
                resetOrder();
                displayOrderItems();
                updateOrderForm();
                addBackToLunchButton();
            }
        });
    }
    
    // ПРЯМАЯ ПРОВЕРКА НА КНОПКЕ "ОТПРАВИТЬ ЗАКАЗ"
    const submitButton = document.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.addEventListener('click', function(e) {
            console.log('Кнопка "Отправить заказ" нажата');
            
            // Проверяем валидность заказа
            const isValid = validateOrder();
            
            if (!isValid) {
                // Если невалидно - останавливаем отправку
                e.preventDefault();
                e.stopPropagation();
                console.log('❌ Заказ невалиден: не отправляем форму');
                return false;
            }
            
            // Если валидно - спрашиваем подтверждение
            console.log('✅ Заказ валиден: спрашиваем подтверждение');
            
            // Подтверждение уже будет в основном обработчике формы
            // Даем форме обработаться дальше
        });
    }
}