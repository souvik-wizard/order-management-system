import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import CheckoutPage from '@/app/checkout/page';
import { renderWithRedux } from '../utils/test-utils';

// Mock useRouter from next/navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: mockPush,
    };
  },
}));

// Mock orderService to prevent actual API calls
jest.mock('@/services/orderService', () => ({
  orderAPI: {
    create: jest.fn().mockResolvedValue({
      success: true,
      data: { _id: 'mock-order-id-456' },
    }),
  },
}));

describe('CheckoutPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const cartPreloadedState = {
    cart: {
      items: [
        {
          id: '1',
          name: 'Classic Cheeseburger',
          price: 9.99,
          quantity: 2,
        },
      ],
      totalItems: 2,
      totalPrice: 19.98,
    },
    orders: {
      status: 'idle',
      error: null,
    },
  };

  it('renders checkout form and order summary', () => {
    renderWithRedux(<CheckoutPage />, { preloadedState: cartPreloadedState });

    expect(screen.getByRole('heading', { name: 'Checkout' })).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/delivery address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByText('Classic Cheeseburger × 2')).toBeInTheDocument();
    expect(screen.getAllByText('$19.98')[0]).toBeInTheDocument();
  });

  it('shows validation errors when fields are empty', async () => {
    renderWithRedux(<CheckoutPage />, { preloadedState: cartPreloadedState });

    const submitBtn = screen.getByRole('button', { name: /place order/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText('Name is required')).toBeInTheDocument();
    expect(await screen.findByText('Delivery address is required')).toBeInTheDocument();
    expect(await screen.findByText('Phone number is required')).toBeInTheDocument();
  });

  it('shows phone number format validation error', async () => {
    renderWithRedux(<CheckoutPage />, { preloadedState: cartPreloadedState });

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/delivery address/i), { target: { value: '123 Test St' } });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '123' } }); // invalid phone

    const submitBtn = screen.getByRole('button', { name: /place order/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText('Please enter a valid phone number')).toBeInTheDocument();
  });

  it('submits form successfully and redirects on valid details', async () => {
    renderWithRedux(<CheckoutPage />, { preloadedState: cartPreloadedState });

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/delivery address/i), { target: { value: '123 Test St' } });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '1234567890' } });

    const submitBtn = screen.getByRole('button', { name: /place order/i });
    fireEvent.click(submitBtn);

    // Wait for dispatch to be called and redirection to occur
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/order/mock-order-id-456');
    });
  });
});
