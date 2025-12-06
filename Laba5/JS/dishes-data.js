const dishes = [
    // Супы (6 блюд)
    {
        keyword: "norwegian_soup",
        name: "Норвежский суп",
        price: 250,
        category: "soup",
        kind: "fish",
        count: "350 мл",
        image: "pictures/soups/norwegian_soup"
    },
    {
        keyword: "salmon_soup",
        name: "Суп с лососем",
        price: 300,
        category: "soup",
        kind: "fish",
        count: "350 мл",
        image: "pictures/soups/СупСЛососем"
    },
    {
        keyword: "beef_borscht",
        name: "Борщ с говядиной",
        price: 280,
        category: "soup",
        kind: "meat",
        count: "400 мл",
        image: "pictures/БорщьСГовядиной"
    },
    {
        keyword: "chicken_noodle_soup",
        name: "Куриный суп с лапшой",
        price: 240,
        category: "soup",
        kind: "meat",
        count: "350 мл",
        image: "pictures/КуриныйСупСЛапшой"
    },
    {
        keyword: "mushroom_soup",
        name: "Грибной суп-пюре",
        price: 280,
        category: "soup",
        kind: "veg",
        count: "350 мл",
        image: "pictures/soups/mushroom_soup"
    },
    {
        keyword: "gazpacho",
        name: "Гаспачо",
        price: 220,
        category: "soup",
        kind: "veg",
        count: "400 мл",
        image: "pictures/soups/gazpacho"
    },
    
    // Главные блюда (6 блюд)
    {
        keyword: "chicken_cutlets_mashed_potatoes",
        name: "Котлеты из курицы с картофельным пюре",
        price: 420,
        category: "main_course",
        kind: "meat",
        count: "350 г",
        image: "pictures/main_course/chickencutletsandmashedpotatoes"
    },
    {
        keyword: "beef_stroganoff",
        name: "Бефстроганов с картофелем",
        price: 580,
        category: "main_course",
        kind: "meat",
        count: "320 г",
        image: "pictures/БефстрогановСкартошкой"
    },
    {
        keyword: "fried_potatoes_mushrooms",
        name: "Жареная картошка с грибами",
        price: 580,
        category: "main_course",
        kind: "veg",
        count: "300 г",
        image: "pictures/main_course/friedpotatoeswithmushrooms1"
    },
    {
        keyword: "vegetable_stew",
        name: "Овощное рагу",
        price: 450,
        category: "main_course",
        kind: "veg",
        count: "320 г",
        image: "pictures/ОвощноеРагу"
    },
    {
        keyword: "grilled_salmon",
        name: "Лосось на гриле с овощами",
        price: 650,
        category: "main_course",
        kind: "fish",
        count: "280 г",
        image: "pictures/ЛососьНаГрилеСовощами"
    },
    {
        keyword: "fish_cutlets",
        name: "Рыбные котлеты с рисом",
        price: 520,
        category: "main_course",
        kind: "fish",
        count: "300 г",
        image: "pictures/РыбныеКотлетыСрисом"
    },
    
    // Салаты и стартеры (6 блюд)
    {
        keyword: "caesar_salad",
        name: "Салат Цезарь с курицей",
        price: 350,
        category: "salad",
        kind: "meat",
        count: "250 г",
        image: "pictures/ЦезарьСкурицей2"
    },
    {
        keyword: "herring_salad",
        name: "Салат с сельдью",
        price: 320,
        category: "salad",
        kind: "fish",
        count: "200 г",
        image: "pictures/СалатСселедью"
    },
    {
        keyword: "greek_salad",
        name: "Греческий салат",
        price: 280,
        category: "salad",
        kind: "veg",
        count: "300 г",
        image: "pictures/ГреческийСалат"
    },
    {
        keyword: "vegetable_salad",
        name: "Овощной салат",
        price: 240,
        category: "salad",
        kind: "veg",
        count: "280 г",
        image: "pictures/ОвощнойСалат"
    },
    {
        keyword: "caprese_salad",
        name: "Салат Капрезе",
        price: 320,
        category: "salad",
        kind: "veg",
        count: "220 г",
        image: "pictures/Салаткапрезе"
    },
    {
        keyword: "olivier_salad",
        name: "Салат Оливье",
        price: 290,
        category: "salad",
        kind: "veg",
        count: "260 г",
        image: "pictures/СалатОливье"
    },
    
    // Напитки (6 блюд)
    {
        keyword: "orange_juice",
        name: "Апельсиновый сок",
        price: 150,
        category: "beverage",
        kind: "cold",
        count: "330 мл",
        image: "pictures/beverages/orangejuice"
    },
    {
        keyword: "apple_juice",
        name: "Яблочный сок",
        price: 180,
        category: "beverage",
        kind: "cold",
        count: "300 мл",
        image: "pictures/beverages/applejuice"
    },
    {
        keyword: "cola",
        name: "Кола",
        price: 120,
        category: "beverage",
        kind: "cold",
        count: "330 мл",
        image: "pictures/Кола2"
    },
    {
        keyword: "coffee",
        name: "Кофе",
        price: 200,
        category: "beverage",
        kind: "hot",
        count: "250 мл",
        image: "pictures/кофе"
    },
    {
        keyword: "tea",
        name: "Чай",
        price: 150,
        category: "beverage",
        kind: "hot",
        count: "300 мл",
        image: "pictures/Чай"
    },
    {
        keyword: "cocoa",
        name: "Какао",
        price: 180,
        category: "beverage",
        kind: "hot",
        count: "300 мл",
        image: "pictures/Какао"
    },
    
    // Десерты (6 блюд)
    {
        keyword: "chocolate_cake",
        name: "Шоколадный торт",
        price: 280,
        category: "dessert",
        kind: "large",
        count: "150 г",
        image: "pictures/ШоколадныйТорт"
    },
    {
        keyword: "cheesecake",
        name: "Чизкейк",
        price: 250,
        category: "dessert",
        kind: "medium",
        count: "120 г",
        image: "pictures/Чизкейк"
    },
    {
        keyword: "tiramisu",
        name: "Тирамису",
        price: 230,
        category: "dessert",
        kind: "medium",
        count: "110 г",
        image: "pictures/тирамису"
    },
    {
        keyword: "apple_pie",
        name: "Яблочный пирог",
        price: 180,
        category: "dessert",
        kind: "small",
        count: "100 г",
        image: "pictures/ЯблочныйПирог"
    },
    {
        keyword: "ice_cream",
        name: "Мороженое",
        price: 150,
        category: "dessert",
        kind: "small",
        count: "90 г",
        image: "pictures/Мороженное"
    },
    {
        keyword: "chocolate_mousse",
        name: "Шоколадный мусс",
        price: 200,
        category: "dessert",
        kind: "small",
        count: "80 г",
        image: "pictures/ШоколадныйМус"
    }
];