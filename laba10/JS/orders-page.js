// orders-page.js - РАБОЧАЯ ВЕРСИЯ

let currentOrders = [];

// Инициализация страницы
async function initOrdersPage() {
    console.log('Инициализация страницы заказов...');
    
    // Ждем загрузки блюд (если нужно)
    if (typeof dishes === 'undefined' || dishes.length === 0) {
        console.log('Ждем загрузки блюд...');
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Загружаем заказы
    currentOrders = await loadOrders();
    
    // Отображаем заказы
    displayOrders(currentOrders);
    
    // Инициализируем обработчики модальных окон
    initModalHandlers();
}

// Отображение заказов в таблице
async function displayOrders(orders) {
    const tbody = document.getElementById('orders-list');
    
    if (!tbody) {
        console.error('Элемент #orders-list не найден');
        return;
    }
    
    if (!orders || orders.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-message">
                    <p>У вас пока нет заказов.</p>
                    <p>Для просмотра истории заказов нужно сначала создать заказ:</p>
                    <p><a href="lunch.html" class="back-to-lunch-btn">Создать заказ →</a></p>
                </td>
            </tr>
        `;
        return;
    }
    
    let html = '';
    
    for (let i = 0; i < orders.length; i++) {
        const order = orders[i];
        
        try {
            const composition = await getOrderComposition(order);
            // РАССЧИТЫВАЕМ СТОИМОСТЬ ИЗ СОСТАВА ЗАКАЗА
            let calculatedTotal = 0;
            if (composition && composition.length > 0) {
                calculatedTotal = composition.reduce((sum, dish) => {
                    return sum + (Number(dish.price) || 0);
                }, 0);
            }
            const totalPrice = calculatedTotal > 0 ? calculatedTotal : (order.total_price || '0');
            const deliveryTime = formatDeliveryTime(order);
           
            
            html += `
                <tr data-order-id="${order.id}">
                    <td>${i + 1}</td>
                    <td>${formatDate(order.created_at)}</td>
                    <td>${composition.join(', ') || 'Состав не указан'}</td>
                    <td>${totalPrice} руб.</td>
                    <td>${deliveryTime}</td>
                    <td>
                        <div class="actions-buttons">
                            <button class="action-btn view-btn" data-order-id="${order.id}" title="Подробнее">
                                <i class="bi bi-eye"></i>
                            </button>
                            <button class="action-btn edit-btn" data-order-id="${order.id}" title="Редактировать">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button class="action-btn delete-btn" data-order-id="${order.id}" title="Удалить">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        } catch (error) {
            console.error('Ошибка при отображении заказа', order.id, error);
        }
    }
    
    tbody.innerHTML = html;
    
    // Добавляем обработчики для кнопок действий
    addOrderActionHandlers();
}

// Форматирование даты
function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        console.error('Ошибка форматирования даты:', dateString, error);
        return dateString;
    }
}

// Форматирование времени доставки
function formatDeliveryTime(order) {
    if (!order) return '-';
    
    if (order.delivery_type === 'now') {
        return 'Как можно скорее<br><small>(с 7:00 до 23:00)</small>';
    } else if (order.delivery_type === 'by_time' && order.delivery_time) {
        return order.delivery_time;
    }
    return '-';
}

// Инициализация обработчиков модальных окон
function initModalHandlers() {
    // Закрытие модальных окон по кнопке X
    document.querySelectorAll('.close-modal-btn').forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });
    
    // Закрытие модальных окон по клику вне окна
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeAllModals();
            }
        });
    });
    
    // Кнопка "Ок" в окне просмотра
    const okBtn = document.querySelector('.ok-btn');
    if (okBtn) {
        okBtn.addEventListener('click', closeAllModals);
    }
    
    // Кнопка "Отмена" в окнах редактирования и удаления
    document.querySelectorAll('.cancel-btn').forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });
    
    // Обработчик изменения типа доставки при редактировании
    document.querySelectorAll('input[name="delivery_type"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const timeGroup = document.getElementById('edit-time-group');
            if (this.value === 'by_time') {
                timeGroup.style.display = 'block';
            } else {
                timeGroup.style.display = 'none';
                const timeInput = document.getElementById('edit-delivery-time-input');
                if (timeInput) timeInput.value = '';
            }
        });
    });
    
    // Сохранение изменений
    const saveBtn = document.getElementById('save-edit-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveOrderChanges);
    }
    
    // Удаление заказа
    const deleteBtn = document.getElementById('confirm-delete-btn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', confirmDeleteOrder);
    }
}

