'use strict';

const MenuItem = require('../models/MenuItem');

/**
 * Menu service — data access layer for menu items.
 */

/**
 * Return all available menu items (optionally filtered by search query).
 * @param {string} [searchQuery]
 * @returns {Promise<Array>}
 */
const getAllMenuItems = async (searchQuery) => {
  const filter = { isAvailable: true };

  if (searchQuery && typeof searchQuery === 'string' && searchQuery.trim()) {
    const regex = new RegExp(searchQuery.trim(), 'i');
    filter.$or = [{ name: regex }, { description: regex }, { category: regex }];
  }

  return MenuItem.find(filter).lean();
};

/**
 * Return a single menu item by ID.
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
const getMenuItemById = async (id) => {
  return MenuItem.findById(id).lean();
};

module.exports = { getAllMenuItems, getMenuItemById };
