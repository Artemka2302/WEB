// order-validation.js - РАБОЧАЯ ВЕРСИЯ (цена 0)

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

// order-validation.js - ИСПРАВЛЕННАЯ ФУНКЦИЯ ОТПРАВКИ ЗАКАЗА

async function submitOrderToAPI(orderData) {
    try {
        const API_KEY = "32342745-3e72-4fcc-8f7a-a5a0c1703144";
        const API_URL = "https://edu.std-900.ist.mospolytech.ru/labs/api/orders";
        
        console.log('📤 Отправляем заказ на сервер:', orderData);


        const totalPrice = calculateTotalPrice();
        console.log('💰 Рассчитанная стоимость заказа:', totalPrice);
        
        // Подготовка данных для отправки
        const payload = {
            full_name: orderData.full_name,
            email: orderData.email,
            phone: orderData.phone,
            delivery_address: orderData.delivery_address,
            delivery_type: orderData.delivery_type,
            comment: orderData.comment || null,
            subscribe: orderData.subscribe ? 1 : 0,
            total_price: Number(totalPrice)
        };
        
        // Добавляем время доставки если нужно
        if (orderData.delivery_type === 'by_time' && orderData.delivery_time) {
            payload.delivery_time = orderData.delivery_time;
        }
        
        // Добавляем ID блюд из выбранных блюд
        const dishIds = getSelectedDishIds();
        if (dishIds.soup_id) payload.soup_id = dishIds.soup_id;
        if (dishIds.main_course_id) payload.main_course_id = dishIds.main_course_id;
        if (dishIds.salad_id) payload.salad_id = dishIds.salad_id;
        if (dishIds.drink_id) payload.drink_id = dishIds.drink_id;
        if (dishIds.dessert_id) payload.dessert_id = dishIds.dessert_id;
        
        console.log('📦 Отправляемые данные:', payload);
        
        const response = await fetch(`${API_URL}?api_key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        console.log('📥 Ответ сервера:', response.status, response.statusText);
        
        if (response.ok) {
            const result = await response.json();
            console.log('✅ Заказ создан успешно:', result);
            return { success: true, data: result };
        } else {
            const errorText = await response.text();
            console.error('❌ Ошибка создания заказа:', errorText);
            return { 
                success: false, 
                error: errorText || `Ошибка: ${response.status}` 
            };
        }
    } catch (error) {
        console.error('❌ Сетевая ошибка:', error);
        return { success: false, error: error.message };
    }
}

// Новая функция для получения ID выбранных блюд
function getSelectedDishIds() {
    console.log('🔍 Получаем ID выбранных блюд для отправки...');
    
    const dishIds = {
        soup_id: null,
        main_course_id: null,
        salad_id: null,
        drink_id: null,  // ВАЖНО: API ожидает drink_id, не beverage_id!
        dessert_id: null
    };
    
    // Проверяем все категории и назначаем ПРАВИЛЬНЫЕ поля API
    if (selectedDishes.soup && selectedDishes.soup.id) {
        dishIds.soup_id = selectedDishes.soup.id;
    }
    
    if (selectedDishes.main_course && selectedDishes.main_course.id) {
        dishIds.main_course_id = selectedDishes.main_course.id;
    }
    
    if (selectedDishes.salad && selectedDishes.salad.id) {
        dishIds.salad_id = selectedDishes.salad.id;
    }
    
    // ВАЖНОЕ ИСПРАВЛЕНИЕ: beverage -> drink_id
    if (selectedDishes.beverage && selectedDishes.beverage.id) {
        dishIds.drink_id = selectedDishes.beverage.id;  // ← ИСПРАВЛЕНО!
        console.log('✅ Напиток: ID сохранен как drink_id:', dishIds.drink_id);
    }
    
    if (selectedDishes.dessert && selectedDishes.dessert.id) {
        dishIds.dessert_id = selectedDishes.dessert.id;
    }
    
    console.log('📦 ID для отправки в API:', dishIds);
    return dishIds;
}// Инициализация валидации формы - ТОЛЬКО на order.html
// Заменяем всю функцию initOrderValidation на эту:

function initOrderValidation() {
    console.log('Инициализация валидации формы...');
    
    const orderForm = document.getElementById('order-form');
    
    if (orderForm) {
        console.log('✅ Форма найдена на order.html');
        
        // Создаем новую функцию обработчика
        async function handleFormSubmit(e) {
            console.log('--- ФОРМА ПЫТАЕТСЯ ОТПРАВИТЬСЯ ---');
            
            // Всегда останавливаем стандартное поведение
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            
            // Проверяем валидность заказа
            const isValid = validateOrder();
            console.log('Результат валидации заказа:', isValid);
            
            // Если заказ НЕ валиден - не отправляем
            if (!isValid) {
                console.log('❌ Заказ невалиден: не отправляем форму');
                return false;
            }
            
            console.log('✅ Заказ валиден: проверяем форму');
            
            // Проверяем обязательные поля формы
            const formData = getFormData();
            if (!formData.valid) {
                showNotification('Пожалуйста, заполните все обязательные поля');
                return false;
            }
            
            console.log('✅ Форма валидна: спрашиваем подтверждение');
            
            // Если заказ валиден - показываем подтверждение
            if (confirm('Подтвердить заказ?')) {
                console.log('Пользователь подтвердил заказ');
                
                // Показываем загрузку
                const submitBtn = orderForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Отправка...';
                submitBtn.disabled = true;
                
                try {
                    // Отправляем заказ на сервер
                    const result = await submitOrderToAPI(formData);
                    
                    if (result.success) {
                        console.log('✅ Заказ успешно создан на сервере');
                        
                        // Очищаем заказ
                        clearOrderFromLocalStorage();
                        
                        // Сбрасываем selectedDishes
                        if (typeof selectedDishes !== 'undefined') {
                            selectedDishes = {
                                soup: null,
                                main_course: null, 
                                beverage: null,
                                salad: null,
                                dessert: null
                            };
                        }
                        
                        // Показываем успешное сообщение
                        alert('✅ Заказ успешно отправлен!\nНомер заказа: ' + (result.data.id || ''));
                        
                        // Через 2 секунды переходим на lunch.html
                        setTimeout(() => {
                            window.location.href = 'lunch.html';
                        }, 2000);
                        
                    } else {
                        console.error('❌ Ошибка создания заказа:', result.error);
                        showNotification('Ошибка при отправке заказа: ' + result.error);
                        
                        // Восстанавливаем кнопку
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                    }
                    
                } catch (error) {
                    console.error('❌ Неожиданная ошибка:', error);
                    showNotification('Произошла ошибка: ' + error.message);
                    
                    // Восстанавливаем кнопку
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
                
            } else {
                console.log('Пользователь отменил заказ');
            }
            
            return false;
        }
        
        // Добавляем наш обработчик
        orderForm.addEventListener('submit', handleFormSubmit);
        
        console.log('✅ Обработчик формы установлен');
    } else {
        console.log('❌ Форма .order-form не найдена (это нормально для lunch.html)');
    }
}

// Новая функция для получения данных формы
function getFormData() {
    const name = document.getElementById('name')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const phone = document.getElementById('phone')?.value.trim();
    const address = document.getElementById('address')?.value.trim();
    const deliveryType = document.querySelector('input[name="delivery_type"]:checked')?.value;
    const deliveryTime = document.getElementById('delivery-time')?.value;
    const subscribe = document.getElementById('subscription')?.checked;
    const comment = document.getElementById('comment')?.value.trim();
    
    // Проверка обязательных полей
    if (!name || !email || !phone || !address || !deliveryType) {
        return { valid: false };
    }
    
    // Проверка email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Введите корректный email');
        return { valid: false };
    }
    
    // Проверка телефона (простая проверка)
    const phoneRegex = /^\+7\d{10}$/;
    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    if (!phoneRegex.test(cleanPhone) && phone.length < 10) {
        showNotification('Введите корректный телефон в формате +7XXXXXXXXXX');
        return { valid: false };
    }
    
    return {
        valid: true,
        full_name: name,
        email: email,
        phone: phone,
        delivery_address: address,
        delivery_type: deliveryType,
        delivery_time: deliveryTime,
        subscribe: subscribe,
        comment: comment
    };
}// Запускаем инициализацию при загрузке DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('order-validation.js: DOM загружен');
    
    // Даем время на загрузку других скриптов
    setTimeout(initOrderValidation, 1000);
});

// Экспортируем для использования в других файлах
window.validateOrder = validateOrder;
window.showNotification = showNotification;