// Добавление обработчиков для кнопок действий в таблице
function addOrderActionHandlers() {
    // Просмотр деталей заказа
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', async function() {
            const orderId = this.getAttribute('data-order-id');
            await showOrderDetails(orderId);
        });
    });
    
    // Редактирование заказа
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const orderId = this.getAttribute('data-order-id');
            showEditOrderForm(orderId);
        });
    });
    
    // Удаление заказа
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const orderId = this.getAttribute('data-order-id');
            showDeleteConfirmation(orderId);
        });
    });
}

// Закрыть все модальные окна
function closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.classList.add('hidden');
    });
}

// Показать детали заказа
async function showOrderDetails(orderId) {
    const order = currentOrders.find(o => o.id == orderId);
    if (!order) {
        return;
    }
    
    const composition = await getOrderComposition(order);
    let calculatedTotal = 0;
    if (composition && composition.length > 0) {
        calculatedTotal = composition.reduce((sum, dish) => {
            return sum + (Number(dish.price) || 0);
        }, 0);
    }
    const totalPrice = calculatedTotal > 0 ? calculatedTotal : (order.total_price || '0');
    const deliveryTime = order.delivery_type === 'by_time' && order.delivery_time 
        ? order.delivery_time 
        : 'Как можно скорее (с 7:00 до 23:00)';
    
    const content = document.getElementById('order-details-content');
    content.innerHTML = `
        <div class="order-info">
            <p><strong>Номер заказа:</strong> #${order.id}</p>
            <p><strong>Дата оформления:</strong> ${formatDate(order.created_at)}</p>
            <p><strong>Имя:</strong> ${order.full_name}</p>
            <p><strong>Email:</strong> ${order.email}</p>
            <p><strong>Телефон:</strong> ${order.phone}</p>
            <p><strong>Адрес доставки:</strong> ${order.delivery_address}</p>
            <p><strong>Тип доставки:</strong> ${order.delivery_type === 'now' ? 'Как можно скорее' : 'Ко времени'}</p>
            <p><strong>Время доставки:</strong> ${deliveryTime}</p>
            <p><strong>Подписка на рассылку:</strong> ${order.subscribe ? 'Да' : 'Нет'}</p>
            
            <div class="order-items">
                <h4>Состав заказа:</h4>
                ${getOrderItemsList(composition, order)}
            </div>
            
            <p><strong>Стоимость:</strong> ${totalPrice || '0'} руб.</p>
            
            ${order.comment ? `<p><strong>Комментарий:</strong> ${order.comment}</p>` : ''}
            
            <p><strong>Дата обновления:</strong> ${formatDate(order.updated_at)}</p>
        </div>
    `;
    
    document.getElementById('order-details-modal').classList.remove('hidden');
}

