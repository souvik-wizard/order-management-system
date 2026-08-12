'use strict';

/**
 * Placeholder product controller.
 * Will be implemented in the next step when business logic is added.
 */

const getProducts = async (_req, res, next) => {
  try {
    res.json({ success: true, message: 'getProducts – not yet implemented', data: [] });
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    res.json({ success: true, message: `getProductById(${req.params.id}) – not yet implemented`, data: null });
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    res.status(201).json({ success: true, message: 'createProduct – not yet implemented', data: null });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    res.json({ success: true, message: `updateProduct(${req.params.id}) – not yet implemented`, data: null });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    res.json({ success: true, message: `deleteProduct(${req.params.id}) – not yet implemented`, data: null });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
