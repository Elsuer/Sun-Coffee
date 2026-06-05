const PRODUCTS = [
  // Классическое кофе
  { id: "espresso-30", name: "Эспрессо 30 мл", category: "coffee", price: 590, icon: "☕", desc: "Классическое кофе · 590 ₸" },
  { id: "espresso-60", name: "Эспрессо 60 мл", category: "coffee", price: 590, icon: "☕", desc: "Классическое кофе · 590 ₸" },
  { id: "americano-250", name: "Американо 250 мл", category: "coffee", price: 800, icon: "☕", desc: "Классическое кофе · 800 ₸" },
  { id: "americano-360", name: "Американо 360 мл", category: "coffee", price: 900, icon: "☕", desc: "Классическое кофе · 900 ₸" },
  { id: "americano-480", name: "Американо 480 мл", category: "coffee", price: 990, icon: "☕", desc: "Классическое кофе · 990 ₸" },
  { id: "cappuccino-250", name: "Капучино 250 мл", category: "coffee", price: 890, icon: "☕", desc: "Классическое кофе · 890 ₸" },
  { id: "cappuccino-360", name: "Капучино 360 мл", category: "coffee", price: 990, icon: "☕", desc: "Классическое кофе · 990 ₸" },
  { id: "cappuccino-480", name: "Капучино 480 мл", category: "coffee", price: 1090, icon: "☕", desc: "Классическое кофе · 1090 ₸" },
  { id: "latte-360", name: "Латте 360 мл", category: "coffee", price: 990, icon: "☕", desc: "Классическое кофе · 990 ₸" },
  { id: "latte-480", name: "Латте 480 мл", category: "coffee", price: 1090, icon: "☕", desc: "Классическое кофе · 1090 ₸" },
  { id: "raf-360", name: "Раф 360 мл", category: "coffee", price: 1090, icon: "☕", desc: "Классическое кофе · 1090 ₸" },
  { id: "raf-480", name: "Раф 480 мл", category: "coffee", price: 1190, icon: "☕", desc: "Классическое кофе · 1190 ₸" },
  { id: "mochaccino-360", name: "Мокачино 360 мл", category: "coffee", price: 1090, icon: "☕", desc: "Классическое кофе · 1090 ₸" },
  { id: "mochaccino-480", name: "Мокачино 480 мл", category: "coffee", price: 1190, icon: "☕", desc: "Классическое кофе · 1190 ₸" },
  { id: "flat-white-250", name: "Флэт уайт 250 мл", category: "coffee", price: 990, icon: "☕", desc: "Классическое кофе · 990 ₸" },

  // Летнее меню — матча и освежающие (1390 ₸)
  { id: "green-matcha-mango", name: "Зелёная матча с пюре манго", category: "summer", price: 1390, icon: "🍵", desc: "Летнее меню · 1390 ₸" },
  { id: "blue-matcha-strawberry", name: "Голубая матча с клубникой", category: "summer", price: 1390, icon: "🍵", desc: "Летнее меню · 1390 ₸" },
  { id: "espresso-tonic", name: "Эспрессо тоник", category: "summer", price: 1390, icon: "🧊", desc: "Летнее меню · 1390 ₸" },
  { id: "pomegranate-bumble", name: "Гранатовый бамбл", category: "summer", price: 1390, icon: "🧊", desc: "Летнее меню · 1390 ₸" },

  // Фраппе (1490 ₸)
  { id: "chocolate-frappe", name: "Шоколадный фраппе", category: "frappe", price: 1490, icon: "🥤", desc: "Фраппе · 1490 ₸" },
  { id: "salted-caramel-frappe", name: "Фраппе солёная карамель", category: "frappe", price: 1490, icon: "🥤", desc: "Фраппе · 1490 ₸" },
  { id: "peanut-frappe", name: "Фраппе арахисовый", category: "frappe", price: 1490, icon: "🥤", desc: "Фраппе · 1490 ₸" },

  // Милкшейки 450 мл (1290 ₸)
  { id: "milkshake-honey-melon", name: "Милкшейк «Медовая дыня»", category: "milkshake", price: 1290, icon: "🥤", desc: "450 мл · 1290 ₸" },
  { id: "milkshake-oreo", name: "Милкшейк Oreo", category: "milkshake", price: 1290, icon: "🥤", desc: "450 мл · 1290 ₸" },
  { id: "milkshake-vanilla", name: "Милкшейк ванильный", category: "milkshake", price: 1290, icon: "🥤", desc: "450 мл · 1290 ₸" },
  { id: "milkshake-strawberry", name: "Милкшейк клубничный", category: "milkshake", price: 1290, icon: "🥤", desc: "450 мл · 1290 ₸" },
  { id: "milkshake-banana", name: "Милкшейк банановый", category: "milkshake", price: 1290, icon: "🥤", desc: "450 мл · 1290 ₸" },

  // Лимонады 450 мл (1190 ₸)
  { id: "lemonade-kiwi-lime", name: "Лимонад киви-лайм", category: "lemonade", price: 1190, icon: "🍋", desc: "450 мл · 1190 ₸" },
  { id: "lemonade-strawberry-mojito", name: "Лимонад клубничный мохито", category: "lemonade", price: 1190, icon: "🍋", desc: "450 мл · 1190 ₸" },
  { id: "lemonade-mango-passion", name: "Лимонад манго-маракуйя", category: "lemonade", price: 1190, icon: "🍋", desc: "450 мл · 1190 ₸" },

  // Чаи 360 мл (990 ₸)
  { id: "tea-karak", name: "Карак чай", category: "tea", price: 990, icon: "🍵", desc: "360 мл · 990 ₸" },
  { id: "tea-raspberry", name: "Чай малиновый", category: "tea", price: 990, icon: "🍵", desc: "360 мл · 990 ₸" },
  { id: "tea-ginger-lemon", name: "Чай имбирь-лимон", category: "tea", price: 990, icon: "🍵", desc: "360 мл · 990 ₸" },
  { id: "tea-sea-buckthorn", name: "Чай облепиховый", category: "tea", price: 990, icon: "🍵", desc: "360 мл · 990 ₸" },
  { id: "tea-blackberry", name: "Чай ежевика", category: "tea", price: 990, icon: "🍵", desc: "360 мл · 990 ₸" },
  { id: "tea-tashkent", name: "Ташкентский чай", category: "tea", price: 990, icon: "🍵", desc: "360 мл · 990 ₸" },
  { id: "tea-mulled-wine", name: "Глинтвейн", category: "tea", price: 990, icon: "🍷", desc: "360 мл · 990 ₸" },

  // Детские напитки 360 мл — всё по 990 ₸
  { id: "kids-cocoa", name: "Какао", category: "kids", price: 990, icon: "🥛", desc: "360 мл · 990 ₸" },
  { id: "kids-hot-chocolate", name: "Горячий шоколад", category: "kids", price: 990, icon: "🍫", desc: "360 мл · 990 ₸" },
  { id: "kids-latte", name: "Детский латте", category: "kids", price: 990, icon: "☕", desc: "360 мл · 990 ₸" },

  // Добавки
  { id: "addon-alt-milk", name: "Альтернативное молоко", category: "addons", price: 500, icon: "🥛", desc: "Добавка · 500 ₸" },
  { id: "addon-curd-foam", name: "Творожно-сливочная пенка", category: "addons", price: 200, icon: "✨", desc: "Добавка · 200 ₸" },
  { id: "addon-syrup", name: "Сироп", category: "addons", price: 0, icon: "🍯", desc: "В подарок" },
];

const PRODUCT_CATEGORIES = {
  all: "Все",
  coffee: "Кофе",
  summer: "Летнее меню",
  frappe: "Фраппе",
  milkshake: "Милкшейки",
  lemonade: "Лимонады",
  tea: "Чаи",
  kids: "Детские",
  addons: "Добавки",
};
