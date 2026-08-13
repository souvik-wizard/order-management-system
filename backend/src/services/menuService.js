'use strict';

const MenuItem = require('../models/MenuItem');

const getAllMenuItems = async (searchQuery) => {
  const filter = { isAvailable: true };

  if (searchQuery && typeof searchQuery === 'string' && searchQuery.trim()) {
    const regex = new RegExp(searchQuery.trim(), 'i');
    filter.$or = [{ name: regex }, { description: regex }, { category: regex }];
  }

  return MenuItem.find(filter).lean();
};

const getMenuItemById = async (id) => {
  return MenuItem.findById(id).lean();
};

module.exports = { getAllMenuItems, getMenuItemById };
