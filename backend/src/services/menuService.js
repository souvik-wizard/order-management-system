'use strict';

const MenuItem = require('../models/MenuItem');

/**
 * Menu service — data access layer for menu items.
 */

/**
 * Return all available menu items.
 * @returns {Promise<Array>}
 */
const getAllMenuItems = async () => {
  return MenuItem.find({ isAvailable: true }).lean();
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
