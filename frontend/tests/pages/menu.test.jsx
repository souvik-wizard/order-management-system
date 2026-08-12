import React from 'react';
import { screen } from '@testing-library/react';
import MenuPage from '@/app/page';
import { renderWithRedux } from '../utils/test-utils';

// Mock menuService to prevent actual API calls
jest.mock('@/services/menuService', () => ({
  menuAPI: {
    getAll: jest.fn().mockResolvedValue({ data: [] }),
  },
}));

describe('MenuPage', () => {
  it('renders loading spinner when menu is loading', () => {
    renderWithRedux(<MenuPage />, {
      preloadedState: {
        menu: {
          items: [],
          status: 'loading',
          error: null,
        },
      },
    });

    expect(screen.getByText('Loading menu…')).toBeInTheDocument();
  });

  it('renders error message when menu loading fails', () => {
    renderWithRedux(<MenuPage />, {
      preloadedState: {
        menu: {
          items: [],
          status: 'failed',
          error: 'Connection error',
        },
      },
    });

    expect(screen.getByText('Connection error')).toBeInTheDocument();
  });

  it('renders categorized menu items on success', () => {
    const mockItems = [
      {
        _id: '1',
        name: 'Classic Cheeseburger',
        description: 'Beef patty',
        price: 9.99,
        imageUrl: 'http://img',
        category: 'Burgers',
        isAvailable: true,
      },
      {
        _id: '2',
        name: 'French Fries',
        description: 'Crispy fries',
        price: 3.99,
        imageUrl: 'http://img',
        category: 'Sides',
        isAvailable: true,
      },
    ];

    renderWithRedux(<MenuPage />, {
      preloadedState: {
        menu: {
          items: mockItems,
          status: 'succeeded',
          error: null,
        },
      },
    });

    // Check categories are displayed
    expect(screen.getByRole('heading', { name: /burgers/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /sides/i })).toBeInTheDocument();

    // Check items are displayed
    expect(screen.getByText('Classic Cheeseburger')).toBeInTheDocument();
    expect(screen.getByText('French Fries')).toBeInTheDocument();
  });
});
