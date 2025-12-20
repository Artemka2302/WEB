// dishes-data.js
// Пустой массив - он будет заполнен при загрузке с API
const dishes = [];

// Функция для поиска блюда по keyword (оставляем для совместимости)
function findDishByKeyword(keyword) {
    return dishes.find(dish => dish.keyword === keyword);
}