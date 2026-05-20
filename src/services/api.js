// Helper to generate RFC4122 compliant UUIDs client-side without external dependencies
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Helper to simulate network latency for authentic UI state updates (skeleton loaders, etc.)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ==================== MOCK DATABASE (FRONTEND ARRAY FORMAT) ====================

const MOCK_CATEGORIES = [
  { id: 1, name: 'Chai & Tea Specials', icon: '🍵', sort_order: 1 },
  { id: 2, name: 'Coffee & Milk Specials', icon: '☕', sort_order: 2 },
  { id: 3, name: 'Shakes', icon: '🥤', sort_order: 3 },
  { id: 4, name: 'Premium Shakes', icon: '🏆', sort_order: 4 },
  { id: 5, name: 'Cold Coffees', icon: '🧊', sort_order: 5 },
  { id: 6, name: 'Mocktails', icon: '🍹', sort_order: 6 },
  { id: 7, name: 'Quick Bites', icon: '🍟', sort_order: 7 },
  { id: 8, name: 'Combos & Specials', icon: '🎁', sort_order: 8 },
  { id: 9, name: 'Ice Creams', icon: '🍦', sort_order: 9 },
];

const MOCK_ITEMS = [
  // ── Chai & Tea Specials (Category 1) ──
  {
    id: 1,
    name: 'Regular Chai',
    price: 9,
    price_alt: null,
    price_label: null,
    price_alt_label: null,
    category_id: 1,
    category_name: 'Chai & Tea Specials',
    category_icon: '🍵',
    type: 'veg',
    image_url: '/images/chai_masala.png',
    description: 'Classic everyday chai brewed with fresh ginger and tea leaves',
    is_featured: 0,
    is_available: 1
  },
  {
    id: 2,
    name: 'Kadak Dum Chai',
    price: 20,
    price_alt: null,
    price_label: null,
    price_alt_label: null,
    category_id: 1,
    category_name: 'Chai & Tea Specials',
    category_icon: '🍵',
    type: 'veg',
    image_url: '/images/chai_masala.png',
    description: 'Strong brew, slow cooked to perfection',
    is_featured: 1,
    is_available: 1
  },
  {
    id: 3,
    name: 'Spl Allam Chai',
    price: 20,
    price_alt: null,
    price_label: null,
    price_alt_label: null,
    category_id: 1,
    category_name: 'Chai & Tea Specials',
    category_icon: '🍵',
    type: 'veg',
    image_url: '/images/chai_masala.png',
    description: 'Special ginger chai with aromatic spices',
    is_featured: 0,
    is_available: 1
  },
  {
    id: 4,
    name: 'Elaichi Chai',
    price: 20,
    price_alt: null,
    price_label: null,
    price_alt_label: null,
    category_id: 1,
    category_name: 'Chai & Tea Specials',
    category_icon: '🍵',
    type: 'veg',
    image_url: '/images/chai_masala.png',
    description: 'Cardamom infused aromatic tea',
    is_featured: 0,
    is_available: 1
  },
  {
    id: 5,
    name: 'Masala Chai',
    price: 25,
    price_alt: null,
    price_label: null,
    price_alt_label: null,
    category_id: 1,
    category_name: 'Chai & Tea Specials',
    category_icon: '🍵',
    type: 'veg',
    image_url: '/images/chai_masala.png',
    description: 'Rich blend of spices in every sip',
    is_featured: 1,
    is_available: 1
  },
  {
    id: 6,
    name: 'Pepper Chai',
    price: 20,
    price_alt: null,
    price_label: null,
    price_alt_label: null,
    category_id: 1,
    category_name: 'Chai & Tea Specials',
    category_icon: '🍵',
    type: 'veg',
    image_url: '/images/chai_masala.png',
    description: 'Spicy black pepper chai for immunity',
    is_featured: 0,
    is_available: 1
  },
  {
    id: 7,
    name: 'Sonti Chai',
    price: 25,
    price_alt: null,
    price_label: null,
    price_alt_label: null,
    category_id: 1,
    category_name: 'Chai & Tea Specials',
    category_icon: '🍵',
    type: 'veg',
    image_url: '/images/chai_masala.png',
    description: 'Dry ginger chai — soothing and warming',
    is_featured: 0,
    is_available: 1
  },
  {
    id: 8,
    name: 'Black Tea',
    price: 20,
    price_alt: null,
    price_label: null,
    price_alt_label: null,
    category_id: 1,
    category_name: 'Chai & Tea Specials',
    category_icon: '🍵',
    type: 'veg',
    image_url: '/images/chai_masala.png',
    description: 'Pure black tea, simple and refreshing',
    is_featured: 0,
    is_available: 1
  },
  {
    id: 9,
    name: 'Lemon Tea',
    price: 20,
    price_alt: null,
    price_label: null,
    price_alt_label: null,
    category_id: 1,
    category_name: 'Chai & Tea Specials',
    category_icon: '🍵',
    type: 'veg',
    image_url: '/images/chai_masala.png',
    description: 'Zesty lemon-infused tea, light and refreshing',
    is_featured: 0,
    is_available: 1
  },
  {
    id: 10,
    name: 'Green Tea',
    price: 25,
    price_alt: null,
    price_label: null,
    price_alt_label: null,
    category_id: 1,
    category_name: 'Chai & Tea Specials',
    category_icon: '🍵',
    type: 'veg',
    image_url: '/images/chai_masala.png',
    description: 'Premium green tea with antioxidant benefits',
    is_featured: 0,
    is_available: 1
  },
  {
    id: 11,
    name: 'Ginger Lemon Tea',
    price: 25,
    price_alt: null,
    price_label: null,
    price_alt_label: null,
    category_id: 1,
    category_name: 'Chai & Tea Specials',
    category_icon: '🍵',
    type: 'veg',
    image_url: '/images/chai_masala.png',
    description: 'Double kick of ginger and lemon',
    is_featured: 0,
    is_available: 1
  },

  // ── Coffee & Milk Specials (Category 2) ──
  {
    id: 12,
    name: 'Coffee',
    price: 18,
    price_alt: null,
    price_label: null,
    price_alt_label: null,
    category_id: 2,
    category_name: 'Coffee & Milk Specials',
    category_icon: '☕',
    type: 'veg',
    image_url: '/images/hot_coffee.png',
    description: 'Traditional South Indian filter style coffee',
    is_featured: 0,
    is_available: 1
  },
  {
    id: 13,
    name: 'Black Coffee',
    price: 20,
    price_alt: null,
    price_label: null,
    price_alt_label: null,
    category_id: 2,
    category_name: 'Coffee & Milk Specials',
    category_icon: '☕',
    type: 'veg',
    image_url: '/images/hot_coffee.png',
    description: 'Bold and rich black coffee, no milk',
    is_featured: 0,
    is_available: 1
  },
  {
    id: 14,
    name: 'Strong Coffee',
    price: 25,
    price_alt: null,
    price_label: null,
    price_alt_label: null,
    category_id: 2,
    category_name: 'Coffee & Milk Specials',
    category_icon: '☕',
    type: 'veg',
    image_url: '/images/hot_coffee.png',
    description: 'Extra strong decoction for coffee lovers',
    is_featured: 0,
    is_available: 1
  },
  {
    id: 15,
    name: 'Plain / Turmeric Milk',
    price: 20,
    price_alt: null,
    price_label: null,
    price_alt_label: null,
    category_id: 2,
    category_name: 'Coffee & Milk Specials',
    category_icon: '☕',
    type: 'veg',
    image_url: '/images/hot_coffee.png',
    description: 'Warm milk or golden turmeric latte',
    is_featured: 0,
    is_available: 1
  },
  {
    id: 16,
    name: 'Pepper Milk',
    price: 20,
    price_alt: null,
    price_label: null,
    price_alt_label: null,
    category_id: 2,
    category_name: 'Coffee & Milk Specials',
    category_icon: '☕',
    type: 'veg',
    image_url: '/images/hot_coffee.png',
    description: 'Warm milk with freshly ground pepper',
    is_featured: 0,
    is_available: 1
  },
  {
    id: 17,
    name: 'Sonti Milk',
    price: 20,
    price_alt: null,
    price_label: null,
    price_alt_label: null,
    category_id: 2,
    category_name: 'Coffee & Milk Specials',
    category_icon: '☕',
    type: 'veg',
    image_url: '/images/hot_coffee.png',
    description: 'Warm milk with dry ginger for wellness',
    is_featured: 0,
    is_available: 1
  },
  {
    id: 18,
    name: 'Hot Badam',
    price: 25,
    price_alt: null,
    price_label: null,
    price_alt_label: null,
    category_id: 2,
    category_name: 'Coffee & Milk Specials',
    category_icon: '☕',
    type: 'veg',
    image_url: '/images/hot_coffee.png',
    description: 'Premium almond milk drink, rich and creamy',
    is_featured: 0,
    is_available: 1
  },
  {
    id: 19,
    name: 'Boost',
    price: 20,
    price_alt: null,
    price_label: null,
    price_alt_label: null,
    category_id: 2,
    category_name: 'Coffee & Milk Specials',
    category_icon: '☕',
    type: 'veg',
    image_url: '/images/hot_coffee.png',
    description: 'Boost energy drink with warm milk',
    is_featured: 0,
    is_available: 1
  },
  {
    id: 20,
    name: 'Bourn Vita',
    price: 20,
    price_alt: null,
    price_label: null,
    price_alt_label: null,
    category_id: 2,
    category_name: 'Coffee & Milk Specials',
    category_icon: '☕',
    type: 'veg',
    image_url: '/images/hot_coffee.png',
    description: 'Classic Bournvita malted milk drink',
    is_featured: 0,
    is_available: 1
  },
  {
    id: 21,
    name: 'Horlicks',
    price: 20,
    price_alt: null,
    price_label: null,
    price_alt_label: null,
    category_id: 2,
    category_name: 'Coffee & Milk Specials',
    category_icon: '☕',
    type: 'veg',
    image_url: '/images/hot_coffee.png',
    description: 'Warm Horlicks milk drink for nutrition',
    is_featured: 0,
    is_available: 1
  },

  // ── Shakes (Category 3) ──
  {
    id: 22,
    name: 'Strawberry Shake',
    price: 80,
    price_alt: 130,
    price_label: 'Milk Shake',
    price_alt_label: 'Thick Shake',
    category_id: 3,
    category_name: 'Shakes',
    category_icon: '🥤',
    type: 'veg',
    image_url: '/images/chocolate_shake.png',
    description: 'Fresh strawberry blended shake, sweet and creamy',
    is_featured: 0,
    is_available: 1
  },
  {
    id: 23,
    name: 'Pineapple Shake',
    price: 80,
    price_alt: 130,
    price_label: 'Milk Shake',
    price_alt_label: 'Thick Shake',
    category_id: 3,
    category_name: 'Shakes',
    category_icon: '🥤',
    type: 'veg',
    image_url: '/images/chocolate_shake.png',
    description: 'Tropical pineapple shake, refreshing and tangy',
    is_featured: 0,
    is_available: 1
  },
  {
    id: 24,
    name: 'Banana Shake',
    price: 80,
    price_alt: 130,
    price_label: 'Milk Shake',
    price_alt_label: 'Thick Shake',
    category_id: 3,
    category_name: 'Shakes',
    category_icon: '🥤',
    type: 'veg',
    image_url: '/images/chocolate_shake.png',
    description: 'Creamy banana milkshake, rich in potassium',
    is_featured: 0,
    is_available: 1
  },
  {
    id: 25,
    name: 'Butterscotch Shake',
    price: 90,
    price_alt: 140,
    price_label: 'Milk Shake',
    price_alt_label: 'Thick Shake',
    category_id: 3,
    category_name: 'Shakes',
    category_icon: '🥤',
    type: 'veg',
    image_url: '/images/chocolate_shake.png',
    description: 'Sweet butterscotch flavored creamy shake',
    is_featured: 0,
    is_available: 1
  },
  {
    id: 26,
    name: 'Black Currant Shake',
    price: 90,
    price_alt: 140,
    price_label: 'Milk Shake',
    price_alt_label: 'Thick Shake',
    category_id: 3,
    category_name: 'Shakes',
    category_icon: '🥤',
    type: 'veg',
    image_url: '/images/chocolate_shake.png',
    description: 'Purple black currant shake with rich flavor',
    is_featured: 0,
    is_available: 1
  },
  {
    id: 27,
    name: 'Oreo Shake',
    price: 100,
    price_alt: 150,
    price_label: 'Milk Shake',
    price_alt_label: 'Thick Shake',
    category_id: 3,
    category_name: 'Shakes',
    category_icon: '🥤',
    type: 'veg',
    image_url: '/images/chocolate_shake.png',
    description: 'Crushed Oreos in creamy vanilla shake',
    is_featured: 0,
    is_available: 1
  },
  {
    id: 28,
    name: 'Kitkat Shake',
    price: 100,
    price_alt: 150,
    price_label: 'Milk Shake',
    price_alt_label: 'Thick Shake',
    category_id: 3,
    category_name: 'Shakes',
    category_icon: '🥤',
    type: 'veg',
    image_url: '/images/chocolate_shake.png',
    description: 'KitKat pieces blended in chocolate shake',
    is_featured: 0,
    is_available: 1
  },

  // ── Premium Shakes (Category 4) ──
  {
    id: 29,
    name: 'Ferrero Rocher Shake',
    price: 160,
    price_alt: null,
    price_label: null,
    price_alt_label: null,
    category_id: 4,
    category_name: 'Premium Shakes',
    category_icon: '🏆',
    type: 'veg',
    image_url: '/images/premium_shake.png',
    description: 'Indulgent Ferrero Rocher luxurious milkshake',
    is_featured: 1,
    is_available: 1
  },
  {
    id: 30,
    name: 'Dry Fruits Shake',
    price: 160,
    price_alt: null,
    price_label: null,
    price_alt_label: null,
    category_id: 4,
    category_name: 'Premium Shakes',
    category_icon: '🏆',
    type: 'veg',
    image_url: '/images/premium_shake.png',
    description: 'Nutritious dry fruits blended in creamy milk',
    is_featured: 0,
    is_available: 1
  },
  {
    id: 31,
    name: 'Nutella Brownie Shake',
    price: 160,
    price_alt: null,
    price_label: null,
    price_alt_label: null,
    category_id: 4,
    category_name: 'Premium Shakes',
    category_icon: '🏆',
    type: 'veg',
    image_url: '/images/premium_shake.png',
    description: 'Nutella spread with brownie chunks in a shake',
    is_featured: 1,
    is_available: 1
  },
  {
    id: 32,
    name: 'Chocolate Brownie Shake',
    price: 160,
    price_alt: null,
    price_label: null,
    price_alt_label: null,
    category_id: 4,
    category_name: 'Premium Shakes',
    category_icon: '🏆',
    type: 'veg',
    image_url: '/images/premium_shake.png',
    description: 'Rich chocolate brownie blended to perfection',
    is_featured: 0,
    is_available: 1
  },
  {
    id: 33,
    name: 'Dark Chocolate Shake',
    price: 160,
    price_alt: null,
    price_label: null,
    price_alt_label: null,
    category_id: 4,
    category_name: 'Premium Shakes',
    category_icon: '🏆',
    type: 'veg',
    image_url: '/images/premium_shake.png',
    description: 'Intense dark chocolate for true choco lovers',
    is_featured: 0,
    is_available: 1
  },
  {
    id: 34,
    name: 'Oreo Kitkat Shake',
    price: 160,
    price_alt: null,
    price_label: null,
    price_alt_label: null,
    category_id: 4,
    category_name: 'Premium Shakes',
    category_icon: '🏆',
    type: 'veg',
    image_url: '/images/premium_shake.png',
    description: 'The ultimate combo — Oreo + KitKat in one shake',
    is_featured: 0,
    is_available: 1
  },

  // ── Cold Coffees (Category 5) ──
  {
    id: 35,
    name: 'Cold Coffee',
    price: 80,
    price_alt: null,
    price_label: null,
    price_alt_label: null,
    category_id: 5,
    category_name: 'Cold Coffees',
    category_icon: '🧊',
    type: 'veg',
    image_url: '/images/cold_coffee.png',
    description: 'Classic chilled coffee, smooth and refreshing',
    is_featured: 1,
    is_available: 1
  },
  {
    id: 36,
    name: 'Hard Rock Coffee',
    price: 90,
    price_alt: null,
    price_label: null,
    price_alt_label: null,
    category_id: 5,
    category_name: 'Cold Coffees',
    category_icon: '🧊',
    type: 'veg',
    image_url: '/images/cold_coffee.png',
    description: 'Double shot cold coffee for the brave',
    is_featured: 0,
    is_available: 1
  },
  {
    id: 37,
    name: 'Coffee Brownie',
    price: 99,
    price_alt: null,
    price_label: null,
    price_alt_label: null,
    category_id: 5,
    category_name: 'Cold Coffees',
    category_icon: '🧊',
    type: 'veg',
    image_url: '/images/cold_coffee.png',
    description: 'Cold coffee with rich chocolate brownie blend',
    is_featured: 0,
    is_available: 1
  },

  // ── Mocktails (Category 6) ──
  {
    id: 38,
    name: 'Blue Curacao',
    price: 70,
    price_alt: null,
    price_label: null,
    price_alt_label: null,
    category_id: 6,
    category_name: 'Mocktails',
    category_icon: '🍹',
    type: 'veg',
    image_url: '/images/mocktail_blue.png',
    description: 'Stunning blue tropical mocktail, citrus flavor',
    is_featured: 1,
    is_available: 1
  },
  {
    id: 39,
    name: 'Virgin Mint',
    price: 70,
    price_alt: null,
    price_label: null,
    price_alt_label: null,
    category_id: 6,
    category_name: 'Mocktails',
    category_icon: '🍹',
    type: 'veg',
    image_url: '/images/mocktail_blue.png',
    description: 'Fresh mint mocktail, cool and refreshing',
    is_featured: 0,
    is_available: 1
  },
  {
    id: 40,
    name: 'Green Mint',
    price: 80,
    price_alt: null,
    price_label: null,
    price_alt_label: null,
    category_id: 6,
    category_name: 'Mocktails',
    category_icon: '🍹',
    type: 'veg',
    image_url: '/images/mocktail_blue.png',
    description: 'Green minty mocktail with herbal freshness',
    is_featured: 0,
    is_available: 1
  },
  {
    id: 41,
    name: 'Watermelon Mocktail',
    price: 80,
    price_alt: null,
    price_label: null,
    price_alt_label: null,
    category_id: 6,
    category_name: 'Mocktails',
    category_icon: '🍹',
    type: 'veg',
    image_url: '/images/mocktail_blue.png',
    description: 'Chilled fresh watermelon juice mocktail',
    is_featured: 0,
    is_available: 1
  },
  {
    id: 42,
    name: 'Sunny Orange',
    price: 90,
    price_alt: null,
    price_label: null,
    price_alt_label: null,
    category_id: 6,
    category_name: 'Mocktails',
    category_icon: '🍹',
    type: 'veg',
    image_url: '/images/mocktail_blue.png',
    description: 'Bright and zesty orange mocktail refresher',
    is_featured: 0,
    is_available: 1
  },

  // ── Quick Bites (Category 7) ──
  {
    id: 43,
    name: 'Fries',
    price: 60,
    price_alt: 70,
    price_label: 'Regular',
    price_alt_label: 'Peri Peri',
    category_id: 7,
    category_name: 'Quick Bites',
    category_icon: '🍟',
    type: 'veg',
    image_url: '/images/french_fries.png',
    description: 'Crispy golden fries, regular or peri peri spiced',
    is_featured: 1,
    is_available: 1
  },
  {
    id: 44,
    name: 'Veg Nuggets',
    price: 80,
    price_alt: null,
    price_label: null,
    price_alt_label: null,
    category_id: 7,
    category_name: 'Quick Bites',
    category_icon: '🍟',
    type: 'veg',
    image_url: '/images/french_fries.png',
    description: 'Crispy vegetable nuggets with dipping sauce',
    is_featured: 0,
    is_available: 1
  },
  {
    id: 45,
    name: 'Veg Smiles',
    price: 80,
    price_alt: null,
    price_label: null,
    price_alt_label: null,
    category_id: 7,
    category_name: 'Quick Bites',
    category_icon: '🍟',
    type: 'veg',
    image_url: '/images/french_fries.png',
    description: 'Fun smiley potato snacks, crispy fried',
    is_featured: 0,
    is_available: 1
  },
  {
    id: 46,
    name: 'Veg Fingers',
    price: 80,
    price_alt: null,
    price_label: null,
    price_alt_label: null,
    category_id: 7,
    category_name: 'Quick Bites',
    category_icon: '🍟',
    type: 'veg',
    image_url: '/images/french_fries.png',
    description: 'Crumb coated vegetable finger snacks',
    is_featured: 0,
    is_available: 1
  },
  {
    id: 47,
    name: 'Potato Pops',
    price: 90,
    price_alt: null,
    price_label: null,
    price_alt_label: null,
    category_id: 7,
    category_name: 'Quick Bites',
    category_icon: '🍟',
    type: 'veg',
    image_url: '/images/french_fries.png',
    description: 'Bite-sized crispy potato pops with seasoning',
    is_featured: 0,
    is_available: 1
  },

  // ── Combos & Specials (Category 8) ──
  {
    id: 48,
    name: 'Bun Maska',
    price: 40,
    price_alt: null,
    price_label: null,
    price_alt_label: null,
    category_id: 8,
    category_name: 'Combos & Specials',
    category_icon: '🎁',
    type: 'veg',
    image_url: '/images/bun_maska.png',
    description: 'Soft bread bun with generous butter spread',
    is_featured: 1,
    is_available: 1
  },
  {
    id: 49,
    name: 'Telangana Chai Murukulu',
    price: 50,
    price_alt: null,
    price_label: null,
    price_alt_label: null,
    category_id: 8,
    category_name: 'Combos & Specials',
    category_icon: '🎁',
    type: 'veg',
    image_url: '/images/bun_maska.png',
    description: 'Traditional Telangana murukulu, perfect chai snack',
    is_featured: 1,
    is_available: 1
  },
  {
    id: 50,
    name: 'Cool Drink + French Fries',
    price: 89,
    price_alt: null,
    price_label: null,
    price_alt_label: null,
    category_id: 8,
    category_name: 'Combos & Specials',
    category_icon: '🎁',
    type: 'veg',
    image_url: '/images/french_fries.png',
    description: 'Refreshing cool drink combo with crispy fries',
    is_featured: 0,
    is_available: 1
  },
  {
    id: 51,
    name: 'Mocktail + Veg Snack',
    price: 149,
    price_alt: null,
    price_label: null,
    price_alt_label: null,
    category_id: 8,
    category_name: 'Combos & Specials',
    category_icon: '🎁',
    type: 'veg',
    image_url: '/images/mocktail_blue.png',
    description: 'Any mocktail paired with your choice of veg snack',
    is_featured: 1,
    is_available: 1
  },
  {
    id: 52,
    name: 'Chocolate Coffee',
    price: 30,
    price_alt: null,
    price_label: null,
    price_alt_label: null,
    category_id: 8,
    category_name: 'Combos & Specials',
    category_icon: '🎁',
    type: 'veg',
    image_url: '/images/hot_coffee.png',
    description: 'Rich chocolate flavored coffee, sweet and bold',
    is_featured: 0,
    is_available: 1
  },
  {
    id: 53,
    name: 'Caramel Coffee',
    price: 30,
    price_alt: null,
    price_label: null,
    price_alt_label: null,
    category_id: 8,
    category_name: 'Combos & Specials',
    category_icon: '🎁',
    type: 'veg',
    image_url: '/images/hot_coffee.png',
    description: 'Smooth caramel infused coffee delight',
    is_featured: 0,
    is_available: 1
  },

  // ── Ice Creams (Category 9) ──
  {
    id: 54,
    name: 'Ice Cream Scoops',
    price: 45,
    price_alt: 80,
    price_label: '2 Scoops',
    price_alt_label: '3 Scoops',
    category_id: 9,
    category_name: 'Ice Creams',
    category_icon: '🍦',
    type: 'veg',
    image_url: '/images/ice_cream.png',
    description: 'Delicious ice cream scoops in your favorite flavor',
    is_featured: 0,
    is_available: 1
  },
  {
    id: 55,
    name: 'Premium Ice Cream Scoops',
    price: 70,
    price_alt: 130,
    price_label: '2 Scoops',
    price_alt_label: '3 Scoops',
    category_id: 9,
    category_name: 'Ice Creams',
    category_icon: '🍦',
    type: 'veg',
    image_url: '/images/ice_cream.png',
    description: 'Premium quality ice cream with exotic flavors',
    is_featured: 1,
    is_available: 1
  },
];


