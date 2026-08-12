'use strict';

process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../../src/server');
const MenuItem = require('../../src/models/MenuItem');

jest.mock('../../src/models/MenuItem');

describe('GET /api/menu', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should retrieve all available menu items', async () => {
    const mockMenuItems = [
      {
        _id: '60c72b2f9b1d8e2568cf95a1',
        name: 'Classic Cheeseburger',
        description: 'Juicy beef patty with melted cheddar',
        price: 9.99,
        imageUrl: 'http://image.url',
        category: 'Burgers',
        isAvailable: true,
      },
      {
        _id: '60c72b2f9b1d8e2568cf95a2',
        name: 'Loaded Fries',
        description: 'Thick-cut fries topped with cheese',
        price: 5.99,
        imageUrl: 'http://image.url',
        category: 'Sides',
        isAvailable: true,
      },
    ];

    MenuItem.find.mockReturnValue({
      lean: jest.fn().mockResolvedValue(mockMenuItems),
    });

    const res = await request(app).get('/api/menu');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual(mockMenuItems);
    expect(MenuItem.find).toHaveBeenCalledWith({ isAvailable: true });
  });

  it('should filter menu items by search query', async () => {
    const mockFilteredItems = [
      {
        _id: '60c72b2f9b1d8e2568cf95a1',
        name: 'Classic Cheeseburger',
        description: 'Juicy beef patty',
        price: 199,
        category: 'Burgers',
        isAvailable: true,
      },
    ];

    MenuItem.find.mockReturnValue({
      lean: jest.fn().mockResolvedValue(mockFilteredItems),
    });

    const res = await request(app).get('/api/menu?search=burger');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual(mockFilteredItems);
    expect(MenuItem.find).toHaveBeenCalledWith({
      isAvailable: true,
      $or: [
        { name: expect.any(RegExp) },
        { description: expect.any(RegExp) },
        { category: expect.any(RegExp) },
      ],
    });
  });

  it('should forward service errors to error handler', async () => {
    MenuItem.find.mockReturnValue({
      lean: jest.fn().mockRejectedValue(new Error('Database error')),
    });

    const res = await request(app).get('/api/menu');

    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Database error');
  });
});
