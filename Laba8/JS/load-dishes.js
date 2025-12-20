// load-dishes.js - ВЕРСИЯ С НОРМАЛИЗАЦИЕЙ
const API_URL = "https://edu.std-900.ist.mospolytech.ru/labs/api/dishes";
const API_KEY = "32342745-3e72-4fcc-8f7a-a5a0c1703144";

let dishes = [];

async function loadDishes() {
    try {
        console.log('Загружаем блюда с API...');
        const response = await fetch(`${API_URL}?key=${API_KEY}`);
        
        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Получено блюд:', data.length);
        
        // НОРМАЛИЗУЕМ ДАННЫЕ ПОД НАШ ФОРМАТ
        dishes = data.map(dish => {
            // Приводим категории к нашему формату
            let category = dish.category;
            if (category === 'main-course') category = 'main_course';
            if (category === 'drink') category = 'beverage';
            
            return {
                keyword: dish.keyword,
                name: dish.name,
                price: dish.price,
                category: category, // Используем нормализованную категорию
                kind: dish.kind,
                count: dish.count,
                image: dish.image
            };
        });
        
        // Логируем результат
        console.log('Нормализованные категории:', [...new Set(dishes.map(d => d.category))]);
        
        return true;
        
    } catch (error) {
        console.error('Не удалось загрузить данные:', error);
        alert('Не удалось загрузить меню. Пожалуйста, перезагрузите страницу.');
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
// load-dishes.js - добавьте логирование
async function loadDishes() {
    try {
        console.log('Загружаем блюда с API...');
        const response = await fetch(`${API_URL}?key=${API_KEY}`);
        
        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Получено блюд с API:', data.length);
        console.log('Первое блюдо:', data[0]);
        
        // НОРМАЛИЗУЕМ ДАННЫЕ ПОД НАШ ФОРМАТ
        dishes = data.map(dish => {
            // Приводим категории к нашему формату
            let category = dish.category;
            if (category === 'main-course') category = 'main_course';
            if (category === 'drink') category = 'beverage';
            
            return {
                keyword: dish.keyword,
                name: dish.name,
                price: dish.price,
                category: category, // Используем нормализованную категорию
                kind: dish.kind,
                count: dish.count,
                image: dish.image
            };
        });
        
        // Логируем результат
        console.log('Всего нормализованных блюд:', dishes.length);
        console.log('Пример блюда:', dishes[0]);
        console.log('Уникальные категории:', [...new Set(dishes.map(d => d.category))]);
        
        return true;
        
    } catch (error) {
        console.error('Не удалось загрузить данные:', error);
        alert('Не удалось загрузить меню. Пожалуйста, перезагрузите страницу.');
        return false;
    }
}