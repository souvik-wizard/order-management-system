'use strict';

const mongoose = require('mongoose');

/**
 * MenuItem model — represents a food item on the menu.
 */
const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

module.exports = MenuItem;
