'use strict';

const express = require('express');
const router = express.Router();
const { getMenu } = require('../controllers/menuController');

/**
 * GET /api/menu — retrieve all available menu items
 */
router.get('/', getMenu);

module.exports = router;
