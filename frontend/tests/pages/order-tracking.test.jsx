import React from 'react';
import { screen, act } from '@testing-library/react';
import OrderTrackingPage from '@/app/order/[id]/page';
import { renderWithRedux } from '../utils/test-utils';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useParams() {
    return { id: 'mock-order-id-789' };
  },
}));

// Mock orderService to prevent actual API calls
jest.mock('@/services/orderService', () => ({
  orderAPI: {
    getById: jest.fn().mockResolvedValue({
      success: true,
      data: {
        _id: 'mock-order-id-789',
        customer: {
          name: 'Jane Smith',
          address: '456 Delivery Rd',
          phone: '9876543210',
        },
        items: [
          {
            name: 'Classic Cheeseburger',
            quantity: 1,
            subtotal: 9.99,
          },
        ],
        totalAmount: 9.99,
        status: 'ORDER_RECEIVED',
      },
    }),
    getStatusStreamUrl: jest.fn((id) => `http://localhost:5000/api/orders/${id}/status/stream`),
  },
}));

// Mock EventSource
class MockEventSource {
  static instances = [];
  constructor(url) {
    this.url = url;
    this.close = jest.fn();
    MockEventSource.instances.push(this);
  }
}
global.EventSource = MockEventSource;

describe('OrderTrackingPage', () => {
  beforeEach(() => {
    MockEventSource.instances = [];
    jest.clearAllMocks();
  });

  const orderPreloadedState = {
    orders: {
      currentOrder: {
        _id: 'mock-order-id-789',
        customer: {
          name: 'Jane Smith',
          address: '456 Delivery Rd',
          phone: '9876543210',
        },
        items: [
          {
            name: 'Classic Cheeseburger',
            quantity: 1,
            subtotal: 9.99,
          },
        ],
        totalAmount: 9.99,
        status: 'ORDER_RECEIVED',
      },
      currentOrderStatus: 'ORDER_RECEIVED',
      status: 'succeeded',
      error: null,
    },
  };

  it('renders order details and delivery info', () => {
    renderWithRedux(<OrderTrackingPage />, { preloadedState: orderPreloadedState });

    expect(screen.getByText('Order Confirmed!')).toBeInTheDocument();
    expect(screen.getByText('mock-order-id-789')).toBeInTheDocument();
    expect(screen.getByText('Classic Cheeseburger × 1')).toBeInTheDocument();
    expect(screen.getAllByText('₹9.99')[0]).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('456 Delivery Rd')).toBeInTheDocument();
  });

  it('highlights current status and shows animated text', () => {
    renderWithRedux(<OrderTrackingPage />, { preloadedState: orderPreloadedState });

    // Status steps should show
    expect(screen.getByText('Order Received')).toBeInTheDocument();
    expect(screen.getByText('Preparing')).toBeInTheDocument();
    expect(screen.getByText('Out for Delivery')).toBeInTheDocument();
  });

  it('initializes EventSource stream and updates status on message', () => {
    const { store } = renderWithRedux(<OrderTrackingPage />, { preloadedState: orderPreloadedState });

    expect(MockEventSource.instances).toHaveLength(1);
    expect(MockEventSource.instances[0].url).toContain('/api/orders/mock-order-id-789/status/stream');

    // Simulate receiving an SSE status update
    const esInstance = MockEventSource.instances[0];
    act(() => {
      esInstance.onmessage({ data: JSON.stringify({ status: 'PREPARING' }) });
    });

    // Verify status updated in Redux slice
    expect(store.getState().orders.currentOrderStatus).toBe('PREPARING');
  });

  it('closes EventSource connection on unmount', () => {
    const { unmount } = renderWithRedux(<OrderTrackingPage />, { preloadedState: orderPreloadedState });

    const esInstance = MockEventSource.instances[0];
    unmount();

    expect(esInstance.close).toHaveBeenCalled();
  });
});
