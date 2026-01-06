// load-dishes.js - УБИРАЕМ КОНФЛИКТУЮЩИЕ ОБЪЯВЛЕНИЯ

// УДАЛИТЬ ЭТУ СТРОКУ: const API_URL = "https://edu.std-900.ist.mospolytech.ru/labs/api/dishes";
// ВМЕСТО НЕЕ:
const DISHES_API_URL = "https://edu.std-900.ist.mospolytech.ru/labs/api/dishes";
const API_KEY = "32342745-3e72-4fcc-8f7a-a5a0c1703144";

// УДАЛИТЬ: let dishes = []; (если есть)
// ВМЕСТО: объявляем dishes как свойство window
window.dishes = window.dishes || [];

async function loadDishes() {
    try {
        console.log('Загружаем блюда с API...');
        
        const response = await fetch(`${DISHES_API_URL}?api_key=${API_KEY}`);
        
        if (!response.ok) {
            throw new Error(`Ошибка сервера: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('✅ Получено блюд с API:', data.length);
        
        // НОРМАЛИЗУЕМ ДАННЫЕ
        window.dishes = data.map(dish => {
            let category = dish.category;
            if (category === 'main-course') category = 'main_course';
            if (category === 'drink') category = 'beverage';
            
            return {
                id: dish.id,
                keyword: dish.keyword,
                name: dish.name,
                price: dish.price,
                category: category,
                kind: dish.kind,
                count: dish.count,
                image: dish.image
            };
        });
        
        console.log('✅ Нормализованные блюда:', window.dishes.length);
        return true;
        
    } catch (error) {
        console.error('❌ Не удалось загрузить данные:', error);
        return false;
    }
}

async function initDishes() {
    const success = await loadDishes();
    
    if (success && typeof displayDishesByCategory === 'function') {
        displayDishesByCategory();
        
        if (typeof initFilters === 'function') {
            setTimeout(initFilters, 100);
        }
    }
}

// Экспортируем
window.loadDishes = loadDishes;
window.initDishes = initDishes;