'use strict';

const menuService = require('../services/menuService');

const getMenu = async (req, res, next) => {
  try {
    const items = await menuService.getAllMenuItems(req.query.search);
    res.json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMenu };
