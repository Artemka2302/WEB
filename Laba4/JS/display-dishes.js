// Функция для создания карточки блюда
function createDishCard(dish) {
    return `
        <div class="dish-card" data-dish="${dish.keyword}">
            <img src="${dish.image}.jpg" alt="${dish.name}">
            <p>${dish.price} руб.</p>
            <p>${dish.name}</p>
            <p>${dish.count}</p>
            <button>Добавить</button>
        </div>
    `;
}

// Функция для отображения блюд по категориям
function displayDishesByCategory() {
    // Группируем блюда по категориям
    const dishesByCategory = {
        soup: dishes.filter(dish => dish.category === 'soup').sort((a, b) => a.name.localeCompare(b.name)),
        main_course: dishes.filter(dish => dish.category === 'main_course').sort((a, b) => a.name.localeCompare(b.name)),
        beverage: dishes.filter(dish => dish.category === 'beverage').sort((a, b) => a.name.localeCompare(b.name))
    };

    // Отображаем супы
    const soupsSection = document.querySelector('section:nth-child(1) .dishes-grid');
    if (soupsSection) {
        soupsSection.innerHTML = dishesByCategory.soup.map(dish => createDishCard(dish)).join('');
    }

    // Отображаем главные блюда
    const mainCourseSection = document.querySelector('section:nth-child(2) .dishes-grid');
    if (mainCourseSection) {
        mainCourseSection.innerHTML = dishesByCategory.main_course.map(dish => createDishCard(dish)).join('');
    }

    // Отображаем напитки
    const beveragesSection = document.querySelector('section:nth-child(3) .dishes-grid');
    if (beveragesSection) {
        beveragesSection.innerHTML = dishesByCategory.beverage.map(dish => createDishCard(dish)).join('');
    }
}

// Запускаем отображение когда DOM загружен
document.addEventListener('DOMContentLoaded', function() {
    displayDishesByCategory();
    console.log('Блюда успешно отображены!');
});