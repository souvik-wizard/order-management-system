'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders, selectAllOrders, selectOrdersStatus, selectOrdersError } from '@/store/slices/ordersSlice';
import OrderCard from '@/components/order/OrderCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import ErrorMessage from '@/components/ui/ErrorMessage';

export default function OrdersPage() {
  const dispatch = useDispatch();
  const orders = useSelector(selectAllOrders);
  const status = useSelector(selectOrdersStatus);
  const error = useSelector(selectOrdersError);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
        <p className="text-gray-500 text-sm">View your order history and track live deliveries.</p>
      </div>

      {/* Loading state */}
      {status === 'loading' && <LoadingSpinner message="Fetching your orders…" />}

      {/* Error state */}
      {status === 'failed' && (
        <ErrorMessage message={error || 'Failed to load past orders. Is the backend running?'} />
      )}

      {/* Success / Empty states */}
      {status === 'succeeded' && (
        <>
          {orders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center shadow-sm">
              <EmptyState
                icon="📦"
                title="No orders yet"
                description="You haven't placed any orders yet. Browse our menu to place your first order!"
              />
              <div className="mt-6">
                <Link
                  href="/"
                  className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
                >
                  Browse Menu
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {orders.map((order) => (
                <OrderCard key={order._id} order={order} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