// Функция для форматирования состава заказа
function getOrderItemsList(composition, order) {
    if (!composition || composition.length === 0) {
        return '<p>Состав не указан</p>';
    }
    
    // Создаем массив для хранения всех элементов
    const items = [];
    
    // Функция для поиска блюда по ID в составе
    const findDishById = (dishId) => {
        return composition.find(dish => dish.id === dishId);
    };
    
    // Проверяем каждую категорию
    const categories = [
        { id: 'soup_id', name: 'Суп', key: 'soup' },
        { id: 'main_course_id', name: 'Главное блюдо', key: 'main_course' },
        { id: 'salad_id', name: 'Салат/Стартер', key: 'salad' },
        { id: 'drink_id', name: 'Напиток', key: 'beverage' },
        { id: 'dessert_id', name: 'Десерт', key: 'dessert' }
    ];
    
    categories.forEach(category => {
        const dishId = order[category.id];
        if (dishId) {
            const dish = findDishById(dishId);
            if (dish) {
                items.push(`
                    <div class="order-item">
                        <strong>${category.name}:</strong> 
                        ${dish.name} (${dish.price} руб.)
                    </div>
                `);
            }
        }
    });
    
    return items.length > 0 ? items.join('') : '<p>Блюда не найдены</p>';
}
// Показать форму редактирования заказа
function showEditOrderForm(orderId) {
    const order = currentOrders.find(o => o.id == orderId);
    if (!order) {
        return;
    }
    
    document.getElementById('edit-order-id').value = order.id;
    document.getElementById('edit-full-name').value = order.full_name;
    document.getElementById('edit-email').value = order.email;
    document.getElementById('edit-phone').value = order.phone;
    document.getElementById('edit-address').value = order.delivery_address;
    
    // Тип доставки
    if (order.delivery_type === 'now') {
        document.getElementById('edit-delivery-now').checked = true;
        document.getElementById('edit-time-group').style.display = 'none';
    } else {
        document.getElementById('edit-delivery-time').checked = true;
        document.getElementById('edit-time-group').style.display = 'block';
    }
    
    const timeInput = document.getElementById('edit-delivery-time-input');
    if (timeInput) {
        timeInput.value = order.delivery_time || '';
    }
    
    document.getElementById('edit-comment').value = order.comment || '';
    
    document.getElementById('edit-order-modal').classList.remove('hidden');
}

// Сохранить изменения заказа
async function saveOrderChanges() {
    const orderId = document.getElementById('edit-order-id').value;
    
    const nameInput = document.getElementById('edit-full-name');
    const emailInput = document.getElementById('edit-email');
    const phoneInput = document.getElementById('edit-phone');
    const addressInput = document.getElementById('edit-address');
    const deliveryTypeInput = document.querySelector('input[name="delivery_type"]:checked');
    
    // Проверка обязательных полей
    if (!nameInput.value || !emailInput.value || !phoneInput.value || !addressInput.value || !deliveryTypeInput) {
        return;
    }
    
    const orderData = {
        full_name: nameInput.value,
        email: emailInput.value,
        phone: phoneInput.value,
        delivery_address: addressInput.value,
        delivery_type: deliveryTypeInput.value,
        comment: document.getElementById('edit-comment').value || ''
    };
    
    // Добавляем время доставки, если выбран тип "ко времени"
    if (orderData.delivery_type === 'by_time') {
        const timeInput = document.getElementById('edit-delivery-time-input');
        if (timeInput && timeInput.value) {
            orderData.delivery_time = timeInput.value;
        }
    }
    
    try {
        const updatedOrder = await updateOrder(orderId, orderData);
        
        // Обновляем заказ в локальном массиве
        const index = currentOrders.findIndex(o => o.id == orderId);
        if (index !== -1) {
            currentOrders[index] = { ...currentOrders[index], ...updatedOrder };
        }
        
        // Обновляем таблицу
        await displayOrders(currentOrders);
        
        // Закрываем модальное окно
        closeAllModals();
        
    } catch (error) {
        console.error('Ошибка при сохранении:', error);
    }
}

// Показать подтверждение удаления
function showDeleteConfirmation(orderId) {
    document.getElementById('delete-order-id').value = orderId;
    document.getElementById('delete-order-modal').classList.remove('hidden');
}

// Подтвердить удаление заказа
async function confirmDeleteOrder() {
    const orderId = document.getElementById('delete-order-id').value;
    
    try {
        await deleteOrder(orderId);
        
        // Удаляем заказ из локального массива
        currentOrders = currentOrders.filter(o => o.id != orderId);
        
        // Обновляем таблицу
        await displayOrders(currentOrders);
        
        // Закрываем модальное окно
        closeAllModals();
        
    } catch (error) {
        console.error('Ошибка при удалении:', error);
    }
}

// Запуск при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('Orders page loaded');
    setTimeout(initOrdersPage, 100);
});