// ==================== LOCALSTORAGE-BASED STATE ====================

const CART_STORAGE_PREFIX = 'chaiopod_cart_items_';

const getLocalCartItems = (cartId) => {
  if (!cartId) return [];
  try {
    const raw = localStorage.getItem(`${CART_STORAGE_PREFIX}${cartId}`);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Error reading localStorage cart:', err);
    return [];
  }
};

const saveLocalCartItems = (cartId, items) => {
  if (!cartId) return;
  try {
    localStorage.setItem(`${CART_STORAGE_PREFIX}${cartId}`, JSON.stringify(items));
  } catch (err) {
    console.error('Error writing localStorage cart:', err);
  }
};

const getActiveCartId = () => {
  return localStorage.getItem('chaiopod_cart_id') || 'guest';
};


// ==================== MOCKED SERVICES API ====================

export const categoriesApi = {
  getAll: async () => {
    await delay(300); // realistic latency
    return {
      data: {
        success: true,
        data: MOCK_CATEGORIES,
      },
    };
  },
};

export const itemsApi = {
  getAll: async (params = {}) => {
    await delay(350); // realistic latency
    let list = [...MOCK_ITEMS];

    if (params.category_id) {
      const catId = parseInt(params.category_id, 10);
      list = list.filter(i => i.category_id === catId);
    }
    if (params.search) {
      const s = params.search.toLowerCase();
      list = list.filter(i =>
        i.name.toLowerCase().includes(s) ||
        (i.category_name && i.category_name.toLowerCase().includes(s))
      );
    }
    if (params.featured === 'true' || params.featured === true) {
      list = list.filter(i => i.is_featured === 1);
    }

    return {
      data: {
        success: true,
        data: list,
      },
    };
  },

  getById: async (id) => {
    await delay(200);
    const item = MOCK_ITEMS.find(i => i.id === parseInt(id, 10));
    if (!item) {
      throw new Error('Item not found');
    }
    return {
      data: {
        success: true,
        data: item,
      },
    };
  },

  getFeatured: async () => {
    await delay(300);
    const featured = MOCK_ITEMS.filter(i => i.is_featured === 1);
    return {
      data: {
        success: true,
        data: featured,
      },
    };
  },
};

