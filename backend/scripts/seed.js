'use strict';

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const mongoose = require('mongoose');
const MenuItem = require('../src/models/MenuItem');

const MENU_ITEMS = [
  {
    name: 'Classic Cheeseburger',
    description: 'Juicy beef patty with melted cheddar, crisp lettuce, ripe tomato, and our house sauce on a toasted brioche bun.',
    price: 9.99,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80',
    category: 'Burgers',
    isAvailable: true,
  },
  {
    name: 'Spicy Chicken Burger',
    description: 'Crispy fried chicken thigh with jalapeños, pepper jack cheese, pickles, and sriracha mayo.',
    price: 10.49,
    imageUrl: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=600&q=80',
    category: 'Burgers',
    isAvailable: true,
  },
  {
    name: 'Margherita Pizza',
    description: 'Hand-stretched sourdough base with San Marzano tomato sauce, fresh mozzarella, and basil.',
    price: 13.99,
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80',
    category: 'Pizza',
    isAvailable: true,
  },
  {
    name: 'BBQ Chicken Pizza',
    description: 'Smoky BBQ base topped with grilled chicken, red onion, sweetcorn, and mozzarella.',
    price: 15.49,
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80',
    category: 'Pizza',
    isAvailable: true,
  },
  {
    name: 'Loaded Fries',
    description: 'Thick-cut fries topped with melted cheese sauce, crispy bacon bits, chives, and sour cream.',
    price: 5.99,
    imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&q=80',
    category: 'Sides',
    isAvailable: true,
  },
  {
    name: 'Garden Salad',
    description: 'Fresh mixed greens, cherry tomatoes, cucumber, red onion, and balsamic vinaigrette.',
    price: 6.99,
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80',
    category: 'Salads',
    isAvailable: true,
  },
  {
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with a molten centre, served with vanilla bean ice cream.',
    price: 6.49,
    imageUrl: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=600&q=80',
    category: 'Desserts',
    isAvailable: true,
  },
  {
    name: 'Fresh Lemonade',
    description: 'Hand-squeezed lemonade with a hint of mint. Served chilled.',
    price: 3.49,
    imageUrl: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=600&q=80',
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
    inserted.forEach((item) => console.log(`   • [${item.category}] ${item.name} — $${item.price}`));

    console.log('\n✅  Seed complete!');
  } catch (err) {
    console.error('❌  Seed failed:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
};

seed();
