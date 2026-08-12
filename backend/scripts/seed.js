'use strict';

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const mongoose = require('mongoose');
const MenuItem = require('../src/models/MenuItem');

const MENU_ITEMS = [
  // ── BURGERS (4 items) ────────────────────────────────────────────────────────
  {
    name: 'Classic Cheeseburger',
    description: 'Juicy beef patty with melted cheddar, crisp lettuce, ripe tomato, and house sauce on a toasted brioche bun.',
    price: 199,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80',
    category: 'Burgers',
    isAvailable: true,
  },
  {
    name: 'Spicy Chicken Burger',
    description: 'Crispy fried chicken thigh with jalapeños, pepper jack cheese, pickles, and sriracha mayo.',
    price: 249,
    imageUrl: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=600&q=80',
    category: 'Burgers',
    isAvailable: true,
  },
  {
    name: 'Veggie Supreme Burger',
    description: 'Crispy spiced vegetable & herb patty with fresh lettuce, tomatoes, and chipotle mayo.',
    price: 179,
    imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&q=80',
    category: 'Burgers',
    isAvailable: true,
  },
  {
    name: 'Paneer Tikka Burger',
    description: 'Grilled tandoori paneer slab infused with Indian spices, mint chutney, and crunchy onion rings.',
    price: 219,
    imageUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&q=80',
    category: 'Burgers',
    isAvailable: true,
  },

  // ── PIZZA (4 items) ──────────────────────────────────────────────────────────
  {
    name: 'Margherita Pizza',
    description: 'Hand-stretched sourdough base with San Marzano tomato sauce, fresh mozzarella, and basil.',
    price: 299,
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80',
    category: 'Pizza',
    isAvailable: true,
  },
  {
    name: 'BBQ Chicken Pizza',
    description: 'Smoky BBQ sauce base topped with succulent grilled chicken, red onion, sweetcorn, and mozzarella.',
    price: 399,
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80',
    category: 'Pizza',
    isAvailable: true,
  },
  {
    name: 'Farmhouse Veggie Pizza',
    description: 'Loaded with bell peppers, sweetcorn, mushrooms, black olives, and melted mozzarella cheese.',
    price: 349,
    imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=80',
    category: 'Pizza',
    isAvailable: true,
  },
  {
    name: 'Pepperoni & Cheese Pizza',
    description: 'Classic American style pizza with spicy pepperoni slices and extra mozzarella cheese.',
    price: 429,
    imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&q=80',
    category: 'Pizza',
    isAvailable: true,
  },

  // ── SIDES (4 items) ──────────────────────────────────────────────────────────
  {
    name: 'Loaded Cheese Fries',
    description: 'Thick-cut golden fries topped with warm melted cheese sauce, jalapeños, and herbs.',
    price: 149,
    imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&q=80',
    category: 'Sides',
    isAvailable: true,
  },
  {
    name: 'Garlic Breadsticks',
    description: 'Freshly baked buttery breadsticks brushed with garlic butter and herbs. Served with marinara dip.',
    price: 129,
    imageUrl: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?w=600&q=80',
    category: 'Sides',
    isAvailable: true,
  },
  {
    name: 'Peri Peri Chicken Wings',
    description: 'Crispy fried chicken wings tossed in spicy African peri peri seasoning (6 pcs).',
    price: 229,
    imageUrl: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=600&q=80',
    category: 'Sides',
    isAvailable: true,
  },
  {
    name: 'Crispy Onion Rings',
    description: 'Batter-fried onion rings fried to perfection. Served with smoky garlic dip.',
    price: 119,
    imageUrl: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=600&q=80',
    category: 'Sides',
    isAvailable: true,
  },

  // ── SALADS (3 items) ─────────────────────────────────────────────────────────
  {
    name: 'Garden Fresh Salad',
    description: 'Fresh mixed greens, cherry tomatoes, cucumber, red onion, and house balsamic vinaigrette.',
    price: 169,
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80',
    category: 'Salads',
    isAvailable: true,
  },
  {
    name: 'Grilled Chicken Caesar Salad',
    description: 'Crisp romaine lettuce, tender grilled chicken, garlic croutons, and creamy Caesar dressing.',
    price: 219,
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=80',
    category: 'Salads',
    isAvailable: true,
  },
  {
    name: 'Greek Feta & Olive Salad',
    description: 'Cucumbers, ripe tomatoes, red onions, Kalamata olives, and creamy feta cheese drizzled with olive oil.',
    price: 199,
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80',
    category: 'Salads',
    isAvailable: true,
  },

  // ── DESSERTS (3 items) ───────────────────────────────────────────────────────
  {
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with a rich molten chocolate centre. Served hot.',
    price: 149,
    imageUrl: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=600&q=80',
    category: 'Desserts',
    isAvailable: true,
  },
  {
    name: 'NY Style Cheesecake',
    description: 'Classic creamy New York cheesecake with a buttery graham cracker crust and berry drizzle.',
    price: 189,
    imageUrl: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&q=80',
    category: 'Desserts',
    isAvailable: true,
  },
  {
    name: 'Gulab Jamun (2 Pcs)',
    description: 'Traditional Indian sweet milk dumplings fried and soaked in cardamom-flavoured sugar syrup.',
    price: 99,
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&q=80',
    category: 'Desserts',
    isAvailable: true,
  },

  // ── DRINKS (3 items) ─────────────────────────────────────────────────────────
  {
    name: 'Fresh Lemonade',
    description: 'Hand-squeezed refreshing lemonade with a hint of mint. Served chilled over ice.',
    price: 79,
    imageUrl: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=600&q=80',
    category: 'Drinks',
    isAvailable: true,
  },
  {
    name: 'Iced Peach Tea',
    description: 'Brewed black tea infused with sweet peach flavour and fresh mint leaves.',
    price: 99,
    imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&q=80',
    category: 'Drinks',
    isAvailable: true,
  },
  {
    name: 'Mango Smoothie',
    description: 'Thick and creamy smoothie made with real Alphonso mango pulp and chilled milk.',
    price: 129,
    imageUrl: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=600&q=80',
    category: 'Drinks',
    isAvailable: true,
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅  Connected to MongoDB');

    // Clear existing menu items
    await MenuItem.deleteMany({});
    console.log('🗑️   Cleared existing menu items');

    // Insert seed data
    const inserted = await MenuItem.insertMany(MENU_ITEMS);
    console.log(`🌱  Seeded ${inserted.length} menu items:`);
    inserted.forEach((item) => console.log(`   • [${item.category}] ${item.name} — ₹${item.price}`));

    console.log('\n✅  Seed complete!');
  } catch (err) {
    console.error('❌  Seed failed:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
};

seed();
