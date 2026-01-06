// orders-api.js - ИСПРАВЛЯЕМ ДУБЛИРОВАНИЕ

// ВАЖНО: Проверьте, что этих констант нет в других файлах
const ORDERS_API_URL = "https://edu.std-900.ist.mospolytech.ru/labs/api/orders";
// УДАЛИТЬ: const DISHES_API_URL = "..."; - она уже в load-dishes.js
const API_KEY_ORDERS = "32342745-3e72-4fcc-8f7a-a5a0c1703144"; // Переименуем

// Загрузить все заказы
async function loadOrders() {
    try {
        console.log('Загружаем историю заказов...');
        
        const response = await fetch(`${ORDERS_API_URL}?api_key=${API_KEY_ORDERS}`, {
            headers: {
                'Accept': 'application/json'
            }
        });
        
        console.log('API Response Status:', response.status, response.statusText);
        
        if (response.status === 401 || response.status === 404) {
            console.log('Нет заказов или ошибка авторизации');
            return [];
        }
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Ошибка сервера: ${response.status} - ${errorText}`);
        }
        
        const orders = await response.json();
        console.log('✅ Получено заказов:', orders ? orders.length : 0);
        
        // Сортируем по дате (новые сначала)
        if (orders && orders.length > 0) {
            orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            return orders;
        }
        
        return [];
        
    } catch (error) {
        console.error('❌ Не удалось загрузить заказов:', error);
        showNotification(`Ошибка загрузки заказов: ${error.message}`, 'error');
        return [];
    }
}

// Получить информацию о блюде по ID
async function getDishInfo(dishId) {
    if (!dishId) return null;
    
    try {
        // Используем глобальную переменную DISHES_API_URL из load-dishes.js
        const API_KEY = "32342745-3e72-4fcc-8f7a-a5a0c1703144";
        const response = await fetch(`https://edu.std-900.ist.mospolytech.ru/labs/api/dishes/${dishId}?api_key=${API_KEY}`, {
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            console.warn(`Блюдо ${dishId} не найдено: ${response.status}`);
            return null;
        }
        
        return await response.json();
    } catch (error) {
        console.warn(`Ошибка при получении блюда ${dishId}:`, error);
        return null;
    }
}

// Получить состав заказа
async function getOrderComposition(order) {
    try {
        const dishIds = [
            order.soup_id,
            order.main_course_id,
            order.salad_id,
            order.drink_id,
            order.dessert_id
        ].filter(id => id !== null && id !== undefined);
        
        const dishPromises = dishIds.map(id => getDishInfo(id));
        const dishes = await Promise.all(dishPromises);
        
        return dishes.filter(dish => dish !== null);
    } catch (error) {
        console.error('Ошибка при получении состава заказа:', error);
        return ['Информация о блюдах временно недоступна'];
    }
}

// Обновить заказ
async function updateOrder(orderId, orderData) {
    try {
        console.log('Обновляем заказ:', orderId, orderData);
        
        const response = await fetch(`${ORDERS_API_URL}/${orderId}?api_key=${API_KEY_ORDERS}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(orderData)
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `Ошибка: ${response.status}`);
        }
        
        const updatedOrder = await response.json();
        console.log('✅ Заказ обновлен');
        
        showNotification('Заказ успешно изменён', 'success');
        return updatedOrder;
        
    } catch (error) {
        console.error('Ошибка при обновлении заказа:', error);
        showNotification(`Ошибка: ${error.message}`, 'error');
        throw error;
    }
}

// Удалить заказ
async function deleteOrder(orderId) {
    try {
        console.log('Удаляем заказ:', orderId);
        
        const response = await fetch(`${ORDERS_API_URL}/${orderId}?api_key=${API_KEY_ORDERS}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
            }
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `Ошибка: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('✅ Заказ удален');
        
        showNotification('Заказ успешно удалён', 'success');
        return result;
        
    } catch (error) {
        console.error('Ошибка при удалении заказа:', error);
        showNotification(`Ошибка: ${error.message}`, 'error');
        throw error;
    }
}

// Показать уведомление
function showNotification(message, type = 'info') {
    // Код функции остается таким же
    // ...
}

// Экспортируем функции - ВАЖНО!
window.loadOrders = loadOrders;
window.getOrderComposition = getOrderComposition;
window.updateOrder = updateOrder;
window.deleteOrder = deleteOrder;
window.showNotification = showNotification;