import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import MenuItemCard from '@/components/menu/MenuItemCard';
import { renderWithRedux } from '../utils/test-utils';

describe('MenuItemCard Component', () => {
  const mockItem = {
    _id: '123',
    name: 'Burger',
    description: 'Juicy burger',
    price: 9.99,
    imageUrl: 'http://burger-image.jpg',
    category: 'Burgers',
  };

  it('renders item details correctly', () => {
    renderWithRedux(<MenuItemCard item={mockItem} />);

    expect(screen.getByText('Burger')).toBeInTheDocument();
    expect(screen.getByText('Juicy burger')).toBeInTheDocument();
    expect(screen.getByText('$9.99')).toBeInTheDocument();
    expect(screen.getByText('Burgers')).toBeInTheDocument();
  });

  it('dispatches addToCart action when Add to Cart button is clicked', () => {
    const { store } = renderWithRedux(<MenuItemCard item={mockItem} />);

    const addButton = screen.getByRole('button', { name: /\+/i });
    fireEvent.click(addButton);

    // Verify item was added to the Redux cart slice
    const cartItems = store.getState().cart.items;
    expect(cartItems).toHaveLength(1);
    expect(cartItems[0]).toEqual({
      id: '123',
      name: 'Burger',
      price: 9.99,
      imageUrl: 'http://burger-image.jpg',
      category: 'Burgers',
      quantity: 1,
    });
  });
});