export const cartApi = {
  create: async (userId = 'guest') => {
    await delay(200);
    let cartId = localStorage.getItem('chaiopod_cart_id');
    if (!cartId) {
      cartId = generateUUID();
    }
    return {
      data: {
        success: true,
        data: { cart_id: cartId },
      },
    };
  },

  get: async (cartId) => {
    await delay(250);
    const items = getLocalCartItems(cartId);
    
    // Enrich with item information (JOIN equivalent)
    const enriched = items.map(ci => {
      const match = MOCK_ITEMS.find(i => i.id === ci.item_id);
      return {
        id: ci.id,
        cart_id: cartId,
        item_id: ci.item_id,
        quantity: ci.quantity,
        price_chosen: ci.price_chosen,
        name: match ? match.name : 'Unknown Item',
        image_url: match ? match.image_url : '',
        category_id: match ? match.category_id : null,
        category_name: match ? match.category_name : '',
      };
    });

    return {
      data: {
        success: true,
        data: enriched,
      },
    };
  },

  addItem: async (cartId, itemId, quantity = 1, priceChosen) => {
    await delay(200);
    const items = getLocalCartItems(cartId);
    
    // Check if item exists in the cart with the same chosen price
    const existing = items.find(ci => ci.item_id === itemId && ci.price_chosen === priceChosen);
    
    if (existing) {
      existing.quantity += quantity;
    } else {
      items.push({
        id: Date.now() + Math.floor(Math.random() * 1000), // simulate auto-increment ID
        cart_id: cartId,
        item_id: itemId,
        quantity: quantity,
        price_chosen: priceChosen,
      });
    }

    saveLocalCartItems(cartId, items);
    return {
      data: {
        success: true,
        message: 'Item added to cart locally',
      },
    };
  },

  updateItem: async (cartItemId, quantity) => {
    await delay(150);
    const cartId = getActiveCartId();
    let items = getLocalCartItems(cartId);

    if (quantity <= 0) {
      items = items.filter(ci => ci.id !== cartItemId);
    } else {
      items = items.map(ci => ci.id === cartItemId ? { ...ci, quantity } : ci);
    }

    saveLocalCartItems(cartId, items);
    return {
      data: {
        success: true,
        message: 'Cart updated locally',
      },
    };
  },

  removeItem: async (cartItemId) => {
    await delay(150);
    const cartId = getActiveCartId();
    let items = getLocalCartItems(cartId);
    items = items.filter(ci => ci.id !== cartItemId);
    saveLocalCartItems(cartId, items);
    return {
      data: {
        success: true,
        message: 'Item removed locally',
      },
    };
  },

  clear: async (cartId) => {
    await delay(150);
    saveLocalCartItems(cartId, []);
    return {
      data: {
        success: true,
        message: 'Cart cleared locally',
      },
    };
  },
};

export const ordersApi = {
  create: async (orderData) => {
    await delay(600); // simulated processing delay
    const totalAmount = orderData.items.reduce((sum, it) => sum + (it.price * it.quantity), 0);
    
    return {
      data: {
        success: true,
        data: {
          order_id: generateUUID(),
          total_amount: totalAmount,
          status: 'confirmed',
        },
      },
    };
  },

  getById: async (orderId) => {
    await delay(300);
    return {
      data: {
        success: true,
        data: {
          id: orderId,
          total_amount: 150, // mock dummy
          order_type: 'dine-in',
          status: 'confirmed',
          customer_name: 'Guest Customer',
        },
      },
    };
  },
};

// Create a dummy Axios/API default instance export to maintain full backward compatibility 
// with any code importing 'api' as a default export
const dummyApi = {
  get: () => Promise.resolve({ data: { success: true } }),
  post: () => Promise.resolve({ data: { success: true } }),
  put: () => Promise.resolve({ data: { success: true } }),
  delete: () => Promise.resolve({ data: { success: true } }),
};
export default dummyApi;
