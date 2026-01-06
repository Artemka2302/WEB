// display-dishes.js

// Функция для создания карточки блюда
function createDishCard(dish) {
    return `
        <div class="dish-card" data-dish="${dish.keyword}" data-kind="${dish.kind}">
            <img src="${dish.image}" alt="${dish.name}">
            <p>${dish.price} руб.</p>
            <p>${dish.name}</p>
            <p>${dish.count}</p>
            <button>Добавить</button>
        </div>
    `;
}

// Функция для отображения блюд по категориям
function displayDishesByCategory(filterKind = 'all', category = null) {
    // Используем window.dishes вместо просто dishes
    if (!window.dishes || window.dishes.length === 0) {
        console.warn('Нет данных о блюдах');
        return;
    }
    
    // Определяем все секции
    const sections = [
        { category: 'soup', element: document.querySelector('section:nth-child(2) .dishes-grid') },
        { category: 'main_course', element: document.querySelector('section:nth-child(3) .dishes-grid') },
        { category: 'salad', element: document.querySelector('section:nth-child(4) .dishes-grid') },
        { category: 'beverage', element: document.querySelector('section:nth-child(5) .dishes-grid') },
        { category: 'dessert', element: document.querySelector('section:nth-child(6) .dishes-grid') }
    ];
    
    // Если передана конкретная категория, обновляем только её
    if (category) {
        const section = sections.find(s => s.category === category);
        if (section && section.element) {
            const filteredDishes = filterKind === 'all' 
                ? window.dishes.filter(dish => dish.category === category)
                : window.dishes.filter(dish => dish.category === category && dish.kind === filterKind);
            
            section.element.innerHTML = filteredDishes.map(dish => createDishCard(dish)).join('');
        }
        return;
    }
    
    // Иначе обновляем все категории
    sections.forEach(section => {
        if (section.element) {
            const filteredDishes = window.dishes.filter(dish => dish.category === section.category);
            section.element.innerHTML = filteredDishes.map(dish => createDishCard(dish)).join('');
        }
    });
}

// Экспортируем
window.displayDishesByCategory = displayDishesByCategory;