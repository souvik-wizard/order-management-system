import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import CartPage from '@/app/cart/page';
import { renderWithRedux } from '../utils/test-utils';

describe('CartPage', () => {
  it('renders empty state when cart is empty', () => {
    renderWithRedux(<CartPage />, {
      preloadedState: {
        cart: {
          items: [],
          totalItems: 0,
          totalPrice: 0,
        },
      },
    });

    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
  });

  it('renders cart items and details when cart has items', () => {
    const preloadedState = {
      cart: {
        items: [
          {
            id: '1',
            name: 'Classic Cheeseburger',
            price: 9.99,
            quantity: 2,
            imageUrl: 'http://img',
            category: 'Burgers',
          },
        ],
        totalItems: 2,
        totalPrice: 19.98,
      },
    };

    renderWithRedux(<CartPage />, { preloadedState });

    expect(screen.getByText('Classic Cheeseburger')).toBeInTheDocument();
    expect(screen.getByText('$9.99 each')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument(); // quantity
    expect(screen.getAllByText('$19.98')[0]).toBeInTheDocument(); // subtotal and total
  });

  it('allows increasing and decreasing quantity of items', () => {
    const preloadedState = {
      cart: {
        items: [
          {
            id: '1',
            name: 'Classic Cheeseburger',
            price: 9.99,
            quantity: 2,
            imageUrl: 'http://img',
            category: 'Burgers',
          },
        ],
        totalItems: 2,
        totalPrice: 19.98,
      },
    };

    const { store } = renderWithRedux(<CartPage />, { preloadedState });

    // Click Increase quantity
    const increaseBtn = screen.getByRole('button', { name: 'Increase quantity' });
    fireEvent.click(increaseBtn);
    expect(store.getState().cart.items[0].quantity).toBe(3);

    // Click Decrease quantity
    const decreaseBtn = screen.getByRole('button', { name: 'Decrease quantity' });
    fireEvent.click(decreaseBtn);
    expect(store.getState().cart.items[0].quantity).toBe(2);
  });

  it('allows removing an item from the cart', () => {
    const preloadedState = {
      cart: {
        items: [
          {
            id: '1',
            name: 'Classic Cheeseburger',
            price: 9.99,
            quantity: 2,
            imageUrl: 'http://img',
            category: 'Burgers',
          },
        ],
        totalItems: 2,
        totalPrice: 19.98,
      },
    };

    const { store } = renderWithRedux(<CartPage />, { preloadedState });

    const removeBtn = screen.getByRole('button', { name: 'Remove item' });
    fireEvent.click(removeBtn);

    expect(store.getState().cart.items).toHaveLength(0);
  });

  it('allows clearing all items from the cart', () => {
    const preloadedState = {
      cart: {
        items: [
          {
            id: '1',
            name: 'Classic Cheeseburger',
            price: 9.99,
            quantity: 1,
            imageUrl: 'http://img',
            category: 'Burgers',
          },
          {
            id: '2',
            name: 'Loaded Fries',
            price: 5.99,
            quantity: 1,
            imageUrl: 'http://img',
            category: 'Sides',
          },
        ],
        totalItems: 2,
        totalPrice: 15.98,
      },
    };

    const { store } = renderWithRedux(<CartPage />, { preloadedState });

    const clearBtn = screen.getByRole('button', { name: /clear all/i });
    fireEvent.click(clearBtn);

    expect(store.getState().cart.items).toHaveLength(0);
  });
});
