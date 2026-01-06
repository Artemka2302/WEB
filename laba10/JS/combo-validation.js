// combo-validation.js - ЕДИНАЯ ФУНКЦИЯ ПРОВЕРКИ КОМБО

// Единая функция проверки комбо-ланча
function validateLunchCombo(selectedDishes) {
    console.log('Проверка комбо-ланча...');
    
    // Проверяем, выбрано ли хоть одно блюдо
    const hasAnyDish = Object.values(selectedDishes).some(dish => dish !== null);
    
    if (!hasAnyDish) {
        console.log('Нет выбранных блюд');
        return { valid: false, message: "Ничего не выбрано. Выберите блюда для заказа" };
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
        soup: selectedDishes.soup !== null,
        main: selectedDishes.main_course !== null,
        salad: selectedDishes.salad !== null,
        beverage: selectedDishes.beverage !== null
    };
    
    console.log('Пользователь выбрал структуру:', userSelection);
    
    // Проверяем, соответствует ли выбор одному из вариантов
    const isValidVariant = lunchVariants.some(variant => {
        const match = variant.soup === userSelection.soup &&
                      variant.main === userSelection.main &&
                      variant.salad === userSelection.salad &&
                      variant.beverage === userSelection.beverage;
        
        if (match) {
            console.log('Найдено соответствие с вариантом:', variant);
        }
        return match;
    });
    
    if (isValidVariant) {
        console.log('✅ Комбо валидно');
        return { valid: true, message: "" };
    }
    
    console.log('❌ Комбо невалидно');
    
    // Определяем что не так
    const { soup, main, salad, beverage } = userSelection;
    let message = "";
    
    if (!beverage) {
        message = "Выберите напиток";
    } else if (soup && !main && !salad) {
        message = "Выберите главное блюдо/салат/стартер";
    } else if (salad && !soup && !main) {
        message = "Выберите суп или главное блюдо";
    } else if (beverage && !main && !soup && !salad) {
        message = "Выберите главное блюдо";
    } else {
        if (soup && main && !beverage) {
            message = "Выберите напиток";
        } else if (soup && salad && !beverage) {
            message = "Выберите напиток";
        } else if (main && salad && !beverage) {
            message = "Выберите напиток";
        } else if (main && !beverage) {
            message = "Выберите напиток";
        } else {
            message = "Выбранные блюда не соответствуют ни одному из вариантов ланча";
        }
    }
    
    return { valid: false, message: message };
}

// Экспортируем функцию
window.validateLunchCombo = validateLunchCombo;