import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import MenuPage from '@/app/page';
import { renderWithRedux } from '../utils/test-utils';

// Mock menuService to prevent actual API calls
jest.mock('@/services/menuService', () => ({
  menuAPI: {
    getAll: jest.fn().mockResolvedValue({ data: [] }),
  },
}));

describe('MenuPage', () => {
  const mockItems = [
    {
      _id: '1',
      name: 'Classic Cheeseburger',
      description: 'Juicy beef patty',
      price: 199,
      imageUrl: 'http://img',
      category: 'Burgers',
      isAvailable: true,
    },
    {
      _id: '2',
      name: 'French Fries',
      description: 'Crispy fries',
      price: 149,
      imageUrl: 'http://img',
      category: 'Sides',
      isAvailable: true,
    },
  ];

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
    renderWithRedux(<MenuPage />, {
      preloadedState: {
        menu: {
          items: mockItems,
          status: 'succeeded',
          error: null,
        },
      },
    });

    // Check items are displayed
    expect(screen.getByText('Classic Cheeseburger')).toBeInTheDocument();
    expect(screen.getByText('French Fries')).toBeInTheDocument();
  });

  it('filters menu items when user types in search bar', () => {
    renderWithRedux(<MenuPage />, {
      preloadedState: {
        menu: {
          items: mockItems,
          status: 'succeeded',
          error: null,
        },
      },
    });

    const searchInput = screen.getByPlaceholderText(/search burgers/i);
    fireEvent.change(searchInput, { target: { value: 'burger' } });

    expect(screen.getByText('Classic Cheeseburger')).toBeInTheDocument();
    expect(screen.queryByText('French Fries')).not.toBeInTheDocument();
  });

  it('filters menu items when category pill button is clicked', () => {
    renderWithRedux(<MenuPage />, {
      preloadedState: {
        menu: {
          items: mockItems,
          status: 'succeeded',
          error: null,
        },
      },
    });

    const sidesPill = screen.getByRole('button', { name: 'Sides' });
    fireEvent.click(sidesPill);

    expect(screen.getByText('French Fries')).toBeInTheDocument();
    expect(screen.queryByText('Classic Cheeseburger')).not.toBeInTheDocument();
  });

  it('shows empty state when no items match search query', () => {
    renderWithRedux(<MenuPage />, {
      preloadedState: {
        menu: {
          items: mockItems,
          status: 'succeeded',
          error: null,
        },
      },
    });

    const searchInput = screen.getByPlaceholderText(/search burgers/i);
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });

    expect(screen.getByText('No menu items found')).toBeInTheDocument();
    expect(screen.getByText(/No items match "nonexistent"/i)).toBeInTheDocument();
  });
});
