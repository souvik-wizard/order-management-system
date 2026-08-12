'use strict';

process.env.NODE_ENV = 'test';

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../src/server');
const MenuItem = require('../../src/models/MenuItem');
const Order = require('../../src/models/Order');

jest.mock('../../src/models/MenuItem', () => {
  const actual = jest.requireActual('../../src/models/MenuItem');
  // We can just spy on or mock the methods directly on the required model in tests
  actual.find = jest.fn();
  actual.findById = jest.fn();
  return actual;
});

jest.mock('../../src/models/Order', () => {
  const actual = jest.requireActual('../../src/models/Order');
  actual.create = jest.fn();
  actual.find = jest.fn();
  actual.findById = jest.fn();
  actual.findByIdAndUpdate = jest.fn();
  actual.findByIdAndDelete = jest.fn();
  return actual;
});

describe('Orders API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/orders', () => {
    it('should create an order and calculate subtotals and totals on the backend using database prices', async () => {
      const mockMenuItems = [
        {
          _id: '60c72b2f9b1d8e2568cf95a1',
          name: 'Classic Cheeseburger',
          price: 9.99,
          isAvailable: true,
        },
        {
          _id: '60c72b2f9b1d8e2568cf95a2',
          name: 'Loaded Fries',
          price: 5.99,
          isAvailable: true,
        },
      ];

      // Mock MenuItem.find for the service price lookup
      MenuItem.find.mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockMenuItems),
      });

      // Mock Order.create to return the created order
      const mockSavedOrder = {
        _id: '60c72b2f9b1d8e2568cf95a5',
        customer: {
          name: 'Jane Doe',
          address: '123 Main St',
          phone: '1234567890',
        },
        items: [
          {
            menuItemId: '60c72b2f9b1d8e2568cf95a1',
            name: 'Classic Cheeseburger',
            price: 9.99,
            quantity: 2,
            subtotal: 19.98,
          },
          {
            menuItemId: '60c72b2f9b1d8e2568cf95a2',
            name: 'Loaded Fries',
            price: 5.99,
            quantity: 1,
            subtotal: 5.99,
          },
        ],
        totalAmount: 25.97,
        status: 'ORDER_RECEIVED',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      Order.create.mockResolvedValue(mockSavedOrder);

      const requestBody = {
        customer: {
          name: 'Jane Doe',
          address: '123 Main St',
          phone: '1234567890',
        },
        items: [
          {
            menuItemId: '60c72b2f9b1d8e2568cf95a1',
            quantity: 2,
            price: 1.00, // Frontend tampered price, should be ignored
          },
          {
            menuItemId: '60c72b2f9b1d8e2568cf95a2',
            quantity: 1,
            price: 2.00, // Frontend tampered price, should be ignored
          },
        ],
      };

      const res = await request(app).post('/api/orders').send(requestBody);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(JSON.parse(JSON.stringify(mockSavedOrder)));

      // Assert that Order.create was called with correct calculations:
      // subtotal 1 = 9.99 * 2 = 19.98
      // subtotal 2 = 5.99 * 1 = 5.99
      // total = 19.98 + 5.99 = 25.97
      expect(Order.create).toHaveBeenCalledWith({
        customer: requestBody.customer,
        items: [
          {
            menuItemId: expect.anything(),
            name: 'Classic Cheeseburger',
            price: 9.99,
            quantity: 2,
            subtotal: 19.98,
          },
          {
            menuItemId: expect.anything(),
            name: 'Loaded Fries',
            price: 5.99,
            quantity: 1,
            subtotal: 5.99,
          },
        ],
        totalAmount: 25.97,
        status: 'ORDER_RECEIVED',
      });
    });

    it('should reject orders with missing/invalid customer data', async () => {
      const requestBody = {
        items: [
          {
            menuItemId: '60c72b2f9b1d8e2568cf95a1',
            quantity: 2,
          },
        ],
      };

      const res = await request(app).post('/api/orders').send(requestBody);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Validation failed');
      expect(res.body.errors).toContain('customer is required');
    });

    it('should reject orders with invalid phone number', async () => {
      const requestBody = {
        customer: {
          name: 'Jane Doe',
          address: '123 Main St',
          phone: 'invalid-phone',
        },
        items: [
          {
            menuItemId: '60c72b2f9b1d8e2568cf95a1',
            quantity: 2,
          },
        ],
      };

      const res = await request(app).post('/api/orders').send(requestBody);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toContain('customer.phone is not a valid phone number');
    });

    it('should reject orders with non-existent menu items', async () => {
      MenuItem.find.mockReturnValue({
        lean: jest.fn().mockResolvedValue([]), // Return empty list
      });

      const requestBody = {
        customer: {
          name: 'Jane Doe',
          address: '123 Main St',
          phone: '1234567890',
        },
        items: [
          {
            menuItemId: '60c72b2f9b1d8e2568cf95a1',
            quantity: 2,
          },
        ],
      };

      const res = await request(app).post('/api/orders').send(requestBody);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Menu item(s) not found');
    });

    it('should reject orders with invalid quantity', async () => {
      const requestBody = {
        customer: {
          name: 'Jane Doe',
          address: '123 Main St',
          phone: '1234567890',
        },
        items: [
          {
            menuItemId: '60c72b2f9b1d8e2568cf95a1',
            quantity: -5,
          },
        ],
      };

      const res = await request(app).post('/api/orders').send(requestBody);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toContain('items[0].quantity must be a positive integer');
    });
  });

  describe('GET /api/orders/:id', () => {
    it('should return the order for a valid ID', async () => {
      const mockOrder = {
        _id: '60c72b2f9b1d8e2568cf95a5',
        customer: { name: 'Jane Doe', address: '123 St', phone: '1234567890' },
        items: [],
        totalAmount: 0,
        status: 'ORDER_RECEIVED',
      };

      Order.findById.mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockOrder),
      });

      const res = await request(app).get('/api/orders/60c72b2f9b1d8e2568cf95a5');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(mockOrder);
    });

    it('should return 404 for a non-existent order', async () => {
      Order.findById.mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      });

      const res = await request(app).get('/api/orders/60c72b2f9b1d8e2568cf95a5');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Order not found');
    });
  });

  describe('PATCH /api/orders/:id/status', () => {
    it('should update the order status to a valid status', async () => {
      const mockUpdatedOrder = {
        _id: '60c72b2f9b1d8e2568cf95a5',
        status: 'PREPARING',
      };

      Order.findByIdAndUpdate.mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockUpdatedOrder),
      });

      const res = await request(app)
        .patch('/api/orders/60c72b2f9b1d8e2568cf95a5/status')
        .send({ status: 'PREPARING' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('PREPARING');
    });

    it('should reject invalid statuses', async () => {
      const res = await request(app)
        .patch('/api/orders/60c72b2f9b1d8e2568cf95a5/status')
        .send({ status: 'INVALID_STATUS' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Invalid status');
    });
  });

  describe('DELETE /api/orders/:id', () => {
    it('should delete the order for a valid ID', async () => {
      const mockDeletedOrder = {
        _id: '60c72b2f9b1d8e2568cf95a5',
      };

      Order.findByIdAndDelete.mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockDeletedOrder),
      });

      const res = await request(app).delete('/api/orders/60c72b2f9b1d8e2568cf95a5');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Order deleted successfully');
    });

    it('should return 404 if order to delete is not found', async () => {
      Order.findByIdAndDelete.mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      });

      const res = await request(app).delete('/api/orders/60c72b2f9b1d8e2568cf95a5');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });
});
