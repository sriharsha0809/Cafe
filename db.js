import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, 'chaiopod.db');

let db;

export function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
  }
  return db;
}

export function initDb() {
  const db = getDb();

  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      icon TEXT DEFAULT '🍵',
      sort_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      price_alt REAL,
      price_label TEXT,
      price_alt_label TEXT,
      category_id INTEGER,
      type TEXT DEFAULT 'veg',
      image_url TEXT,
      description TEXT,
      is_featured INTEGER DEFAULT 0,
      is_available INTEGER DEFAULT 1,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    );

    CREATE TABLE IF NOT EXISTS cart (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS cart_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cart_id TEXT,
      item_id INTEGER,
      quantity INTEGER DEFAULT 1,
      price_chosen REAL,
      FOREIGN KEY (cart_id) REFERENCES cart(id),
      FOREIGN KEY (item_id) REFERENCES items(id)
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      total_amount REAL,
      order_type TEXT DEFAULT 'dine-in',
      payment_method TEXT,
      status TEXT DEFAULT 'pending',
      customer_name TEXT,
      customer_phone TEXT,
      address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id TEXT,
      item_id INTEGER,
      quantity INTEGER,
      price REAL,
      item_name TEXT,
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (item_id) REFERENCES items(id)
    );
  `);

  // Seed data if empty
  const catCount = db.prepare('SELECT COUNT(*) as c FROM categories').get();
  if (catCount.c === 0) {
    seedData(db);
  }

  console.log('✅ Database initialized successfully');
}

function seedData(db) {
  const insertCategory = db.prepare('INSERT INTO categories (name, icon, sort_order) VALUES (?, ?, ?)');
  const insertItem = db.prepare(`
    INSERT INTO items (name, price, price_alt, price_label, price_alt_label, category_id, type, image_url, description, is_featured)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const categories = [
    { name: 'Chai & Tea Specials', icon: '🍵', order: 1 },
    { name: 'Coffee & Milk Specials', icon: '☕', order: 2 },
    { name: 'Shakes', icon: '🥤', order: 3 },
    { name: 'Premium Shakes', icon: '🏆', order: 4 },
    { name: 'Cold Coffees', icon: '🧊', order: 5 },
    { name: 'Mocktails', icon: '🍹', order: 6 },
    { name: 'Quick Bites', icon: '🍟', order: 7 },
    { name: 'Combos & Specials', icon: '🎁', order: 8 },
    { name: 'Ice Creams', icon: '🍦', order: 9 },
  ];

  const catIds = {};
  for (const cat of categories) {
    const res = insertCategory.run(cat.name, cat.icon, cat.order);
    catIds[cat.name] = res.lastInsertRowid;
  }

  const items = [
    // Chai & Tea Specials
    { name: 'Regular Chai', price: 9, price_alt: null, pl: null, pal: null, cat: 'Chai & Tea Specials', type: 'veg', img: '/images/chai_masala.png', desc: 'Classic everyday chai brewed with fresh ginger and tea leaves', featured: 0 },
    { name: 'Kadak Dum Chai', price: 20, price_alt: null, pl: null, pal: null, cat: 'Chai & Tea Specials', type: 'veg', img: '/images/chai_masala.png', desc: 'Strong brew, slow cooked to perfection', featured: 1 },
    { name: 'Spl Allam Chai', price: 20, price_alt: null, pl: null, pal: null, cat: 'Chai & Tea Specials', type: 'veg', img: '/images/chai_masala.png', desc: 'Special ginger chai with aromatic spices', featured: 0 },
    { name: 'Elaichi Chai', price: 20, price_alt: null, pl: null, pal: null, cat: 'Chai & Tea Specials', type: 'veg', img: '/images/chai_masala.png', desc: 'Cardamom infused aromatic tea', featured: 0 },
    { name: 'Masala Chai', price: 25, price_alt: null, pl: null, pal: null, cat: 'Chai & Tea Specials', type: 'veg', img: '/images/chai_masala.png', desc: 'Rich blend of spices in every sip', featured: 1 },
    { name: 'Pepper Chai', price: 20, price_alt: null, pl: null, pal: null, cat: 'Chai & Tea Specials', type: 'veg', img: '/images/chai_masala.png', desc: 'Spicy black pepper chai for immunity', featured: 0 },
    { name: 'Sonti Chai', price: 25, price_alt: null, pl: null, pal: null, cat: 'Chai & Tea Specials', type: 'veg', img: '/images/chai_masala.png', desc: 'Dry ginger chai — soothing and warming', featured: 0 },
    { name: 'Black Tea', price: 20, price_alt: null, pl: null, pal: null, cat: 'Chai & Tea Specials', type: 'veg', img: '/images/chai_masala.png', desc: 'Pure black tea, simple and refreshing', featured: 0 },
    { name: 'Lemon Tea', price: 20, price_alt: null, pl: null, pal: null, cat: 'Chai & Tea Specials', type: 'veg', img: '/images/chai_masala.png', desc: 'Zesty lemon-infused tea, light and refreshing', featured: 0 },
    { name: 'Green Tea', price: 25, price_alt: null, pl: null, pal: null, cat: 'Chai & Tea Specials', type: 'veg', img: '/images/chai_masala.png', desc: 'Premium green tea with antioxidant benefits', featured: 0 },
    { name: 'Ginger Lemon Tea', price: 25, price_alt: null, pl: null, pal: null, cat: 'Chai & Tea Specials', type: 'veg', img: '/images/chai_masala.png', desc: 'Double kick of ginger and lemon', featured: 0 },

    // Coffee & Milk Specials
    { name: 'Coffee', price: 18, price_alt: null, pl: null, pal: null, cat: 'Coffee & Milk Specials', type: 'veg', img: '/images/hot_coffee.png', desc: 'Traditional South Indian filter style coffee', featured: 0 },
    { name: 'Black Coffee', price: 20, price_alt: null, pl: null, pal: null, cat: 'Coffee & Milk Specials', type: 'veg', img: '/images/hot_coffee.png', desc: 'Bold and rich black coffee, no milk', featured: 0 },
    { name: 'Strong Coffee', price: 25, price_alt: null, pl: null, pal: null, cat: 'Coffee & Milk Specials', type: 'veg', img: '/images/hot_coffee.png', desc: 'Extra strong decoction for coffee lovers', featured: 0 },
    { name: 'Plain / Turmeric Milk', price: 20, price_alt: null, pl: null, pal: null, cat: 'Coffee & Milk Specials', type: 'veg', img: '/images/hot_coffee.png', desc: 'Warm milk or golden turmeric latte', featured: 0 },
    { name: 'Pepper Milk', price: 20, price_alt: null, pl: null, pal: null, cat: 'Coffee & Milk Specials', type: 'veg', img: '/images/hot_coffee.png', desc: 'Warm milk with freshly ground pepper', featured: 0 },
    { name: 'Sonti Milk', price: 20, price_alt: null, pl: null, pal: null, cat: 'Coffee & Milk Specials', type: 'veg', img: '/images/hot_coffee.png', desc: 'Warm milk with dry ginger for wellness', featured: 0 },
    { name: 'Hot Badam', price: 25, price_alt: null, pl: null, pal: null, cat: 'Coffee & Milk Specials', type: 'veg', img: '/images/hot_coffee.png', desc: 'Premium almond milk drink, rich and creamy', featured: 0 },
    { name: 'Boost', price: 20, price_alt: null, pl: null, pal: null, cat: 'Coffee & Milk Specials', type: 'veg', img: '/images/hot_coffee.png', desc: 'Boost energy drink with warm milk', featured: 0 },
    { name: 'Bourn Vita', price: 20, price_alt: null, pl: null, pal: null, cat: 'Coffee & Milk Specials', type: 'veg', img: '/images/hot_coffee.png', desc: 'Classic Bournvita malted milk drink', featured: 0 },
    { name: 'Horlicks', price: 20, price_alt: null, pl: null, pal: null, cat: 'Coffee & Milk Specials', type: 'veg', img: '/images/hot_coffee.png', desc: 'Warm Horlicks milk drink for nutrition', featured: 0 },

    // Shakes
    { name: 'Strawberry Shake', price: 80, price_alt: 130, pl: 'Milk Shake', pal: 'Thick Shake', cat: 'Shakes', type: 'veg', img: '/images/chocolate_shake.png', desc: 'Fresh strawberry blended shake, sweet and creamy', featured: 0 },
    { name: 'Pineapple Shake', price: 80, price_alt: 130, pl: 'Milk Shake', pal: 'Thick Shake', cat: 'Shakes', type: 'veg', img: '/images/chocolate_shake.png', desc: 'Tropical pineapple shake, refreshing and tangy', featured: 0 },
    { name: 'Banana Shake', price: 80, price_alt: 130, pl: 'Milk Shake', pal: 'Thick Shake', cat: 'Shakes', type: 'veg', img: '/images/chocolate_shake.png', desc: 'Creamy banana milkshake, rich in potassium', featured: 0 },
    { name: 'Butterscotch Shake', price: 90, price_alt: 140, pl: 'Milk Shake', pal: 'Thick Shake', cat: 'Shakes', type: 'veg', img: '/images/chocolate_shake.png', desc: 'Sweet butterscotch flavored creamy shake', featured: 0 },
    { name: 'Black Currant Shake', price: 90, price_alt: 140, pl: 'Milk Shake', pal: 'Thick Shake', cat: 'Shakes', type: 'veg', img: '/images/chocolate_shake.png', desc: 'Purple black currant shake with rich flavor', featured: 0 },
    { name: 'Oreo Shake', price: 100, price_alt: 150, pl: 'Milk Shake', pal: 'Thick Shake', cat: 'Shakes', type: 'veg', img: '/images/chocolate_shake.png', desc: 'Crushed Oreos in creamy vanilla shake', featured: 0 },
    { name: 'Kitkat Shake', price: 100, price_alt: 150, pl: 'Milk Shake', pal: 'Thick Shake', cat: 'Shakes', type: 'veg', img: '/images/chocolate_shake.png', desc: 'KitKat pieces blended in chocolate shake', featured: 0 },

    // Premium Shakes
    { name: 'Ferrero Rocher Shake', price: 160, price_alt: null, pl: null, pal: null, cat: 'Premium Shakes', type: 'veg', img: '/images/premium_shake.png', desc: 'Indulgent Ferrero Rocher luxurious milkshake', featured: 1 },
    { name: 'Dry Fruits Shake', price: 160, price_alt: null, pl: null, pal: null, cat: 'Premium Shakes', type: 'veg', img: '/images/premium_shake.png', desc: 'Nutritious dry fruits blended in creamy milk', featured: 0 },
    { name: 'Nutella Brownie Shake', price: 160, price_alt: null, pl: null, pal: null, cat: 'Premium Shakes', type: 'veg', img: '/images/premium_shake.png', desc: 'Nutella spread with brownie chunks in a shake', featured: 1 },
    { name: 'Chocolate Brownie Shake', price: 160, price_alt: null, pl: null, pal: null, cat: 'Premium Shakes', type: 'veg', img: '/images/premium_shake.png', desc: 'Rich chocolate brownie blended to perfection', featured: 0 },
    { name: 'Dark Chocolate Shake', price: 160, price_alt: null, pl: null, pal: null, cat: 'Premium Shakes', type: 'veg', img: '/images/premium_shake.png', desc: 'Intense dark chocolate for true choco lovers', featured: 0 },
    { name: 'Oreo Kitkat Shake', price: 160, price_alt: null, pl: null, pal: null, cat: 'Premium Shakes', type: 'veg', img: '/images/premium_shake.png', desc: 'The ultimate combo — Oreo + KitKat in one shake', featured: 0 },

    // Cold Coffees
    { name: 'Cold Coffee', price: 80, price_alt: null, pl: null, pal: null, cat: 'Cold Coffees', type: 'veg', img: '/images/cold_coffee.png', desc: 'Classic chilled coffee, smooth and refreshing', featured: 1 },
    { name: 'Hard Rock Coffee', price: 90, price_alt: null, pl: null, pal: null, cat: 'Cold Coffees', type: 'veg', img: '/images/cold_coffee.png', desc: 'Double shot cold coffee for the brave', featured: 0 },
    { name: 'Coffee Brownie', price: 99, price_alt: null, pl: null, pal: null, cat: 'Cold Coffees', type: 'veg', img: '/images/cold_coffee.png', desc: 'Cold coffee with rich chocolate brownie blend', featured: 0 },

    // Mocktails
    { name: 'Blue Curacao', price: 70, price_alt: null, pl: null, pal: null, cat: 'Mocktails', type: 'veg', img: '/images/mocktail_blue.png', desc: 'Stunning blue tropical mocktail, citrus flavor', featured: 1 },
    { name: 'Virgin Mint', price: 70, price_alt: null, pl: null, pal: null, cat: 'Mocktails', type: 'veg', img: '/images/mocktail_blue.png', desc: 'Fresh mint mocktail, cool and refreshing', featured: 0 },
    { name: 'Green Mint', price: 80, price_alt: null, pl: null, pal: null, cat: 'Mocktails', type: 'veg', img: '/images/mocktail_blue.png', desc: 'Green minty mocktail with herbal freshness', featured: 0 },
    { name: 'Watermelon Mocktail', price: 80, price_alt: null, pl: null, pal: null, cat: 'Mocktails', type: 'veg', img: '/images/mocktail_blue.png', desc: 'Chilled fresh watermelon juice mocktail', featured: 0 },
    { name: 'Sunny Orange', price: 90, price_alt: null, pl: null, pal: null, cat: 'Mocktails', type: 'veg', img: '/images/mocktail_blue.png', desc: 'Bright and zesty orange mocktail refresher', featured: 0 },

    // Quick Bites
    { name: 'Fries', price: 60, price_alt: 70, pl: 'Regular', pal: 'Peri Peri', cat: 'Quick Bites', type: 'veg', img: '/images/french_fries.png', desc: 'Crispy golden fries, regular or peri peri spiced', featured: 1 },
    { name: 'Veg Nuggets', price: 80, price_alt: null, pl: null, pal: null, cat: 'Quick Bites', type: 'veg', img: '/images/french_fries.png', desc: 'Crispy vegetable nuggets with dipping sauce', featured: 0 },
    { name: 'Veg Smiles', price: 80, price_alt: null, pl: null, pal: null, cat: 'Quick Bites', type: 'veg', img: '/images/french_fries.png', desc: 'Fun smiley potato snacks, crispy fried', featured: 0 },
    { name: 'Veg Fingers', price: 80, price_alt: null, pl: null, pal: null, cat: 'Quick Bites', type: 'veg', img: '/images/french_fries.png', desc: 'Crumb coated vegetable finger snacks', featured: 0 },
    { name: 'Potato Pops', price: 90, price_alt: null, pl: null, pal: null, cat: 'Quick Bites', type: 'veg', img: '/images/french_fries.png', desc: 'Bite-sized crispy potato pops with seasoning', featured: 0 },

    // Combos & Specials
    { name: 'Bun Maska', price: 40, price_alt: null, pl: null, pal: null, cat: 'Combos & Specials', type: 'veg', img: '/images/bun_maska.png', desc: 'Soft bread bun with generous butter spread', featured: 1 },
    { name: 'Telangana Chai Murukulu', price: 50, price_alt: null, pl: null, pal: null, cat: 'Combos & Specials', type: 'veg', img: '/images/bun_maska.png', desc: 'Traditional Telangana murukulu, perfect chai snack', featured: 1 },
    { name: 'Cool Drink + French Fries', price: 89, price_alt: null, pl: null, pal: null, cat: 'Combos & Specials', type: 'veg', img: '/images/french_fries.png', desc: 'Refreshing cool drink combo with crispy fries', featured: 0 },
    { name: 'Mocktail + Veg Snack', price: 149, price_alt: null, pl: null, pal: null, cat: 'Combos & Specials', type: 'veg', img: '/images/mocktail_blue.png', desc: 'Any mocktail paired with your choice of veg snack', featured: 1 },
    { name: 'Chocolate Coffee', price: 30, price_alt: null, pl: null, pal: null, cat: 'Combos & Specials', type: 'veg', img: '/images/hot_coffee.png', desc: 'Rich chocolate flavored coffee, sweet and bold', featured: 0 },
    { name: 'Caramel Coffee', price: 30, price_alt: null, pl: null, pal: null, cat: 'Combos & Specials', type: 'veg', img: '/images/hot_coffee.png', desc: 'Smooth caramel infused coffee delight', featured: 0 },

    // Ice Creams
    { name: 'Ice Cream Scoops', price: 45, price_alt: 80, pl: '2 Scoops', pal: '3 Scoops', cat: 'Ice Creams', type: 'veg', img: '/images/ice_cream.png', desc: 'Delicious ice cream scoops in your favorite flavor', featured: 0 },
    { name: 'Premium Ice Cream Scoops', price: 70, price_alt: 130, pl: '2 Scoops', pal: '3 Scoops', cat: 'Ice Creams', type: 'veg', img: '/images/ice_cream.png', desc: 'Premium quality ice cream with exotic flavors', featured: 1 },
  ];

  for (const item of items) {
    insertItem.run(
      item.name, item.price, item.price_alt, item.pl, item.pal,
      catIds[item.cat], item.type, item.img, item.desc, item.featured
    );
  }

  console.log('✅ Seed data inserted successfully');
}
