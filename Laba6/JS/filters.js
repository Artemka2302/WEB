// Функция для инициализации фильтров
function initFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // Делаем кнопку "Все" активной по умолчанию для каждой категории
    document.querySelectorAll('.filters').forEach(filterGroup => {
        const allBtn = filterGroup.querySelector('[data-kind="all"]');
        if (allBtn) {
            allBtn.classList.add('active');
        }
    });
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            const kind = this.getAttribute('data-kind');
            
            // Снимаем активный класс со всех кнопок этой категории
            const allButtonsInGroup = this.parentElement.querySelectorAll('.filter-btn');
            allButtonsInGroup.forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Если кликнули на уже активную кнопку "Все" - ничего не делаем
            if (this.classList.contains('active') && kind === 'all') {
                this.classList.add('active');
                return;
            }
            
            // Если кликнули на уже активную кнопку фильтра - показываем все блюда
            if (this.classList.contains('active')) {
                // Активируем кнопку "Все"
                const allBtn = this.parentElement.querySelector('[data-kind="all"]');
                if (allBtn) {
                    allBtn.classList.add('active');
                }
                displayDishesByCategory('all', category);
                return;
            }
            
            // Иначе активируем выбранный фильтр
            this.classList.add('active');
            displayDishesByCategory(kind, category);
        });
    });
}

// Запускаем инициализацию фильтров когда DOM загружен
document.addEventListener('DOMContentLoaded', function() {
    // Даем немного времени на отрисовку блюд
    setTimeout(initFilters, 100);
});